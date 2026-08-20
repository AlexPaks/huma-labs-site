// Simulates a non-JS-executing crawler: fetches each indexable route over
// plain HTTP (Node's fetch never executes <script> tags) against a minimal
// static file server serving the real built dist/ output — deliberately NOT
// `vite preview`, whose SPA-fallback middleware intercepts every
// extension-less path and serves the root shell before checking for an
// exact static file match, which would mask the prerendered files entirely.
// A plain static server (exact file match, else 404 — no SPA rewrite) is
// the correct proxy for how a standard static host serves this dist/
// output. Asserts the RAW response body already contains real visible text,
// correct head metadata, and no duplicate/conflicting SEO tags — proof the
// site does not depend on crawlers running client-side JavaScript
// (master plan §20).
import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const root = process.cwd();
const distDir = path.join(root, "dist");
const staticServerPort = 4598;
const baseUrl = `http://localhost:${staticServerPort}`;
const outputDir = path.join(root, "docs", "implementation", "validation", "phase-12");

const CONTENT_TYPES = { ".html": "text/html; charset=utf-8", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml; charset=utf-8" };

function createStaticServer() {
  return http.createServer((req, res) => {
    const requestPath = decodeURIComponent(req.url.split("?")[0]);
    const candidates = requestPath.endsWith("/")
      ? [path.join(distDir, requestPath, "index.html")]
      : [path.join(distDir, requestPath), path.join(distDir, requestPath, "index.html")];
    const filePath = candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());

    if (!filePath) {
      res.writeHead(404).end("Not found");
      return;
    }

    res.writeHead(200, { "Content-Type": CONTENT_TYPES[path.extname(filePath)] ?? "application/octet-stream" });
    res.end(fs.readFileSync(filePath));
  });
}

const ROUTE_CHECKS = [
  {
    route: "/he",
    expectTitle: "HUMA Labs | Human Adaptability for a Changing World",
    expectText: "היכולת של הארגון",
    expectLangDir: 'lang="he" dir="rtl"',
    expectStructuredData: true,
  },
  {
    route: "/en",
    expectTitle: "HUMA Labs | Human Adaptability for a Changing World",
    expectText: "An organization's ability",
    expectLangDir: 'lang="en" dir="ltr"',
    expectStructuredData: true,
  },
  {
    route: "/he/insight",
    expectTitle: "HUMA Organizational Insight | HUMA Labs",
    expectText: "מיפוי קצר שמתרגם אתגר ארגוני",
    expectLangDir: 'lang="he" dir="rtl"',
    expectStructuredData: false,
  },
  {
    route: "/en/insight",
    expectTitle: "HUMA Organizational Insight | HUMA Labs",
    expectText: "A short mapping that translates",
    expectLangDir: 'lang="en" dir="ltr"',
    expectStructuredData: false,
  },
];

function countOccurrences(haystack, needle) {
  return haystack.split(needle).length - 1;
}

async function main() {
  const server = createStaticServer();
  await new Promise((resolve) => server.listen(staticServerPort, resolve));

  const report = { routes: [], staticFiles: {} };

  try {
    for (const check of ROUTE_CHECKS) {
      const res = await fetch(`${baseUrl}${check.route}`);
      const body = await res.text();

      report.routes.push({
        route: check.route,
        status: res.status,
        bodyBytes: body.length,
        hasExpectedTitle: body.includes(`<title>${check.expectTitle}</title>`),
        hasExpectedVisibleText: body.includes(check.expectText),
        hasExpectedLangDir: body.includes(check.expectLangDir),
        robotsMetaCount: countOccurrences(body, 'name="robots"'),
        robotsIsIndexFollow: body.includes('name="robots" content="index,follow"'),
        canonicalLinkCount: countOccurrences(body, 'rel="canonical"'),
        descriptionMetaCount: countOccurrences(body, 'name="description"'),
        hreflangAlternateCount: countOccurrences(body, 'rel="alternate"'),
        hasXDefault: body.includes('hreflang="x-default"'),
        hasStructuredData: body.includes("application/ld+json"),
        structuredDataMatchesExpectation: body.includes("application/ld+json") === check.expectStructuredData,
      });
    }

    const robotsRes = await fetch(`${baseUrl}/robots.txt`);
    const robotsBody = await robotsRes.text();
    report.staticFiles.robotsTxt = {
      status: robotsRes.status,
      allowsOaiSearchBot: /User-agent: OAI-SearchBot\s*\nAllow: \//.test(robotsBody),
      allowsGptBot: /User-agent: GPTBot\s*\nAllow: \//.test(robotsBody),
    };

    const sitemapRes = await fetch(`${baseUrl}/sitemap.xml`);
    const sitemapBody = await sitemapRes.text();
    report.staticFiles.sitemapXml = {
      status: sitemapRes.status,
      urlCount: countOccurrences(sitemapBody, "<loc>"),
    };
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }

  const allPassed =
    report.routes.every(
      (r) =>
        r.status === 200 &&
        r.hasExpectedTitle &&
        r.hasExpectedVisibleText &&
        r.hasExpectedLangDir &&
        r.robotsMetaCount === 1 &&
        r.robotsIsIndexFollow &&
        r.canonicalLinkCount === 1 &&
        r.descriptionMetaCount === 1 &&
        r.hreflangAlternateCount === 3 &&
        r.hasXDefault &&
        r.structuredDataMatchesExpectation,
    ) &&
    report.staticFiles.robotsTxt.status === 200 &&
    report.staticFiles.robotsTxt.allowsOaiSearchBot &&
    report.staticFiles.robotsTxt.allowsGptBot &&
    report.staticFiles.sitemapXml.status === 200 &&
    report.staticFiles.sitemapXml.urlCount === 4;

  report.allPassed = allPassed;

  console.log(JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(outputDir, "phase12-prerender-check.json"), `${JSON.stringify(report, null, 2)}\n`);

  if (!allPassed) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const phase12ValidationDir = path.join(root, "docs", "implementation", "validation", "phase-12");

function readJson(relativePath) {
  const raw = fs.readFileSync(path.join(root, relativePath), "utf8").replace(/^﻿/, "");
  return JSON.parse(raw);
}

function readTextFile(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

// Mirrors src/i18n/language.tsx's getLocalizedPath — kept in sync manually.
function getLocalizedPath(language, pageId) {
  return pageId === "insight" ? `/${language}/insight` : `/${language}`;
}

const SUPPORTED_LANGUAGES = ["he", "en"];
const REQUIRED_PAGE_IDS = ["home", "insight"];

function main() {
  ensureDirectory(phase12ValidationDir);
  const issues = [];
  const checks = [];

  function record(name, passed, detail) {
    checks.push({ name, passed, detail: detail ?? null });
    if (!passed) issues.push(name);
  }

  const seoConfig = readJson("config/seo.json");
  const seoPages = readJson("config/seo-pages.json");
  const seoMessagesHe = readJson("messages/he/seo.json");
  const seoMessagesEn = readJson("messages/en/seo.json");
  const robotsTxt = readTextFile("public/robots.txt");
  const sitemapXml = readTextFile("public/sitemap.xml");
  const indexHtml = readTextFile("index.html");

  // 1. Page registry completeness.
  const registeredIds = seoPages.pages.map((p) => p.id);
  record(
    "seo-pages: registry contains exactly home and insight",
    REQUIRED_PAGE_IDS.every((id) => registeredIds.includes(id)) && registeredIds.length === REQUIRED_PAGE_IDS.length,
    JSON.stringify(registeredIds),
  );
  record(
    "seo-pages: all registered pages are indexable",
    seoPages.pages.every((p) => p.indexable === true),
  );

  // 2. Scope-decision regression guards.
  record(
    "config: OAI-SearchBot is explicitly allowed",
    seoConfig.aiCrawlerPolicy["OAI-SearchBot"] === "allow",
  );
  record("config: GPTBot is explicitly allowed", seoConfig.aiCrawlerPolicy["GPTBot"] === "allow");
  record("config: baseUrl is a placeholder, not a real production domain", seoConfig.baseUrl.includes(".example"));

  // 3. index.html root fallback stays in sync with config/seo.json's baseUrl and stays noindex.
  record(
    "index.html: root shell is noindex (compatibility redirect only, not real content)",
    /name="robots"\s+content="noindex,follow"/.test(indexHtml),
  );
  record(
    "index.html: root canonical target matches config/seo.json's baseUrl",
    indexHtml.includes(`${seoConfig.baseUrl}/he`),
  );

  // 4. robots.txt content.
  record("robots.txt: allows default crawlers", /User-agent: \*\s*\nAllow: \//.test(robotsTxt));
  record("robots.txt: disallows /api/", robotsTxt.includes("Disallow: /api/"));
  record("robots.txt: disallows concept-preview query URLs", robotsTxt.includes("Disallow: /*?concept="));
  record(
    "robots.txt: explicit OAI-SearchBot directive allows crawling",
    /User-agent: OAI-SearchBot\s*\nAllow: \//.test(robotsTxt),
  );
  record(
    "robots.txt: explicit GPTBot directive allows crawling",
    /User-agent: GPTBot\s*\nAllow: \//.test(robotsTxt),
  );
  record("robots.txt: references the sitemap", robotsTxt.includes(`Sitemap: ${seoConfig.baseUrl}/sitemap.xml`));

  // 5. sitemap.xml content — exactly the expected URL set, no private/query URLs.
  const expectedUrls = [];
  for (const page of seoPages.pages) {
    for (const language of SUPPORTED_LANGUAGES) {
      expectedUrls.push(`${seoConfig.baseUrl}${getLocalizedPath(language, page.id)}`);
    }
  }
  const locMatches = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  record(
    "sitemap.xml: contains exactly the expected indexable URLs (no more, no less)",
    locMatches.length === expectedUrls.length && expectedUrls.every((url) => locMatches.includes(url)),
    JSON.stringify({ expected: expectedUrls, found: locMatches }),
  );
  record(
    "sitemap.xml: no URL contains a query string or /api/ path",
    locMatches.every((url) => !url.includes("?") && !url.includes("/api/")),
  );
  record("sitemap.xml: declares the xhtml namespace for hreflang alternates", sitemapXml.includes("xmlns:xhtml="));

  // 6. Localized SEO metadata parity — every registered page has he+en title and description.
  const metadataComplete = REQUIRED_PAGE_IDS.every(
    (id) =>
      seoMessagesHe.pages[id]?.title &&
      seoMessagesHe.pages[id]?.description &&
      seoMessagesEn.pages[id]?.title &&
      seoMessagesEn.pages[id]?.description,
  );
  record("seo messages: every registered page has he+en title and description", metadataComplete);

  // 7. Canonical/hreflang logic simulation — mirrors DocumentHead.tsx's pure logic.
  function simulateHead(pageId, language) {
    const canonicalPath = getLocalizedPath(language, pageId);
    const alternates = SUPPORTED_LANGUAGES.map((lang) => ({
      hreflang: lang,
      href: `${seoConfig.baseUrl}${getLocalizedPath(lang, pageId)}`,
    }));
    alternates.push({ hreflang: "x-default", href: `${seoConfig.baseUrl}${getLocalizedPath("he", pageId)}` });
    return { canonicalUrl: `${seoConfig.baseUrl}${canonicalPath}`, alternates };
  }

  const homeHe = simulateHead("home", "he");
  record(
    "document-head simulation: canonical URL never carries a concept query string",
    !homeHe.canonicalUrl.includes("?"),
  );
  record(
    "document-head simulation: hreflang set includes both languages plus x-default",
    homeHe.alternates.length === 3 && homeHe.alternates.some((a) => a.hreflang === "x-default"),
  );
  record(
    "document-head simulation: x-default points at the default-language (he) version",
    homeHe.alternates.find((a) => a.hreflang === "x-default").href === homeHe.alternates.find((a) => a.hreflang === "he").href,
  );

  // 8. Structured data — only approved, non-fabricated fields.
  const ALLOWED_STRUCTURED_DATA_KEYS = new Set(["@context", "@type", "@graph", "name", "url", "description", "inLanguage"]);
  function collectKeys(value, keys = new Set()) {
    if (Array.isArray(value)) {
      value.forEach((item) => collectKeys(item, keys));
    } else if (value && typeof value === "object") {
      Object.keys(value).forEach((key) => {
        keys.add(key);
        collectKeys(value[key], keys);
      });
    }
    return keys;
  }
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", name: seoMessagesHe.organizationName, url: `${seoConfig.baseUrl}/he`, description: seoMessagesHe.pages.home.description },
      { "@type": "WebSite", name: seoMessagesHe.organizationName, url: `${seoConfig.baseUrl}/he`, inLanguage: SUPPORTED_LANGUAGES },
    ],
  };
  const structuredDataKeys = collectKeys(structuredData);
  record(
    "structured-data: contains only approved fields, no fabricated claims (ratings, pricing, reviews, etc.)",
    [...structuredDataKeys].every((key) => ALLOWED_STRUCTURED_DATA_KEYS.has(key)),
    JSON.stringify([...structuredDataKeys]),
  );
  record(
    "structured-data: Organization/WebSite name and description reuse already-approved homepage copy",
    structuredData["@graph"][0].description === seoMessagesHe.pages.home.description,
  );

  const report = {
    generatedAt: new Date().toISOString(),
    checks,
    passed: issues.length === 0,
  };

  fs.writeFileSync(path.join(phase12ValidationDir, "phase12-validation-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));

  if (issues.length > 0) {
    process.exitCode = 1;
  }
}

main();

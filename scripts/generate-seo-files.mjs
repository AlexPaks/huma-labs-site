import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");

function readJson(relativePath) {
  const raw = fs.readFileSync(path.join(root, relativePath), "utf8").replace(/^﻿/, "");
  return JSON.parse(raw);
}

// Mirrors src/i18n/language.tsx's getLocalizedPath — kept in sync manually,
// following this repo's plain-JS-duplication convention for build scripts
// that cannot import TypeScript source (see scripts/validate-phase7.mjs).
function getLocalizedPath(language, pageId) {
  return pageId === "insight" ? `/${language}/insight` : `/${language}`;
}

// Mirrors src/config/site.ts's siteConfig.supportedLanguages — kept in sync manually.
const SUPPORTED_LANGUAGES = ["he", "en"];

function buildRobotsTxt(seoConfig) {
  const lines = ["User-agent: *", "Allow: /", "Disallow: /api/", "Disallow: /*?concept=", ""];

  for (const [bot, policy] of Object.entries(seoConfig.aiCrawlerPolicy)) {
    lines.push(`User-agent: ${bot}`);
    lines.push(policy === "allow" ? "Allow: /" : "Disallow: /");
    lines.push("");
  }

  lines.push(`Sitemap: ${seoConfig.baseUrl}/sitemap.xml`);

  return `${lines.join("\n")}\n`;
}

function buildSitemapXml(seoConfig, seoPages, supportedLanguages) {
  const baseUrl = seoConfig.baseUrl.replace(/\/$/, "");
  const urlEntries = [];

  for (const page of seoPages.pages) {
    if (!page.indexable) continue;

    for (const language of supportedLanguages) {
      const loc = `${baseUrl}${getLocalizedPath(language, page.id)}`;
      const alternates = supportedLanguages
        .map(
          (altLanguage) =>
            `    <xhtml:link rel="alternate" hreflang="${altLanguage}" href="${baseUrl}${getLocalizedPath(altLanguage, page.id)}" />`,
        )
        .join("\n");
      const defaultAlternate = `    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${getLocalizedPath(supportedLanguages[0], page.id)}" />`;

      urlEntries.push(
        [
          "  <url>",
          `    <loc>${loc}</loc>`,
          alternates,
          defaultAlternate,
          `    <changefreq>${page.changefreq}</changefreq>`,
          `    <priority>${page.priority.toFixed(1)}</priority>`,
          "  </url>",
        ].join("\n"),
      );
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urlEntries.join("\n")}\n</urlset>\n`;
}

function main() {
  const seoConfig = readJson("config/seo.json");
  const seoPages = readJson("config/seo-pages.json");

  fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(path.join(publicDir, "robots.txt"), buildRobotsTxt(seoConfig));
  fs.writeFileSync(
    path.join(publicDir, "sitemap.xml"),
    buildSitemapXml(seoConfig, seoPages, SUPPORTED_LANGUAGES),
  );

  console.log("Generated public/robots.txt and public/sitemap.xml");
}

main();

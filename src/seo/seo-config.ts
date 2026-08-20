import seoConfig from "../../config/seo.json";
import seoPages from "../../config/seo-pages.json";
import type { AppPageId } from "../i18n/language";

export interface SeoPageEntry {
  id: AppPageId;
  indexable: boolean;
  priority: number;
  changefreq: string;
}

export const seoPageRegistry: SeoPageEntry[] = seoPages.pages as SeoPageEntry[];

export const seoBaseUrl = seoConfig.baseUrl.replace(/\/$/, "");

export const aiCrawlerPolicy: Record<string, "allow" | "disallow"> = seoConfig.aiCrawlerPolicy as Record<
  string,
  "allow" | "disallow"
>;

export function absoluteUrl(path: string): string {
  return `${seoBaseUrl}${path}`;
}

export function getSeoPageEntry(pageId: AppPageId): SeoPageEntry {
  const entry = seoPageRegistry.find((page) => page.id === pageId);

  if (!entry) {
    throw new Error(`No SEO page registry entry for page id: ${pageId}`);
  }

  return entry;
}

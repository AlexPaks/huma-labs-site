import { useEffect } from "react";
import { siteConfig, type SupportedLanguage } from "../config/site";
import { getLocalizedPath, useLanguage, type AppPageId } from "../i18n/language";
import { useMessages } from "../i18n/messages";
import { useCurrentConcept } from "../concepts/conceptMode";
import { absoluteUrl, getSeoPageEntry } from "./seo-config";

const MANAGED_ATTRIBUTE = "data-seo-managed";

function clearManagedTags() {
  document.head.querySelectorAll(`[${MANAGED_ATTRIBUTE}="true"]`).forEach((node) => node.remove());
}

function addMetaTag(attribute: "name" | "property", key: string, content: string) {
  const meta = document.createElement("meta");
  meta.setAttribute(attribute, key);
  meta.setAttribute("content", content);
  meta.setAttribute(MANAGED_ATTRIBUTE, "true");
  document.head.appendChild(meta);
}

function addLinkTag(rel: string, href: string, hreflang?: string) {
  const link = document.createElement("link");
  link.setAttribute("rel", rel);
  link.setAttribute("href", href);
  if (hreflang) {
    link.setAttribute("hreflang", hreflang);
  }
  link.setAttribute(MANAGED_ATTRIBUTE, "true");
  document.head.appendChild(link);
}

function addStructuredData(payload: Record<string, unknown>) {
  const script = document.createElement("script");
  script.setAttribute("type", "application/ld+json");
  script.setAttribute(MANAGED_ATTRIBUTE, "true");
  script.textContent = JSON.stringify(payload);
  document.head.appendChild(script);
}

/**
 * Single owner of every SEO-relevant document-head tag (title, canonical,
 * hreflang, robots, Open Graph, structured data). Replaces the previous
 * ad-hoc concept-preview robots-meta effect in SiteLayout so there is only
 * one place writing to <head> and no risk of two effects fighting over the
 * same tag.
 */
export function DocumentHead() {
  const { currentLanguage, currentPageId } = useLanguage();
  const currentConcept = useCurrentConcept();
  const { t } = useMessages(currentLanguage);

  useEffect(() => {
    const pageId: AppPageId = currentPageId;
    const pageEntry = getSeoPageEntry(pageId);
    const canonicalPath = getLocalizedPath(currentLanguage, pageId);
    const canonicalUrl = absoluteUrl(canonicalPath);
    const isConceptPreview = currentConcept !== siteConfig.defaultConcept;
    const title = t("seo", `pages.${pageId}.title`);
    const description = t("seo", `pages.${pageId}.description`);
    const organizationName = t("seo", "organizationName");

    clearManagedTags();

    document.title = title;

    addMetaTag("name", "description", description);
    addMetaTag(
      "name",
      "robots",
      pageEntry.indexable && !isConceptPreview ? "index,follow" : "noindex,nofollow",
    );

    addLinkTag("canonical", canonicalUrl);

    siteConfig.supportedLanguages.forEach((language: SupportedLanguage) => {
      addLinkTag("alternate", absoluteUrl(getLocalizedPath(language, pageId)), language);
    });
    addLinkTag(
      "alternate",
      absoluteUrl(getLocalizedPath(siteConfig.defaultLanguage, pageId)),
      "x-default",
    );

    addMetaTag("property", "og:type", "website");
    addMetaTag("property", "og:title", title);
    addMetaTag("property", "og:description", description);
    addMetaTag("property", "og:url", canonicalUrl);
    addMetaTag("property", "og:site_name", organizationName);
    addMetaTag("property", "og:locale", currentLanguage === "he" ? "he_IL" : "en_US");
    addMetaTag(
      "property",
      "og:locale:alternate",
      currentLanguage === "he" ? "en_US" : "he_IL",
    );
    addMetaTag("name", "twitter:card", "summary");
    addMetaTag("name", "twitter:title", title);
    addMetaTag("name", "twitter:description", description);

    if (pageId === "home") {
      addStructuredData({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            name: organizationName,
            url: absoluteUrl(getLocalizedPath(currentLanguage, "home")),
            description,
          },
          {
            "@type": "WebSite",
            name: organizationName,
            url: absoluteUrl(getLocalizedPath(currentLanguage, "home")),
            inLanguage: siteConfig.supportedLanguages,
          },
        ],
      });
    }
  }, [currentLanguage, currentPageId, currentConcept, t]);

  return null;
}

export type SupportedLanguage = "he" | "en";
export type SupportedDirection = "rtl" | "ltr";

export type SupportedConcept = "a" | "c";

export interface PublicSiteConfig {
  defaultLanguage: SupportedLanguage;
  supportedLanguages: SupportedLanguage[];
  defaultConcept: SupportedConcept;
  showConceptSwitcher: boolean;
  showLanguageSwitcher: boolean;
}

// Frontend configuration is bundled client-side data only and must never hold secrets.
export const siteConfig: PublicSiteConfig = {
  defaultLanguage: "he",
  supportedLanguages: ["he", "en"],
  defaultConcept: "a",
  showConceptSwitcher: false,
  showLanguageSwitcher: true,
};

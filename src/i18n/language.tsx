import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  siteConfig,
  type SupportedDirection,
  type SupportedLanguage,
} from "../config/site";
import { withRetainedConceptSearch } from "../concepts/conceptMode";

export type AppPageId = "home" | "insight";

interface LanguageContextValue {
  currentLanguage: SupportedLanguage;
  currentDirection: SupportedDirection;
  currentPageId: AppPageId;
  switchLanguage: (language: SupportedLanguage) => void;
  localizeHref: (href: string) => string;
}

const languageStorageKey = "huma-language";
const localizedInsightSegment = "insight";
const supportedLanguages = new Set<SupportedLanguage>(siteConfig.supportedLanguages);

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isSupportedLanguage(value: string | null | undefined): value is SupportedLanguage {
  return value === "he" || value === "en";
}

function sanitizeHash(hash: string) {
  return hash.startsWith("#") ? hash : hash ? `#${hash}` : "";
}

function getDirectionForLanguage(language: SupportedLanguage): SupportedDirection {
  return language === "he" ? "rtl" : "ltr";
}

function getPathSegments(pathname: string) {
  return pathname.split("/").filter(Boolean);
}

export function getPathLanguage(pathname: string) {
  const [firstSegment] = getPathSegments(pathname);
  return isSupportedLanguage(firstSegment) ? firstSegment : null;
}

export function getCurrentDocumentLanguage(): SupportedLanguage {
  const lang = document.documentElement.lang;
  return isSupportedLanguage(lang) ? lang : siteConfig.defaultLanguage;
}

export function getStoredLanguagePreference() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = window.localStorage.getItem(languageStorageKey);
    return isSupportedLanguage(value) ? value : null;
  } catch {
    return null;
  }
}

function setStoredLanguagePreference(language: SupportedLanguage) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(languageStorageKey, language);
  } catch {
    // Ignore storage failures and continue with URL-authoritative behavior.
  }
}

export function getPageIdFromPathname(pathname: string): AppPageId {
  const segments = getPathSegments(pathname);

  if (segments[0] === localizedInsightSegment) {
    return "insight";
  }

  if (isSupportedLanguage(segments[0]) && segments[1] === localizedInsightSegment) {
    return "insight";
  }

  return "home";
}

export function getLocalizedPath(
  language: SupportedLanguage,
  pageId: AppPageId,
  hash = "",
) {
  const basePath =
    pageId === "insight" ? `/${language}/${localizedInsightSegment}` : `/${language}`;

  return `${basePath}${sanitizeHash(hash)}`;
}

export function getQueryLanguage(search: string) {
  const params = new URLSearchParams(search);
  const value = params.get("lang");
  return isSupportedLanguage(value) ? value : null;
}

export function localizeContentHref(href: string, language: SupportedLanguage) {
  if (href === "/" || href.length === 0) {
    return getLocalizedPath(language, "home");
  }

  if (href === "/insight") {
    return getLocalizedPath(language, "insight");
  }

  if (href === "/#contact" || href === "#contact") {
    return getLocalizedPath(language, "home", "#contact");
  }

  return href;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [storedLanguage, setStoredLanguage] = useState<SupportedLanguage | null>(() =>
    getStoredLanguagePreference(),
  );

  const currentLanguage =
    getPathLanguage(location.pathname) ?? storedLanguage ?? siteConfig.defaultLanguage;
  const currentDirection = getDirectionForLanguage(currentLanguage);
  const currentPageId = getPageIdFromPathname(location.pathname);

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentDirection;
    // document.title is owned by src/seo/DocumentHead.tsx, which sets a
    // per-page title (not just the generic site title) and must run after
    // this effect regardless of provider order.
  }, [currentDirection, currentLanguage]);

  function switchLanguage(nextLanguage: SupportedLanguage) {
    setStoredLanguagePreference(nextLanguage);
    setStoredLanguage(nextLanguage);

    const nextPath = getLocalizedPath(nextLanguage, currentPageId, location.hash);
    startTransition(() => {
      navigate(withRetainedConceptSearch(nextPath, location.search), { replace: false });
    });
  }

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        currentDirection,
        currentPageId,
        switchLanguage,
        localizeHref: (href: string) =>
          withRetainedConceptSearch(localizeContentHref(href, currentLanguage), location.search),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("Language context is not available.");
  }

  return context;
}

export function isSupportedLanguageId(value: string) {
  return supportedLanguages.has(value as SupportedLanguage);
}

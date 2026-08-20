import { createContext, useContext, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { siteConfig, type SupportedConcept } from "../config/site";

const conceptStorageKey = "huma-concept";

function isSupportedConcept(value: string | null | undefined): value is SupportedConcept {
  return value === "a" || value === "c";
}

export function getQueryConcept(search: string) {
  const params = new URLSearchParams(search);
  const value = params.get("concept");
  return isSupportedConcept(value) ? value : null;
}

export function getStoredConceptPreference(): SupportedConcept | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = window.localStorage.getItem(conceptStorageKey);
    return isSupportedConcept(value) ? value : null;
  } catch {
    return null;
  }
}

function setStoredConceptPreference(concept: SupportedConcept) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(conceptStorageKey, concept);
  } catch {
    // Ignore storage failures and continue with URL-authoritative behavior.
  }
}

export function getResolvedConcept(search: string) {
  return getQueryConcept(search) ?? getStoredConceptPreference() ?? siteConfig.defaultConcept;
}

export function getRetainedConceptSearch(search: string) {
  const concept = getResolvedConcept(search);

  if (concept === siteConfig.defaultConcept) {
    return "";
  }

  return `?concept=${concept}`;
}

export function withRetainedConceptSearch(path: string, search: string) {
  const retainedSearch = getRetainedConceptSearch(search);

  if (!retainedSearch) {
    return path;
  }

  const hashIndex = path.indexOf("#");
  const base = hashIndex === -1 ? path : path.slice(0, hashIndex);
  const hash = hashIndex === -1 ? "" : path.slice(hashIndex);
  const separator = base.includes("?") ? "&" : "?";

  return `${base}${separator}${retainedSearch.slice(1)}${hash}`;
}

interface ConceptContextValue {
  currentConcept: SupportedConcept;
  switchConcept: (concept: SupportedConcept) => void;
}

const ConceptContext = createContext<ConceptContextValue | null>(null);

export function ConceptProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [storedConcept, setStoredConcept] = useState<SupportedConcept | null>(() =>
    getStoredConceptPreference(),
  );

  const queryConcept = getQueryConcept(location.search);
  const currentConcept = queryConcept ?? storedConcept ?? siteConfig.defaultConcept;

  function switchConcept(nextConcept: SupportedConcept) {
    setStoredConceptPreference(nextConcept);
    setStoredConcept(nextConcept);

    const params = new URLSearchParams(location.search);

    if (nextConcept === siteConfig.defaultConcept) {
      params.delete("concept");
    } else {
      params.set("concept", nextConcept);
    }

    const nextSearch = params.toString();

    navigate(
      {
        pathname: location.pathname,
        hash: location.hash,
        search: nextSearch ? `?${nextSearch}` : "",
      },
      { replace: false },
    );
  }

  return (
    <ConceptContext.Provider value={{ currentConcept, switchConcept }}>
      {children}
    </ConceptContext.Provider>
  );
}

function useConceptContext() {
  const context = useContext(ConceptContext);

  if (!context) {
    throw new Error("Concept context is not available.");
  }

  return context;
}

export function useCurrentConcept() {
  return useConceptContext().currentConcept;
}

export function useConceptSwitcher() {
  return useConceptContext();
}

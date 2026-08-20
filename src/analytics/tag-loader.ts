const loadedScriptUrls = new Set<string>();

/**
 * Injects a third-party script tag exactly once. Only ever called from a
 * provider's init(), which only ever runs after its required consent
 * category is granted AND the provider is enabled with a real id
 * configured — never on page load by default.
 */
export function loadExternalScript(url: string, attributes?: Record<string, string>) {
  if (typeof document === "undefined" || loadedScriptUrls.has(url)) {
    return;
  }

  const script = document.createElement("script");
  script.src = url;
  script.async = true;

  for (const [key, value] of Object.entries(attributes ?? {})) {
    script.setAttribute(key, value);
  }

  document.head.appendChild(script);
  loadedScriptUrls.add(url);
}

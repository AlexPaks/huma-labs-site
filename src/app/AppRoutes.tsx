import { Navigate, Outlet, Route, Routes, useLocation, useParams } from "react-router-dom";
import { SiteLayout } from "../components/SiteLayout";
import { siteConfig } from "../config/site";
import { HomePage } from "../pages/HomePage";
import { InsightPage } from "../pages/InsightPage";
import {
  getLocalizedPath,
  getPageIdFromPathname,
  getQueryLanguage,
  getStoredLanguagePreference,
  isSupportedLanguageId,
} from "../i18n/language";
import { withRetainedConceptSearch } from "../concepts/conceptMode";

function CompatibilityRedirect() {
  const location = useLocation();
  const targetLanguage = getQueryLanguage(location.search) ?? siteConfig.defaultLanguage;
  const targetPageId = getPageIdFromPathname(location.pathname);

  return (
    <Navigate
      replace
      to={withRetainedConceptSearch(
        getLocalizedPath(targetLanguage, targetPageId, location.hash),
        location.search,
      )}
    />
  );
}

function UnsupportedRouteRedirect() {
  const location = useLocation();
  const storedLanguage = getStoredLanguagePreference();
  const targetLanguage = storedLanguage ?? siteConfig.defaultLanguage;
  const targetPageId = getPageIdFromPathname(location.pathname);

  return (
    <Navigate
      replace
      to={withRetainedConceptSearch(
        getLocalizedPath(targetLanguage, targetPageId, location.hash),
        location.search,
      )}
    />
  );
}

function LocalizedRouteLayout() {
  const location = useLocation();
  const { language } = useParams();
  const queryLanguage = getQueryLanguage(location.search);

  if (!language || !isSupportedLanguageId(language)) {
    return <UnsupportedRouteRedirect />;
  }

  if (queryLanguage && queryLanguage !== language) {
    return (
      <Navigate
        replace
        to={withRetainedConceptSearch(
          getLocalizedPath(queryLanguage, getPageIdFromPathname(location.pathname), location.hash),
          location.search,
        )}
      />
    );
  }

  return <SiteLayout />;
}

function LocalizedOutlet() {
  return <Outlet />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CompatibilityRedirect />} />
      <Route path="/insight" element={<CompatibilityRedirect />} />

      <Route path="/:language" element={<LocalizedRouteLayout />}>
        <Route element={<LocalizedOutlet />}>
          <Route index element={<HomePage />} />
          <Route path="insight" element={<InsightPage />} />
        </Route>
      </Route>

      <Route path="*" element={<UnsupportedRouteRedirect />} />
    </Routes>
  );
}

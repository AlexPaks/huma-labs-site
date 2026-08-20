import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useAnalytics } from "../analytics/AnalyticsContext";
import { ConceptAFooter } from "../concepts/concept-a/components/ConceptAFooter";
import { ConceptAHeader } from "../concepts/concept-a/components/ConceptAHeader";
import { ConceptCFooter } from "../concepts/concept-c/components/ConceptCFooter";
import { ConceptCHeader } from "../concepts/concept-c/components/ConceptCHeader";
import { useCurrentConcept } from "../concepts/conceptMode";
import { siteConfig } from "../config/site";
import { useLanguage } from "../i18n/language";
import { ConceptReviewSwitcher } from "../shared/components/ConceptReviewSwitcher";
import { CookieConsentBanner } from "../shared/components/CookieConsentBanner";
import { DocumentHead } from "../seo/DocumentHead";
import { HashScrollManager } from "./HashScrollManager";

export function SiteLayout() {
  const location = useLocation();
  const currentConcept = useCurrentConcept();
  const { currentLanguage } = useLanguage();
  const { track } = useAnalytics();
  const previousLanguageRef = useRef<string | null>(null);
  const Header = currentConcept === "c" ? ConceptCHeader : ConceptAHeader;
  const Footer = currentConcept === "c" ? ConceptCFooter : ConceptAFooter;

  useEffect(() => {
    track("page_view", { path: location.pathname });
    // Only re-fire on an actual navigation, not on every unrelated re-render.
  }, [location.pathname]);

  useEffect(() => {
    if (previousLanguageRef.current && previousLanguageRef.current !== currentLanguage) {
      track("language_changed", { language: currentLanguage });
    }
    previousLanguageRef.current = currentLanguage;
  }, [currentLanguage]);

  useEffect(() => {
    document.body.dataset.concept = currentConcept;
  }, [currentConcept]);

  return (
    <div className="concept-site-shell" data-concept={currentConcept}>
      <DocumentHead />
      <HashScrollManager />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CookieConsentBanner />
      {siteConfig.showConceptSwitcher && <ConceptReviewSwitcher />}
    </div>
  );
}

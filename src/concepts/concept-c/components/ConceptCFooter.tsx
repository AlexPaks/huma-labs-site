import { NavLink } from "react-router-dom";
import { siteStructure } from "../../../content/siteStructure";
import { useLanguage } from "../../../i18n/language";
import { useMessages } from "../../../i18n/messages";
import { ConceptCBrand } from "./ConceptCBrand";

export function ConceptCFooter() {
  const { currentLanguage, currentDirection, localizeHref } = useLanguage();
  const { t, tRef } = useMessages(currentLanguage);

  return (
    <footer className="concept-c-footer">
      <div className="concept-container concept-c-footer__inner" dir={currentDirection}>
        <div className="concept-c-footer__brand-block">
          <ConceptCBrand siteName={t("common", "brand.siteName")} />
          <p className="concept-c-footer__tagline">{t("common", "brand.hebrewTagline")}</p>
        </div>

        <nav
          aria-label={t("navigation", "aria.primaryFooter")}
          className="concept-c-footer__nav"
        >
          {siteStructure.navigationItems.map((item) => (
            <NavLink
              key={item.id}
              className="concept-c-footer__link"
              to={localizeHref(item.href)}
            >
              {tRef(item.labelRef)}
            </NavLink>
          ))}
        </nav>

        <p className="concept-c-footer__copyright">{t("common", "copyright")}</p>
      </div>
    </footer>
  );
}

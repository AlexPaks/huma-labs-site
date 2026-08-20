import { NavLink } from "react-router-dom";
import { siteStructure } from "../../../content/siteStructure";
import { useLanguage } from "../../../i18n/language";
import { useMessages } from "../../../i18n/messages";
import { ConceptABrand } from "./ConceptABrand";

export function ConceptAFooter() {
  const { currentLanguage, currentDirection, localizeHref } = useLanguage();
  const { t, tRef } = useMessages(currentLanguage);

  return (
    <footer className="concept-footer">
      <div className="concept-container concept-footer__inner" dir={currentDirection}>
        <div className="concept-footer__brand-block">
          <ConceptABrand siteName={t("common", "brand.siteName")} />
          <p className="concept-footer__tagline">{t("common", "brand.hebrewTagline")}</p>
        </div>

        <nav
          aria-label={t("navigation", "aria.primaryFooter")}
          className="concept-footer__nav"
        >
          {siteStructure.navigationItems.map((item) => (
            <NavLink
              key={item.id}
              className="concept-footer__link"
              to={localizeHref(item.href)}
            >
              {tRef(item.labelRef)}
            </NavLink>
          ))}
        </nav>

        <p className="concept-footer__copyright">{t("common", "copyright")}</p>
      </div>
    </footer>
  );
}

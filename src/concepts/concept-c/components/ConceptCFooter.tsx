import { NavLink } from "react-router-dom";
import { siteStructure } from "../../../content/siteStructure";
import { socialLinks } from "../../../content/socialLinks";
import { useLanguage } from "../../../i18n/language";
import { useMessages } from "../../../i18n/messages";
import { SocialIcon } from "../../../shared/components/SocialIcon";
import { ConceptCBrand } from "./ConceptCBrand";

export function ConceptCFooter() {
  const { currentLanguage, currentDirection, localizeHref } = useLanguage();
  const { t, tRef } = useMessages(currentLanguage);

  return (
    <footer className="concept-c-footer">
      <div className="concept-container concept-c-footer__inner" dir={currentDirection}>
        <div className="concept-c-footer__brand-block">
          <ConceptCBrand
            siteName={t("common", "brand.siteName")}
            tagline={t("common", "brand.tagline")}
          />
          <p className="concept-c-footer__description">{t("common", "footer.description")}</p>
        </div>

        <div className="concept-c-footer__contact-block">
          <p className="concept-c-footer__heading">{t("common", "footer.contactLabel")}</p>
          <a className="concept-c-footer__email" href="mailto:contact@huma-labs.org">
            contact@huma-labs.org
          </a>
          <NavLink className="concept-c-footer__contact-link" to={`${localizeHref("/")}#contact`}>
            {t("common", "footer.contactAction")}
          </NavLink>
          <div className="concept-c-footer__social">
            <p className="concept-c-footer__heading">{t("common", "footer.socialLabel")}</p>
            <div className="concept-c-footer__social-links">
              {socialLinks.map((socialLink) => (
                <a
                  key={socialLink.id}
                  aria-label={socialLink.label}
                  className="concept-c-footer__social-link"
                  data-mock={socialLink.isMock || undefined}
                  href={socialLink.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  <SocialIcon provider={socialLink.id} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <nav
          aria-label={t("navigation", "aria.primaryFooter")}
          className="concept-c-footer__nav"
        >
          <p className="concept-c-footer__heading">{t("common", "footer.navigationLabel")}</p>
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

        <div className="concept-c-footer__bottom">
          <p className="concept-c-footer__copyright">{t("common", "copyright")}</p>
        </div>
      </div>
    </footer>
  );
}

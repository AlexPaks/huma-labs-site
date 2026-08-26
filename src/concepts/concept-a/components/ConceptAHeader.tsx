import {
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { NavLink, useLocation } from "react-router-dom";
import { siteStructure } from "../../../content/siteStructure";
import { useLanguage } from "../../../i18n/language";
import { useMessages } from "../../../i18n/messages";
import { siteConfig } from "../../../config/site";
import { ConceptABrand } from "./ConceptABrand";

export function ConceptAHeader() {
  const { currentLanguage, currentDirection, switchLanguage, localizeHref } = useLanguage();
  const { t, tRef } = useMessages(currentLanguage);
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.hash, currentLanguage]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      setIsMenuOpen(false);
      window.requestAnimationFrame(() => {
        triggerRef.current?.focus();
      });
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  return (
    <header className="concept-header">
      <div className="concept-container concept-header__inner" dir={currentDirection}>
        <NavLink className="concept-header__brand" to={localizeHref("/")}>
          <ConceptABrand
            siteName={t("common", "brand.siteName")}
            tagline={t("common", "brand.tagline")}
          />
        </NavLink>

        <div className="concept-header__desktop">
          <nav
            aria-label={t("navigation", "aria.primary")}
            className="concept-header__nav"
          >
            {siteStructure.navigationItems.map((item) => (
              <NavLink
                key={item.id}
                className={({ isActive }) =>
                  [
                    "concept-header__link",
                    item.id === "insight" && "concept-header__link--insight",
                    isActive && "concept-header__link--active",
                  ]
                    .filter(Boolean)
                    .join(" ")
                }
                to={localizeHref(item.href)}
              >
                {tRef(item.labelRef)}
              </NavLink>
            ))}
          </nav>

          {siteConfig.showLanguageSwitcher ? (
            <div
              aria-label={t("navigation", "aria.languageSwitcher")}
              className="concept-language-switch"
              role="group"
            >
              {siteConfig.supportedLanguages.map((language) => {
                const isActive = language === currentLanguage;
                return (
                  <button
                    key={language}
                    aria-pressed={isActive}
                    className={
                      isActive
                        ? "concept-language-switch__button concept-language-switch__button--active"
                        : "concept-language-switch__button"
                    }
                    onClick={() => switchLanguage(language)}
                    type="button"
                  >
                    {language.toUpperCase()}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <button
          aria-controls={menuId}
          aria-expanded={isMenuOpen}
          aria-label={
            isMenuOpen
              ? t("navigation", "aria.closeMenu")
              : t("navigation", "aria.openMenu")
          }
          className="concept-menu-button"
          onClick={() => setIsMenuOpen((current) => !current)}
          ref={triggerRef}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div
        className={isMenuOpen ? "concept-mobile-menu concept-mobile-menu--open" : "concept-mobile-menu"}
        dir={currentDirection}
        id={menuId}
      >
        <div className="concept-container concept-mobile-menu__inner">
          <nav
            aria-label={t("navigation", "aria.primaryMobile")}
            className="concept-mobile-menu__nav"
          >
            {siteStructure.navigationItems.map((item) => (
              <NavLink
                key={item.id}
                className={({ isActive }) =>
                  [
                    "concept-mobile-menu__link",
                    item.id === "insight" && "concept-mobile-menu__link--insight",
                    isActive && "concept-mobile-menu__link--active",
                  ]
                    .filter(Boolean)
                    .join(" ")
                }
                to={localizeHref(item.href)}
              >
                {tRef(item.labelRef)}
              </NavLink>
            ))}
          </nav>

          {siteConfig.showLanguageSwitcher ? (
            <div
              aria-label={t("navigation", "aria.languageSwitcher")}
              className="concept-language-switch concept-language-switch--mobile"
              role="group"
            >
              {siteConfig.supportedLanguages.map((language) => {
                const isActive = language === currentLanguage;
                return (
                  <button
                    key={language}
                    aria-pressed={isActive}
                    className={
                      isActive
                        ? "concept-language-switch__button concept-language-switch__button--active"
                        : "concept-language-switch__button"
                    }
                    onClick={() => switchLanguage(language)}
                    type="button"
                  >
                    {tRef(`common:languageNames.${language}`)}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

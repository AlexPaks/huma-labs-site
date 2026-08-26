import {
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { NavLink, useLocation } from "react-router-dom";
import { siteStructure } from "../../../content/siteStructure";
import { siteConfig } from "../../../config/site";
import { useLanguage } from "../../../i18n/language";
import { useMessages } from "../../../i18n/messages";
import { ConceptCBrand } from "./ConceptCBrand";

export function ConceptCHeader() {
  const { currentLanguage, currentDirection, switchLanguage, localizeHref } = useLanguage();
  const { t, tRef } = useMessages(currentLanguage);
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.hash, location.search, currentLanguage]);

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
    <header className="concept-c-header">
      <div className="concept-container concept-c-header__inner" dir={currentDirection}>
        <NavLink className="concept-c-header__brand" to={localizeHref("/")}>
          <ConceptCBrand
            siteName={t("common", "brand.siteName")}
            tagline={t("common", "brand.tagline")}
          />
        </NavLink>

        <div className="concept-c-header__desktop">
          <nav
            aria-label={t("navigation", "aria.primary")}
            className="concept-c-header__nav"
          >
            {siteStructure.navigationItems.map((item) => (
              <NavLink
                key={item.id}
                className={({ isActive }) =>
                  [
                    "concept-c-header__link",
                    item.id === "insight" && "concept-c-header__link--insight",
                    isActive && "concept-c-header__link--active",
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
              className="concept-c-language-switch"
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
                        ? "concept-c-language-switch__button concept-c-language-switch__button--active"
                        : "concept-c-language-switch__button"
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
          className="concept-c-menu-button"
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
        className={isMenuOpen ? "concept-c-mobile-menu concept-c-mobile-menu--open" : "concept-c-mobile-menu"}
        dir={currentDirection}
        id={menuId}
      >
        <div className="concept-container concept-c-mobile-menu__inner">
          <nav
            aria-label={t("navigation", "aria.primaryMobile")}
            className="concept-c-mobile-menu__nav"
          >
            {siteStructure.navigationItems.map((item) => (
              <NavLink
                key={item.id}
                className={({ isActive }) =>
                  [
                    "concept-c-mobile-menu__link",
                    item.id === "insight" && "concept-c-mobile-menu__link--insight",
                    isActive && "concept-c-mobile-menu__link--active",
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
              className="concept-c-language-switch concept-c-language-switch--mobile"
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
                        ? "concept-c-language-switch__button concept-c-language-switch__button--active"
                        : "concept-c-language-switch__button"
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

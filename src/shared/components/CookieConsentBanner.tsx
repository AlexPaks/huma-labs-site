import { useEffect, useState } from "react";
import { useAnalytics } from "../../analytics/AnalyticsContext";
import { useLanguage } from "../../i18n/language";
import { useMessages } from "../../i18n/messages";
import type { ConsentPreferences } from "../../analytics/consent-service";

export function CookieConsentBanner() {
  const { consent, acceptAll, rejectAll, savePreferences, track } = useAnalytics();
  const { currentLanguage } = useLanguage();
  const { t } = useMessages(currentLanguage);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [draftPreferences, setDraftPreferences] = useState<ConsentPreferences>({
    functional: consent.functional,
    analytics: consent.analytics,
    marketing: consent.marketing,
  });

  useEffect(() => {
    if (!consent.resolved) {
      track("consent_banner_viewed");
    }
    // Fire once per unresolved-banner mount only.
  }, [consent.resolved]);

  if (consent.resolved) {
    return null;
  }

  function toggleDraft(category: keyof ConsentPreferences) {
    setDraftPreferences((current) => ({ ...current, [category]: !current[category] }));
  }

  return (
    <div className="concept-consent-banner" role="dialog" aria-modal="false" aria-label={t("cookie-consent", "banner.title")}>
      {isCustomizing ? (
        <div className="concept-consent-banner__preferences">
          <p className="concept-consent-banner__title">{t("cookie-consent", "preferences.title")}</p>

          {(["essential", "functional", "analytics", "marketing"] as const).map((category) => (
            <label key={category} className="concept-consent-banner__row">
              <input
                checked={category === "essential" ? true : draftPreferences[category]}
                disabled={category === "essential"}
                onChange={() => category !== "essential" && toggleDraft(category)}
                type="checkbox"
              />
              <span>
                <strong>{t("cookie-consent", `preferences.${category}.label`)}</strong>
                <span className="concept-consent-banner__row-description">
                  {t("cookie-consent", `preferences.${category}.description`)}
                </span>
              </span>
            </label>
          ))}

          <div className="concept-consent-banner__actions">
            <button
              className="concept-button"
              onClick={() => {
                savePreferences(draftPreferences);
                setIsCustomizing(false);
              }}
              type="button"
            >
              {t("cookie-consent", "preferences.save")}
            </button>
            <button className="concept-text-link" onClick={() => setIsCustomizing(false)} type="button">
              {t("cookie-consent", "preferences.close")}
            </button>
          </div>
        </div>
      ) : (
        <div className="concept-consent-banner__summary">
          <div>
            <p className="concept-consent-banner__title">{t("cookie-consent", "banner.title")}</p>
            <p className="concept-consent-banner__description">{t("cookie-consent", "banner.description")}</p>
          </div>
          <div className="concept-consent-banner__actions">
            <button className="concept-button" onClick={acceptAll} type="button">
              {t("cookie-consent", "banner.acceptAll")}
            </button>
            <button className="concept-text-link" onClick={rejectAll} type="button">
              {t("cookie-consent", "banner.rejectAll")}
            </button>
            <button className="concept-text-link" onClick={() => setIsCustomizing(true)} type="button">
              {t("cookie-consent", "banner.customize")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

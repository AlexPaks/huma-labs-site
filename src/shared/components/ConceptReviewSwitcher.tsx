import { useConceptSwitcher } from "../../concepts/conceptMode";
import { useLanguage } from "../../i18n/language";
import { useMessages } from "../../i18n/messages";

export function ConceptReviewSwitcher() {
  const { currentConcept, switchConcept } = useConceptSwitcher();
  const { currentLanguage } = useLanguage();
  const { t } = useMessages(currentLanguage);

  return (
    <div className="concept-review-switcher" role="group" aria-label={t("system", "conceptSwitcher.label")}>
      <span className="concept-review-switcher__label">{t("system", "conceptSwitcher.label")}</span>
      <button
        aria-pressed={currentConcept === "a"}
        className="concept-review-switcher__option"
        onClick={() => switchConcept("a")}
        type="button"
      >
        {t("system", "conceptSwitcher.optionA")}
      </button>
      <button
        aria-pressed={currentConcept === "c"}
        className="concept-review-switcher__option"
        onClick={() => switchConcept("c")}
        type="button"
      >
        {t("system", "conceptSwitcher.optionC")}
      </button>
    </div>
  );
}

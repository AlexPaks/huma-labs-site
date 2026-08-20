type ConceptCAnalyzingStateSectionProps = {
  sectionId?: string;
  label: string;
  loadingTitle: string;
  loadingBody: string;
  errorTitle: string;
  errorBody: string;
  retryLabel: string;
  fallbackLabel: string;
  status: "loading" | "error";
  onRetry: () => void;
  onUseFallback: () => void;
  dataPrimaryState?: "analyzing";
};

export function ConceptCAnalyzingStateSection({
  sectionId,
  label,
  loadingTitle,
  loadingBody,
  errorTitle,
  errorBody,
  retryLabel,
  fallbackLabel,
  status,
  onRetry,
  onUseFallback,
  dataPrimaryState,
}: ConceptCAnalyzingStateSectionProps) {
  return (
    <section
      className="concept-section concept-section--insight-page concept-c-analysis-state"
      data-primary-state={dataPrimaryState}
      id={sectionId}
    >
      <div className="concept-container concept-c-analysis-state__layout" aria-live="polite">
        <p className="concept-kicker">{label}</p>

        {status === "loading" ? (
          <>
            <span className="concept-c-analysis-state__spinner" aria-hidden="true" />
            <h1 className="concept-c-analysis-state__title">{loadingTitle}</h1>
            <p className="concept-c-analysis-state__body">{loadingBody}</p>
          </>
        ) : (
          <>
            <h1 className="concept-c-analysis-state__title">{errorTitle}</h1>
            <p className="concept-c-analysis-state__body">{errorBody}</p>
            <div className="concept-c-analysis-state__actions">
              <button
                className="concept-button concept-c-button concept-c-button--filled"
                onClick={onRetry}
                type="button"
              >
                {retryLabel}
              </button>
              <button className="concept-c-text-link" onClick={onUseFallback} type="button">
                {fallbackLabel}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

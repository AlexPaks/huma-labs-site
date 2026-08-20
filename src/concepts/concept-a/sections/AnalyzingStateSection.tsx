type AnalyzingStateSectionProps = {
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

export function AnalyzingStateSection({
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
}: AnalyzingStateSectionProps) {
  return (
    <section
      className="concept-section concept-section--insight-page"
      data-primary-state={dataPrimaryState}
      id={sectionId}
    >
      <div className="concept-container concept-analysis-state" aria-live="polite">
        <p className="concept-kicker">{label}</p>

        {status === "loading" ? (
          <>
            <span className="concept-analysis-state__spinner" aria-hidden="true" />
            <h2 className="concept-display">{loadingTitle}</h2>
            <p>{loadingBody}</p>
          </>
        ) : (
          <>
            <h2 className="concept-display">{errorTitle}</h2>
            <p>{errorBody}</p>
            <div className="concept-analysis-state__actions">
              <button className="concept-button" onClick={onRetry} type="button">
                {retryLabel}
              </button>
              <button className="concept-text-link" onClick={onUseFallback} type="button">
                {fallbackLabel}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

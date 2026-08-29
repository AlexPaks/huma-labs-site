import { loadPromptTemplate } from "./prompt-loader.mjs";

/**
 * Combines the external prompt template with the normalized, localized
 * question/answer text. Kept as a dedicated composer (not inline string
 * concatenation in the API endpoint) per the master plan's rule.
 */
export function composeAnalysisPrompt(normalizedAssessment) {
  const { version: promptVersion, template } = loadPromptTemplate(normalizedAssessment.language);

  const assessmentContext = {
    language: normalizedAssessment.language,
    responses: normalizedAssessment.answers.map((answer) => ({
      question: answer.questionText,
      selectedOptions: answer.selectedOptions.map(({ label, themes, capability, audienceScope, isAmbiguous }) => ({
        label,
        themes,
        capability: capability ?? undefined,
        audienceScope: audienceScope ?? undefined,
        isAmbiguous: isAmbiguous || undefined,
      })),
      freeText: answer.openText ?? undefined,
    })),
    signals: normalizedAssessment.structuredContext,
  };
  const prompt = template.replace("{{ASSESSMENT_CONTEXT_JSON}}", JSON.stringify(assessmentContext, null, 2));

  return { prompt, promptVersion };
}

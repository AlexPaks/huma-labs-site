import { loadPromptTemplate } from "./prompt-loader.mjs";

/**
 * Combines the external prompt template with the normalized, localized
 * question/answer text. Kept as a dedicated composer (not inline string
 * concatenation in the API endpoint) per the master plan's rule.
 */
export function composeAnalysisPrompt(normalizedAssessment) {
  const { version: promptVersion, template } = loadPromptTemplate(normalizedAssessment.language);

  const summaryLines = normalizedAssessment.answers.map(
    (answer) => `- ${answer.questionText}\n  ${answer.answerText}`,
  );

  const prompt = template.replace("{{ASSESSMENT_SUMMARY}}", summaryLines.join("\n"));

  return { prompt, promptVersion };
}

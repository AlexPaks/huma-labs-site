import assessmentDefinition from "../../content/assessment.json" with { type: "json" };

export const REQUEST_TEXT_MAX_LENGTH = 2000;
export const REQUEST_JSON_MAX_BYTES = 20_000;

export class RequestValidationError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "RequestValidationError";
    this.code = code;
  }
}

const questionsById = Object.fromEntries(assessmentDefinition.questions.map((question) => [question.id, question]));
const supportedLanguages = new Set(["he", "en"]);

function toValueList(value) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

function findConsistencyConflict(answers) {
  const answersByQuestionId = Object.fromEntries(answers.map((answer) => [answer.questionId, answer.value]));

  for (const question of assessmentDefinition.questions) {
    for (const optionId of toValueList(answersByQuestionId[question.id])) {
      const option = question.options.find((candidate) => candidate.id === optionId);
      const conflictsWith = option?.analysis?.conflictsWith ?? [];
      const conflict = conflictsWith.find(({ questionId, optionId: conflictingOptionId }) =>
        toValueList(answersByQuestionId[questionId]).includes(conflictingOptionId),
      );

      if (conflict) {
        return { questionId: question.id, optionId, conflict };
      }
    }
  }

  return null;
}

function assert(condition, code, message) {
  if (!condition) {
    throw new RequestValidationError(code, message);
  }
}

/**
 * Validates an incoming analyze-assessment request body against the real,
 * versioned assessment definition. Rejects anything that does not match the
 * approved quiz shape rather than trying to be lenient — the LLM prompt is
 * only ever built from data that passed this check.
 */
export function validateAssessmentRequest(rawBody, serializedLength) {
  assert(
    typeof serializedLength === "number" && serializedLength <= REQUEST_JSON_MAX_BYTES,
    "REQUEST_TOO_LARGE",
    `Request body exceeds the ${REQUEST_JSON_MAX_BYTES}-byte limit.`,
  );

  assert(rawBody && typeof rawBody === "object" && !Array.isArray(rawBody), "INVALID_ASSESSMENT", "Request body must be a JSON object.");

  const allowedTopLevelKeys = new Set(["quizId", "quizVersion", "language", "answers"]);
  for (const key of Object.keys(rawBody)) {
    assert(allowedTopLevelKeys.has(key), "INVALID_ASSESSMENT", `Unexpected field in request body: ${key}`);
  }

  assert(rawBody.quizId === assessmentDefinition.quizId, "INVALID_ASSESSMENT", "Unknown quizId.");
  assert(
    rawBody.quizVersion === assessmentDefinition.version,
    "UNSUPPORTED_QUIZ_VERSION",
    `Quiz version "${rawBody.quizVersion}" is not the currently supported version "${assessmentDefinition.version}".`,
  );
  assert(
    typeof rawBody.language === "string" && supportedLanguages.has(rawBody.language),
    "INVALID_ASSESSMENT",
    "Unsupported or missing language.",
  );
  assert(Array.isArray(rawBody.answers) && rawBody.answers.length > 0, "INVALID_ASSESSMENT", "Request must include at least one answer.");
  assert(
    rawBody.answers.length <= assessmentDefinition.questions.length,
    "INVALID_ASSESSMENT",
    "Request includes more answers than the quiz defines questions.",
  );

  const seenQuestionIds = new Set();
  const answers = [];

  for (const answer of rawBody.answers) {
    assert(
      answer && typeof answer === "object" && typeof answer.questionId === "string",
      "INVALID_ASSESSMENT",
      "Each answer must include a string questionId.",
    );
    assert(!seenQuestionIds.has(answer.questionId), "INVALID_ASSESSMENT", `Duplicate answer for question "${answer.questionId}".`);
    seenQuestionIds.add(answer.questionId);

    const question = questionsById[answer.questionId];
    assert(question, "INVALID_ASSESSMENT", `Unknown question id "${answer.questionId}".`);

    const value = answer.value;

    if (question.type === "multiple-choice") {
      assert(Array.isArray(value), "INVALID_ASSESSMENT", `Answer for "${question.id}" must be an array of option ids.`);
      assert(
        new Set(value).size === value.length,
        "INVALID_ASSESSMENT",
        `Answer for "${question.id}" must not contain duplicate option ids.`,
      );
      const minSelections = question.validation.minSelections ?? (question.required ? 1 : 0);
      const maxSelections = question.validation.maxSelections ?? Number.POSITIVE_INFINITY;
      assert(
        value.length >= minSelections && value.length <= maxSelections,
        "INVALID_ASSESSMENT",
        `Answer for "${question.id}" must include between ${minSelections} and ${maxSelections} selections.`,
      );
      const optionIds = new Set(question.options.map((option) => option.id));
      for (const optionId of value) {
        assert(optionIds.has(optionId), "INVALID_ASSESSMENT", `Unknown option id "${optionId}" for question "${question.id}".`);
      }
    } else if (question.type === "single-choice") {
      assert(typeof value === "string", "INVALID_ASSESSMENT", `Answer for "${question.id}" must be a string option id.`);
      if (value.length > 0) {
        const optionIds = new Set(question.options.map((option) => option.id));
        assert(optionIds.has(value), "INVALID_ASSESSMENT", `Unknown option id "${value}" for question "${question.id}".`);
      }
    } else {
      assert(typeof value === "string", "INVALID_ASSESSMENT", `Answer for "${question.id}" must be a string.`);
      assert(
        value.length <= REQUEST_TEXT_MAX_LENGTH,
        "INVALID_ASSESSMENT",
        `Answer for "${question.id}" exceeds the ${REQUEST_TEXT_MAX_LENGTH}-character open-text limit.`,
      );
    }

    answers.push({ questionId: question.id, value });
  }

  const consistencyConflict = findConsistencyConflict(answers);
  assert(
    !consistencyConflict,
    "INCONSISTENT_ASSESSMENT",
    "Selected answers contain choices that cannot be true at the same time.",
  );

  return {
    quizId: rawBody.quizId,
    quizVersion: rawBody.quizVersion,
    language: rawBody.language,
    answers,
  };
}

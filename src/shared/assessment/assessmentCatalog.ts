import rawAssessmentDefinition from "../../../content/assessment.json";

export interface AssessmentOption {
  id: string;
  labelRef: string;
  nextQuestionId?: string | null;
  analysis?: {
    themes?: string[];
    audienceScope?: string;
    isAmbiguous?: boolean;
    conflictsWith?: Array<{ questionId: string; optionId: string }>;
  };
}

export interface VisibleWhenCondition {
  questionId: string;
  equals?: string;
  in?: string[];
  notEquals?: string;
}

export interface AssessmentQuestion {
  id: string;
  order: number;
  type: "single-choice" | "multiple-choice" | "short-text" | "long-text";
  required: boolean;
  questionRef: string;
  previewRef: string;
  helperRef?: string | null;
  promptRef?: string | null;
  nextQuestionId?: string | null;
  options: AssessmentOption[];
  validation: {
    minSelections?: number;
    maxSelections?: number;
    minLength?: number;
    maxLength?: number;
  };
  visibleWhen?: VisibleWhenCondition | null;
  capabilityMapping?: Record<string, string> | null;
  scoreMapping?: Record<string, number> | null;
}

export interface AssessmentDefinition {
  quizId: string;
  version: string;
  routingId: string;
  questions: AssessmentQuestion[];
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const assessmentDefinition = rawAssessmentDefinition as AssessmentDefinition;

assert(
  Array.isArray(assessmentDefinition.questions),
  "Invalid assessment definition.",
);

export { assessmentDefinition };

export const assessmentQuestionsById = Object.fromEntries(
  assessmentDefinition.questions.map((question) => [question.id, question]),
);

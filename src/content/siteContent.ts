import { siteStructure } from "./siteStructure";
import { assessmentDefinition } from "../shared/assessment/assessmentCatalog";

type InsightQuestion = {
  id: string;
  questionRef: string;
  options: readonly string[];
  helperRef?: string | null;
};

// Deprecated compatibility layer kept only so legacy imports can migrate without
// reintroducing hardcoded user-visible copy into the application source.
export const heroStats = siteStructure.heroStats.map((item) => item.labelRef) as readonly string[];

export const capabilities = siteStructure.capabilities.map((item) => ({
  key: item.labelRef,
  titleRef: item.titleRef,
  descriptionRef: item.descriptionRef,
}));

export const processSteps = siteStructure.processSteps.map((item) => ({
  id: String(item.order).padStart(2, "0"),
  key: item.labelRef,
  titleRef: item.titleRef,
  descriptionRef: item.descriptionRef,
  outcomeRef: item.outcomeRef,
}));

export const challenges = siteStructure.challenges.map((item) => ({
  statementRef: item.statementRef,
  directionRef: item.directionRef,
}));

export const formats = siteStructure.formats.map((item) => item.labelRef) as readonly string[];

export const outcomes = siteStructure.outcomes.map((item) => ({
  key: item.labelRef,
  titleRef: item.titleRef,
}));

export const insightQuestions = assessmentDefinition.questions.map((question) => ({
  id: String(question.order).padStart(2, "0"),
  questionRef: question.questionRef,
  options: question.options.map((option) => option.labelRef),
  helperRef: question.helperRef,
})) as readonly InsightQuestion[];

import { useEffect, useRef, useState } from "react";
import { useAnalytics } from "../analytics/AnalyticsContext";
import { AnalyzingStateSection } from "../concepts/concept-a/sections/AnalyzingStateSection";
import { InsightOverviewSection } from "../concepts/concept-a/sections/InsightOverviewSection";
import { InsightQuestionFlowSection } from "../concepts/concept-a/sections/InsightQuestionFlowSection";
import { InsightResultSection } from "../concepts/concept-a/sections/InsightResultSection";
import { ConceptCAnalyzingStateSection } from "../concepts/concept-c/sections/ConceptCAnalyzingStateSection";
import { ConceptCInsightOverviewSection } from "../concepts/concept-c/sections/ConceptCInsightOverviewSection";
import { ConceptCInsightQuestionFlowSection } from "../concepts/concept-c/sections/ConceptCInsightQuestionFlowSection";
import { ConceptCInsightResultSection } from "../concepts/concept-c/sections/ConceptCInsightResultSection";
import { useCurrentConcept } from "../concepts/conceptMode";
import { siteStructure, processStepsById } from "../content/siteStructure";
import { useMessages } from "../i18n/messages";
import { useLanguage } from "../i18n/language";
import { assessmentDefinition } from "../shared/assessment/assessmentCatalog";
import { useInsightQuestionFlow } from "../shared/assessment/useInsightQuestionFlow";
import { requestInsightAnalysis } from "../shared/assessment/insightApiClient";
import type { InsightCompletionPayload, MockInsightResult } from "../shared/assessment/insightEngine";
import type { InsightResult } from "../shared/assessment/insightResultTypes";
import type { FormId } from "../shared/forms/formCatalog";

type InsightPageState = "intro" | "question" | "analyzing" | "result";
type AnalysisStatus = "loading" | "error" | null;
const PROCESS_STAGES = ["discover", "design", "act"] as const;
// Matches the capability the static, approved fallback result content
// represents (see messages/*/insight-result.json primaryCard.capability).
const FALLBACK_CAPABILITY_ID = "adaptability";

declare global {
  interface Window {
    __HUMA_DEBUG_LAST_INSIGHT_RESULT__?: {
      payload: InsightCompletionPayload;
      mockResult: MockInsightResult;
    };
  }
}

export function InsightPage() {
  const currentConcept = useCurrentConcept();
  const { currentLanguage } = useLanguage();
  const { tRef, t } = useMessages(currentLanguage);
  const { track } = useAnalytics();
  const insightPage = siteStructure.pages.insight;
  const sortedQuestions = [...assessmentDefinition.questions].sort(
    (left, right) => left.order - right.order,
  );

  function scrollToStateStart() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }

  function openQuestionState() {
    track("quiz_started");
    setPageState("question");
    window.requestAnimationFrame(scrollToStateStart);
  }

  function handleContinueWithTracking() {
    // Fired before handleContinue() rather than after: for the final
    // question, handleContinue() synchronously triggers the entire
    // completion cascade (quiz_completed, insight_analysis_started, ...)
    // before returning — tracking after would report this step as
    // "completed" later than the events that causally depend on it.
    const stepQuestionId = questionFlow.currentQuestion?.id;
    const stepIndex = questionFlow.currentIndex;

    if (questionFlow.hasAnswer && stepQuestionId) {
      track("quiz_step_completed", { questionId: stepQuestionId, stepIndex });
    }

    return questionFlow.handleContinue();
  }

  const pendingPayloadRef = useRef<InsightCompletionPayload | null>(null);
  const [analysisResult, setAnalysisResult] = useState<InsightResult | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>(null);

  async function runAnalysis(payload: InsightCompletionPayload) {
    pendingPayloadRef.current = payload;
    setAnalysisStatus("loading");
    setPageState("analyzing");
    window.requestAnimationFrame(scrollToStateStart);
    track("insight_analysis_started");

    const outcome = await requestInsightAnalysis(payload);

    if (outcome.ok) {
      setAnalysisResult(outcome.result);
      setAnalysisStatus(null);
      questionFlow.resetFlow();
      setPageState("result");
      window.requestAnimationFrame(scrollToStateStart);
      track("insight_analysis_completed");
      return;
    }

    setAnalysisStatus("error");
    track("insight_analysis_failed", { code: outcome.code });
  }

  function handleCompleted(payload: InsightCompletionPayload, mockResult: MockInsightResult) {
    if (typeof window !== "undefined") {
      window.__HUMA_DEBUG_LAST_INSIGHT_RESULT__ = { payload, mockResult };
    }

    track("quiz_completed");
    void runAnalysis(payload);
  }

  function handleRetryAnalysis() {
    if (pendingPayloadRef.current) {
      void runAnalysis(pendingPayloadRef.current);
    }
  }

  function handleUseFallback() {
    setAnalysisResult(null);
    setAnalysisStatus(null);
    questionFlow.resetFlow();
    setPageState("result");
    window.requestAnimationFrame(scrollToStateStart);
  }

  const questionFlow = useInsightQuestionFlow(
    sortedQuestions.map((question) => ({
      id: question.id,
      order: question.order,
      type: question.type,
      required: question.required,
      question: tRef(question.questionRef),
      helper: question.helperRef ? tRef(question.helperRef) : null,
      prompt: question.promptRef ? tRef(question.promptRef) : null,
      nextQuestionId: question.nextQuestionId ?? null,
      options: question.options.map((option) => ({
        id: option.id,
        label: tRef(option.labelRef),
        nextQuestionId: option.nextQuestionId ?? null,
      })),
      validation: question.validation,
      visibleWhen: question.visibleWhen ?? null,
      capabilityMapping: question.capabilityMapping ?? null,
    })),
    {
      quizId: assessmentDefinition.quizId,
      quizVersion: assessmentDefinition.version,
      language: currentLanguage,
      onCompleted: handleCompleted,
    },
  );

  const [pageState, setPageState] = useState<InsightPageState>(() =>
    questionFlow.hasResumedProgress ? "question" : "intro",
  );

  function handleRestart() {
    questionFlow.resetFlow();
    setAnalysisResult(null);
    setAnalysisStatus(null);
    setPageState("intro");
    window.requestAnimationFrame(scrollToStateStart);
  }

  const capability = analysisResult
    ? t("common", `capabilityLabels.${analysisResult.primaryCapability}`)
    : tRef(siteStructure.resultCard.primaryCapabilityRef);

  const focusItems = analysisResult
    ? analysisResult.signalsToExamine
    : siteStructure.resultCard.focusItemRefs.map((ref) => tRef(ref));

  const process = analysisResult
    ? PROCESS_STAGES.map((stage) => ({
        id: stage,
        label: t("common", `processLabels.${stage}`),
        title: analysisResult.recommendedDirection[stage],
        description: "",
      }))
    : siteStructure.resultCard.processStepIds.map((id) => {
        const step = processStepsById[id];
        return {
          id: step.id,
          label: tRef(step.labelRef),
          title: tRef(step.titleRef),
          description: tRef(step.descriptionRef),
        };
      });

  const insightContext = analysisResult
    ? {
        primaryCapability: analysisResult.primaryCapability,
        secondaryCapabilities: analysisResult.secondaryCapabilities,
        insightResult: analysisResult,
      }
    : { primaryCapability: FALLBACK_CAPABILITY_ID, secondaryCapabilities: [] };

  useEffect(() => {
    if (pageState === "intro") {
      track("quiz_viewed");
    } else if (pageState === "result") {
      track("insight_result_viewed");
    }
    // Fire once per page-state entry, not on every unrelated re-render.
  }, [pageState]);

  // Every branch below renders a different page-state/concept combination as
  // the Insight route's entire content, so this hidden heading is the one
  // stable h1 the page always has — the state-specific sections below all
  // use h2/h3 for their own (state-scoped) headings.
  const pageHeading = <h1 className="sr-only">{tRef("assessment:page.hero.title")}</h1>;

  if (pageState === "analyzing" && currentConcept === "c") {
    return (
      <>
        {pageHeading}
        <ConceptCAnalyzingStateSection
          dataPrimaryState="analyzing"
          errorBody={t("insight-result", "analysis.errorBody")}
          errorTitle={t("insight-result", "analysis.errorTitle")}
          fallbackLabel={t("insight-result", "analysis.fallbackLabel")}
          label={tRef("common:organizationInsightLabel")}
          loadingBody={t("insight-result", "analysis.loadingBody")}
          loadingTitle={t("insight-result", "analysis.loadingTitle")}
          onRetry={handleRetryAnalysis}
          onUseFallback={handleUseFallback}
          retryLabel={t("insight-result", "analysis.retryLabel")}
          sectionId="insight-analyzing"
          status={analysisStatus === "error" ? "error" : "loading"}
        />
      </>
    );
  }

  if (pageState === "analyzing") {
    return (
      <>
        {pageHeading}
        <AnalyzingStateSection
          dataPrimaryState="analyzing"
          errorBody={t("insight-result", "analysis.errorBody")}
          errorTitle={t("insight-result", "analysis.errorTitle")}
          fallbackLabel={t("insight-result", "analysis.fallbackLabel")}
          label={tRef("common:organizationInsightLabel")}
          loadingBody={t("insight-result", "analysis.loadingBody")}
          loadingTitle={t("insight-result", "analysis.loadingTitle")}
          onRetry={handleRetryAnalysis}
          onUseFallback={handleUseFallback}
          retryLabel={t("insight-result", "analysis.retryLabel")}
          sectionId="insight-analyzing"
          status={analysisStatus === "error" ? "error" : "loading"}
        />
      </>
    );
  }

  if (pageState === "intro" && currentConcept === "c") {
    return (
      <>
        {pageHeading}
        <ConceptCInsightOverviewSection
          body={tRef(insightPage.hero.bodyRef)}
          ctaAction={openQuestionState}
          ctaLabel={tRef("homepage:insightPreview.action")}
          dataPrimaryState="intro"
          label={tRef(insightPage.hero.eyebrowRef)}
          questions={sortedQuestions.map((question) => ({
            id: question.id,
            order: question.order,
            label: tRef(question.questionRef),
          }))}
          sectionId="insight-overview"
          title={tRef(insightPage.hero.titleRef)}
        />
      </>
    );
  }

  if (pageState === "question" && currentConcept === "c") {
    return (
      <>
        {pageHeading}
        <ConceptCInsightQuestionFlowSection
          backLabel={tRef("assessment:page.controls.back")}
          continueLabel={tRef("assessment:page.controls.continue")}
          currentAnswer={questionFlow.currentAnswer}
          currentIndex={questionFlow.currentIndex}
          currentQuestion={questionFlow.currentQuestion}
          dataPrimaryState="question"
          label={tRef("common:organizationInsightLabel")}
          onBack={questionFlow.moveBack}
          onContinue={handleContinueWithTracking}
          onMultipleAnswerToggle={questionFlow.updateMultipleAnswer}
          onSingleAnswerChange={questionFlow.updateSingleAnswer}
          progressLabel={(current, total) =>
            tRef("assessment:page.controls.progress", { current, total })
          }
          questions={questionFlow.questions}
          sectionId="insight-flow"
          showValidation={questionFlow.showValidation}
          totalQuestions={questionFlow.totalQuestions}
          validationMessage={tRef("validation:required")}
        />
      </>
    );
  }

  if (pageState === "result" && currentConcept === "c") {
    return (
      <>
        {pageHeading}
        <ConceptCInsightResultSection
          capability={capability}
          contactLabel={tRef(insightPage.contactSection.eyebrowRef)}
          contactTitle={tRef(insightPage.contactSection.titleRef)}
          dataPrimaryState="result"
          directionTitle={tRef(insightPage.resultSection.directionTitleRef)}
          eyebrow={tRef(insightPage.resultSection.eyebrowRef)}
          focusItems={focusItems}
          focusTitle={tRef(insightPage.resultSection.focusTitleRef)}
          formId={insightPage.contactSection.formId as FormId}
          insightContext={insightContext}
          onRestart={handleRestart}
          process={process}
          restartLabel={t("insight-result", "actions.restart")}
          sectionId="insight-result"
        />
      </>
    );
  }

  return (
    <>
      {pageHeading}
      {pageState === "intro" ? (
        <InsightOverviewSection
          body={tRef(insightPage.hero.bodyRef)}
          ctaAction={openQuestionState}
          ctaLabel={tRef("homepage:insightPreview.action")}
          dataPrimaryState="intro"
          label={tRef(insightPage.hero.eyebrowRef)}
          questions={sortedQuestions.map((question) => ({
            id: question.id,
            order: question.order,
            label: tRef(question.questionRef),
          }))}
          sectionId="insight-overview"
          title={tRef(insightPage.hero.titleRef)}
          variant="page"
        />
      ) : pageState === "question" ? (
        <InsightQuestionFlowSection
          backLabel={tRef("assessment:page.controls.back")}
          continueLabel={tRef("assessment:page.controls.continue")}
          currentAnswer={questionFlow.currentAnswer}
          currentIndex={questionFlow.currentIndex}
          currentQuestion={questionFlow.currentQuestion}
          dataPrimaryState="question"
          label={tRef("common:organizationInsightLabel")}
          onBack={questionFlow.moveBack}
          onContinue={handleContinueWithTracking}
          onMultipleAnswerToggle={questionFlow.updateMultipleAnswer}
          onSingleAnswerChange={questionFlow.updateSingleAnswer}
          progressLabel={(current, total) =>
            tRef("assessment:page.controls.progress", { current, total })
          }
          questions={questionFlow.questions}
          sectionId="insight-flow"
          showValidation={questionFlow.showValidation}
          totalQuestions={questionFlow.totalQuestions}
          validationMessage={tRef("validation:required")}
          variant="page"
        />
      ) : (
        <InsightResultSection
          capability={capability}
          contactLabel={tRef(insightPage.contactSection.eyebrowRef)}
          contactTitle={tRef(insightPage.contactSection.titleRef)}
          dataPrimaryState="result"
          directionTitle={tRef(insightPage.resultSection.directionTitleRef)}
          eyebrow={tRef(insightPage.resultSection.eyebrowRef)}
          focusItems={focusItems}
          focusTitle={tRef(insightPage.resultSection.focusTitleRef)}
          formId={insightPage.contactSection.formId as FormId}
          insightContext={insightContext}
          onRestart={handleRestart}
          process={process}
          restartLabel={t("insight-result", "actions.restart")}
          sectionId="insight-result"
          variant="page"
        />
      )}
    </>
  );
}

import { Fragment } from "react";
import { HomeHeroSection } from "../concepts/concept-a/sections/HomeHeroSection";
import { ProblemInsightSection } from "../concepts/concept-a/sections/ProblemInsightSection";
import { InsightOverviewSection } from "../concepts/concept-a/sections/InsightOverviewSection";
import { CapabilitiesMethodSection } from "../concepts/concept-a/sections/CapabilitiesMethodSection";
import { ChallengesFormatsSection } from "../concepts/concept-a/sections/ChallengesFormatsSection";
import { OutcomesContactSection } from "../concepts/concept-a/sections/OutcomesContactSection";
import { ConceptCHomePage } from "../concepts/concept-c/ConceptCHomePage";
import { useAnalytics } from "../analytics/AnalyticsContext";
import { useCurrentConcept } from "../concepts/conceptMode";
import {
  siteStructure,
  ctaLinksById,
  capabilitiesById,
  challengesById,
  formatsById,
  outcomesById,
  processStepsById,
} from "../content/siteStructure";
import { useMessages } from "../i18n/messages";
import { useLanguage } from "../i18n/language";
import { assessmentDefinition } from "../shared/assessment/assessmentCatalog";
import type { FormId } from "../shared/forms/formCatalog";
import type { ReactNode } from "react";

function toSentenceFragments(text: string) {
  return text
    .split(/(?<=[.!?])\s+/u)
    .map((part) => part.trim().replace(/[.!?]+$/u, ""))
    .filter(Boolean);
}

export function HomePage() {
  const currentConcept = useCurrentConcept();
  const { currentLanguage, localizeHref } = useLanguage();
  const { tRef } = useMessages(currentLanguage);
  const { track } = useAnalytics();

  if (currentConcept === "c") {
    return <ConceptCHomePage />;
  }

  const homePage = siteStructure.pages.home;
  const sectionOrder = homePage.sectionOrder as Array<{
    id: string;
    component: string;
  }>;
  const insightPreviewQuestions = [...assessmentDefinition.questions]
    .sort((left, right) => left.order - right.order)
    .map((question) => ({
      id: question.id,
      order: question.order,
      label: tRef(question.previewRef),
    }));
  const sortedQuestions = [...assessmentDefinition.questions].sort(
    (left, right) => left.order - right.order,
  );
  const heroPrimaryCta = ctaLinksById[homePage.hero.primaryCtaId];
  const heroSecondaryCta = ctaLinksById[homePage.hero.secondaryCtaId];
  const insightPreviewCta = ctaLinksById[homePage.insightPreview.ctaId];
  const contextTitleParts = toSentenceFragments(tRef(homePage.context.titleRef));
  const contextParagraphs = homePage.context.bodyRefs.map((ref) => tRef(ref));
  const contextChangeItems = toSentenceFragments(
    tRef(homePage.context.bodyRefs[0]),
  ).slice(0, 3);
  const contextChallengeLines = toSentenceFragments(
    tRef(homePage.context.bodyRefs[1]),
  );
  const capabilities = homePage.capabilitiesSection.capabilityIds.map((id) => {
    const capability = capabilitiesById[id];
    return {
      id: capability.id,
      label: tRef(capability.labelRef),
      title: tRef(capability.titleRef),
      description: tRef(capability.descriptionRef),
    };
  });
  const process = homePage.processSection.processStepIds.map((id) => {
    const step = processStepsById[id];
    return {
      id: step.id,
      label: tRef(step.labelRef),
      title: tRef(step.titleRef),
      description: tRef(step.descriptionRef),
    };
  });
  const challenges = homePage.challengesSection.challengeIds.map((id) => {
    const challenge = challengesById[id];
    return {
      id: challenge.id,
      statement: tRef(challenge.statementRef),
      direction: tRef(challenge.directionRef),
    };
  });
  const outcomes = homePage.outcomesSection.outcomeIds.map((id) => {
    const outcome = outcomesById[id];
    return {
      id: outcome.id,
      label: tRef(outcome.labelRef),
      title: tRef(outcome.titleRef),
    };
  });
  const previewQuestion = sortedQuestions[2];
  const previewProgress = tRef("assessment:page.controls.progress", {
    current: previewQuestion.order,
    total: sortedQuestions.length,
  });
  const renderedComponents = new Set<string>();

  function renderSection(section: { id: string; component: string }): ReactNode {
    if (renderedComponents.has(section.component)) {
      return null;
    }

    renderedComponents.add(section.component);

    switch (section.component) {
      case "hero":
        return (
          <HomeHeroSection
            sectionId={section.id}
            body={tRef(homePage.hero.bodyRef)}
            challengeLines={contextChallengeLines}
            changeItems={contextChangeItems}
            leadLabel={contextTitleParts[0] ?? tRef(homePage.context.titleRef)}
            previewLabel={previewProgress}
            previewTitle={tRef(previewQuestion.questionRef)}
            onPrimaryCtaClick={() => track("primary_cta_clicked", { location: "home_hero" })}
            onSecondaryCtaClick={() => track("secondary_cta_clicked", { location: "home_hero" })}
            primaryCtaHref={localizeHref(heroPrimaryCta.href)}
            primaryCtaLabel={tRef(heroPrimaryCta.labelRef)}
            secondaryCtaHref={localizeHref(heroSecondaryCta.href)}
            secondaryCtaLabel={tRef(heroSecondaryCta.labelRef)}
            titleLines={homePage.hero.titleLineRefs.map((ref) => tRef(ref))}
          />
        );

      case "organizational-context":
        return (
          <ProblemInsightSection
            body={contextParagraphs}
            changeItems={[...contextChangeItems, ...contextTitleParts.slice(1)].slice(0, 4)}
            challengeLines={contextChallengeLines}
            headingId="organizational-context-heading"
            label={tRef(homePage.context.eyebrowRef)}
            sectionId={section.id}
            title={tRef(homePage.context.titleRef)}
          />
        );

      case "organizational-insight":
        return (
          <InsightOverviewSection
            body={tRef(homePage.insightPreview.bodyRef)}
            ctaHref={localizeHref(insightPreviewCta.href)}
            ctaLabel={tRef(insightPreviewCta.labelRef)}
            headingId="organizational-insight-heading"
            label={tRef(homePage.insightPreview.eyebrowRef)}
            questions={insightPreviewQuestions}
            sectionId={section.id}
            title={tRef(homePage.insightPreview.titleRef)}
          />
        );

      case "capabilities-method":
        return (
          <CapabilitiesMethodSection
            body={tRef(homePage.processSection.titleRef)}
            capabilities={capabilities}
            headingId="core-capabilities-heading"
            label={tRef(homePage.capabilitiesSection.eyebrowRef)}
            process={process}
            processLabel={tRef(homePage.processSection.eyebrowRef)}
            processSectionId="huma-method"
            sectionId="core-capabilities"
            title={tRef(homePage.capabilitiesSection.titleRef)}
          />
        );

      case "challenges-formats":
        return (
          <ChallengesFormatsSection
            body={tRef(homePage.challengesSection.bodyRef)}
            challenges={challenges}
            directionLabel={tRef(homePage.challengesSection.directionLabelRef)}
            formats={homePage.formatsSection.formatIds.map((id) => tRef(formatsById[id].labelRef))}
            formatsLabel={tRef(homePage.formatsSection.eyebrowRef)}
            formatsSectionId="delivery-formats"
            formatsTitle={tRef(homePage.formatsSection.titleRef)}
            headingId="organizational-challenges-heading"
            label={tRef(homePage.challengesSection.eyebrowRef)}
            sectionId="organizational-challenges"
            title={tRef(homePage.challengesSection.titleRef)}
          />
        );

      case "outcomes-contact":
        return (
          <OutcomesContactSection
            contactBody={tRef(homePage.contactSection.bodyRef)}
            contactLabel={tRef(homePage.contactSection.eyebrowRef)}
            contactSectionId="contact"
            contactTitle={tRef(homePage.contactSection.titleRef)}
            formId={homePage.contactSection.formId as FormId}
            headingId="organizational-outcomes-heading"
            label={tRef(homePage.outcomesSection.eyebrowRef)}
            outcomes={outcomes}
            sectionId="organizational-outcomes"
            title={tRef(homePage.outcomesSection.titleRef)}
          />
        );

      default:
        return null;
    }
  }

  return (
    <>
      {sectionOrder.map((section) => (
        <Fragment key={section.id}>
          {renderSection(section)}
        </Fragment>
      ))}
    </>
  );
}

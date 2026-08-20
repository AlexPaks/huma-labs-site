import { useAnalytics } from "../../analytics/AnalyticsContext";
import {
  capabilitiesById,
  challengesById,
  ctaLinksById,
  formatsById,
  outcomesById,
  processStepsById,
  siteStructure,
} from "../../content/siteStructure";
import { useLanguage } from "../../i18n/language";
import { useMessages } from "../../i18n/messages";
import { assessmentDefinition } from "../../shared/assessment/assessmentCatalog";
import type { FormId } from "../../shared/forms/formCatalog";
import { ConceptCCapabilitiesMethodSection } from "./sections/ConceptCCapabilitiesMethodSection";
import { ConceptCChallengesFormatsSection } from "./sections/ConceptCChallengesFormatsSection";
import { ConceptCHomeHeroSection } from "./sections/ConceptCHomeHeroSection";
import { ConceptCOutcomesContactSection } from "./sections/ConceptCOutcomesContactSection";
import { ConceptCProblemInsightSection } from "./sections/ConceptCProblemInsightSection";

function toSentenceFragments(text: string) {
  return text
    .split(/(?<=[.!?])\s+/u)
    .map((part) => part.trim().replace(/[.!?]+$/u, ""))
    .filter(Boolean);
}

function toShortLabel(text: string, wordCount = 3) {
  return text.split(/\s+/u).filter(Boolean).slice(0, wordCount).join(" ");
}

export function ConceptCHomePage() {
  const { currentLanguage, localizeHref } = useLanguage();
  const { tRef } = useMessages(currentLanguage);
  const { track } = useAnalytics();
  const homePage = siteStructure.pages.home;
  const heroPrimaryCta = ctaLinksById[homePage.hero.primaryCtaId];
  const heroSecondaryCta = ctaLinksById[homePage.hero.secondaryCtaId];
  const insightPreviewCta = ctaLinksById[homePage.insightPreview.ctaId];
  const contextParagraphs = homePage.context.bodyRefs.map((ref) => tRef(ref));
  const contextChangeItems = toSentenceFragments(
    tRef(homePage.context.bodyRefs[0]),
  ).slice(0, 4);
  const contextChallengeLines = toSentenceFragments(
    tRef(homePage.context.bodyRefs[1]),
  );
  const insightPreviewQuestions = [...assessmentDefinition.questions]
    .sort((left, right) => left.order - right.order)
    .map((question) => ({
      id: question.id,
      order: question.order,
      label: tRef(question.previewRef),
    }));

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
      outcome: tRef(step.outcomeRef),
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

  return (
    <>
      <ConceptCHomeHeroSection
        body={tRef(homePage.hero.bodyRef)}
        capabilityLabel={toShortLabel(tRef(homePage.capabilitiesSection.titleRef))}
        challengeLabel={toShortLabel(tRef(homePage.context.titleRef), 2)}
        eyebrow={tRef(homePage.hero.eyebrowRef)}
        onPrimaryCtaClick={() => track("primary_cta_clicked", { location: "home_hero" })}
        onSecondaryCtaClick={() => track("secondary_cta_clicked", { location: "home_hero" })}
        primaryCtaHref={localizeHref(heroPrimaryCta.href)}
        primaryCtaLabel={tRef(heroPrimaryCta.labelRef)}
        secondaryCtaHref={localizeHref(heroSecondaryCta.href)}
        secondaryCtaLabel={tRef(heroSecondaryCta.labelRef)}
        sectionId="hero"
        statLabels={siteStructure.heroStats.map((item) => tRef(item.labelRef))}
        titleLines={homePage.hero.titleLineRefs.map((ref) => tRef(ref))}
      />

      <ConceptCProblemInsightSection
        changeItems={contextChangeItems}
        challengeLines={contextChallengeLines}
        contextBody={contextParagraphs}
        contextLabel={tRef(homePage.context.eyebrowRef)}
        contextTitle={tRef(homePage.context.titleRef)}
        ctaHref={localizeHref(insightPreviewCta.href)}
        ctaLabel={tRef(insightPreviewCta.labelRef)}
        insightBody={tRef(homePage.insightPreview.bodyRef)}
        insightLabel={tRef(homePage.insightPreview.eyebrowRef)}
        insightTitle={tRef(homePage.insightPreview.titleRef)}
        questions={insightPreviewQuestions}
        sectionId="organizational-context"
      />

      <ConceptCCapabilitiesMethodSection
        body={tRef(homePage.processSection.bodyRef)}
        capabilities={capabilities}
        capabilitiesLabel={tRef(homePage.capabilitiesSection.eyebrowRef)}
        label={tRef(homePage.capabilitiesSection.eyebrowRef)}
        methodLabel={tRef(homePage.processSection.eyebrowRef)}
        outcomesLabel={tRef(homePage.outcomesSection.eyebrowRef)}
        process={process}
        sectionId="core-capabilities"
        title={tRef(homePage.capabilitiesSection.titleRef)}
      />

      <ConceptCChallengesFormatsSection
        body={tRef(homePage.challengesSection.bodyRef)}
        challenges={challenges}
        directionLabel={tRef(homePage.challengesSection.directionLabelRef)}
        formats={homePage.formatsSection.formatIds.map((id) => tRef(formatsById[id].labelRef))}
        formatsLabel={tRef(homePage.formatsSection.eyebrowRef)}
        formatsTitle={tRef(homePage.formatsSection.titleRef)}
        label={tRef(homePage.challengesSection.eyebrowRef)}
        sectionId="organizational-challenges"
        title={tRef(homePage.challengesSection.titleRef)}
      />

      <ConceptCOutcomesContactSection
        contactBody={tRef(homePage.contactSection.bodyRef)}
        contactLabel={tRef(homePage.contactSection.eyebrowRef)}
        contactSectionId="contact"
        contactTitle={tRef(homePage.contactSection.titleRef)}
        formId={homePage.contactSection.formId as FormId}
        label={tRef(homePage.outcomesSection.eyebrowRef)}
        outcomes={outcomes}
        sectionId="organizational-outcomes"
        title={tRef(homePage.outcomesSection.titleRef)}
      />
    </>
  );
}

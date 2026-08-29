import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const phase7ValidationDir = path.join(root, "docs", "implementation", "validation", "phase-7");
const approvedCapabilityIds = new Set(["presence", "resilience", "adaptability", "leadership"]);

function readJson(relativePath) {
  const raw = fs.readFileSync(path.join(root, relativePath), "utf8").replace(/^﻿/, "");
  return JSON.parse(raw);
}

function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

// --- Pure engine logic, mirrored from src/shared/assessment/insightEngine.ts ---
// Duplicated here (rather than imported) to match this repo's existing
// validate-phase2.mjs / validate-phase3.mjs convention of plain-JS Node
// scripts with no TypeScript module resolution step.

function toValueList(value) {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

function evaluateVisibility(condition, answers) {
  if (!condition) return true;
  const answerValues = toValueList(answers[condition.questionId]);
  if (condition.equals !== undefined && condition.equals !== null) {
    return answerValues.includes(condition.equals);
  }
  if (condition.in) {
    return answerValues.some((value) => condition.in.includes(value));
  }
  if (condition.notEquals !== undefined && condition.notEquals !== null) {
    return !answerValues.includes(condition.notEquals);
  }
  return true;
}

function getVisibleQuestions(questions, answers) {
  return [...questions]
    .sort((left, right) => left.order - right.order)
    .filter((question) => evaluateVisibility(question.visibleWhen, answers));
}

function resolveNextQuestionId(question, answerValue, visibleQuestions) {
  if (question.type === "single-choice" && typeof answerValue === "string") {
    const option = question.options.find((candidate) => candidate.id === answerValue);
    if (option?.nextQuestionId) return option.nextQuestionId;
  }
  if (question.nextQuestionId) return question.nextQuestionId;
  const currentPosition = visibleQuestions.findIndex((candidate) => candidate.id === question.id);
  return visibleQuestions[currentPosition + 1]?.id ?? null;
}

function isAnswerValid(question, value) {
  if (question.type === "multiple-choice") {
    const values = Array.isArray(value) ? value : [];
    const min = question.validation.minSelections ?? (question.required ? 1 : 0);
    const max = question.validation.maxSelections ?? Number.POSITIVE_INFINITY;
    return values.length >= min && values.length <= max;
  }
  if (question.type === "single-choice") {
    const hasSelection = typeof value === "string" && value.length > 0;
    return question.required ? hasSelection : true;
  }
  const text = typeof value === "string" ? value.trim() : "";
  const minLength = question.validation.minLength ?? (question.required ? 1 : 0);
  const maxLength = question.validation.maxLength ?? Number.POSITIVE_INFINITY;
  return text.length >= minLength && text.length <= maxLength;
}

function buildCompletionPayload(quizId, quizVersion, language, visitedQuestionIds, answers) {
  return {
    quizId,
    quizVersion,
    language,
    visitedQuestionIds,
    answers: visitedQuestionIds.map((questionId) => ({
      questionId,
      value: answers[questionId] ?? "",
    })),
  };
}

function buildMockInsightResult(payload, questionsById) {
  const tally = {};
  for (const answer of payload.answers) {
    const capabilityMapping = questionsById[answer.questionId]?.capabilityMapping;
    if (!capabilityMapping) continue;
    for (const value of toValueList(answer.value)) {
      const capabilityId = capabilityMapping[value];
      if (capabilityId) tally[capabilityId] = (tally[capabilityId] ?? 0) + 1;
    }
  }
  const [topEntry] = Object.entries(tally).sort((left, right) => right[1] - left[1]);
  return { isMock: true, primaryCapabilityId: topEntry?.[0] ?? null, capabilityTally: tally };
}

// --- Simulates a full quiz walkthrough by always picking the first visible/valid answer ---
function simulateWalkthrough(quizId, quizVersion, language, questions, answerPicker) {
  const questionsById = Object.fromEntries(questions.map((q) => [q.id, q]));
  let answers = {};
  const visited = [];
  let currentId = getVisibleQuestions(questions, answers)[0]?.id ?? null;
  let guard = 0;

  while (currentId && guard < 100) {
    guard += 1;
    const question = questionsById[currentId];
    if (!question) break;
    visited.push(currentId);

    const value = answerPicker(question);
    answers = { ...answers, [currentId]: value };

    if (!isAnswerValid(question, value)) {
      return { ok: false, reason: `Simulated answer failed validation for "${currentId}"`, visited, answers };
    }

    const visibleQuestions = getVisibleQuestions(questions, answers);
    currentId = resolveNextQuestionId(question, value, visibleQuestions);
  }

  const payload = buildCompletionPayload(quizId, quizVersion, language, visited, answers);
  const mockResult = buildMockInsightResult(payload, questionsById);
  return { ok: true, visited, answers, payload, mockResult };
}

function main() {
  ensureDirectory(phase7ValidationDir);

  const assessmentDefinition = readJson(path.join("content", "assessment.json"));
  const issues = [];
  const questions = assessmentDefinition.questions;
  const questionsById = Object.fromEntries(questions.map((q) => [q.id, q]));
  const questionIdsInOrder = [...questions].sort((a, b) => a.order - b.order).map((q) => q.id);
  const requiredMultiSelectQuestionIds = new Set(["challenge", "impact", "desired-change", "audience"]);

  // 1. Structural integrity.
  const seenIds = new Set();
  for (const question of questions) {
    if (seenIds.has(question.id)) issues.push(`Duplicate question id: ${question.id}`);
    seenIds.add(question.id);

    const optionIds = new Set();
    for (const option of question.options ?? []) {
      if (optionIds.has(option.id)) {
        issues.push(`Duplicate option id "${option.id}" in question "${question.id}"`);
      }
      optionIds.add(option.id);

      if (option.nextQuestionId && !questionsById[option.nextQuestionId]) {
        issues.push(
          `Option "${option.id}" in question "${question.id}" references unknown nextQuestionId "${option.nextQuestionId}"`,
        );
      }

      if (requiredMultiSelectQuestionIds.has(question.id)) {
        if (!Array.isArray(option.analysis?.themes) || option.analysis.themes.length === 0) {
          issues.push(`Option "${option.id}" in "${question.id}" is missing structured analysis themes`);
        }
        for (const conflict of option.analysis?.conflictsWith ?? []) {
          const targetQuestion = questionsById[conflict.questionId];
          if (!targetQuestion?.options.some((candidate) => candidate.id === conflict.optionId)) {
            issues.push(`Option "${option.id}" in "${question.id}" has an invalid consistency conflict target`);
          }
        }
      }
    }

    if (question.nextQuestionId && !questionsById[question.nextQuestionId]) {
      issues.push(`Question "${question.id}" references unknown nextQuestionId "${question.nextQuestionId}"`);
    }

    if (question.visibleWhen) {
      const dependsOnId = question.visibleWhen.questionId;
      if (!questionsById[dependsOnId]) {
        issues.push(`Question "${question.id}" visibleWhen references unknown question "${dependsOnId}"`);
      } else if (questionsById[dependsOnId].order >= question.order) {
        issues.push(
          `Question "${question.id}" visibleWhen depends on "${dependsOnId}", which is not strictly earlier in order`,
        );
      }
    }

    if (question.capabilityMapping) {
      for (const [optionId, capabilityId] of Object.entries(question.capabilityMapping)) {
        if (!optionIds.has(optionId)) {
          issues.push(`capabilityMapping in "${question.id}" references unknown option id "${optionId}"`);
        }
        if (!approvedCapabilityIds.has(capabilityId)) {
          issues.push(
            `capabilityMapping in "${question.id}" maps "${optionId}" to unapproved capability id "${capabilityId}"`,
          );
        }
      }
    }

    if (requiredMultiSelectQuestionIds.has(question.id)) {
      if (question.type !== "multiple-choice") {
        issues.push(`Question "${question.id}" must allow multiple selections`);
      }
      if (question.validation.minSelections !== 1 || question.validation.maxSelections !== 3) {
        issues.push(`Question "${question.id}" must require one to three selections`);
      }
    }
  }

  for (const questionId of ["current-state", "tomorrow-problem"]) {
    if (questionsById[questionId]?.type === "multiple-choice") {
      issues.push(`Question "${questionId}" must not allow multiple selections`);
    }
  }

  // 2. Default-configuration regression guard: the approved six questions must remain
  //    always-visible (no visibleWhen) so today's linear flow is unchanged, per explicit
  //    user decision when Phase 7 was scoped.
  const questionsWithVisibility = questions.filter((q) => q.visibleWhen);
  if (questionsWithVisibility.length > 0) {
    issues.push(
      `Default content must keep all questions unconditionally visible; found visibleWhen on: ${questionsWithVisibility
        .map((q) => q.id)
        .join(", ")}`,
    );
  }

  // 3. Full walkthrough of the real content, always picking the first available option /
  //    a synthetic long-text answer, must reach every question exactly once in order and
  //    terminate — proving the default behavior is the unchanged linear 6-question flow.
  const defaultWalkthrough = simulateWalkthrough(
    assessmentDefinition.quizId,
    assessmentDefinition.version,
    "he",
    questions,
    (question) => {
      if (question.type === "multiple-choice") return [question.options[0]?.id].filter(Boolean);
      if (question.type === "single-choice") return question.options[0]?.id ?? "";
      return "a".repeat(Math.max(1, question.validation.minLength ?? 1));
    },
  );

  if (!defaultWalkthrough.ok) {
    issues.push(`Default walkthrough failed: ${defaultWalkthrough.reason}`);
  } else {
    if (JSON.stringify(defaultWalkthrough.visited) !== JSON.stringify(questionIdsInOrder)) {
      issues.push(
        `Default walkthrough visited [${defaultWalkthrough.visited.join(
          ", ",
        )}], expected the unchanged linear order [${questionIdsInOrder.join(", ")}]`,
      );
    }
    if (
      defaultWalkthrough.mockResult.primaryCapabilityId &&
      !approvedCapabilityIds.has(defaultWalkthrough.mockResult.primaryCapabilityId)
    ) {
      issues.push(
        `Default walkthrough produced an unapproved primary capability id: ${defaultWalkthrough.mockResult.primaryCapabilityId}`,
      );
    }
  }

  // 4. Validation-rule self-test: an empty long-text answer must fail validation, and a
  //    too-long answer must fail maxLength, on the real "tomorrow-problem" question.
  const longTextQuestion = questions.find((q) => q.type === "long-text");
  const validationSelfTest = {
    emptyAnswerRejected: longTextQuestion ? !isAnswerValid(longTextQuestion, "") : null,
    tooLongAnswerRejected: longTextQuestion
      ? !isAnswerValid(longTextQuestion, "a".repeat((longTextQuestion.validation.maxLength ?? 0) + 1))
      : null,
    validAnswerAccepted: longTextQuestion ? isAnswerValid(longTextQuestion, "a valid answer") : null,
  };
  if (longTextQuestion) {
    if (!validationSelfTest.emptyAnswerRejected) issues.push("Validation self-test: empty long-text answer was not rejected");
    if (!validationSelfTest.tooLongAnswerRejected) issues.push("Validation self-test: over-length long-text answer was not rejected");
    if (!validationSelfTest.validAnswerAccepted) issues.push("Validation self-test: a valid long-text answer was rejected");
  }

  // 5. Synthetic branching + conditional-visibility self-test (fixture only, not the
  //    real content) proving the generic engine mechanism works, per the explicit
  //    decision to keep the real six approved questions on unconditional linear flow.
  const syntheticQuestions = [
    {
      id: "s1",
      order: 1,
      type: "single-choice",
      required: true,
      options: [
        { id: "branch-x", nextQuestionId: "s3" },
        { id: "branch-y", nextQuestionId: null },
      ],
      validation: {},
      visibleWhen: null,
      nextQuestionId: "s2",
    },
    {
      id: "s2",
      order: 2,
      type: "short-text",
      required: true,
      options: [],
      validation: { minLength: 1, maxLength: 20 },
      visibleWhen: { questionId: "s1", equals: "branch-y" },
      nextQuestionId: "s3",
    },
    {
      id: "s3",
      order: 3,
      type: "single-choice",
      required: true,
      options: [{ id: "done", nextQuestionId: null }],
      validation: {},
      visibleWhen: null,
      nextQuestionId: null,
    },
  ];

  const branchingRun = simulateWalkthrough("synthetic", "test", "he", syntheticQuestions, (question) => {
    if (question.id === "s1") return "branch-x";
    if (question.id === "s2") return "should not be reached";
    return question.options[0]?.id ?? "";
  });
  const conditionalVisibilityRun = simulateWalkthrough("synthetic", "test", "he", syntheticQuestions, (question) => {
    if (question.id === "s1") return "branch-y";
    if (question.id === "s2") return "reached s2";
    return question.options[0]?.id ?? "";
  });

  const engineSelfTest = {
    branchingSkipsS2WhenBranchX: branchingRun.ok && !branchingRun.visited.includes("s2"),
    conditionalVisibilityShowsS2WhenBranchY: conditionalVisibilityRun.ok && conditionalVisibilityRun.visited.includes("s2"),
  };
  if (!engineSelfTest.branchingSkipsS2WhenBranchX) {
    issues.push("Engine self-test: branching did not skip the conditionally-irrelevant question s2");
  }
  if (!engineSelfTest.conditionalVisibilityShowsS2WhenBranchY) {
    issues.push("Engine self-test: conditional visibility did not show s2 when its condition was met");
  }

  const report = {
    generatedAt: new Date().toISOString(),
    structuralValidation: {
      passed: issues.length === 0,
      issues,
    },
    defaultWalkthrough: {
      visitedQuestionIds: defaultWalkthrough.visited,
      expectedQuestionIds: questionIdsInOrder,
      mockResult: defaultWalkthrough.ok ? defaultWalkthrough.mockResult : null,
    },
    validationSelfTest,
    engineSelfTest,
  };

  fs.writeFileSync(
    path.join(phase7ValidationDir, "phase7-validation-report.json"),
    `${JSON.stringify(report, null, 2)}\n`,
  );

  console.log(JSON.stringify(report, null, 2));

  if (issues.length > 0) {
    process.exitCode = 1;
  }
}

main();

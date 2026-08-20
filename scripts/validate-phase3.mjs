import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const phase3ValidationDir = path.join(
  root,
  "docs",
  "implementation",
  "validation",
  "phase-3",
);

const messageDomains = [
  "common",
  "navigation",
  "homepage",
  "assessment",
  "insight-result",
  "contact-form",
  "validation",
  "system",
  "cookie-consent",
  "privacy",
  "seo",
];

const approvedRoutingIds = new Set(["contact", "insight-delivery"]);
const secretPatterns = [
  /OPENAI_API_KEY/i,
  /ANTHROPIC_API_KEY/i,
  /SMTP/i,
  /SECRET/i,
  /PASSWORD/i,
  /TOKEN/i,
];

const allowedHebrewEnglishLeaves = new Set(["common.languageNames.he"]);

function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8").replace(/^\uFEFF/, "");
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

function flattenLeaves(value, prefix = "") {
  if (typeof value === "string") {
    return [prefix];
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [];
  }

  return Object.entries(value).flatMap(([key, child]) => {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    return flattenLeaves(child, nextPrefix);
  });
}

function readLeafValue(value, dottedPath) {
  const segments = dottedPath.split(".");
  let current = value;

  for (const segment of segments) {
    if (!current || typeof current !== "object" || !(segment in current)) {
      return null;
    }

    current = current[segment];
  }

  return typeof current === "string" ? current : null;
}

function collectInterpolationTokens(value) {
  return Array.from(
    value.matchAll(/{{\s*([a-zA-Z0-9_]+)\s*}}/g),
    (match) => match[1],
  ).sort();
}

function collectMessageRefs(value, collector = []) {
  if (Array.isArray(value)) {
    for (const item of value) {
      collectMessageRefs(item, collector);
    }
    return collector;
  }

  if (!value || typeof value !== "object") {
    return collector;
  }

  for (const [key, child] of Object.entries(value)) {
    if (key.endsWith("Ref") && typeof child === "string") {
      collector.push(child);
    } else if (key.endsWith("Refs") && Array.isArray(child)) {
      for (const item of child) {
        if (typeof item === "string") {
          collector.push(item);
        }
      }
    } else {
      collectMessageRefs(child, collector);
    }
  }

  return collector;
}

function containsHebrew(text) {
  return /[\u0590-\u05FF]/.test(text);
}

function resolveMessageRef(catalogs, ref, language) {
  const [domain, key] = ref.split(":");
  if (!domain || !key || !(domain in catalogs[language])) {
    return false;
  }

  const value = readLeafValue(catalogs[language][domain], key);
  return typeof value === "string" && value.trim().length > 0;
}

function createLanguageAudit() {
  return [
    {
      file: "index.html",
      value: 'lang="he" dir="rtl"',
      reason: "Static HTML defaults are used only as an initial bootstrap state before the path-aware script and React language system run.",
      classification: "technical",
      futureOwner: "Phase 16 deployment review",
    },
    {
      file: "index.html",
      value: '"en" / "he" / "ltr" / "rtl"',
      reason: "Initial path parsing sets the document language and direction before hydration.",
      classification: "technical",
      futureOwner: "Shared language system",
    },
    {
      file: "src/config/site.ts",
      value: '"he" | "en" and "rtl" | "ltr"',
      reason: "Supported language and direction identifiers are required application configuration.",
      classification: "technical",
      futureOwner: "Shared language system",
    },
    {
      file: "src/i18n/language.tsx",
      value: '"he" / "en" / "rtl" / "ltr"',
      reason: "Localized route parsing, persistence, and direction resolution require stable technical language identifiers.",
      classification: "technical",
      futureOwner: "Shared language system",
    },
    {
      file: "src/i18n/messages.ts",
      value: "messages/he and messages/en catalog imports",
      reason: "Catalog loading uses stable language directories and is not user-visible copy.",
      classification: "technical",
      futureOwner: "Shared language system",
    },
    {
      file: "src/styles.css",
      value: '.field[dir="ltr"] and .field[dir="rtl"]',
      reason: "Mixed-direction form inputs need explicit CSS hooks for readable email and telephone entry.",
      classification: "technical",
      futureOwner: "Shared form system",
    },
    {
      file: "src/shared/forms/DynamicForm.tsx",
      value: '"he" / "rtl" / "ltr"',
      reason: "Form input direction switches are technical logic, not editable user-facing copy.",
      classification: "technical",
      futureOwner: "Shared form system",
    },
  ];
}

function main() {
  ensureDirectory(phase3ValidationDir);

  const catalogs = {
    he: Object.fromEntries(
      messageDomains.map((domain) => [
        domain,
        readJson(path.join("messages", "he", `${domain}.json`)),
      ]),
    ),
    en: Object.fromEntries(
      messageDomains.map((domain) => [
        domain,
        readJson(path.join("messages", "en", `${domain}.json`)),
      ]),
    ),
  };

  const siteStructure = readJson(path.join("content", "site-structure.json"));
  const assessmentDefinition = readJson(path.join("content", "assessment.json"));
  const contactFormDefinition = readJson(path.join("forms", "contact-form.json"));
  const insightEmailFormDefinition = readJson(
    path.join("forms", "insight-email-form.json"),
  );

  const contentIssues = [];
  const languageIssues = [];

  for (const domain of messageDomains) {
    const hebrewShape = flattenLeaves(catalogs.he[domain]).sort();
    const englishShape = flattenLeaves(catalogs.en[domain]).sort();

    if (JSON.stringify(hebrewShape) !== JSON.stringify(englishShape)) {
      contentIssues.push(`Shape mismatch between he and en for domain: ${domain}`);
    }

    for (const leafPath of hebrewShape) {
      const hebrewValue = readLeafValue(catalogs.he[domain], leafPath) ?? "";
      const englishValue = readLeafValue(catalogs.en[domain], leafPath) ?? "";

      if (hebrewValue.trim().length === 0) {
        contentIssues.push(`Empty Hebrew message value: ${domain}.${leafPath}`);
      }

      if (englishValue.trim().length === 0) {
        languageIssues.push(`Empty English message value: ${domain}.${leafPath}`);
      }

      const heTokens = collectInterpolationTokens(hebrewValue);
      const enTokens = collectInterpolationTokens(englishValue);
      if (JSON.stringify(heTokens) !== JSON.stringify(enTokens)) {
        languageIssues.push(
          `Interpolation token mismatch between he and en for ${domain}.${leafPath}`,
        );
      }

      if (
        containsHebrew(englishValue) &&
        !allowedHebrewEnglishLeaves.has(`${domain}.${leafPath}`)
      ) {
        languageIssues.push(
          `Unexpected Hebrew text found in English message: ${domain}.${leafPath}`,
        );
      }
    }
  }

  const referencedMessageRefs = new Set([
    ...collectMessageRefs(siteStructure),
    ...collectMessageRefs(assessmentDefinition),
    ...collectMessageRefs(contactFormDefinition),
    ...collectMessageRefs(insightEmailFormDefinition),
  ]);

  for (const ref of referencedMessageRefs) {
    if (!resolveMessageRef(catalogs, ref, "he")) {
      contentIssues.push(`Missing Hebrew message ref: ${ref}`);
    }

    if (!resolveMessageRef(catalogs, ref, "en")) {
      languageIssues.push(`Missing English message ref: ${ref}`);
    }
  }

  const quizIssues = [];
  const questionIds = new Set();
  for (const question of assessmentDefinition.questions) {
    if (questionIds.has(question.id)) {
      quizIssues.push(`Duplicate question id: ${question.id}`);
    }
    questionIds.add(question.id);

    const optionIds = new Set();
    for (const option of question.options ?? []) {
      if (optionIds.has(option.id)) {
        quizIssues.push(
          `Duplicate option id "${option.id}" in question "${question.id}"`,
        );
      }
      optionIds.add(option.id);
    }
  }

  const formIssues = [];
  for (const formDefinition of [contactFormDefinition, insightEmailFormDefinition]) {
    if (!approvedRoutingIds.has(formDefinition.routingId)) {
      formIssues.push(`Unapproved routing id: ${formDefinition.routingId}`);
    }

    const fieldIds = new Set();
    for (const field of formDefinition.fields) {
      if (fieldIds.has(field.id)) {
        formIssues.push(
          `Duplicate field id "${field.id}" in form "${formDefinition.formId}"`,
        );
      }
      fieldIds.add(field.id);
    }
  }

  const publicJsonPayload = JSON.stringify({
    siteStructure,
    assessmentDefinition,
    contactFormDefinition,
    insightEmailFormDefinition,
    catalogs,
  });

  const exposureIssues = [];
  if (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(publicJsonPayload)) {
    exposureIssues.push("Public definitions contain an email address.");
  }
  for (const pattern of secretPatterns) {
    if (pattern.test(publicJsonPayload)) {
      exposureIssues.push(
        `Public definitions contain a secret-like token matching ${pattern}`,
      );
    }
  }

  const appRoutesSource = readText(path.join("src", "app", "AppRoutes.tsx"));
  const languageSource = readText(path.join("src", "i18n", "language.tsx"));
  const indexHtmlSource = readText("index.html");

  const routeChecks = {
    localizedHomeRoute: appRoutesSource.includes('path="/:language"'),
    localizedInsightRoute: appRoutesSource.includes('path="insight"'),
    legacyHomeRedirect: appRoutesSource.includes('path="/" element={<CompatibilityRedirect />}'),
    legacyInsightRedirect: appRoutesSource.includes('path="/insight" element={<CompatibilityRedirect />}'),
    queryLanguageNormalization: appRoutesSource.includes("getQueryLanguage"),
    languagePersistence: languageSource.includes("huma-language"),
    documentLangUpdate: languageSource.includes("document.documentElement.lang"),
    documentDirUpdate: languageSource.includes("document.documentElement.dir"),
    htmlBootstrapDirection: indexHtmlSource.includes("document.documentElement.dir = direction"),
  };

  const routeIssues = Object.entries(routeChecks)
    .filter(([, passed]) => !passed)
    .map(([key]) => `Missing route/language architecture check: ${key}`);

  const languageAudit = createLanguageAudit();

  const report = {
    generatedAt: new Date().toISOString(),
    contentValidation: {
      passed: contentIssues.length === 0,
      issues: contentIssues,
      referencedMessageRefCount: referencedMessageRefs.size,
    },
    languageValidation: {
      passed:
        languageIssues.length === 0 &&
        routeIssues.length === 0,
      issues: [...languageIssues, ...routeIssues],
    },
    quizValidation: {
      passed: quizIssues.length === 0,
      issues: quizIssues,
    },
    formValidation: {
      passed: formIssues.length === 0 && exposureIssues.length === 0,
      issues: [...formIssues, ...exposureIssues],
    },
    routeChecks,
    languageAuditSummary: {
      passed: languageAudit.every((entry) => entry.classification === "technical"),
      userVisibleExceptions: [],
      technicalExceptions: languageAudit.length,
    },
  };

  fs.writeFileSync(
    path.join(phase3ValidationDir, "phase3-validation-report.json"),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  fs.writeFileSync(
    path.join(phase3ValidationDir, "phase3-language-audit.json"),
    `${JSON.stringify(languageAudit, null, 2)}\n`,
  );

  console.log(JSON.stringify(report, null, 2));

  const hasFailures =
    !report.contentValidation.passed ||
    !report.languageValidation.passed ||
    !report.quizValidation.passed ||
    !report.formValidation.passed ||
    !report.languageAuditSummary.passed;

  if (hasFailures) {
    process.exitCode = 1;
  }
}

main();

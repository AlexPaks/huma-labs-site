import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const phase2ValidationDir = path.join(
  root,
  "docs",
  "implementation",
  "validation",
  "phase-2",
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

function readJson(relativePath) {
  const raw = fs
    .readFileSync(path.join(root, relativePath), "utf8")
    .replace(/^\uFEFF/, "");
  return JSON.parse(raw);
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

function resolveMessageRef(catalogs, ref) {
  const [domain, key] = ref.split(":");
  if (!domain || !key || !(domain in catalogs.he)) {
    return { domain, key, exists: false };
  }

  const hebrewValue = readLeafValue(catalogs.he[domain], key);
  return {
    domain,
    key,
    exists: typeof hebrewValue === "string",
  };
}

function walkDirectory(directoryPath, matcher, collector = []) {
  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    const fullPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      walkDirectory(fullPath, matcher, collector);
      continue;
    }

    if (matcher(fullPath)) {
      collector.push(fullPath);
    }
  }

  return collector;
}

function analyzeHardcodedCopy(srcDirectory) {
  const sourceFiles = walkDirectory(
    srcDirectory,
    (fullPath) => fullPath.endsWith(".ts") || fullPath.endsWith(".tsx"),
  );
  const exceptions = [];

  for (const fullPath of sourceFiles) {
    const sourceText = fs.readFileSync(fullPath, "utf8");
    const sourceFile = ts.createSourceFile(
      fullPath,
      sourceText,
      ts.ScriptTarget.Latest,
      true,
      fullPath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    );

    function visit(node) {
      if (ts.isJsxText(node)) {
        const text = node.getText().trim();
        if (text) {
          exceptions.push({
            file: path.relative(root, fullPath),
            string: text,
            reason: "JSX text node remains in source.",
            classification: "user-visible",
            futurePhaseOwner: "Phase 2",
          });
        }
      }

      if (
        ts.isJsxAttribute(node) &&
        ["aria-label", "title", "placeholder", "alt"].includes(node.name.text)
      ) {
        const initializer = node.initializer;
        if (initializer && ts.isStringLiteral(initializer)) {
          exceptions.push({
            file: path.relative(root, fullPath),
            string: initializer.text,
            reason: `Literal ${node.name.text} attribute remains in source.`,
            classification: "user-visible",
            futurePhaseOwner: "Phase 2",
          });
        }
      }

      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
  }

  return exceptions;
}

function main() {
  ensureDirectory(phase2ValidationDir);

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

  const messageIssues = [];
  for (const domain of messageDomains) {
    const hebrewShape = flattenLeaves(catalogs.he[domain]).sort();
    const englishShape = flattenLeaves(catalogs.en[domain]).sort();

    if (JSON.stringify(hebrewShape) !== JSON.stringify(englishShape)) {
      messageIssues.push(`Shape mismatch between he and en for domain: ${domain}`);
    }

    for (const leafPath of hebrewShape) {
      const hebrewValue = readLeafValue(catalogs.he[domain], leafPath);
      if (!hebrewValue || hebrewValue.trim().length === 0) {
        messageIssues.push(`Empty Hebrew message value: ${domain}.${leafPath}`);
      }

      const englishValue = readLeafValue(catalogs.en[domain], leafPath) ?? "";
      const heTokens = collectInterpolationTokens(hebrewValue ?? "");
      const enTokens = collectInterpolationTokens(englishValue);
      if (JSON.stringify(heTokens) !== JSON.stringify(enTokens)) {
        messageIssues.push(
          `Interpolation token mismatch between he and en for ${domain}.${leafPath}`,
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

  const missingMessageRefs = [...referencedMessageRefs].filter(
    (ref) => !resolveMessageRef(catalogs, ref).exists,
  );

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
    catalogs: catalogs.he,
  });

  const publicExposureIssues = [];
  if (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(publicJsonPayload)) {
    publicExposureIssues.push("Public definitions contain an email address.");
  }
  for (const pattern of secretPatterns) {
    if (pattern.test(publicJsonPayload)) {
      publicExposureIssues.push(
        `Public definitions contain a secret-like token matching ${pattern}`,
      );
    }
  }

  const hardcodedCopyExceptions = analyzeHardcodedCopy(
    path.join(root, "src"),
  );

  const report = {
    generatedAt: new Date().toISOString(),
    messageValidation: {
      passed: messageIssues.length === 0 && missingMessageRefs.length === 0,
      issues: [...messageIssues, ...missingMessageRefs.map((ref) => `Missing referenced message ref: ${ref}`)],
    },
    contentSchemaValidation: {
      passed: missingMessageRefs.length === 0,
      referencedMessageRefCount: referencedMessageRefs.size,
    },
    quizValidation: {
      passed: quizIssues.length === 0,
      issues: quizIssues,
    },
    formValidation: {
      passed: formIssues.length === 0 && publicExposureIssues.length === 0,
      issues: [...formIssues, ...publicExposureIssues],
    },
    hardcodedCopyExceptions,
  };

  fs.writeFileSync(
    path.join(phase2ValidationDir, "phase2-validation-report.json"),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  fs.writeFileSync(
    path.join(phase2ValidationDir, "phase2-hardcoded-copy-report.json"),
    `${JSON.stringify(hardcodedCopyExceptions, null, 2)}\n`,
  );

  console.log(JSON.stringify(report, null, 2));

  const hasFailures =
    !report.messageValidation.passed ||
    !report.quizValidation.passed ||
    !report.formValidation.passed ||
    hardcodedCopyExceptions.some(
      (exception) => exception.classification === "user-visible",
    );

  if (hasFailures) {
    process.exitCode = 1;
  }
}

main();

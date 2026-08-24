import fs from "node:fs";
import path from "node:path";
import { validateContactRequest, RequestValidationError as ContactValidationError } from "../server/schemas/contact-request.schema.mjs";
import {
  validateInsightDeliveryRequest,
  RequestValidationError as DeliveryValidationError,
} from "../server/schemas/insight-delivery-request.schema.mjs";
import { mockEmailProvider } from "../server/email/providers/mock-email-provider.mjs";
import { smtpEmailProvider } from "../server/email/providers/smtp-email-provider.mjs";
import { EmailError } from "../server/email/email-provider.mjs";
import { sendTemplatedEmail } from "../server/email/email-service.mjs";
import { handleContactRequest } from "../server/api/contact.mjs";
import { handleDeliverInsightRequest } from "../server/api/deliver-insight.mjs";

const root = process.cwd();
const phase10ValidationDir = path.join(root, "docs", "implementation", "validation", "phase-10");

function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

const validContactBody = {
  formId: "contact-form",
  formVersion: "1.0.0",
  language: "he",
  fields: {
    fullName: "בדיקה",
    role: "מנהלת פיתוח ארגוני",
    organization: "HUMA",
    email: "test@example.com",
    focusAreas: ["presence", "resilience"],
    challenge: "בדיקת Phase 10",
  },
};

const validDeliveryBody = {
  formId: "insight-email-form",
  formVersion: "1.0.0",
  language: "en",
  fields: {
    fullName: "Test User",
    role: "HR Lead",
    organization: "HUMA",
    email: "test@example.com",
  },
  insightContext: {
    primaryCapability: "resilience",
    secondaryCapabilities: ["adaptability"],
  },
};

async function main() {
  ensureDirectory(phase10ValidationDir);
  const results = [];

  function record(name, passed, detail) {
    results.push({ name, passed, detail: detail ?? null });
  }

  // --- Contact request schema ---
  try {
    const serialized = JSON.stringify(validContactBody);
    const parsed = validateContactRequest(validContactBody, Buffer.byteLength(serialized, "utf8"));
    record("contact-schema: valid request accepted", parsed.isHoneypotTriggered === false);
  } catch (error) {
    record("contact-schema: valid request accepted", false, error.message);
  }

  try {
    const withHoneypot = { ...validContactBody, fields: { ...validContactBody.fields, website: "http://spam.example" } };
    const parsed = validateContactRequest(withHoneypot, Buffer.byteLength(JSON.stringify(withHoneypot), "utf8"));
    record("contact-schema: detects a filled honeypot", parsed.isHoneypotTriggered === true);
  } catch (error) {
    record("contact-schema: detects a filled honeypot", false, error.message);
  }

  const invalidContactCases = [
    ["unsupported form version", { ...validContactBody, formVersion: "9.9.9" }, "UNSUPPORTED_FORM_VERSION"],
    ["unknown top-level field", { ...validContactBody, utmSource: "x" }, "INVALID_REQUEST"],
    ["unknown focus-area option", { ...validContactBody, fields: { ...validContactBody.fields, focusAreas: ["not-a-real-option"] } }, "INVALID_REQUEST"],
    ["over-length challenge text", { ...validContactBody, fields: { ...validContactBody.fields, challenge: "a".repeat(2000) } }, "INVALID_REQUEST"],
    ["invalid email format", { ...validContactBody, fields: { ...validContactBody.fields, email: "not-an-email" } }, "INVALID_REQUEST"],
  ];

  for (const [name, body, expectedCode] of invalidContactCases) {
    try {
      validateContactRequest(body, Buffer.byteLength(JSON.stringify(body), "utf8"));
      record(`contact-schema: rejects ${name}`, false, "Did not throw");
    } catch (error) {
      const ok = error instanceof ContactValidationError && error.code === expectedCode;
      record(`contact-schema: rejects ${name}`, ok, ok ? null : `Expected ${expectedCode}, got ${error.code}`);
    }
  }

  // --- Insight-delivery request schema ---
  try {
    const parsed = validateInsightDeliveryRequest(validDeliveryBody, Buffer.byteLength(JSON.stringify(validDeliveryBody), "utf8"));
    record("delivery-schema: valid request accepted", parsed.isHoneypotTriggered === false && parsed.insightContext.primaryCapability === "resilience");
  } catch (error) {
    record("delivery-schema: valid request accepted", false, error.message);
  }

  const invalidDeliveryCases = [
    ["missing email", { ...validDeliveryBody, fields: { ...validDeliveryBody.fields, email: "" } }, "INVALID_REQUEST"],
    ["unapproved primary capability", { ...validDeliveryBody, insightContext: { primaryCapability: "charisma", secondaryCapabilities: [] } }, "INVALID_REQUEST"],
    ["too many secondary capabilities", { ...validDeliveryBody, insightContext: { primaryCapability: "resilience", secondaryCapabilities: ["presence", "adaptability", "leadership"] } }, "INVALID_REQUEST"],
    ["no separate recipient override accepted", { ...validDeliveryBody, recipientEmail: "attacker@example.com" }, "INVALID_REQUEST"],
  ];

  for (const [name, body, expectedCode] of invalidDeliveryCases) {
    try {
      validateInsightDeliveryRequest(body, Buffer.byteLength(JSON.stringify(body), "utf8"));
      record(`delivery-schema: rejects ${name}`, false, "Did not throw");
    } catch (error) {
      const ok = error instanceof DeliveryValidationError && error.code === expectedCode;
      record(`delivery-schema: rejects ${name}`, ok, ok ? null : `Expected ${expectedCode}, got ${error.code}`);
    }
  }

  // --- Templates load and render for every language ---
  for (const [templateName, language] of [
    ["contact-notification", "he"],
    ["contact-notification", "en"],
    ["contact-confirmation", "he"],
    ["contact-confirmation", "en"],
    ["insight-delivery", "he"],
    ["insight-delivery", "en"],
    ["insight-notification", "he"],
    ["insight-notification", "en"],
  ]) {
    try {
      const result = await sendTemplatedEmail({
        templateName,
        language,
        to: "recipient@example.com",
        subjectByLanguage: { he: "נושא בדיקה", en: "Test subject" },
        values: { fullName: "Test", primaryCapability: "Resilience", secondaryCapabilities: ["Presence"], focusAreas: [], challenge: "" },
      });
      record(`email-templates: ${templateName} (${language}) renders and sends via mock`, Boolean(result.messageId));
    } catch (error) {
      record(`email-templates: ${templateName} (${language}) renders and sends via mock`, false, error.message);
    }
  }

  // --- Mock provider direct check ---
  try {
    const result = await mockEmailProvider.send({ to: "a@example.com", subject: "s", text: "body" });
    record("mock-email-provider: sends without network access", Boolean(result.messageId));
  } catch (error) {
    record("mock-email-provider: sends without network access", false, error.message);
  }

  // --- SMTP provider fails safe with no credentials configured ---
  for (const key of ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASSWORD", "SMTP_FROM_ADDRESS"]) {
    delete process.env[key];
  }
  try {
    await smtpEmailProvider.send({ to: "a@example.com", subject: "s", text: "body" }, { timeoutMs: 5000 });
    record("smtp-email-provider: fails safe with no credentials configured", false, "Did not throw");
  } catch (error) {
    record("smtp-email-provider: fails safe with no credentials configured", error instanceof EmailError && error.code === "PROVIDER_UNAVAILABLE");
  }

  // --- End-to-end through the handlers, in-process, mock provider ---
  process.env.EMAIL_PROVIDER = "mock";
  process.env.CONTACT_NOTIFICATION_EMAIL = "internal@example.com";

  try {
    const { status, body } = await handleContactRequest({
      rawBody: validContactBody,
      serializedLength: Buffer.byteLength(JSON.stringify(validContactBody), "utf8"),
      clientKey: "phase10-validate-contact",
    });
    record("end-to-end: handleContactRequest sends via mock provider", status === 200 && body.status === "sent", JSON.stringify(body));
  } catch (error) {
    record("end-to-end: handleContactRequest sends via mock provider", false, error.message);
  }

  try {
    const { status, body } = await handleDeliverInsightRequest({
      rawBody: validDeliveryBody,
      serializedLength: Buffer.byteLength(JSON.stringify(validDeliveryBody), "utf8"),
      clientKey: "phase10-validate-delivery",
    });
    record("end-to-end: handleDeliverInsightRequest sends via mock provider", status === 200 && body.status === "sent", JSON.stringify(body));
  } catch (error) {
    record("end-to-end: handleDeliverInsightRequest sends via mock provider", false, error.message);
  }

  try {
    const withHoneypot = { ...validContactBody, fields: { ...validContactBody.fields, website: "spam" } };
    const { status, body } = await handleContactRequest({
      rawBody: withHoneypot,
      serializedLength: Buffer.byteLength(JSON.stringify(withHoneypot), "utf8"),
      clientKey: "phase10-validate-honeypot",
    });
    record("end-to-end: honeypot submission returns a fake success without sending", status === 200 && body.status === "sent");
  } catch (error) {
    record("end-to-end: honeypot submission returns a fake success without sending", false, error.message);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    results,
    passed: results.every((entry) => entry.passed),
  };

  fs.writeFileSync(path.join(phase10ValidationDir, "phase10-validation-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));

  if (!report.passed) {
    process.exitCode = 1;
  }
}

main();

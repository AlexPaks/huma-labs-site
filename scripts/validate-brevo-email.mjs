import fs from "node:fs";
import path from "node:path";
import { createBrevoEmailProvider } from "../server/email/providers/brevo-email-provider.mjs";
import { EmailError } from "../server/email/email-provider.mjs";
import { sendTemplatedEmail } from "../server/email/email-service.mjs";
import { validateInsightDeliveryRequest } from "../server/schemas/insight-delivery-request.schema.mjs";

const outputDirectory = path.join(process.cwd(), "docs", "implementation", "validation", "phase-15.6");
const managedEnvironmentKeys = [
  "EMAIL_PROVIDER",
  "BREVO_API_KEY",
  "BREVO_FROM_EMAIL",
  "BREVO_FROM_NAME",
  "BREVO_SANDBOX",
];
const originalEnvironment = Object.fromEntries(managedEnvironmentKeys.map((key) => [key, process.env[key]]));
const originalFetch = globalThis.fetch;
const results = [];
const validInsightResult = {
  primaryCapability: "leadership",
  secondaryCapabilities: ["adaptability"],
  executiveSummary: "Executive summary",
  organizationalAnalysis: "Organizational analysis",
  possibleOrganizationalImpact: "Possible impact",
  signalsToExamine: ["Signal one", "Signal two", "Signal three"],
  recommendedDirection: {
    discover: "Discover direction",
    design: "Design direction",
    act: "Act direction",
  },
  suggestedNextStep: "Suggested next step",
  disclaimer: "Disclaimer",
};

function record(name, passed, detail) {
  results.push({ name, passed, detail: detail ?? null });
}

function configureBrevo({ sandbox = true } = {}) {
  process.env.EMAIL_PROVIDER = "brevo";
  process.env.BREVO_API_KEY = "test-api-key-not-a-secret";
  process.env.BREVO_FROM_EMAIL = "sender@example.com";
  process.env.BREVO_FROM_NAME = "HUMA Labs";
  process.env.BREVO_SANDBOX = String(sandbox);
}

function restoreEnvironment() {
  for (const key of managedEnvironmentKeys) {
    const value = originalEnvironment[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
  globalThis.fetch = originalFetch;
}

async function main() {
  fs.mkdirSync(outputDirectory, { recursive: true });

  try {
    delete process.env.BREVO_API_KEY;
    delete process.env.BREVO_FROM_EMAIL;
    let requestCount = 0;
    const provider = createBrevoEmailProvider({
      fetchImpl: async () => {
        requestCount += 1;
        throw new Error("Network must not be reached");
      },
    });

    try {
      await provider.send({ to: "recipient@example.com", subject: "Subject", text: "Body" }, { timeoutMs: 100 });
      record("configuration: missing credentials fail before a network request", false, "Did not throw");
    } catch (error) {
      record(
        "configuration: missing credentials fail before a network request",
        error instanceof EmailError && error.code === "PROVIDER_UNAVAILABLE" && requestCount === 0,
      );
    }

    configureBrevo({ sandbox: true });
    let sandboxRequest;
    const sandboxProvider = createBrevoEmailProvider({
      fetchImpl: async (url, options) => {
        sandboxRequest = { url, options };
        return { ok: true, status: 201, json: async () => ({ messageId: "sandbox-message-id" }) };
      },
    });
    const sandboxResult = await sandboxProvider.send(
      {
        to: "recipient@example.com",
        replyTo: "reply@example.com",
        subject: "Sandbox subject",
        text: "Sandbox body",
      },
      { timeoutMs: 100 },
    );
    const sandboxPayload = JSON.parse(sandboxRequest.options.body);
    record(
      "sandbox: builds an authenticated Brevo request without delivery",
      sandboxRequest.url === "https://api.brevo.com/v3/smtp/email" &&
        sandboxRequest.options.method === "POST" &&
        sandboxRequest.options.headers["api-key"] === "test-api-key-not-a-secret" &&
        sandboxPayload.headers?.["X-Sib-Sandbox"] === "drop" &&
        sandboxPayload.sender.email === "sender@example.com" &&
        sandboxPayload.to[0].email === "recipient@example.com" &&
        sandboxPayload.replyTo.email === "reply@example.com" &&
        sandboxResult.messageId === "sandbox-message-id",
    );

    configureBrevo({ sandbox: false });
    let livePayload;
    const liveProvider = createBrevoEmailProvider({
      fetchImpl: async (_url, options) => {
        livePayload = JSON.parse(options.body);
        return { ok: true, status: 201, json: async () => ({ messageId: "live-message-id" }) };
      },
    });
    await liveProvider.send({ to: "recipient@example.com", subject: "Live subject", text: "Live body" }, { timeoutMs: 100 });
    record("live mode: omits the Brevo sandbox header", livePayload.headers === undefined);

    configureBrevo({ sandbox: true });
    const renderedBodies = [];
    globalThis.fetch = async (_url, options) => {
      const payload = JSON.parse(options.body);
      renderedBodies.push(payload.textContent);
      return {
        ok: true,
        status: 201,
        json: async () => ({ messageId: "service-message-id" }),
      };
    };
    const serviceResult = await sendTemplatedEmail({
      templateName: "contact-notification",
      language: "en",
      to: "recipient@example.com",
      replyTo: "reply@example.com",
      subjectByLanguage: { he: "Hebrew subject", en: "Integration subject" },
      values: {
        fullName: "Integration Test",
        role: "HR Lead",
        organization: "HUMA",
        email: "reply@example.com",
        focusAreas: ["leadership"],
        challenge: "Integration body",
      },
    });
    record("email service: selects Brevo and renders the existing template", serviceResult.messageId === "service-message-id");

    const insightRequest = {
      formId: "insight-email-form",
      formVersion: "1.0.0",
      language: "en",
      fields: { fullName: "Integration Test", role: "HR Lead", organization: "HUMA", email: "recipient@example.com" },
      insightContext: { primaryCapability: "leadership", secondaryCapabilities: ["adaptability"] },
      insightResult: validInsightResult,
    };
    const parsedInsightRequest = validateInsightDeliveryRequest(
      insightRequest,
      Buffer.byteLength(JSON.stringify(insightRequest), "utf8"),
    );
    await sendTemplatedEmail({
      templateName: "insight-delivery",
      language: "en",
      to: "recipient@example.com",
      subjectByLanguage: { he: "Hebrew subject", en: "Insight subject" },
      values: {
        ...parsedInsightRequest.fields,
        primaryCapability: "Leadership",
        secondaryCapabilities: ["Adaptability"],
        executiveSummary: parsedInsightRequest.insightResult.executiveSummary,
        organizationalAnalysis: parsedInsightRequest.insightResult.organizationalAnalysis,
        possibleOrganizationalImpact: parsedInsightRequest.insightResult.possibleOrganizationalImpact,
        signalsToExamine: parsedInsightRequest.insightResult.signalsToExamine.map((item) => `- ${item}`).join("\n"),
        discoverDirection: parsedInsightRequest.insightResult.recommendedDirection.discover,
        designDirection: parsedInsightRequest.insightResult.recommendedDirection.design,
        actDirection: parsedInsightRequest.insightResult.recommendedDirection.act,
        suggestedNextStep: parsedInsightRequest.insightResult.suggestedNextStep,
        disclaimer: parsedInsightRequest.insightResult.disclaimer,
      },
    });
    const insightEmailBody = renderedBodies.at(-1) || "";
    record(
      "insight delivery: validates and renders the full LLM result",
      insightEmailBody.includes("Executive summary") &&
        insightEmailBody.includes("Organizational analysis") &&
        insightEmailBody.includes("- Signal three") &&
        insightEmailBody.includes("Suggested next step"),
    );

    const failingProvider = createBrevoEmailProvider({
      fetchImpl: async () => ({ ok: false, status: 401, json: async () => ({ message: "secret provider detail" }) }),
    });
    try {
      await failingProvider.send({ to: "recipient@example.com", subject: "Subject", text: "Body" }, { timeoutMs: 100 });
      record("errors: classifies provider rejection without exposing credentials", false, "Did not throw");
    } catch (error) {
      record(
        "errors: classifies provider rejection without exposing credentials",
        error instanceof EmailError &&
          error.code === "SEND_FAILED" &&
          !error.message.includes("test-api-key-not-a-secret") &&
          !error.message.includes("secret provider detail"),
      );
    }
  } finally {
    restoreEnvironment();
  }

  const report = {
    generatedAt: new Date().toISOString(),
    networkRequestsSent: 0,
    realEmailsSent: 0,
    results,
    passed: results.every((entry) => entry.passed),
  };

  fs.writeFileSync(
    path.join(outputDirectory, "phase15-6-validation-report.json"),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  console.log(JSON.stringify(report, null, 2));

  if (!report.passed) {
    process.exitCode = 1;
  }
}

main();

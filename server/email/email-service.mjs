import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mockEmailProvider } from "./providers/mock-email-provider.mjs";
import { smtpEmailProvider } from "./providers/smtp-email-provider.mjs";
import { EmailError } from "./email-provider.mjs";

const templatesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "templates");
const versionCommentPattern = /^<!--\s*templateVersion:\s*([^\s]+)\s*-->/;
const EMAIL_SEND_TIMEOUT_MS = 15_000;

const providersById = {
  mock: mockEmailProvider,
  smtp: smtpEmailProvider,
};

function getConfiguredProvider() {
  const providerId = process.env.EMAIL_PROVIDER || "mock";
  const provider = providersById[providerId];

  if (!provider) {
    throw new EmailError("PROVIDER_UNAVAILABLE", `Unknown EMAIL_PROVIDER "${providerId}".`);
  }

  return provider;
}

function loadTemplate(templateName, language) {
  const filePath = path.join(templatesDir, language, `${templateName}.md`);
  const contents = fs.readFileSync(filePath, "utf8");
  const match = contents.match(versionCommentPattern);

  if (!match) {
    throw new Error(`Template "${templateName}" (${language}) is missing a templateVersion header.`);
  }

  return { version: match[1], template: contents };
}

/**
 * Strips CRLF sequences from any value that could end up in an email header
 * (subject, reply-to, to) — prevents SMTP/email header injection from
 * user-provided free text.
 */
function sanitizeHeaderValue(value) {
  return String(value ?? "").replace(/[\r\n]+/g, " ").trim();
}

function renderTemplate(template, values) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = values[key];
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(", ") : "—";
    }
    return value != null && String(value).length > 0 ? String(value) : "—";
  });
}

/**
 * Renders a named template and sends it through the configured provider.
 * Every caller (contact, insight delivery) goes through this single
 * function so provider selection, timeouts, and header sanitization are
 * handled in exactly one place.
 */
export async function sendTemplatedEmail({ templateName, language, to, replyTo, subjectByLanguage, values }) {
  const { template } = loadTemplate(templateName, language);
  const body = renderTemplate(template, values);
  const provider = getConfiguredProvider();

  return provider.send(
    {
      to: sanitizeHeaderValue(to),
      replyTo: replyTo ? sanitizeHeaderValue(replyTo) : undefined,
      subject: sanitizeHeaderValue(subjectByLanguage[language] ?? subjectByLanguage.en),
      text: body,
    },
    { timeoutMs: EMAIL_SEND_TIMEOUT_MS },
  );
}

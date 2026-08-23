import { EmailError } from "../email-provider.mjs";

const BREVO_EMAIL_ENDPOINT = "https://api.brevo.com/v3/smtp/email";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requireEmailAddress(value, environmentKey) {
  const email = String(value ?? "").trim();

  if (!EMAIL_PATTERN.test(email)) {
    throw new EmailError("PROVIDER_UNAVAILABLE", `${environmentKey} is not configured with a valid email address.`);
  }

  return email;
}

function getConfiguration() {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    throw new EmailError("PROVIDER_UNAVAILABLE", "BREVO_API_KEY is not configured.");
  }

  return {
    apiKey,
    fromEmail: requireEmailAddress(process.env.BREVO_FROM_EMAIL, "BREVO_FROM_EMAIL"),
    fromName: String(process.env.BREVO_FROM_NAME || "HUMA Labs").trim(),
    sandbox: process.env.BREVO_SANDBOX !== "false",
  };
}

function buildPayload(email, configuration) {
  const payload = {
    sender: {
      email: configuration.fromEmail,
      name: configuration.fromName,
    },
    to: [{ email: requireEmailAddress(email.to, "email recipient") }],
    subject: email.subject,
    textContent: email.text,
  };

  if (email.replyTo) {
    payload.replyTo = { email: requireEmailAddress(email.replyTo, "email reply-to") };
  }

  if (configuration.sandbox) {
    payload.headers = { "X-Sib-Sandbox": "drop" };
  }

  return payload;
}

export function createBrevoEmailProvider({ fetchImpl } = {}) {
  return {
    id: "brevo",
    async send(email, { timeoutMs }) {
      const configuration = getConfiguration();
      const request = fetchImpl || globalThis.fetch;

      if (typeof request !== "function") {
        throw new EmailError("PROVIDER_UNAVAILABLE", "The server runtime does not provide fetch.");
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await request(BREVO_EMAIL_ENDPOINT, {
          method: "POST",
          headers: {
            accept: "application/json",
            "api-key": configuration.apiKey,
            "content-type": "application/json",
          },
          body: JSON.stringify(buildPayload(email, configuration)),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new EmailError("SEND_FAILED", `Brevo email request failed with status ${response.status}.`);
        }

        const result = await response.json();
        if (!result?.messageId) {
          throw new EmailError("SEND_FAILED", "Brevo email response did not include a messageId.");
        }

        return { messageId: result.messageId };
      } catch (error) {
        if (error instanceof EmailError) {
          throw error;
        }

        if (error?.name === "AbortError") {
          throw new EmailError("PROVIDER_UNAVAILABLE", "Brevo email request timed out.", error);
        }

        throw new EmailError("SEND_FAILED", "Brevo email request failed.", error);
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}

export const brevoEmailProvider = createBrevoEmailProvider();

export class EmailError extends Error {
  constructor(code, message, cause) {
    super(message);
    this.name = "EmailError";
    this.code = code; // "PROVIDER_UNAVAILABLE" | "SEND_FAILED"
    this.cause = cause;
  }
}

/**
 * Shared contract every email provider (mock, SMTP, Brevo) implements. The
 * endpoint only ever depends on this shape, never on a specific provider.
 *
 * @typedef {object} OutgoingEmail
 * @property {string} to
 * @property {string} [replyTo]
 * @property {string} subject
 * @property {string} text
 */

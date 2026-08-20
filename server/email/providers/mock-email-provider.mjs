// Deterministic, in-process, no network access — the default provider, same
// pattern as the Phase 8 mock LLM provider. Logs only redacted metadata,
// never the email body (which may contain the submitter's free-text answers).
export const mockEmailProvider = {
  id: "mock",
  async send(email) {
    console.info("[mock-email-provider] would send", {
      to: email.to,
      subject: email.subject,
      bodyLength: email.text.length,
    });

    return { messageId: `mock-${Date.now()}-${Math.random().toString(36).slice(2, 10)}` };
  },
};

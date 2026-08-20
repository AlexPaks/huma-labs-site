import nodemailer from "nodemailer";
import { EmailError } from "../email-provider.mjs";

let cachedTransport = null;

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;

  if (!host || !port || !user || !password) {
    throw new EmailError("PROVIDER_UNAVAILABLE", "SMTP is not fully configured.");
  }

  if (!cachedTransport) {
    cachedTransport = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user, pass: password },
    });
  }

  return cachedTransport;
}

export const smtpEmailProvider = {
  id: "smtp",
  async send(email, { timeoutMs }) {
    const fromAddress = process.env.SMTP_FROM_ADDRESS;

    if (!fromAddress) {
      throw new EmailError("PROVIDER_UNAVAILABLE", "SMTP_FROM_ADDRESS is not configured.");
    }

    const transport = getTransport();

    try {
      const info = await Promise.race([
        transport.sendMail({
          from: fromAddress,
          to: email.to,
          replyTo: email.replyTo,
          subject: email.subject,
          text: email.text,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(Object.assign(new Error("SMTP send timed out"), { code: "TIMEOUT" })), timeoutMs),
        ),
      ]);

      return { messageId: info.messageId };
    } catch (error) {
      if (error?.code === "TIMEOUT") {
        throw new EmailError("PROVIDER_UNAVAILABLE", "SMTP send timed out.", error);
      }

      throw new EmailError("SEND_FAILED", "SMTP send failed.", error);
    }
  },
};

import OpenAI from "openai";
import { insightResultJsonSchema } from "../schemas/insight-result.schema.mjs";
import { ProviderError } from "./llm-provider.mjs";

const DEFAULT_MODEL = "gpt-4o-mini";

export function parseChatCompletionContent(response) {
  const content = response?.choices?.[0]?.message?.content;

  if (!content) {
    throw new ProviderError("INVALID_PROVIDER_OUTPUT", "OpenAI response did not include message content.");
  }

  try {
    return JSON.parse(content);
  } catch (parseError) {
    throw new ProviderError("INVALID_PROVIDER_OUTPUT", "OpenAI response content was not valid JSON.", parseError);
  }
}

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new ProviderError("PROVIDER_UNAVAILABLE", "OPENAI_API_KEY is not configured.");
  }

  return new OpenAI({ apiKey });
}

export const openaiProvider = {
  id: "openai",
  async analyze(input, { timeoutMs }) {
    const client = getClient();
    const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await client.chat.completions.create(
        {
          model,
          messages: [{ role: "user", content: input.prompt }],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "insight_result",
              strict: true,
              schema: insightResultJsonSchema,
            },
          },
        },
        { signal: controller.signal },
      );

      return { raw: parseChatCompletionContent(response) };
    } catch (error) {
      if (error instanceof ProviderError) {
        throw error;
      }

      if (error?.name === "AbortError") {
        throw new ProviderError("TIMEOUT", `OpenAI request exceeded ${timeoutMs}ms.`, error);
      }

      throw new ProviderError("PROVIDER_UNAVAILABLE", "OpenAI request failed.", error);
    } finally {
      clearTimeout(timeout);
    }
  },
};

import Anthropic from "@anthropic-ai/sdk";
import { insightResultJsonSchema } from "../schemas/insight-result.schema.mjs";
import { ProviderError } from "./llm-provider.mjs";

const DEFAULT_MODEL = "claude-sonnet-5";
const TOOL_NAME = "submit_insight_result";

export function parseToolUseInput(response) {
  const toolUseBlock = response?.content?.find((block) => block.type === "tool_use" && block.name === TOOL_NAME);

  if (!toolUseBlock) {
    throw new ProviderError("INVALID_PROVIDER_OUTPUT", "Claude response did not include the expected tool call.");
  }

  return toolUseBlock.input;
}

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new ProviderError("PROVIDER_UNAVAILABLE", "ANTHROPIC_API_KEY is not configured.");
  }

  return new Anthropic({ apiKey });
}

export const claudeProvider = {
  id: "claude",
  async analyze(input, { timeoutMs }) {
    const client = getClient();
    const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;

    try {
      const response = await client.messages.create(
        {
          model,
          max_tokens: 2048,
          messages: [{ role: "user", content: input.prompt }],
          tools: [
            {
              name: TOOL_NAME,
              description: "Submit the structured Organizational Insight result.",
              input_schema: insightResultJsonSchema,
            },
          ],
          tool_choice: { type: "tool", name: TOOL_NAME },
        },
        { timeout: timeoutMs },
      );

      return { raw: parseToolUseInput(response) };
    } catch (error) {
      if (error instanceof ProviderError) {
        throw error;
      }

      if (error?.name === "APIConnectionTimeoutError" || error?.status === 408) {
        throw new ProviderError("TIMEOUT", `Claude request exceeded ${timeoutMs}ms.`, error);
      }

      throw new ProviderError("PROVIDER_UNAVAILABLE", "Claude request failed.", error);
    }
  },
};

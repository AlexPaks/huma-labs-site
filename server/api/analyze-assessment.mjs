import crypto from "node:crypto";
import assessmentDefinition from "../../content/assessment.json" with { type: "json" };
import { validateAssessmentRequest, RequestValidationError, REQUEST_JSON_MAX_BYTES } from "../schemas/assessment-request.schema.mjs";
import { buildInsightResult } from "../schemas/insight-result.schema.mjs";
import { normalizeAssessmentForPrompt } from "../services/assessment-normalizer.mjs";
import { composeAnalysisPrompt } from "../services/prompt-composer.mjs";
import { validateProviderOutput } from "../services/result-validator.mjs";
import { createRateLimiter } from "../services/rate-limiter.mjs";
import { ProviderError } from "../providers/llm-provider.mjs";
import { mockProvider } from "../providers/mock-provider.mjs";
import { openaiProvider } from "../providers/openai-provider.mjs";
import { claudeProvider } from "../providers/claude-provider.mjs";

const PROVIDER_TIMEOUT_MS = 20_000;
const MAX_PROVIDER_ATTEMPTS = 2; // one retry on a transient provider failure

const providersById = {
  mock: mockProvider,
  openai: openaiProvider,
  claude: claudeProvider,
};

const rateLimiter = createRateLimiter({ windowMs: 60_000, maxRequests: 10 });

export class RequestTooLargeError extends Error {}

function getDeploymentMetadata() {
  return {
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "local",
    deploymentId: process.env.VERCEL_DEPLOYMENT_ID || "local",
    gitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA || "local",
    deploymentUrl: process.env.VERCEL_URL || null,
  };
}

function getConfiguredProvider() {
  const providerId = process.env.LLM_PROVIDER?.trim() || "mock";
  const provider = providersById[providerId];

  if (!provider) {
    throw new ProviderError("PROVIDER_UNAVAILABLE", `Unknown LLM_PROVIDER "${providerId}".`);
  }

  return provider;
}

async function callProviderWithRetry(provider, analyzeInput) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_PROVIDER_ATTEMPTS; attempt += 1) {
    try {
      return await provider.analyze({ ...analyzeInput, attempt }, { timeoutMs: PROVIDER_TIMEOUT_MS });
    } catch (error) {
      lastError = error;

      // Do not retry on a shape failure — retrying will not fix malformed output.
      if (error instanceof ProviderError && error.code === "INVALID_PROVIDER_OUTPUT") {
        throw error;
      }
    }
  }

  throw lastError;
}

/**
 * Redacts free-text answer content before anything gets logged. Server logs
 * must never contain the user's open-text answers or provider raw errors.
 */
function toLoggableSummary(request) {
  return {
    quizId: request.quizId,
    quizVersion: request.quizVersion,
    language: request.language,
    answerCount: request.answers.length,
  };
}

function toSafeProviderFailureMetadata(error, provider) {
  const cause = error instanceof ProviderError ? error.cause : undefined;
  const networkCause = cause?.cause;

  return {
    provider: provider.id,
    status: Number.isInteger(cause?.status) ? cause.status : null,
    type: typeof cause?.type === "string" ? cause.type : null,
    providerCode: typeof cause?.code === "string" ? cause.code : null,
    errorName: typeof cause?.name === "string" ? cause.name : null,
    networkErrorName: typeof networkCause?.name === "string" ? networkCause.name : null,
    networkCode: typeof networkCause?.code === "string" ? networkCause.code : null,
  };
}

/**
 * Framework-agnostic core handler: takes a parsed JSON body and a client
 * identifier (for rate limiting), returns { status, body }. Never throws for
 * expected failure modes — always resolves to a classified error response.
 * Thin adapters (Vercel Node function, local dev server) wrap this.
 */
export async function handleAnalyzeAssessment({ rawBody, serializedLength, clientKey }) {
  const requestId = crypto.randomUUID();
  const deployment = getDeploymentMetadata();

  const rateLimitResult = rateLimiter.check(clientKey);
  if (!rateLimitResult.allowed) {
    return {
      status: 429,
      body: { requestId, error: { code: "RATE_LIMITED", message: "Too many requests. Please try again shortly." } },
    };
  }

  let request;
  try {
    request = validateAssessmentRequest(rawBody, serializedLength);
  } catch (error) {
    if (error instanceof RequestValidationError) {
      const status = error.code === "UNSUPPORTED_QUIZ_VERSION" ? 409 : error.code === "REQUEST_TOO_LARGE" ? 413 : 400;
      return { status, body: { requestId, error: { code: error.code, message: error.message } } };
    }
    throw error;
  }

  console.info("[analyze-assessment] request", requestId, {
    ...toLoggableSummary(request),
    deployment,
  });

  const normalized = normalizeAssessmentForPrompt(request);
  const { prompt, promptVersion } = composeAnalysisPrompt(normalized);

  let provider;
  try {
    provider = getConfiguredProvider();
  } catch (error) {
    console.error("[analyze-assessment] provider unavailable", requestId, {
      code: error.code,
      configuredProvider: process.env.LLM_PROVIDER ?? "mock",
      deployment,
    });
    return { status: 503, body: { requestId, error: { code: "PROVIDER_UNAVAILABLE", message: "The analysis provider is not available." } } };
  }

  let providerResult;
  try {
    providerResult = await callProviderWithRetry(provider, {
      language: request.language,
      prompt,
      promptVersion,
      quizVersion: request.quizVersion,
      requestId,
      deployment,
    });
  } catch (error) {
    const code = error instanceof ProviderError ? error.code : "PROVIDER_UNAVAILABLE";
    console.error("[analyze-assessment] provider failure", requestId, code, {
      ...toSafeProviderFailureMetadata(error, provider),
      deployment,
    });
    const status = code === "TIMEOUT" ? 504 : code === "INVALID_PROVIDER_OUTPUT" ? 502 : 503;
    return {
      status,
      body: {
        requestId,
        error: {
          code,
          message: "The analysis could not be completed. Please try again.",
        },
      },
    };
  }

  let validatedContent;
  try {
    validatedContent = validateProviderOutput(providerResult.raw);
  } catch (error) {
    console.error("[analyze-assessment] invalid provider output", requestId);
    return {
      status: 502,
      body: { requestId, error: { code: "INVALID_PROVIDER_OUTPUT", message: "The analysis result was not in the expected format." } },
    };
  }

  const result = buildInsightResult({
    resultId: requestId,
    quizVersion: assessmentDefinition.version,
    promptVersion,
    language: request.language,
    content: validatedContent,
  });

  return { status: 200, body: { requestId, result } };
}

export { REQUEST_JSON_MAX_BYTES };

import type { FormDefinition } from "./formCatalog";

export type FormSubmitOutcome = { ok: true } | { ok: false; code: string };

const endpointByRoutingId: Record<string, string> = {
  contact: "/api/contact",
  "insight-delivery": "/api/insight/deliver",
};

/**
 * Submits a validated form to its secure server-side endpoint. The browser
 * never sends email itself and never learns which email provider handled
 * delivery — it only ever sees a request id and a classified error code on
 * failure.
 */
export async function submitDynamicForm(
  definition: FormDefinition,
  language: "he" | "en",
  fields: Record<string, string | string[]>,
  extraFields?: Record<string, unknown>,
): Promise<FormSubmitOutcome> {
  const endpoint = endpointByRoutingId[definition.routingId];

  if (!endpoint) {
    return { ok: false, code: "UNKNOWN_FORM_ROUTE" };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        formId: definition.formId,
        formVersion: definition.version,
        language,
        fields,
        ...extraFields,
      }),
    });

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      return { ok: false, code: body?.error?.code ?? "PROVIDER_UNAVAILABLE" };
    }

    return { ok: true };
  } catch {
    return { ok: false, code: "NETWORK_ERROR" };
  }
}

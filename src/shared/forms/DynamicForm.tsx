import { useEffect, useRef, useState } from "react";
import { useAnalytics } from "../../analytics/AnalyticsContext";
import { useMessages } from "../../i18n/messages";
import { useLanguage } from "../../i18n/language";
import type { FormDefinition, FormField } from "./formCatalog";
import { submitDynamicForm } from "./formApiClient";
import {
  createInitialFormValues,
  validateFormValues,
} from "./validation";

const HONEYPOT_FIELD_NAME = "website";

const EVENT_PREFIX_BY_ROUTING_ID: Record<string, "contact_form" | "insight_email_form"> = {
  contact: "contact_form",
  "insight-delivery": "insight_email_form",
};

type DynamicFormProps = {
  definition: FormDefinition;
  compact?: boolean;
  tone?: "light" | "dark";
  extraFields?: Record<string, unknown>;
};

type FormValues = ReturnType<typeof createInitialFormValues>;

export function DynamicForm({
  definition,
  compact = false,
  tone = "light",
  extraFields,
}: DynamicFormProps) {
  const { currentLanguage } = useLanguage();
  const { t, tRef } = useMessages(currentLanguage);
  const { track } = useAnalytics();
  const eventPrefix = EVENT_PREFIX_BY_ROUTING_ID[definition.routingId];
  const hasTrackedStartRef = useRef(false);
  const [values, setValues] = useState<FormValues>(() =>
    createInitialFormValues(definition),
  );
  const [honeypotValue, setHoneypotValue] = useState("");
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "validationError" | "sendError"
  >("idle");

  useEffect(() => {
    if (eventPrefix) {
      track(`${eventPrefix}_viewed`);
    }
    // Fire once when this form instance mounts.
  }, []);

  function trackFirstInteraction() {
    if (!hasTrackedStartRef.current && eventPrefix) {
      hasTrackedStartRef.current = true;
      track(`${eventPrefix}_started`);
    }
  }

  const labelClass =
    tone === "dark"
      ? "concept-form__label concept-form__label--dark"
      : "concept-form__label";
  const descriptionClass =
    tone === "dark"
      ? "concept-form__description concept-form__description--dark"
      : "concept-form__description";
  const errorClass =
    tone === "dark"
      ? "concept-form__error concept-form__error--dark"
      : "concept-form__error";
  const fieldDirection = currentLanguage === "he" ? "rtl" : "ltr";

  function getInputDirection(field: FormField) {
    if (field.type === "email" || field.type === "telephone") {
      return "ltr";
    }

    return fieldDirection;
  }

  const primaryFields = definition.fields.filter(
    (field) => field.type !== "multi-select" && field.type !== "textarea",
  );
  const secondaryFields = definition.fields.filter(
    (field) => field.type === "multi-select" || field.type === "textarea",
  );

  function setFieldValue(fieldId: string, nextValue: string | string[]) {
    trackFirstInteraction();
    setValues((current) => ({
      ...current,
      [fieldId]: nextValue,
    }));
  }

  function renderField(field: FormField) {
    const error = submitted ? errors[field.id] : undefined;
    const sharedFieldProps = {
      className: "field",
      name: field.id,
    };

    if (field.type === "multi-select" && Array.isArray(field.options)) {
      const selectedValues = Array.isArray(values[field.id])
        ? (values[field.id] as string[])
        : [];

      return (
        <fieldset key={field.id} className="concept-form__fieldset">
          <legend className={labelClass}>{tRef(field.labelRef)}</legend>
          <div className="concept-form__multi-select">
            {field.options.map((option) => {
              const isSelected = selectedValues.includes(option.id);
              return (
                <label
                  key={option.id}
                  className={
                    isSelected
                      ? "concept-form__choice concept-form__choice--selected"
                      : "concept-form__choice"
                  }
                >
                  <input
                    className="concept-form__checkbox"
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {
                      const nextValues = isSelected
                        ? selectedValues.filter((value: string) => value !== option.id)
                        : [...selectedValues, option.id];
                      setFieldValue(field.id, nextValues);
                    }}
                  />
                  <span>{tRef(option.labelRef)}</span>
                </label>
              );
            })}
          </div>
          {error ? <p className={errorClass}>{tRef(error)}</p> : null}
        </fieldset>
      );
    }

    if (field.type === "textarea") {
      return (
        <label key={field.id} className="concept-form__field">
          <span className={labelClass}>{tRef(field.labelRef)}</span>
          <textarea
            {...sharedFieldProps}
            className="field concept-form__textarea"
            dir={getInputDirection(field)}
            value={typeof values[field.id] === "string" ? values[field.id] : ""}
            onChange={(event) => setFieldValue(field.id, event.target.value)}
          />
          {error ? <p className={errorClass}>{tRef(error)}</p> : null}
        </label>
      );
    }

    return (
      <label key={field.id} className="concept-form__field">
        <span className={labelClass}>{tRef(field.labelRef)}</span>
        <input
          {...sharedFieldProps}
          type={field.type}
          dir={getInputDirection(field)}
          inputMode={field.type === "telephone" ? "tel" : undefined}
          value={typeof values[field.id] === "string" ? values[field.id] : ""}
          onChange={(event) => setFieldValue(field.id, event.target.value)}
        />
        {error ? <p className={errorClass}>{tRef(error)}</p> : null}
      </label>
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    if (honeypotValue.trim().length > 0) {
      // Bot filled the hidden field: pretend success, send nothing.
      setStatus("success");
      return;
    }

    const nextErrors = validateFormValues(definition, values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("validationError");
      return;
    }

    setStatus("submitting");
    const outcome = await submitDynamicForm(definition, currentLanguage, values, extraFields);
    setStatus(outcome.ok ? "success" : "sendError");

    if (eventPrefix === "contact_form") {
      track(outcome.ok ? "contact_form_submitted" : "contact_form_failed");
    } else if (eventPrefix === "insight_email_form" && outcome.ok) {
      track("insight_email_submitted");
    }
  }

  return (
    <form className="concept-form" aria-label={tRef(definition.submitLabelRef)} onSubmit={handleSubmit}>
      <div
        className={
          compact
            ? "concept-form__grid concept-form__grid--compact"
            : "concept-form__grid"
        }
      >
        {primaryFields.map(renderField)}
      </div>

      {secondaryFields.length > 0 ? (
        <>
          {secondaryFields.map(renderField)}
        </>
      ) : null}

      <label className="concept-form__honeypot" aria-hidden="true">
        <span>{t("system", "forms.honeypotLabel")}</span>
        <input
          autoComplete="off"
          name={HONEYPOT_FIELD_NAME}
          onChange={(event) => setHoneypotValue(event.target.value)}
          tabIndex={-1}
          type="text"
          value={honeypotValue}
        />
      </label>

      <div className="concept-form__actions">
        <button className="concept-button" disabled={status === "submitting"} type="submit">
          {status === "submitting" ? t("system", "forms.sending") : tRef(definition.submitLabelRef)}
        </button>
        <p className={descriptionClass}>{tRef(definition.descriptionRef)}</p>
        {status !== "idle" && status !== "submitting" ? (
          <p aria-live="polite" className={status === "success" ? descriptionClass : errorClass}>
            {status === "success"
              ? tRef(definition.successMessageRef)
              : status === "sendError"
                ? t("system", "forms.sendFailed")
                : tRef(definition.errorMessageRef)}
          </p>
        ) : null}
      </div>
    </form>
  );
}

import type { MessageRef } from "../../i18n/messages";
import type { FormDefinition } from "./formCatalog";

type FormValues = Record<string, string | string[]>;
type FormErrors = Partial<Record<string, MessageRef>>;

function isBlank(value: string | string[]) {
  return Array.isArray(value) ? value.length === 0 : value.trim().length === 0;
}

export function createInitialFormValues(definition: FormDefinition) {
  return Object.fromEntries(
    definition.fields.map((field) => [
      field.id,
      field.multiple ? [] : "",
    ]),
  ) as FormValues;
}

export function validateFormValues(
  definition: FormDefinition,
  values: FormValues,
) {
  const errors: FormErrors = {};

  for (const field of definition.fields) {
    const value = values[field.id] ?? (field.multiple ? [] : "");

    if (field.required && isBlank(value)) {
      errors[field.id] =
        field.type === "checkbox"
          ? "validation:consentRequired"
          : "validation:required";
      continue;
    }

    if (field.type === "email" && typeof value === "string" && value.trim()) {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!isValidEmail) {
        errors[field.id] = "validation:email";
        continue;
      }
    }

    if (
      typeof value === "string" &&
      field.validation?.minLength !== undefined &&
      value.length < field.validation.minLength
    ) {
      errors[field.id] = "validation:minLength";
      continue;
    }

    if (
      typeof value === "string" &&
      field.validation?.maxLength !== undefined &&
      value.length > field.validation.maxLength
    ) {
      errors[field.id] = "validation:maxLength";
      continue;
    }

    if (Array.isArray(value) && Array.isArray(field.options)) {
      const allowedOptions = new Set(field.options.map((option) => option.id));
      const hasInvalidOption = value.some((item) => !allowedOptions.has(item));
      if (hasInvalidOption) {
        errors[field.id] = "validation:invalidOption";
      }
    }
  }

  return errors;
}

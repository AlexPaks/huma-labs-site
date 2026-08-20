import rawContactFormDefinition from "../../../forms/contact-form.json";
import rawInsightEmailFormDefinition from "../../../forms/insight-email-form.json";

export interface FormOption {
  id: string;
  labelRef: string;
}

export interface FormFieldValidation {
  minLength?: number;
  maxLength?: number;
}

export interface FormField {
  id: string;
  order: number;
  type:
    | "text"
    | "email"
    | "telephone"
    | "textarea"
    | "select"
    | "multi-select"
    | "checkbox"
    | "consent";
  labelRef: string;
  required: boolean;
  multiple: boolean;
  serverFieldId: string;
  options?: FormOption[];
  validation?: FormFieldValidation;
}

export interface FormDefinition {
  formId: string;
  version: string;
  routingId: string;
  enabled: boolean;
  submitLabelRef: string;
  descriptionRef: string;
  successMessageRef: string;
  errorMessageRef: string;
  fields: FormField[];
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const contactFormDefinition = rawContactFormDefinition as FormDefinition;
const insightEmailFormDefinition = rawInsightEmailFormDefinition as FormDefinition;

assert(
  Array.isArray(contactFormDefinition.fields) &&
    Array.isArray(insightEmailFormDefinition.fields),
  "Invalid form definition.",
);

export const formCatalog = {
  "contact-form": contactFormDefinition,
  "insight-email-form": insightEmailFormDefinition,
} as const;

export type FormId = keyof typeof formCatalog;

export function getFormDefinition(formId: FormId) {
  return formCatalog[formId];
}

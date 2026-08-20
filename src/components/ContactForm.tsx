import { DynamicForm } from "../shared/forms/DynamicForm";
import { getFormDefinition, type FormId } from "../shared/forms/formCatalog";

type ContactFormProps = {
  formId: FormId;
  compact?: boolean;
  tone?: "light" | "dark";
  extraFields?: Record<string, unknown>;
};

export function ContactForm({
  formId,
  compact = false,
  tone = "light",
  extraFields,
}: ContactFormProps) {
  return (
    <DynamicForm
      definition={getFormDefinition(formId)}
      compact={compact}
      tone={tone}
      extraFields={extraFields}
    />
  );
}

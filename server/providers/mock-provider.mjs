import { approvedCapabilityIds } from "../schemas/insight-result.schema.mjs";

function stableHash(text) {
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }
  return hash;
}

const summaryByLanguage = {
  he: {
    executiveSummary:
      "זהו ניתוח לדוגמה (Mock) המבוסס על מבנה קבוע, ללא קריאה אמיתית למודל שפה. הוא משמש לבדיקת התשתית בלבד.",
    organizationalAnalysis:
      "בהתבסס על התשובות שסופקו, מסתמנת נקודת מינוף מרכזית אחת שכדאי להעמיק בה בשיחה עם צוות HUMA.",
    possibleOrganizationalImpact:
      "חיזוק היכולת המזוהה עשוי לתמוך בהתמודדות טובה יותר עם האתגר הארגוני שתואר.",
    signalsToExamine: ["קצב השינוי הנדרש מול קצב ההיערכות בפועל", "בהירות התפקידים סביב האתגר", "כלים קיימים מול כלים חסרים"],
    recommendedDirection: {
      discover: "מיפוי ממוקד של הפער בין המצב הנוכחי ליעד הרצוי.",
      design: "התאמת תוכנית פיתוח ליכולת שזוהתה, בקנה מידה שמתאים לארגון.",
      act: "יישום מדורג עם נקודות בדיקה קצובות בזמן.",
    },
    suggestedNextStep: "לתאם שיחת עומק עם צוות HUMA כדי לבחון את הממצאים לעומק.",
    disclaimer: "זהו ניתוח ראשוני בלבד ואינו מהווה אבחון סופי או התחייבות לתוצאה.",
  },
  en: {
    executiveSummary:
      "This is a mock analysis based on a fixed structure, with no real language-model call. It exists to test the pipeline only.",
    organizationalAnalysis:
      "Based on the answers provided, one central leverage point stands out and is worth exploring further with the HUMA team.",
    possibleOrganizationalImpact:
      "Strengthening the identified capability may support better handling of the described organizational challenge.",
    signalsToExamine: [
      "The pace of required change versus the actual pace of readiness",
      "Role clarity around the challenge",
      "Existing tools versus missing tools",
    ],
    recommendedDirection: {
      discover: "A focused mapping of the gap between the current state and the desired goal.",
      design: "Tailoring a development plan to the identified capability, at a scale that fits the organization.",
      act: "Phased implementation with time-boxed checkpoints.",
    },
    suggestedNextStep: "Schedule an in-depth conversation with the HUMA team to explore the findings further.",
    disclaimer: "This is a preliminary analysis only and does not constitute a final diagnosis or a promise of results.",
  },
};

export const mockProvider = {
  id: "mock",
  async analyze(input) {
    const hash = stableHash(input.prompt);
    const primaryCapability = approvedCapabilityIds[hash % approvedCapabilityIds.length];
    const remainingCapabilities = approvedCapabilityIds.filter((id) => id !== primaryCapability);
    const secondaryCapabilities = [remainingCapabilities[hash % remainingCapabilities.length]];
    const summary = summaryByLanguage[input.language] ?? summaryByLanguage.en;

    return {
      raw: {
        primaryCapability,
        secondaryCapabilities,
        ...summary,
      },
    };
  },
};

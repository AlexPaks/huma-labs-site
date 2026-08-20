export type CapabilityId = "presence" | "resilience" | "adaptability" | "leadership";

export interface InsightResult {
  resultId: string;
  quizVersion: string;
  promptVersion: string;
  language: "he" | "en";
  primaryCapability: CapabilityId;
  secondaryCapabilities: CapabilityId[];
  executiveSummary: string;
  organizationalAnalysis: string;
  possibleOrganizationalImpact: string;
  signalsToExamine: string[];
  recommendedDirection: {
    discover: string;
    design: string;
    act: string;
  };
  suggestedNextStep: string;
  disclaimer: string;
}

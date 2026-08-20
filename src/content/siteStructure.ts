import rawSiteStructure from "../../content/site-structure.json";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const siteStructure = rawSiteStructure;

assert(
  Array.isArray(siteStructure.navigationItems) &&
    Array.isArray(siteStructure.ctaLinks) &&
    Array.isArray(siteStructure.capabilities) &&
    Array.isArray(siteStructure.processSteps),
  "Invalid site structure configuration.",
);

export { siteStructure };

export const ctaLinksById = Object.fromEntries(
  siteStructure.ctaLinks.map((item) => [item.id, item]),
);

export const capabilitiesById = Object.fromEntries(
  siteStructure.capabilities.map((item) => [item.id, item]),
);

export const processStepsById = Object.fromEntries(
  siteStructure.processSteps.map((item) => [item.id, item]),
);

export const challengesById = Object.fromEntries(
  siteStructure.challenges.map((item) => [item.id, item]),
);

export const formatsById = Object.fromEntries(
  siteStructure.formats.map((item) => [item.id, item]),
);

export const outcomesById = Object.fromEntries(
  siteStructure.outcomes.map((item) => [item.id, item]),
);

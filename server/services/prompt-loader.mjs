import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const promptsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "prompts");
const versionCommentPattern = /^<!--\s*promptVersion:\s*([^\s]+)\s*-->/;

const cache = new Map();

/**
 * Loads the external, per-language prompt template and its version. Prompts
 * live under server/prompts/{language}/organizational-insight.md and are
 * never bundled into the frontend or sent to the browser.
 */
export function loadPromptTemplate(language) {
  if (cache.has(language)) {
    return cache.get(language);
  }

  const filePath = path.join(promptsDir, language, "organizational-insight.md");
  const contents = fs.readFileSync(filePath, "utf8");
  const match = contents.match(versionCommentPattern);

  if (!match) {
    throw new Error(`Prompt file for language "${language}" is missing a promptVersion header.`);
  }

  const result = { version: match[1], template: contents };
  cache.set(language, result);
  return result;
}

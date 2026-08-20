// Best-effort mitigation only. This does not guarantee immunity to prompt
// injection — the prompt itself also instructs the model to treat answer
// text as data, never as instructions. This guard neutralizes the most
// common obvious patterns before the text ever reaches the prompt.
const SUSPICIOUS_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions?/gi,
  /disregard\s+(all\s+)?(previous|prior|above)\s+instructions?/gi,
  /system\s*:/gi,
  /you\s+are\s+now\s+/gi,
  /התעלם\s+מ(כל\s+)?ה?הוראות/gi,
  /אתה\s+עכשיו\s+/gi,
];

export function sanitizeOpenTextForPrompt(text) {
  let sanitized = text;
  let flagged = false;

  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(sanitized)) {
      flagged = true;
    }
    sanitized = sanitized.replace(pattern, "[removed]");
  }

  // Collapse heading-like markdown/code-fence markers so free text cannot
  // masquerade as a new prompt section.
  sanitized = sanitized.replace(/```/g, "'''").replace(/^#{1,6}\s/gm, "");

  return { sanitized, flagged };
}

/** Normalize HTML nonbreaking-space entities in summaries and plain-text previews. */
export function normalizeSummary(value: string): string {
  return value
    .replace(/&(?:amp;)?(?:nbsp|npsb);|&#(?:160|x[aA]0);|\u00a0/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

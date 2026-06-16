/**
 * Extracts language code from a unit ID
 * @param unitId - Unit ID in format "code-*" (e.g., "es-1", "fr-2")
 * @returns Language code (e.g., "es", "fr"), defaults to "es"
 */
export function getLangCode(unitId: string): string {
  return unitId.split("-")[0] ?? "es";
}

/**
 * Extracts AI teacher name from prompt
 * @param prompt - AI teacher prompt string
 * @returns Teacher name or "Teacher" as fallback
 */
export function extractTeacherName(prompt: string): string {
  const match = prompt.match(/named (\w+)/);
  return match?.[1] ?? "Teacher";
}

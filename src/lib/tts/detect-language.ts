import { detect } from "tinyld";

/**
 * Detects the language of a given text.
 * Returns ISO 639-1 code (e.g. "en", "tr", "fr") or "unknown" as fallback.
 */
export function detectLanguage(text: string): string {
  try {
    return detect(text) || "unknown";
  } catch {
    return "unknown";
  }
}

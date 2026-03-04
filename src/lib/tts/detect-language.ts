import { detectAll } from "tinyld";

const MIN_CONFIDENCE = 0.6;
const MIN_WORDS = 5;

// Only trust languages tinyld reliably detects
// Short English gets misidentified as "af" (Afrikaans) without this guard
const TRUSTED_CODES = new Set([
  "en", "ar", "fr", "de", "es", "it", "pt", "ru", "zh",
  "ja", "ko", "tr", "nl", "pl", "sv", "da", "fi", "no",
  "nb", "he", "hi", "id", "ms", "th", "vi", "uk", "cs",
  "ro", "bg", "hr", "sk", "sl", "et", "lv", "lt", "hu",
  "el", "sr", "ca", "bn", "ta", "te", "ml", "gu", "mr",
  "ur", "fa", "sw", "mn", "my", "km", "si",
]);

export function detectLanguage(text: string): string {
  if (!text?.trim()) return "en";

  // Too short — tinyld is unreliable, default to English
  const wordCount = text.trim().split(/\s+/).length;
  if (wordCount < MIN_WORDS) return "en";

  try {
    const results = detectAll(text);
    if (!results?.length) return "en";

    const top = results[0];

    // Reject low confidence or untrusted language codes
    if (!top || top.accuracy < MIN_CONFIDENCE || !TRUSTED_CODES.has(top.lang)) {
      return "en";
    }

    return top.lang;
  } catch {
    return "en";
  }
}

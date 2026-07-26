// ─── Character Limits ─────────────────────────────────────────────────────────
/** Global maximum characters allowed per TTS request (paid plans) */
export const MAX_CHARS_ALLOWED = 3_000;

/** Free Trial: max characters per TTS single-speaker request */
export const FREE_TRIAL_MAX_CHARS = 500;

/** Multi-Speaker: soft cap per individual line (UI only, for readability) */
export const MAX_CHARS_PER_DIALOGUE_LINE = 500;

export const FREE_TRIAL_INITIAL_CREDITS = 10_000;

export const UNVERIFIED_CREDIT_THRESHOLD = 3_000;

// ─── Credit Multipliers ───────────────────────────────────────────────────────
// Base: Flash single-speaker = 1 credit per character
// Flash single-speaker  = 1×
// Pro single-speaker    = 2×
// Flash multi-speaker   = 2×
// Pro multi-speaker     = 3×

export const CREDITS_PER_CHAR = {
  geminiFlashTTS:      1, // Flash single-speaker (base)
  geminiProTTS:        2, // Pro single-speaker   (2×)
  geminiFlashDialogue: 2, // Flash multi-speaker  (2×)
  geminiProDialogue:   3, // Pro multi-speaker    (3×)
} as const;

export type CreditRateKey = keyof typeof CREDITS_PER_CHAR;

// ─── Plan Credit Budgets ──────────────────────────────────────────────────────
export const PLAN_INITIAL_CREDITS = {
  freeTrial: 10_000,  // 7-day trial, Flash only
  start:     40_000,
  creator:   125_000,
  pro:       400_000,
} as const;


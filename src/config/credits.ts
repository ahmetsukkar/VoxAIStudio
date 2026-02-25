export const CREDITS_PER_CHAR = {
  chatterbox: 1,
  googleCloud: 1,
  geminiFlashTTS: 4,
  geminiProTTS: 8,
  geminiFlashDialogue: 6,
  geminiProDialogue: 10,
} as const;

export type CreditRateKey = keyof typeof CREDITS_PER_CHAR;

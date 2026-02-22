export type GeminiEmotion =
  | "neutral"
  | "cheerful"
  | "sad"
  | "angry"
  | "excited"
  | "whispering"
  | "emotional";

export type GeminiStyle =
  | "conversational"
  | "newsreader"
  | "storytelling"
  | "podcast"
  | "audiobook"
  | "customer-support";

export type GeminiPace = "normal" | "slow" | "fast";

export type GeminiModel =
  | "gemini-2.5-flash-preview-tts"
  | "gemini-2.5-pro-preview-tts";

export const GeminiEmotions: { value: GeminiEmotion; label: string }[] = [
  { value: "neutral",    label: "Neutral" },
  { value: "cheerful",   label: "Cheerful" },
  { value: "sad",        label: "Sad" },
  { value: "angry",      label: "Angry" },
  { value: "excited",    label: "Excited" },
  { value: "whispering", label: "Whispering" },
  { value: "emotional",  label: "Emotional" },
];

export const GeminiStyles: { value: GeminiStyle; label: string }[] = [
  { value: "conversational",   label: "Conversational" },
  { value: "newsreader",       label: "News Reader" },
  { value: "storytelling",     label: "Storytelling" },
  { value: "podcast",          label: "Podcast" },
  { value: "audiobook",        label: "Audiobook" },
  { value: "customer-support", label: "Customer Support" },
];

export const GeminiPaces: { value: GeminiPace; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "slow",   label: "Slow" },
  { value: "fast",   label: "Fast" },
];

export const GeminiVoices: { name: string; description: string }[] = [
  { name: "Zephyr",        description: "Bright" },
  { name: "Puck",          description: "Upbeat" },
  { name: "Charon",        description: "Informative" },
  { name: "Kore",          description: "Firm" },
  { name: "Fenrir",        description: "Excitable" },
  { name: "Leda",          description: "Youthful" },
  { name: "Orus",          description: "Firm" },
  { name: "Aoede",         description: "Breezy" },
  { name: "Callirrhoe",    description: "Easy-going" },
  { name: "Autonoe",       description: "Bright" },
  { name: "Enceladus",     description: "Breathy" },
  { name: "Iapetus",       description: "Clear" },
  { name: "Umbriel",       description: "Easy-going" },
  { name: "Algieba",       description: "Smooth" },
  { name: "Despina",       description: "Smooth" },
  { name: "Erinome",       description: "Clear" },
  { name: "Algenib",       description: "Gravelly" },
  { name: "Rasalgethi",    description: "Informative" },
  { name: "Laomedeia",     description: "Upbeat" },
  { name: "Achernar",      description: "Soft" },
  { name: "Alnilam",       description: "Firm" },
  { name: "Schedar",       description: "Even" },
  { name: "Gacrux",        description: "Mature" },
  { name: "Pulcherrima",   description: "Forward" },
  { name: "Achird",        description: "Friendly" },
  { name: "Zubenelgenubi", description: "Casual" },
  { name: "Vindemiatrix",  description: "Gentle" },
  { name: "Sadachbia",     description: "Lively" },
  { name: "Sadaltager",    description: "Knowledgeable" },
  { name: "Sulafat",       description: "Warm" },
];

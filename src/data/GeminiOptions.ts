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

export type GeminiVoiceCategory = "Male" | "Female";

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

const S3_VOICE_SAMPLES = "https://vox-ai-studio.s3.us-east-1.amazonaws.com/samples/voices";

export const GeminiVoices: { name: string; description: string; category: GeminiVoiceCategory; sampleUrl: string }[] = [
  { name: "Zephyr",        description: "Bright",        category: "Female",         sampleUrl: `${S3_VOICE_SAMPLES}/Zephyr-Bright.wav` },
  { name: "Puck",          description: "Upbeat",        category: "Male",           sampleUrl: `${S3_VOICE_SAMPLES}/Puck-Upbeat.wav` },
  { name: "Charon",        description: "Informative",   category: "Male",           sampleUrl: `${S3_VOICE_SAMPLES}/Charon-Informative.wav` },
  { name: "Kore",          description: "Firm",          category: "Female",         sampleUrl: `${S3_VOICE_SAMPLES}/Kore-Firm.wav` },
  { name: "Fenrir",        description: "Excitable",     category: "Male",           sampleUrl: `${S3_VOICE_SAMPLES}/Fenrir-Excitable.wav` },
  { name: "Leda",          description: "Youthful",      category: "Female",         sampleUrl: `${S3_VOICE_SAMPLES}/Leda-Youthful.wav` },
  { name: "Orus",          description: "Firm",          category: "Male",           sampleUrl: `${S3_VOICE_SAMPLES}/Orus-Firm.wav` },
  { name: "Aoede",         description: "Breezy",        category: "Female",         sampleUrl: `${S3_VOICE_SAMPLES}/Aoede-Breezy.wav` },
  { name: "Callirrhoe",    description: "Easy-going",    category: "Female",         sampleUrl: `${S3_VOICE_SAMPLES}/Callirrhoe-Easy-going.wav` },
  { name: "Autonoe",       description: "Bright",        category: "Female",         sampleUrl: `${S3_VOICE_SAMPLES}/Autonoe-Bright.wav` },
  { name: "Enceladus",     description: "Breathy",       category: "Male",           sampleUrl: `${S3_VOICE_SAMPLES}/Enceladus-Breathy.wav` },
  { name: "Iapetus",       description: "Clear",         category: "Male",           sampleUrl: `${S3_VOICE_SAMPLES}/Iapetus-Clear.wav` },
  { name: "Umbriel",       description: "Easy-going",    category: "Male",           sampleUrl: `${S3_VOICE_SAMPLES}/Umbriel-Easy-going.wav` },
  { name: "Algieba",       description: "Smooth",        category: "Male",           sampleUrl: `${S3_VOICE_SAMPLES}/Algieba-Smooth.wav` },
  { name: "Despina",       description: "Smooth",        category: "Female",         sampleUrl: `${S3_VOICE_SAMPLES}/Despina-Smooth.wav` },
  { name: "Erinome",       description: "Clear",         category: "Female",         sampleUrl: `${S3_VOICE_SAMPLES}/Erinome-Clear.wav` },
  { name: "Algenib",       description: "Gravelly",      category: "Male",           sampleUrl: `${S3_VOICE_SAMPLES}/Algenib-Gravelly.wav` },
  { name: "Rasalgethi",    description: "Informative",   category: "Male",           sampleUrl: `${S3_VOICE_SAMPLES}/Rasalgethi-Informative.wav` },
  { name: "Laomedeia",     description: "Upbeat",        category: "Female",         sampleUrl: `${S3_VOICE_SAMPLES}/Laomedeia-Upbeat.wav` },
  { name: "Achernar",      description: "Soft",          category: "Female",         sampleUrl: `${S3_VOICE_SAMPLES}/Achernar-Soft.wav` },
  { name: "Alnilam",       description: "Firm",          category: "Male",           sampleUrl: `${S3_VOICE_SAMPLES}/Alnilam-Firm.wav` },
  { name: "Schedar",       description: "Even",          category: "Male",           sampleUrl: `${S3_VOICE_SAMPLES}/Schedar-Even.wav` },
  { name: "Gacrux",        description: "Mature",        category: "Female",         sampleUrl: `${S3_VOICE_SAMPLES}/Gacrux-Mature.wav` },
  { name: "Pulcherrima",   description: "Forward",       category: "Female",         sampleUrl: `${S3_VOICE_SAMPLES}/Pulcherrima-Forward.wav` },
  { name: "Achird",        description: "Friendly",      category: "Male",           sampleUrl: `${S3_VOICE_SAMPLES}/Achird-Friendly.wav` },
  { name: "Zubenelgenubi", description: "Casual",        category: "Male",           sampleUrl: `${S3_VOICE_SAMPLES}/Zubenelgenubi-Casual.wav` },
  { name: "Vindemiatrix",  description: "Gentle",        category: "Female",         sampleUrl: `${S3_VOICE_SAMPLES}/Vindemiatrix-Gentle.wav` },
  { name: "Sadachbia",     description: "Lively",        category: "Male",           sampleUrl: `${S3_VOICE_SAMPLES}/Sadachbia-Lively.wav` },
  { name: "Sadaltager",    description: "Knowledgeable", category: "Male",           sampleUrl: `${S3_VOICE_SAMPLES}/Sadaltager-Knowledgeable.wav` },
  { name: "Sulafat",       description: "Warm",          category: "Female",         sampleUrl: `${S3_VOICE_SAMPLES}/Sulafat-Warm.wav` },
];

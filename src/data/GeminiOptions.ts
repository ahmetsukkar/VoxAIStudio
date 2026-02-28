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

const S3_VOICE_SAMPLES = "https://vox-ai-studio.s3.us-east-1.amazonaws.com/samples/voices";

export const GeminiVoices: { name: string; description: string; sampleUrl: string }[] = [
  { name: "Zephyr",        description: "Bright",        sampleUrl: `${S3_VOICE_SAMPLES}/Zephyr.mp3` },
  { name: "Puck",          description: "Upbeat",        sampleUrl: `${S3_VOICE_SAMPLES}/Puck.mp3` },
  { name: "Charon",        description: "Informative",   sampleUrl: `${S3_VOICE_SAMPLES}/Charon.mp3` },
  { name: "Kore",          description: "Firm",          sampleUrl: `${S3_VOICE_SAMPLES}/Kore.mp3` },
  { name: "Fenrir",        description: "Excitable",     sampleUrl: `${S3_VOICE_SAMPLES}/Fenrir.mp3` },
  { name: "Leda",          description: "Youthful",      sampleUrl: `${S3_VOICE_SAMPLES}/Leda.mp3` },
  { name: "Orus",          description: "Firm",          sampleUrl: `${S3_VOICE_SAMPLES}/Orus.mp3` },
  { name: "Aoede",         description: "Breezy",        sampleUrl: `${S3_VOICE_SAMPLES}/Aoede.mp3` },
  { name: "Callirrhoe",    description: "Easy-going",    sampleUrl: `${S3_VOICE_SAMPLES}/Callirrhoe.mp3` },
  { name: "Autonoe",       description: "Bright",        sampleUrl: `${S3_VOICE_SAMPLES}/Autonoe.mp3` },
  { name: "Enceladus",     description: "Breathy",       sampleUrl: `${S3_VOICE_SAMPLES}/Enceladus.mp3` },
  { name: "Iapetus",       description: "Clear",         sampleUrl: `${S3_VOICE_SAMPLES}/Iapetus.mp3` },
  { name: "Umbriel",       description: "Easy-going",    sampleUrl: `${S3_VOICE_SAMPLES}/Umbriel.mp3` },
  { name: "Algieba",       description: "Smooth",        sampleUrl: `${S3_VOICE_SAMPLES}/Algieba.mp3` },
  { name: "Despina",       description: "Smooth",        sampleUrl: `${S3_VOICE_SAMPLES}/Despina.mp3` },
  { name: "Erinome",       description: "Clear",         sampleUrl: `${S3_VOICE_SAMPLES}/Erinome.mp3` },
  { name: "Algenib",       description: "Gravelly",      sampleUrl: `${S3_VOICE_SAMPLES}/Algenib.mp3` },
  { name: "Rasalgethi",    description: "Informative",   sampleUrl: `${S3_VOICE_SAMPLES}/Rasalgethi.mp3` },
  { name: "Laomedeia",     description: "Upbeat",        sampleUrl: `${S3_VOICE_SAMPLES}/Laomedeia.mp3` },
  { name: "Achernar",      description: "Soft",          sampleUrl: `${S3_VOICE_SAMPLES}/Achernar.mp3` },
  { name: "Alnilam",       description: "Firm",          sampleUrl: `${S3_VOICE_SAMPLES}/Alnilam.mp3` },
  { name: "Schedar",       description: "Even",          sampleUrl: `${S3_VOICE_SAMPLES}/Schedar.mp3` },
  { name: "Gacrux",        description: "Mature",        sampleUrl: `${S3_VOICE_SAMPLES}/Gacrux.mp3` },
  { name: "Pulcherrima",   description: "Forward",       sampleUrl: `${S3_VOICE_SAMPLES}/Pulcherrima.mp3` },
  { name: "Achird",        description: "Friendly",      sampleUrl: `${S3_VOICE_SAMPLES}/Achird.mp3` },
  { name: "Zubenelgenubi", description: "Casual",        sampleUrl: `${S3_VOICE_SAMPLES}/Zubenelgenubi.mp3` },
  { name: "Vindemiatrix",  description: "Gentle",        sampleUrl: `${S3_VOICE_SAMPLES}/Vindemiatrix.mp3` },
  { name: "Sadachbia",     description: "Lively",        sampleUrl: `${S3_VOICE_SAMPLES}/Sadachbia.mp3` },
  { name: "Sadaltager",    description: "Knowledgeable", sampleUrl: `${S3_VOICE_SAMPLES}/Sadaltager.mp3` },
  { name: "Sulafat",       description: "Warm",          sampleUrl: `${S3_VOICE_SAMPLES}/Sulafat.mp3` },
];

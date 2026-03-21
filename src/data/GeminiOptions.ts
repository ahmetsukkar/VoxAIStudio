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

const S3_VOICE_SAMPLES = "https://vox-ai-studio.s3.us-east-1.amazonaws.com/samples/voices/Gemini";

export const GeminiVoices: {
  name: string;
  description: string;
  category: GeminiVoiceCategory;
  sampleUrl: string;
}[] = [
  { name: "Zephyr",        description: "Bright",        category: "Female", sampleUrl: `${S3_VOICE_SAMPLES}/Zephyr-Bright.wav` },
  { name: "Puck",          description: "Upbeat",        category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Puck-Upbeat.wav` },
  { name: "Charon",        description: "Informative",   category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Charon-Informative.wav` },
  { name: "Kore",          description: "Firm",          category: "Female", sampleUrl: `${S3_VOICE_SAMPLES}/Kore-Firm.wav` },
  { name: "Fenrir",        description: "Excitable",     category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Fenrir-Excitable.wav` },
  { name: "Leda",          description: "Youthful",      category: "Female", sampleUrl: `${S3_VOICE_SAMPLES}/Leda-Youthful.wav` },
  { name: "Orus",          description: "Firm",          category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Orus-Firm.wav` },
  { name: "Aoede",         description: "Breezy",        category: "Female", sampleUrl: `${S3_VOICE_SAMPLES}/Aoede-Breezy.wav` },
  { name: "Callirrhoe",    description: "Easy-going",    category: "Female", sampleUrl: `${S3_VOICE_SAMPLES}/Callirrhoe-Easy-going.wav` },
  { name: "Autonoe",       description: "Bright",        category: "Female", sampleUrl: `${S3_VOICE_SAMPLES}/Autonoe-Bright.wav` },
  { name: "Enceladus",     description: "Breathy",       category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Enceladus-Breathy.wav` },
  { name: "Iapetus",       description: "Clear",         category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Iapetus-Clear.wav` },
  { name: "Umbriel",       description: "Easy-going",    category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Umbriel-Easy-going.wav` },
  { name: "Algieba",       description: "Smooth",        category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Algieba-Smooth.wav` },
  { name: "Despina",       description: "Smooth",        category: "Female", sampleUrl: `${S3_VOICE_SAMPLES}/Despina-Smooth.wav` },
  { name: "Erinome",       description: "Clear",         category: "Female", sampleUrl: `${S3_VOICE_SAMPLES}/Erinome-Clear.wav` },
  { name: "Algenib",       description: "Gravelly",      category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Algenib-Gravelly.wav` },
  { name: "Rasalgethi",    description: "Informative",   category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Rasalgethi-Informative.wav` },
  { name: "Laomedeia",     description: "Upbeat",        category: "Female", sampleUrl: `${S3_VOICE_SAMPLES}/Laomedeia-Upbeat.wav` },
  { name: "Achernar",      description: "Soft",          category: "Female", sampleUrl: `${S3_VOICE_SAMPLES}/Achernar-Soft.wav` },
  { name: "Alnilam",       description: "Firm",          category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Alnilam-Firm.wav` },
  { name: "Schedar",       description: "Even",          category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Schedar-Even.wav` },
  { name: "Gacrux",        description: "Mature",        category: "Female", sampleUrl: `${S3_VOICE_SAMPLES}/Gacrux-Mature.wav` },
  { name: "Pulcherrima",   description: "Forward",       category: "Female", sampleUrl: `${S3_VOICE_SAMPLES}/Pulcherrima-Forward.wav` },
  { name: "Achird",        description: "Friendly",      category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Achird-Friendly.wav` },
  { name: "Zubenelgenubi", description: "Casual",        category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Zubenelgenubi-Casual.wav` },
  { name: "Vindemiatrix",  description: "Gentle",        category: "Female", sampleUrl: `${S3_VOICE_SAMPLES}/Vindemiatrix-Gentle.wav` },
  { name: "Sadachbia",     description: "Lively",        category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Sadachbia-Lively.wav` },
  { name: "Sadaltager",    description: "Knowledgeable", category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Sadaltager-Knowledgeable.wav` },
  { name: "Sulafat",       description: "Warm",          category: "Female", sampleUrl: `${S3_VOICE_SAMPLES}/Sulafat-Warm.wav` },
];

export const GeminiVoiceEmotionMap: Record<GeminiEmotion, string[]> = {
  neutral:    ["Iapetus", "Erinome", "Schedar", "Charon", "Rasalgethi", "Sadaltager"],
  cheerful:   ["Puck", "Laomedeia", "Zephyr", "Autonoe", "Leda", "Pulcherrima"],
  excited:    ["Fenrir", "Sadachbia", "Puck", "Laomedeia", "Zephyr"],
  sad:        ["Enceladus", "Vindemiatrix", "Achernar", "Callirrhoe", "Umbriel"],
  angry:      ["Algenib", "Kore", "Orus", "Alnilam", "Fenrir"],
  whispering: ["Enceladus", "Achernar", "Vindemiatrix", "Aoede"],
  emotional:  ["Sulafat", "Aoede", "Achird", "Despina", "Algieba"],
};

// ── Supported Languages (BCP-47) ─────────────────────────────────────────────

export interface SupportedLanguage {
  code: string;
  label: string;
  countryCode: string; 
}

export const SupportedLanguages: SupportedLanguage[] = [
  { code: "af",  label: "Afrikaans",           countryCode: "za" },
  { code: "sq",  label: "Albanian",            countryCode: "al" },
  { code: "am",  label: "Amharic",             countryCode: "et" },
  { code: "ar",  label: "Arabic",              countryCode: "sa" },
  { code: "hy",  label: "Armenian",            countryCode: "am" },
  { code: "az",  label: "Azerbaijani",         countryCode: "az" },
  { code: "eu",  label: "Basque",              countryCode: "es" },
  { code: "be",  label: "Belarusian",          countryCode: "by" },
  { code: "bn",  label: "Bangla",              countryCode: "bd" },
  { code: "bg",  label: "Bulgarian",           countryCode: "bg" },
  { code: "my",  label: "Burmese",             countryCode: "mm" },
  { code: "ca",  label: "Catalan",             countryCode: "es" },
  { code: "ceb", label: "Cebuano",             countryCode: "ph" },
  { code: "cmn", label: "Chinese, Mandarin",   countryCode: "cn" },
  { code: "hr",  label: "Croatian",            countryCode: "hr" },
  { code: "cs",  label: "Czech",               countryCode: "cz" },
  { code: "da",  label: "Danish",              countryCode: "dk" },
  { code: "nl",  label: "Dutch",               countryCode: "nl" },
  { code: "en",  label: "English",             countryCode: "gb" },
  { code: "et",  label: "Estonian",            countryCode: "ee" },
  { code: "fil", label: "Filipino",            countryCode: "ph" },
  { code: "fi",  label: "Finnish",             countryCode: "fi" },
  { code: "fr",  label: "French",              countryCode: "fr" },
  { code: "gl",  label: "Galician",            countryCode: "es" },
  { code: "ka",  label: "Georgian",            countryCode: "ge" },
  { code: "de",  label: "German",              countryCode: "de" },
  { code: "el",  label: "Greek",               countryCode: "gr" },
  { code: "gu",  label: "Gujarati",            countryCode: "in" },
  { code: "ht",  label: "Haitian Creole",      countryCode: "ht" },
  { code: "he",  label: "Hebrew",              countryCode: "il" },
  { code: "hi",  label: "Hindi",               countryCode: "in" },
  { code: "hu",  label: "Hungarian",           countryCode: "hu" },
  { code: "is",  label: "Icelandic",           countryCode: "is" },
  { code: "id",  label: "Indonesian",          countryCode: "id" },
  { code: "it",  label: "Italian",             countryCode: "it" },
  { code: "ja",  label: "Japanese",            countryCode: "jp" },
  { code: "jv",  label: "Javanese",            countryCode: "id" },
  { code: "kn",  label: "Kannada",             countryCode: "in" },
  { code: "ko",  label: "Korean",              countryCode: "kr" },
  { code: "kok", label: "Konkani",             countryCode: "in" },
  { code: "lo",  label: "Lao",                 countryCode: "la" },
  { code: "la",  label: "Latin",               countryCode: "va" },
  { code: "lv",  label: "Latvian",             countryCode: "lv" },
  { code: "lt",  label: "Lithuanian",          countryCode: "lt" },
  { code: "lb",  label: "Luxembourgish",       countryCode: "lu" },
  { code: "mk",  label: "Macedonian",          countryCode: "mk" },
  { code: "mai", label: "Maithili",            countryCode: "in" },
  { code: "mg",  label: "Malagasy",            countryCode: "mg" },
  { code: "ms",  label: "Malay",               countryCode: "my" },
  { code: "ml",  label: "Malayalam",           countryCode: "in" },
  { code: "mn",  label: "Mongolian",           countryCode: "mn" },
  { code: "mr",  label: "Marathi",             countryCode: "in" },
  { code: "ne",  label: "Nepali",              countryCode: "np" },
  { code: "nb",  label: "Norwegian, Bokmål",   countryCode: "no" },
  { code: "nn",  label: "Norwegian, Nynorsk",  countryCode: "no" },
  { code: "or",  label: "Odia",                countryCode: "in" },
  { code: "ps",  label: "Pashto",              countryCode: "af" },
  { code: "fa",  label: "Persian",             countryCode: "ir" },
  { code: "pl",  label: "Polish",              countryCode: "pl" },
  { code: "pt",  label: "Portuguese",          countryCode: "pt" },
  { code: "pa",  label: "Punjabi",             countryCode: "in" },
  { code: "ro",  label: "Romanian",            countryCode: "ro" },
  { code: "ru",  label: "Russian",             countryCode: "ru" },
  { code: "sd",  label: "Sindhi",              countryCode: "pk" },
  { code: "si",  label: "Sinhala",             countryCode: "lk" },
  { code: "sk",  label: "Slovak",              countryCode: "sk" },
  { code: "sl",  label: "Slovenian",           countryCode: "si" },
  { code: "sr",  label: "Serbian",             countryCode: "rs" },
  { code: "es",  label: "Spanish",             countryCode: "es" },
  { code: "sw",  label: "Swahili",             countryCode: "ke" },
  { code: "sv",  label: "Swedish",             countryCode: "se" },
  { code: "ta",  label: "Tamil",               countryCode: "in" },
  { code: "te",  label: "Telugu",              countryCode: "in" },
  { code: "th",  label: "Thai",                countryCode: "th" },
  { code: "tr",  label: "Turkish",             countryCode: "tr" },
  { code: "uk",  label: "Ukrainian",           countryCode: "ua" },
  { code: "ur",  label: "Urdu",                countryCode: "pk" },
  { code: "vi",  label: "Vietnamese",          countryCode: "vn" },
];


// Lookup map for fast label resolution: code → label
export const LanguageLabelMap: Record<string, string> = Object.fromEntries(
  SupportedLanguages.map((l) => [l.code, l.label]),
);


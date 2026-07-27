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

export const GeminiEmotions: { value: GeminiEmotion }[] = [
  { value: "neutral" },
  { value: "cheerful" },
  { value: "sad" },
  { value: "angry" },
  { value: "excited" },
  { value: "whispering" },
  { value: "emotional" },
];

export const GeminiStyles: { value: GeminiStyle }[] = [
  { value: "conversational" },
  { value: "newsreader" },
  { value: "storytelling" },
  { value: "podcast" },
  { value: "audiobook" },
  { value: "customer-support" },
];

export const GeminiPaces: { value: GeminiPace }[] = [
  { value: "normal" },
  { value: "slow" },
  { value: "fast" },
];

const S3_VOICE_SAMPLES = "/samples/voices/Gemini";

export const GeminiVoices: {
  name: string;
  description: string;
  category: GeminiVoiceCategory;
  sampleUrl: string;
}[] = [
  { name: "Zephyr",        description: "Bright",        category: "Female", sampleUrl: `${S3_VOICE_SAMPLES}/Zephyr-Bright.mp3` },
  { name: "Puck",          description: "Upbeat",        category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Puck-Upbeat.mp3` },
  { name: "Charon",        description: "Informative",   category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Charon-Informative.mp3` },
  { name: "Kore",          description: "Firm",          category: "Female", sampleUrl: `${S3_VOICE_SAMPLES}/Kore-Firm.mp3` },
  { name: "Fenrir",        description: "Excitable",     category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Fenrir-Excitable.mp3` },
  { name: "Leda",          description: "Youthful",      category: "Female", sampleUrl: `${S3_VOICE_SAMPLES}/Leda-Youthful.mp3` },
  { name: "Orus",          description: "Firm",          category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Orus-Firm.mp3` },
  { name: "Aoede",         description: "Breezy",        category: "Female", sampleUrl: `${S3_VOICE_SAMPLES}/Aoede-Breezy.mp3` },
  { name: "Callirrhoe",    description: "Easy-going",    category: "Female", sampleUrl: `${S3_VOICE_SAMPLES}/Callirrhoe-Easy-going.mp3` },
  { name: "Autonoe",       description: "Bright",        category: "Female", sampleUrl: `${S3_VOICE_SAMPLES}/Autonoe-Bright.mp3` },
  { name: "Enceladus",     description: "Breathy",       category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Enceladus-Breathy.mp3` },
  { name: "Iapetus",       description: "Clear",         category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Iapetus-Clear.mp3` },
  { name: "Umbriel",       description: "Easy-going",    category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Umbriel-Easy-going.mp3` },
  { name: "Algieba",       description: "Smooth",        category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Algieba-Smooth.mp3` },
  { name: "Despina",       description: "Smooth",        category: "Female", sampleUrl: `${S3_VOICE_SAMPLES}/Despina-Smooth.mp3` },
  { name: "Erinome",       description: "Clear",         category: "Female", sampleUrl: `${S3_VOICE_SAMPLES}/Erinome-Clear.mp3` },
  { name: "Algenib",       description: "Gravelly",      category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Algenib-Gravelly.mp3` },
  { name: "Rasalgethi",    description: "Informative",   category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Rasalgethi-Informative.mp3` },
  { name: "Laomedeia",     description: "Upbeat",        category: "Female", sampleUrl: `${S3_VOICE_SAMPLES}/Laomedeia-Upbeat.mp3` },
  { name: "Achernar",      description: "Soft",          category: "Female", sampleUrl: `${S3_VOICE_SAMPLES}/Achernar-Soft.mp3` },
  { name: "Alnilam",       description: "Firm",          category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Alnilam-Firm.mp3` },
  { name: "Schedar",       description: "Even",          category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Schedar-Even.mp3` },
  { name: "Gacrux",        description: "Mature",        category: "Female", sampleUrl: `${S3_VOICE_SAMPLES}/Gacrux-Mature.mp3` },
  { name: "Pulcherrima",   description: "Forward",       category: "Female", sampleUrl: `${S3_VOICE_SAMPLES}/Pulcherrima-Forward.mp3` },
  { name: "Achird",        description: "Friendly",      category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Achird-Friendly.mp3` },
  { name: "Zubenelgenubi", description: "Casual",        category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Zubenelgenubi-Casual.mp3` },
  { name: "Vindemiatrix",  description: "Gentle",        category: "Female", sampleUrl: `${S3_VOICE_SAMPLES}/Vindemiatrix-Gentle.mp3` },
  { name: "Sadachbia",     description: "Lively",        category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Sadachbia-Lively.mp3` },
  { name: "Sadaltager",    description: "Knowledgeable", category: "Male",   sampleUrl: `${S3_VOICE_SAMPLES}/Sadaltager-Knowledgeable.mp3` },
  { name: "Sulafat",       description: "Warm",          category: "Female", sampleUrl: `${S3_VOICE_SAMPLES}/Sulafat-Warm.mp3` },
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

export const LanguageLabelMap: Record<string, string> = Object.fromEntries(
  SupportedLanguages.map((l) => [l.code, l.label]),
);
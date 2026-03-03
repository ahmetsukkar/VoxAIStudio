"use client";

import { Loader2 } from "lucide-react";
import { authClient } from "~/lib/auth-client";
import { useEffect, useState, useRef } from "react";
import { generateSpeech as generateSpeechAction } from "~/actions/tts";
import type { TTSProviderType } from "~/actions/tts/tts-factory";
import type { EngineOptionsMap } from "~/types/engines";
import { getUserUploadedVoices } from "~/actions/voice-upload";
import { toast } from "sonner";
import type { GeneratedAudio, UploadedVoice } from "~/types/tts";
import { Languages } from "~/data/Languages";
import { VoiceFiles } from "~/data/VoiceFiles";
import SpeechSettings from "~/components/studio/tts/speech-settings";
import TextInput from "~/components/studio/tts/text-input";
import RecentGenerations from "~/components/studio/recent-generations";
import { GeminiVoices } from "~/data/GeminiOptions";
import { useCreditsStore } from "~/store/credits-store";

export default function TTSStudio() {
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [text, setText] = useState("");
  const [selectedEngine, setSelectedEngine] =
    useState<TTSProviderType>("gemini");
  const [currentAudio, setCurrentAudio] = useState<GeneratedAudio | null>(null);
  const [userUploadedVoices, setUserUploadedVoices] = useState<UploadedVoice[]>(
    [],
  );
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [engineOptions, setEngineOptions] = useState<EngineOptionsMap>({
    chatterbox: {
      language: "en",
      voice: VoiceFiles[0]?.s3_key ?? "samples/voices/Charon.wav",
      exaggeration: 0.5,
      cfgWeight: 0.5,
    },
    gemini: {
      voice: GeminiVoices[0]?.name ?? "Zephyr",
      model: "gemini-2.5-flash-preview-tts",
      emotion: "neutral",
      style: "conversational",
      pace: "normal",
    },
  });

  const audioRef = useRef<HTMLAudioElement>(null);

  const fetchUserUploadedVoices = async () => {
    const result = await getUserUploadedVoices("aws");
    if (result.success) {
      setUserUploadedVoices(result.voices as UploadedVoice[]);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        const [, voicesResult] = await Promise.all([
          authClient.getSession(),
          getUserUploadedVoices(),
        ]);
        if (voicesResult.success) {
          setUserUploadedVoices(voicesResult.voices);
        }
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    void initializeData();
  }, []);

  useEffect(() => {
    if (!currentAudio || !audioRef.current) return;

    const audio = audioRef.current;

    const onCanPlay = () => {
      audio.play().catch((e) => console.error("Autoplay failed:", e));
      audio.removeEventListener("canplay", onCanPlay);
    };

    audio.addEventListener("canplay", onCanPlay);

    return () => {
      audio.removeEventListener("canplay", onCanPlay);
    };
  }, [currentAudio]);

  const generateSpeech = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text!");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateSpeechAction(
        selectedEngine,
        selectedEngine === "chatterbox"
          ? {
              text,
              voice_S3_key: engineOptions.chatterbox.voice,
              language: engineOptions.chatterbox.language,
              exaggeration: engineOptions.chatterbox.exaggeration,
              cfg_weight: engineOptions.chatterbox.cfgWeight,
            }
          : {
              text,
              voice_name: engineOptions.gemini.voice,
              gemini_model: engineOptions.gemini.model,
              gemini_emotion: engineOptions.gemini.emotion,
              gemini_style: engineOptions.gemini.style,
              gemini_pace: engineOptions.gemini.pace,
            },
      );

      if (!result.success || !result.audioUrl || !result.s3_key) {
        throw new Error(result.error ?? "Generation failed");
      }

      if (result.creditsRemaining !== undefined) {
        useCreditsStore.getState().setCredits(result.creditsRemaining);
      }

      const newAudio: GeneratedAudio = {
        s3_key: result.s3_key,
        audioUrl: result.audioUrl,
        text,
        language: engineOptions.chatterbox.language,
        timestamp: new Date(),
      };

      setCurrentAudio(newAudio);
      setRefreshTrigger((prev) => prev + 1);

      document
        .getElementById("main-scroll")
        ?.scrollTo({ top: 0, behavior: "smooth" });

      toast.success("Speech generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate speech",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAudio = (audio: GeneratedAudio) => {
    window.open(audio.audioUrl, "_blank");
    toast.success("Download started!");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-2 py-4 sm:px-4 sm:py-6">
      <div className="grid grid-cols-1 gap-2 sm:gap-4 lg:grid-cols-3">
        {/* Left — Settings */}
        <div className="order-2 space-y-2 sm:space-y-3 lg:order-1 lg:col-span-1">
          <SpeechSettings
            languages={Languages}
            voiceFiles={VoiceFiles}
            selectedEngine={selectedEngine}
            setSelectedEngine={setSelectedEngine}
            engineOptions={engineOptions}
            setEngineOptions={setEngineOptions}
            userUploadedVoices={userUploadedVoices}
            onVoiceUploaded={fetchUserUploadedVoices}
            text={text}
            isGenerating={isGenerating}
            onGenerate={generateSpeech}
          />
        </div>

        {/* Right — Text input + player */}
        <div className="order-1 space-y-2 sm:space-y-3 lg:order-2 lg:col-span-2">
          <TextInput
            text={text}
            setText={setText}
            currentAudio={currentAudio}
            audioRef={audioRef}
            onDownload={downloadAudio}
          />
        </div>
      </div>

      <RecentGenerations group="TTS" refreshTrigger={refreshTrigger} />
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import { RedirectToSignIn, SignedIn } from "@daveyplate/better-auth-ui";
import { Loader2 } from "lucide-react";
import { authClient } from "~/lib/auth-client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  generateSpeech as generateSpeechAction,
  getUserAudioProjects,
} from "~/actions/tts";
import type { TTSProviderType } from "~/actions/tts/tts-factory";
import type { EngineOptionsMap } from "~/types/engines";
import { getUserUploadedVoices } from "~/actions/voice-upload";
import { toast } from "sonner";
import type { GeneratedAudio, UploadedVoice } from "~/types/tts";
import { Languages } from "~/data/Languages";
import { VoiceFiles } from "~/data/VoiceFiles";
import SpeechSettings from "~/components/studio/tts/speech-settings";
import TextInput from "~/components/studio/tts/text-input";
import AudioHistory from "~/components/studio/tts/audio-history";
import { GeminiVoices } from "~/data/GeminiOptions";

export default function CreatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [text, setText] = useState("");
  const [selectedEngine, setSelectedEngine] =
    useState<TTSProviderType>("chatterbox");
  const [generatedAudios, setGeneratedAudios] = useState<GeneratedAudio[]>([]);
  const [currentAudio, setCurrentAudio] = useState<GeneratedAudio | null>(null);
  const [userUploadedVoices, setUserUploadedVoices] = useState<UploadedVoice[]>(
    [],
  );

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
        const [, projectsResult, voicesResult] = await Promise.all([
          authClient.getSession(),
          getUserAudioProjects(),
          getUserUploadedVoices(),
        ]);

        if (projectsResult.success && projectsResult.audioProjects) {
          const mappedProjects = projectsResult.audioProjects.map(
            (project) => ({
              s3_key: project.s3Key,
              audioUrl: project.audioUrl,
              text: project.text,
              language: project.language,
              timestamp: new Date(project.createdAt),
            }),
          );
          setGeneratedAudios(mappedProjects);
        }

        if (voicesResult.success) {
          setUserUploadedVoices(voicesResult.voices);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing data:", error);
        setIsLoading(false);
      }
    };

    void initializeData();
  }, []);

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

      router.refresh();

      const newAudio: GeneratedAudio = {
        s3_key: result.s3_key,
        audioUrl: result.audioUrl,
        text: text,
        language: engineOptions.chatterbox.language,
        timestamp: new Date(),
      };

      setCurrentAudio(newAudio);
      setGeneratedAudios([newAudio, ...generatedAudios].slice(0, 20));

      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.load();
          audioRef.current.play().catch((error) => {
            console.error("Autoplay failed:", error);
          });
        }
      }, 100);

      toast.success("Speech generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to generate speech";
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const playAudio = (audio: GeneratedAudio) => {
    setCurrentAudio(audio);
    // Auto-play after setting the audio
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play().catch((error) => {
          console.error("Autoplay failed:", error);
        });
      }
    }, 100);
    toast.info(`Now playing...`);
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
    <>
      <RedirectToSignIn />
      <SignedIn>
        <div className="border-b border-gray-200 bg-white py-2">
          <div className="mx-auto max-w-7xl text-center">
            [ 🎙️ Text to Speech ] [ 🎭 Dialogue Studio ]
          </div>
        </div>
        {/* Main Content Area */}
        <div className="mx-auto max-w-7xl px-2 py-4 sm:px-4 sm:py-6">
          <div className="grid grid-cols-1 gap-2 sm:gap-4 lg:grid-cols-3">
            {/* Left Side - Controls (1/3 width) */}
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
          <div className="pt-4">
            <AudioHistory
              generatedAudios={generatedAudios}
              languages={Languages}
              onPlay={playAudio}
              onDownload={downloadAudio}
            />
          </div>
        </div>
      </SignedIn>
    </>
  );
}

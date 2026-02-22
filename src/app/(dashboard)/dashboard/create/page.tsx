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
import type {
  GeminiEmotion,
  GeminiModel,
  GeminiPace,
  GeminiStyle,
} from "~/data/GeminiOptions";

import { uploadVoice, getUserUploadedVoices } from "~/actions/voice-upload";
import { toast } from "sonner";
import type { GeneratedAudio, UploadedVoice } from "~/types/tts";

import { Languages } from "~/data/Languages";
import { VoiceFiles } from "~/data/VoiceFiles";

import SpeechSettings from "~/components/create/speech-settings";
import TextInput from "~/components/create/text-input";
import AudioHistory from "~/components/create/audio-history";

export default function CreatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploadingVoice, setIsUploadingVoice] = useState(false);
  const [text, setText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedVoice, setSelectedVoice] = useState(
    VoiceFiles[0]?.s3_key ?? "samples/voices/Kore.wav",
  );

  const [selectedEngine, setSelectedEngine] =
    useState<TTSProviderType>("chatterbox");
  const [exaggeration, setExaggeration] = useState(0.5);
  const [cfgWeight, setCfgWeight] = useState(0.5);
  const [generatedAudios, setGeneratedAudios] = useState<GeneratedAudio[]>([]);
  const [currentAudio, setCurrentAudio] = useState<GeneratedAudio | null>(null);
  const [userUploadedVoices, setUserUploadedVoices] = useState<UploadedVoice[]>(
    [],
  );

  // Gemini-specific states
  const [geminiVoice, setGeminiVoice] = useState("Kore");
  const [geminiModel, setGeminiModel] = useState<GeminiModel>(
    "gemini-2.5-flash-preview-tts",
  );
  const [geminiEmotion, setGeminiEmotion] = useState<GeminiEmotion>("neutral");
  const [geminiStyle, setGeminiStyle] = useState<GeminiStyle>("conversational");
  const [geminiPace, setGeminiPace] = useState<GeminiPace>("normal");

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
              voice_S3_key: selectedVoice,
              language: selectedLanguage,
              exaggeration,
              cfg_weight: cfgWeight,
            }
          : {
              text,
              voice_name: geminiVoice,
              gemini_model: geminiModel,
              gemini_emotion: geminiEmotion,
              gemini_style: geminiStyle,
              gemini_pace: geminiPace,
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
        language: selectedLanguage,
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

  const handleVoiceUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("audio/")) {
      toast.error("Please select an audio file!");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB!");
      return;
    }

    setIsUploadingVoice(true);
    try {
      const formData = new FormData();
      formData.append("voice", file);

      const result = await uploadVoice("aws", formData);

      if (!result.success) {
        throw new Error(result.error ?? "Upload failed");
      }

      toast.success("Voice uploaded successfully!");

      await fetchUserUploadedVoices();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload voice file");
    } finally {
      setIsUploadingVoice(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
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
            <h1 className="from-primary to-primary/70 mb-1 bg-gradient-to-r bg-clip-text text-lg font-bold text-transparent">
              Text-to-Speech Generator
            </h1>
            <p className="text-muted-foreground mx-auto max-w-xl text-xs">
              Generate natural-sounding speech in 23 languages with voice
              cloning
            </p>
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
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                selectedVoice={selectedVoice}
                setSelectedVoice={setSelectedVoice}
                exaggeration={exaggeration}
                setExaggeration={setExaggeration}
                cfgWeight={cfgWeight}
                setCfgWeight={setCfgWeight}
                userUploadedVoices={userUploadedVoices}
                isUploadingVoice={isUploadingVoice}
                handleVoiceUpload={handleVoiceUpload}
                text={text}
                isGenerating={isGenerating}
                onGenerate={generateSpeech}
                geminiVoice={geminiVoice}
                setGeminiVoice={setGeminiVoice}
                geminiModel={geminiModel}
                setGeminiModel={setGeminiModel}
                geminiEmotion={geminiEmotion}
                setGeminiEmotion={setGeminiEmotion}
                geminiStyle={geminiStyle}
                setGeminiStyle={setGeminiStyle}
                geminiPace={geminiPace}
                setGeminiPace={setGeminiPace}
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

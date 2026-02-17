"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Play, Pause, AudioWaveform } from "lucide-react";
import Link from "next/link";
export default function DemoSection() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const naturalSpeechSamples = [
    {
      id: "warm-narrator",
      text: "Welcome back. In the next minute, I’ll guide you through a simple story that feels natural and clear.",
      voiceType: "Warm Narrator (Neutral English)",
      audioUrl: "/audio/warm-narrator.wav",
    },
    {
      id: "energetic-host",
      text: "Alright everyone—big news today! We’re kicking off with the fastest updates and a quick takeaway you can use.",
      voiceType: "Energetic Male Host",
      audioUrl: "/audio/energetic-host.wav",
    },
    {
      id: "calm-meditation",
      text: "Take a slow breath in, hold for a moment, and let your shoulders drop as you exhale gently.",
      voiceType: "Calm Meditation Guide (Soft Female)",
      audioUrl: "/audio/calm-meditation.wav",
    },
    {
      id: "customer-support",
      text: "Thanks for reaching out—let’s sort this out together. First, I’ll confirm a couple of details and then fix it.",
      voiceType: "Customer Support Agent (Professional)",
      audioUrl: "/audio/customer-support.wav",
    },
    {
      id: "audiobook-british",
      text: "At precisely midnight, the old clock chimed once, and the hallway seemed to hold its breath.",
      voiceType: "Audiobook Reader (British RP)",
      audioUrl: "/audio/audiobook-british.wav",
    },
    {
      id: "turkish-friendly",
      text: "Merhaba! Bugün sana doğal ve anlaşılır bir ses örneği dinleteceğim; hazır olduğunda başlayalım.",
      voiceType: "Turkish Friendly (Istanbul Accent)",
      audioUrl: "/audio/turkish-friendly.wav",
    },
  ];

  const multilingualSamples = [
    {
      id: "hindi",
      language: "Indian 🇮🇳",
      text: "नमस्ते! हमें खुशी है कि आप आज यहाँ हैं।",
      audioUrl: "/audio/hindi.wav",
    },
    {
      id: "spanish",
      language: "Spanish 🇪🇸",
      text: "¡Hola! Gracias por visitarnos, empecemos cuando quieras.",
      audioUrl: "/audio/spanish.wav",
    },
    {
      id: "french",
      language: "French 🇫🇷",
      text: "Bonjour ! Ravi de vous voir ici, commençons ensemble.",
      audioUrl: "/audio/french.wav",
    },
    {
      id: "japanese",
      language: "Japanese 🇯🇵",
      text: "はじめまして！ここで一緒に始めましょう。",
      audioUrl: "/audio/japanese.wav",
    },
    {
      id: "arabic",
      language: "Arabic 🇸🇦",
      text: "مرحبًا! يسعدنا انضمامك إلينا، فلنبدأ الآن.",
      audioUrl: "/audio/arabic.wav",
    },
  ];

  const handlePlay = (id: string, audioUrl: string) => {
    if (playingId === id) {
      const audio = document.getElementById(id) as HTMLAudioElement;
      audio?.pause();
      setPlayingId(null);
      return;
    }

    if (playingId) {
      const currentAudio = document.getElementById(
        playingId,
      ) as HTMLAudioElement;
      currentAudio?.pause();
      currentAudio.currentTime = 0;
    }

    const audio = document.getElementById(id) as HTMLAudioElement;
    if (audio) {
      audio
        .play()
        .then(() => {
          setPlayingId(id);
        })
        .catch((error) => {
          console.error("Audio playback failed:", error);
          alert(
            "Unable to play audio. Please check the audio file or try generating your own speech in the dashboard!",
          );
        });

      audio.onended = () => {
        setPlayingId(null);
      };

      audio.onerror = () => {
        setPlayingId(null);
      };
    }
  };
  return (
    <section className="bg-gradient-to-br from-indigo-50/50 to-cyan-50/30 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
            Hear the{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Difference
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Listen to real demos of our AI voice technology in action.
          </p>
        </div>
        <div className="mb-16">
          <h3 className="mb-6 text-center text-2xl font-semibold text-slate-800">
            Realistic & Emotion‑Rich Speech.
          </h3>
          <Card className="overflow-hidden border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Text Sample
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Voice Type
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                      Audio Output
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {naturalSpeechSamples.map((sample) => (
                    <tr key={sample.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 text-sm text-slate-600">
                        &ldquo;{sample.text}&rdquo;
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-700">
                        {sample.voiceType}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                            onClick={() =>
                              handlePlay(sample.id, sample.audioUrl)
                            }
                          >
                            {playingId === sample.id ? (
                              <>
                                <Pause className="h-4 w-4" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4" />
                                Play
                              </>
                            )}
                          </Button>
                          {sample.audioUrl && (
                            <audio
                              id={sample.id}
                              src={sample.audioUrl}
                              preload="metadata"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        {/* Multilingual Support Demo */}
        <div>
          <h3 className="mb-6 text-center text-2xl font-semibold text-slate-800">
            Multilingual Support
          </h3>
          <Card className="overflow-hidden border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Language
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Text Sample
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                      Audio Output
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {multilingualSamples.map((sample) => (
                    <tr key={sample.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-700">
                        {sample.language}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        &ldquo;{sample.text}&rdquo;
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                            onClick={() =>
                              handlePlay(sample.id, sample.audioUrl)
                            }
                          >
                            {playingId === sample.id ? (
                              <>
                                <Pause className="h-4 w-4" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4" />
                                Play
                              </>
                            )}
                          </Button>
                          {sample.audioUrl && (
                            <audio
                              id={sample.id}
                              src={sample.audioUrl}
                              preload="metadata"
                              crossOrigin="anonymous"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        <div className="mt-12 text-center">
          <p className="mb-6 text-slate-600">
            Ready to create your own AI-generated voices?
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="cursor-pointer gap-2 bg-gradient-to-r from-indigo-500 to-cyan-600 hover:from-indigo-600 hover:to-cyan-700"
            >
              <AudioWaveform className="h-5 w-5" />
              Try It Free Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

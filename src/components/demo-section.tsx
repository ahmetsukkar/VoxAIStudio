"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Play, Pause } from "lucide-react";
import AuthCTA from "./auth-cta";
import { useTranslations } from "next-intl";

const S3_VOICE_SAMPLES = "/samples/voices/Public";

export default function DemoSection() {
  const t = useTranslations("home.demo");
  const [playingId, setPlayingId] = useState<string | null>(null);

  const naturalSpeechSamples = [
    {
      id: "warm-narrator",
      text: "Welcome back. In the next minute, I'll guide you through a simple story that feels natural and clear.",
      voiceType: "Warm Narrator (Neutral English)",
      audioUrl: `${S3_VOICE_SAMPLES}/warm-narrator.mp3`,
    },
    {
      id: "energetic-host",
      text: "Alright everyone—big news today! We're kicking off with the fastest updates and a quick takeaway you can use.",
      voiceType: "Energetic Male Host",
      audioUrl: `${S3_VOICE_SAMPLES}/energetic-host.mp3`,
    },
    {
      id: "calm-meditation",
      text: "Take a slow breath in, hold for a moment, and let your shoulders drop as you exhale gently.",
      voiceType: "Calm Meditation Guide (Soft Female)",
      audioUrl: `${S3_VOICE_SAMPLES}/calm-meditation.mp3`,
    },
    {
      id: "customer-support",
      text: "Thanks for reaching out—let's sort this out together. First, I'll confirm a couple of details and then fix it.",
      voiceType: "Customer Support Agent (Professional)",
      audioUrl: `${S3_VOICE_SAMPLES}/customer-support.mp3`,
    },
    {
      id: "audiobook-british",
      text: "At precisely midnight, the old clock chimed once, and the hallway seemed to hold its breath.",
      voiceType: "Audiobook Reader (British RP)",
      audioUrl: `${S3_VOICE_SAMPLES}/audiobook-british.mp3`,
    },
    {
      id: "turkish-friendly",
      text: "Merhaba! Bugün sana doğal ve anlaşılır bir ses örneği dinleteceğim; hazır olduğunda başlayalım.",
      voiceType: "Turkish Friendly (Istanbul Accent)",
      audioUrl: `${S3_VOICE_SAMPLES}/turkish-friendly.mp3`,
    },
  ];

  const multilingualSamples = [
    {
      id: "hindi",
      language: "Indian 🇮🇳",
      text: "नमस्ते! हमें खुशी है कि आप आज यहाँ हैं।",
      audioUrl: `${S3_VOICE_SAMPLES}/hindi.mp3`,
    },
    {
      id: "spanish",
      language: "Spanish 🇪🇸",
      text: "¡Hola! Gracias por visitarnos, empecemos cuando quieras.",
      audioUrl: `${S3_VOICE_SAMPLES}/spanish.mp3`,
    },
    {
      id: "french",
      language: "French 🇫🇷",
      text: "Bonjour ! Ravi de vous voir ici, commençons ensemble.",
      audioUrl: `${S3_VOICE_SAMPLES}/french.mp3`,
    },
    {
      id: "japanese",
      language: "Japanese 🇯🇵",
      text: "はじめまして！ここで一緒に始めましょう。",
      audioUrl: `${S3_VOICE_SAMPLES}/japanese.mp3`,
    },
    {
      id: "arabic",
      language: "Arabic 🇸🇦",
      text: "مرحبًا! يسعدنا انضمامك إلينا، فلنبدأ الآن.",
      audioUrl: `${S3_VOICE_SAMPLES}/arabic.mp3`,
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

      audio.onended = () => setPlayingId(null);
      audio.onerror = () => setPlayingId(null);
    }
  };

  return (
    <section
      id="demo"
      className="bg-gradient-to-br from-indigo-50/50 to-cyan-50/30 py-20 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
            {t("title")}{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-600">{t("subtitle")}</p>
        </div>

        {/* Natural Speech Table */}
        <div className="mb-16">
          <h3 className="mb-6 text-center text-2xl font-semibold text-slate-800">
            {t("naturalSpeech.heading")}
          </h3>
          <Card className="overflow-hidden border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-start text-sm font-semibold text-slate-700">
                      {t("naturalSpeech.colText")}
                    </th>
                    <th className="px-6 py-4 text-start text-sm font-semibold text-slate-700">
                      {t("naturalSpeech.colVoice")}
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                      {t("naturalSpeech.colAudio")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {naturalSpeechSamples.map((sample) => (
                    <tr key={sample.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 text-start text-sm text-slate-600">
                        &ldquo;{sample.text}&rdquo;
                      </td>
                      <td className="px-6 py-4 text-start text-sm font-medium text-slate-700">
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
                                {t("pause")}
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4" />
                                {t("play")}
                              </>
                            )}
                          </Button>
                          {sample.audioUrl && (
                            <audio
                              id={sample.id}
                              src={sample.audioUrl}
                              preload="none"
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

        {/* Multilingual Table */}
        <div>
          <h3 className="mb-6 text-center text-2xl font-semibold text-slate-800">
            {t("multilingual.heading")}
          </h3>
          <Card className="overflow-hidden border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-start text-sm font-semibold text-slate-700">
                      {t("multilingual.colLanguage")}
                    </th>
                    <th className="px-6 py-4 text-start text-sm font-semibold text-slate-700">
                      {t("multilingual.colText")}
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                      {t("multilingual.colAudio")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {multilingualSamples.map((sample) => (
                    <tr key={sample.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 text-start text-sm font-medium text-slate-700">
                        {sample.language}
                      </td>
                      <td className="px-6 py-4 text-start text-sm text-slate-600">
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
                                {t("pause")}
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4" />
                                {t("play")}
                              </>
                            )}
                          </Button>
                          {sample.audioUrl && (
                            <audio
                              id={sample.id}
                              src={sample.audioUrl}
                              preload="none"
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

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="mb-6 text-slate-600">{t("ctaText")}</p>
          <AuthCTA
            label={t("ctaButton")}
            icon="AudioWaveform"
            size="lg"
            className="bg-gradient-to-r from-indigo-500 to-cyan-600 px-8 py-6 text-base text-white"
          />
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import {
  Loader2,
  Plus,
  Settings2,
  ChevronDown,
  ChevronUp,
  Lock,
  Clock,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { toast } from "sonner";
import { GeminiVoices } from "~/data/GeminiOptions";
import { calcGeminiDialogueCredits } from "~/lib/credits/calculate";
import type {
  DialogueSpeaker,
  DialogueLine,
  DialogueSettings,
  SpeakerId,
} from "~/types/dialogue";
import SpeakerCard from "./speaker-card";
import DialogueLineItem from "./dialogue-line-item";
import DialogueSettingsPanel from "./dialogue-settings";
import RecentGenerations from "~/components/studio/recent-generations";
import { generateDialogue } from "~/actions/tts";
import { useCreditsStore } from "~/store/credits-store";
import { usePlanStore } from "~/store/plan-store";
import { audioManager } from "~/lib/audio/audio-manager";
import { VerifyToGenerateModal } from "~/components/verify-to-generate-modal";
import { authClient, useSession } from "~/lib/auth-client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import PricingModal from "~/components/pricing-modal";
import { TrialExpiredModal } from "~/components/trial-expired-modal";
import { useTranslations } from "next-intl";

export default function DialogueStudio() {
  const { data: session } = useSession();
  const t = useTranslations("studio.dialogue");
  const [speakers, setSpeakers] = useState<DialogueSpeaker[]>([
    {
      id: "s1",
      name: "Joe",
      voice: GeminiVoices[2]?.name ?? "Charon",
      color: "blue",
      emotion: "neutral",
    },
    {
      id: "s2",
      name: "Jane",
      voice: GeminiVoices[15]?.name ?? "Erinome",
      color: "green",
      emotion: "neutral",
    },
  ]);

  const [lines, setLines] = useState<DialogueLine[]>([
    { id: "l1", speakerId: "s1", text: "" },
    { id: "l2", speakerId: "s2", text: "" },
  ]);

  const [settings, setSettings] = useState<DialogueSettings>({
    model: "gemini-2.5-flash-preview-tts",
    style: "conversational",
    pace: "normal",
    language: "auto",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showTrialExpiredModal, setShowTrialExpiredModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);

  const [verifySent, setVerifySent] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const trialExpired = usePlanStore((s) => s.trialExpired);

  const { setCredits } = useCreditsStore();

  const isFreeTrial = usePlanStore((s) => s.isFreeTrial);
  const maxChars = usePlanStore((s) => s.maxCharsAllowed);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioRefMobile = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioUrl) return;
    const playAudio = (el: HTMLAudioElement | null) => {
      if (!el) return;
      return setTimeout(() => {
        audioManager.register(el, () => el.pause());
        el.play().catch(() => {
          // Autoplay blocked by browser — user presses play manually
        });
      }, 100);
    };
    const t1 = playAudio(audioRef.current);
    return () => {
      clearTimeout(t1);
    };
  }, [audioUrl]);

  const totalChars = lines.reduce((sum, l) => sum + l.text.length, 0);
  const isOverLimit = totalChars > maxChars;
  const creditsNeeded = calcGeminiDialogueCredits(lines, settings);

  const updateSpeaker = (updated: DialogueSpeaker) =>
    setSpeakers((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));

  const updateLine = (updated: DialogueLine) =>
    setLines((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));

  const deleteLine = (id: string) =>
    setLines((prev) => prev.filter((l) => l.id !== id));

  const addLine = () => {
    setLines((prev) => {
      const lastLine = prev[prev.length - 1];
      const lastSpeaker = lastLine?.speakerId ?? speakers[0]?.id;
      const lastIndex = speakers.findIndex((s) => s.id === lastSpeaker);
      const nextSpeakerId: SpeakerId =
        speakers[(lastIndex + 1) % speakers.length]?.id ?? "s1";

      return [
        ...prev,
        { id: `l${Date.now()}`, speakerId: nextSpeakerId, text: "" },
      ];
    });
  };

  const handleResendVerification = async () => {
    if (!session?.user?.email) return;
    setVerifyLoading(true);
    try {
      await authClient.sendVerificationEmail({
        email: session.user.email,
        callbackURL: "/dashboard",
      });
      setVerifySent(true);
    } catch {
      toast.error(t("toasts.verifyFailed"));
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (lines.some((l) => !l.text.trim())) {
      toast.error(t("toasts.fillLines"));
      return;
    }

    setIsGenerating(true);
    setAudioUrl(null);

    try {
      const result = await generateDialogue({ speakers, lines, settings });

      if (result.error === "VERIFICATION_REQUIRED") {
        setShowVerifyModal(true);
        return;
      }

      if (result.error === "TRIAL_EXPIRED") {
        setShowTrialExpiredModal(true);
        return;
      }

      if (!result.success || !result.audioUrl)
        throw new Error(result.error ?? "Generation failed");

      setAudioUrl(result.audioUrl);
      if (result.creditsRemaining !== undefined)
        setCredits(result.creditsRemaining);

      setRefreshTrigger((prev) => prev + 1);

      document
        .getElementById("main-scroll")
        ?.scrollTo({ top: 0, behavior: "smooth" });

      toast.success(t("toasts.success"));
    } catch (error) {
      console.error("Dialogue generation error:", error);
      toast.error(error instanceof Error ? error.message : t("toasts.failed"));
    } finally {
      setIsGenerating(false);
    }
  };

  const AudioPlayer = ({
    refProp,
  }: {
    refProp: React.RefObject<HTMLAudioElement | null>;
  }) => {
    if (!audioUrl) {
      return (
        <p className="text-muted-foreground py-6 text-center text-xs italic">
          {t("waitingForGeneration")}
        </p>
      );
    }
    return (
      <audio
        key={audioUrl}
        ref={refProp}
        controls
        className="w-full"
        src={audioUrl}
      />
    );
  };

  // ── Free Trial gate ───────────────────────────────────────────────────────
  if (isFreeTrial === true || trialExpired === true) {
    const isVerified = session?.user?.emailVerified;
    const isExpired = trialExpired === true;

    return (
      <div className="mx-auto max-w-7xl px-2 py-4 sm:px-4 sm:py-6">
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-indigo-300 bg-indigo-50/50 py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
            {isExpired ? (
              <Clock className="h-7 w-7 text-amber-500" />
            ) : (
              <Lock className="h-7 w-7 text-indigo-500" />
            )}
          </div>

          <h2 className="mb-2 text-xl font-bold text-slate-800">
            {isExpired ? t("freeTrial.expiredTitle") : t("freeTrial.title")}
          </h2>
          <p className="mb-6 max-w-sm text-sm text-slate-500">
            {isExpired
              ? t("freeTrial.expiredSubtitle")
              : t("freeTrial.subtitle")}
          </p>

          {/* Upgrade button — same verified/unverified logic */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  {isVerified ? (
                    <Button
                      onClick={() => setShowPricingModal(true)}
                      className="bg-gradient-to-r from-indigo-500 to-cyan-600 hover:from-indigo-600 hover:to-cyan-700"
                    >
                      {t("freeTrial.upgradeButton")}
                    </Button>
                  ) : (
                    <Button
                      disabled
                      className="cursor-not-allowed bg-gradient-to-r from-indigo-300 to-cyan-400 opacity-60"
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      {t("freeTrial.upgradeButton")}
                    </Button>
                  )}
                </span>
              </TooltipTrigger>
              {!isVerified && (
                <TooltipContent
                  side="top"
                  className="max-w-[200px] text-center text-xs"
                >
                  Please verify your email to purchase a plan
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          {/* Verify button — only if not verified */}
          {!isVerified && (
            <div className="mt-3">
              {verifySent ? (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 dark:border-green-800 dark:bg-green-900/20">
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">
                    {t("freeTrial.verificationSent")}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {t("freeTrial.checkInbox")} <strong>{session?.user?.email}</strong>
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  {t("freeTrial.verifyFirst")}
                  <button
                    onClick={handleResendVerification}
                    disabled={verifyLoading}
                    className="text-indigo-500 underline hover:text-indigo-700 disabled:opacity-50"
                  >
                    {verifyLoading ? t("freeTrial.sending") : t("freeTrial.verifyEmail")}
                  </button>{" "}
                  {t("freeTrial.verifyNote")}
                </p>
              )}
            </div>
          )}
          {showPricingModal && (
            <PricingModal
              open={showPricingModal}
              onClose={() => setShowPricingModal(false)}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-2 py-4 sm:px-4 sm:py-6">
      {showVerifyModal && (
        <VerifyToGenerateModal onClose={() => setShowVerifyModal(false)} />
      )}
      {showTrialExpiredModal && (
        <TrialExpiredModal onClose={() => setShowTrialExpiredModal(false)} />
      )}
      <div className="grid grid-cols-1 gap-2 sm:gap-4 lg:grid-cols-3">
        {/* ── LEFT SIDEBAR — desktop only ── */}
        <div className="hidden space-y-2 sm:space-y-3 lg:col-span-1 lg:block">
          <Card className="shadow-lg">
            <CardContent className="p-2 sm:p-3">
              <h3 className="mb-2 text-sm font-bold">{t("player")}</h3>
              <AudioPlayer refProp={audioRef} />
            </CardContent>
          </Card>

          <DialogueSettingsPanel
            settings={settings}
            onChange={setSettings}
            creditsNeeded={creditsNeeded}
            totalChars={totalChars}
          />
        </div>

        {/* ── MAIN AREA ── */}
        <div className="space-y-4 lg:col-span-2">
          {/* ── MOBILE ONLY ── */}
          <div className="space-y-2 lg:hidden">
            <Card className="shadow-sm">
              <CardContent className="p-2">
                <AudioPlayer refProp={audioRefMobile} />
              </CardContent>
            </Card>

            <button
              onClick={() => setSettingsOpen((prev) => !prev)}
              className="bg-muted hover:bg-muted/80 flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            >
              <span className="flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                {t("settingsToggle")}
                {creditsNeeded > 0 && (
                  <span className="text-muted-foreground text-xs font-normal">
                    · {creditsNeeded} credits
                  </span>
                )}
              </span>
              {settingsOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {settingsOpen && (
              <DialogueSettingsPanel
                settings={settings}
                onChange={setSettings}
                creditsNeeded={creditsNeeded}
                totalChars={totalChars}
              />
            )}
          </div>

          {/* Speakers */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {speakers.map((speaker) => (
              <SpeakerCard
                key={speaker.id}
                speaker={speaker}
                onChange={updateSpeaker}
              />
            ))}
          </div>

          {/* Dialogue Lines */}
          <Card>
            <CardContent className="space-y-4 p-3 sm:p-4">
              {lines.map((line) => (
                <DialogueLineItem
                  key={line.id}
                  line={line}
                  speakers={speakers}
                  canDelete={lines.length > 2}
                  onChange={updateLine}
                  onDelete={() => deleteLine(line.id)}
                />
              ))}
              <Button
                variant="outline"
                className="w-full border-dashed"
                onClick={addLine}
                disabled={isOverLimit}
              >
                <Plus className="mr-2 h-4 w-4" />
                {t("addLine")}
              </Button>
            </CardContent>
          </Card>

          {/* Generate Button + total counter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1 text-xs">
              <span className="text-muted-foreground">
                {t("totalConversationLength")}
              </span>
              <span
                className={
                  isOverLimit
                    ? "font-semibold text-red-500"
                    : totalChars > maxChars * 0.9
                      ? "text-orange-500"
                      : "text-muted-foreground"
                }
              >
                {totalChars.toLocaleString()} / {maxChars.toLocaleString()}{" "}
                {t("characters")}
              </span>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || totalChars === 0 || isOverLimit}
              className="h-11 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  {t("generating")}
                </>
              ) : (
                t("generate")
              )}
            </Button>

            {isOverLimit && (
              <p className="text-center text-xs text-red-500">
                {t("overLimit", { max: maxChars.toLocaleString() })}
              </p>
            )}
            {!isGenerating && totalChars === 0 && (
              <p className="text-muted-foreground text-center text-xs">
                {t("fillLines")}
              </p>
            )}
          </div>
        </div>
      </div>

      <RecentGenerations group="Dialogue" refreshTrigger={refreshTrigger} />
    </div>
  );
}

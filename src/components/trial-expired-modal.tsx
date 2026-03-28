"use client";

import { useState } from "react";
import { authClient, useSession } from "~/lib/auth-client";
import { Button } from "~/components/ui/button";
import { Clock, X, Lock } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useTranslations } from "next-intl";

interface Props {
  onClose: () => void;
}

export function TrialExpiredModal({ onClose }: Props) {
  const { data: session } = useSession();
  const isVerified = session?.user?.emailVerified;
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("dashboard.trials");
  const tVerify = useTranslations("dashboard.verifyBanner");

  const handleResend = async () => {
    if (!session?.user?.email) return;
    setLoading(true);
    await authClient.sendVerificationEmail({
      email: session.user.email,
      callbackURL: "/dashboard",
    });
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-md space-y-5 rounded-2xl border border-border bg-card p-8 text-center shadow-2xl">
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground absolute top-4 right-4 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex justify-center">
          <div className="rounded-full bg-amber-100 p-4 dark:bg-amber-900/30">
            <Clock className="h-10 w-10 text-amber-600 dark:text-amber-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold">{t("expiredTitle")}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t("expiredDescription")}
          </p>
        </div>

        <div className="space-y-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="block w-full">
                  {isVerified ? (
                    <Link href="/api/auth/checkout?slug=start" className="block">
                      <Button
                        className="w-full bg-gradient-to-r from-indigo-500 to-cyan-600 text-white hover:from-indigo-600 hover:to-cyan-700"
                        onClick={onClose}
                      >
                        {t("upgradeButton")}
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      disabled
                      className="w-full cursor-not-allowed bg-gradient-to-r from-indigo-300 to-cyan-400 text-white opacity-60"
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      {t("upgradeButton")}
                    </Button>
                  )}
                </span>
              </TooltipTrigger>
              {!isVerified && (
                <TooltipContent side="top" className="max-w-[200px] text-center text-xs">
                  Please verify your email to purchase a plan
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          {!isVerified && (
            <>
              {sent ? (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">
                    ✓ {tVerify("sent")}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Check your inbox at <strong>{session?.user?.email}</strong>
                  </p>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleResend}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? tVerify("sending") : tVerify("resend")}
                </Button>
              )}
            </>
          )}
        </div>

        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground text-xs underline transition-colors"
        >
          {t("dismiss")}
        </button>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { authClient, useSession } from "~/lib/auth-client";
import { Button } from "~/components/ui/button";
import { MailCheck, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  onClose: () => void;
}

export function VerifyToGenerateModal({ onClose }: Props) {
  const { data: session } = useSession();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("dashboard.modals.verifyToGenerate");
  const tBanner = useTranslations("dashboard.verifyBanner");

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
          <div className="rounded-full bg-indigo-100 p-4 dark:bg-indigo-900/30">
            <MailCheck className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold">{t("title")}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t("description")}
          </p>
        </div>

        {sent ? (
          <div className="space-y-1 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
              ✓ {tBanner("sent")}
            </p>
            <p className="text-muted-foreground text-xs">
              Check your inbox at <strong>{session?.user?.email}</strong>
            </p>
          </div>
        ) : (
          <Button
            onClick={handleResend}
            disabled={loading}
            className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {loading ? tBanner("sending") : t("resend")}
          </Button>
        )}

        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground text-xs underline transition-colors"
        >
          {t("close")}
        </button>
      </div>
    </div>
  );
}
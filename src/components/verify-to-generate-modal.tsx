"use client";

import { useState } from "react";
import { authClient } from "~/lib/auth-client";
import { useSession } from "~/lib/auth-client";
import { Button } from "~/components/ui/button";
import { MailCheck, X } from "lucide-react";

interface Props {
  onClose: () => void;
}

export function VerifyToGenerateModal({ onClose }: Props) {
  const { data: session } = useSession();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

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
      <div className="relative w-full max-w-md mx-4 rounded-2xl border border-border bg-card p-8 shadow-2xl text-center space-y-5">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex justify-center">
          <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-4">
            <MailCheck className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold">Verify your email to continue</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            You&apos;ve used your free trial credits! Verify your email to keep
            generating voices with Vox AI Studio.
          </p>
        </div>

        {sent ? (
          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 space-y-1">
            <p className="text-green-700 dark:text-green-400 font-medium text-sm">
              ✓ Verification email sent!
            </p>
            <p className="text-muted-foreground text-xs">
              Check your inbox at <strong>{session?.user?.email}</strong>
            </p>
          </div>
        ) : (
          <Button
            onClick={handleResend}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {loading ? "Sending..." : "Send Verification Email"}
          </Button>
        )}

        <button
          onClick={onClose}
          className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}

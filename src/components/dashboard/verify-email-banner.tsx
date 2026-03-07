"use client";

import { useState, useEffect } from "react";
import { X, MailCheck, Loader2 } from "lucide-react";
import { useSession, authClient } from "~/lib/auth-client";
import { toast } from "sonner";

export default function VerifyEmailBanner() {
  const { data: session } = useSession();
  const [dismissed, setDismissed] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const isVerified = session?.user?.emailVerified;

  if (!session || isVerified || dismissed) return null;

  const handleResend = async () => {
    setIsSending(true);
    try {
      await authClient.sendVerificationEmail({
        email: session.user.email,
        callbackURL: "/dashboard",
      });
      toast.success("Verification email sent! Check your inbox.");
    } catch {
      toast.error("Failed to send verification email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative border-b border-amber-200 bg-amber-50 px-4 py-2.5 dark:border-amber-800 dark:bg-amber-950/40">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2 text-amber-800 dark:text-amber-300 sm:items-center">
          <MailCheck className="mt-0.5 h-4 w-4 shrink-0 sm:mt-0" />
          <span className="text-sm">
            Please verify your email to unlock purchases and full access.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleResend}
            disabled={isSending}
            className="flex items-center gap-1.5 rounded-md bg-amber-600 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-amber-700 disabled:opacity-60"
          >
            {isSending ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Sending...
              </>
            ) : (
              "Resend verification email"
            )}
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="text-amber-600 transition-colors hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

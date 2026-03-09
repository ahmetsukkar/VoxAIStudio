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

interface Props {
  onClose: () => void;
}

export function TrialExpiredModal({ onClose }: Props) {
  const { data: session } = useSession();
  const isVerified = session?.user?.emailVerified;

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
      <div className="relative mx-4 w-full max-w-md space-y-5 rounded-2xl border border-border bg-card p-8 text-center shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground absolute top-4 right-4 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-amber-100 p-4 dark:bg-amber-900/30">
            <Clock className="h-10 w-10 text-amber-600 dark:text-amber-400" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Your Free Trial has expired</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your 7-day trial has ended. Upgrade to a paid plan to keep
            generating speech with Vox AI Studio.
          </p>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          {/* Upgrade button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {/* span wrapper needed so Tooltip works on disabled button */}
                <span className="block w-full">
                  {isVerified ? (
                    <Link href="/api/auth/checkout?slug=start" className="block">
                      <Button
                        className="w-full bg-gradient-to-r from-indigo-500 to-cyan-600 hover:from-indigo-600 hover:to-cyan-700 text-white"
                        onClick={onClose}
                      >
                        Upgrade — starting at $7
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      disabled
                      className="w-full cursor-not-allowed bg-gradient-to-r from-indigo-300 to-cyan-400 opacity-60 text-white"
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Upgrade — starting at $7
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

          {/* Verify button — only shown if NOT verified */}
          {!isVerified && (
            <>
              {sent ? (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">
                    ✓ Verification email sent!
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Check your inbox at{" "}
                    <strong>{session?.user?.email}</strong>
                  </p>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleResend}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Sending..." : "Verify Email First"}
                </Button>
              )}
            </>
          )}
        </div>

        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground text-xs underline transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}

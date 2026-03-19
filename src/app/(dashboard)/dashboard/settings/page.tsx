"use client";

import {
  RedirectToSignIn,
  SecuritySettingsCards,
  SignedIn,
  UpdateNameCard,
} from "@daveyplate/better-auth-ui";
import { Loader2, MailCheck, ShieldCheck } from "lucide-react";
import { authClient, useSession } from "~/lib/auth-client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

function EmailVerificationCard() {
  const { data: session } = useSession();
  const [isSending, setIsSending] = useState(false);

  const isVerified = session?.user?.emailVerified;

  if (!session) return null;

  const handleResend = async () => {
    setIsSending(true);
    try {
      await authClient.sendVerificationEmail({
        email: session.user.email,
        callbackURL: "/dashboard",
      });
      toast.success("Verification email sent! Check your inbox.");
    } catch {
      toast.error("Failed to send. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <MailCheck className="h-5 w-5" />
          Email Verification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-muted-foreground text-sm">
              {session.user.email}
            </p>
            {isVerified ? (
              <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400">
                <ShieldCheck className="h-4 w-4" />
                Your email is verified
              </p>
            ) : (
              <p className="mt-1 text-sm font-medium text-amber-600 dark:text-amber-400">
                ⚠️ Not verified — verify to unlock purchases
              </p>
            )}
          </div>
          {!isVerified && (
            <Button
              size="sm"
              onClick={handleResend}
              disabled={isSending}
              className="w-full bg-purple-600 hover:bg-purple-700 sm:w-auto sm:shrink-0"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Sending...
                </>
              ) : (
                "Resend verification email"
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function SettingPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        await authClient.getSession();
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    void checkSession();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            Loading your settings...
          </p>
        </div>
      </div>
    );
  }
  return (
    <>
      <RedirectToSignIn />
      <SignedIn>
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent">
              Account Settings
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your account preferences and security settings
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-6">
            <EmailVerificationCard />

            <div className="w-full max-w-2xl [&_button[type='submit']]:border-0 [&_button[type='submit']]:bg-purple-600 [&_button[type='submit']]:text-white [&_button[type='submit']:hover]:bg-purple-700">
              <UpdateNameCard />
            </div>

            <div className="w-full max-w-2xl overflow-hidden [&_*]:min-w-0 [&_*]:break-all [&_button[type='submit']]:border-0 [&_button[type='submit']]:bg-purple-600 [&_button[type='submit']]:text-white [&_button[type='submit']:hover]:bg-purple-700">
              <SecuritySettingsCards className="w-full max-w-2xl" />
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  );
}

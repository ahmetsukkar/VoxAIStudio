"use client";

import { useEffect } from "react";
import { authClient } from "~/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectToPricing = searchParams.get("upgrade") === "true";
  const postAuthUrl = redirectToPricing
    ? "/dashboard?upgrade=true"
    : "/dashboard";

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const session = await authClient.getSession();

        if (!session?.data?.user) {
          console.log("No session found");
          router.push("/auth/sign-in");
          return;
        }

        const user = session?.data?.user;
        console.log("User session:", user);

        if (user.createdAt) {
          const accountCreatedAt = new Date(user.createdAt);
          const now = new Date();
          const accountAgeInSeconds =
            (now.getTime() - accountCreatedAt.getTime()) / 1000;

          console.log("Account age:", accountAgeInSeconds, "seconds");

          if (accountAgeInSeconds < 10) {
            console.log("New account detected - deleting user");
            try {
              const response = await fetch("/api/auth/delete-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id }),
              });

              if (response.ok) {
                console.log("User deleted successfully");
              } else {
                console.error("Failed to delete user");
              }
            } catch (deleteError) {
              console.error("Error deleting user:", deleteError);
              await authClient.signOut();
            }

            router.push("/auth/sign-in?error=no-account");
            return;
          }
        }

        console.log("Existing user - redirecting to dashboard");
        router.push(postAuthUrl);
      } catch (err) {
        console.error("Callback error:", err);
        router.push("/auth/sign-in?error=auth-failed");
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="border-primary mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-r-transparent"></div>
        <h2 className="text-xl font-semibold">Verifying your account...</h2>
        <p className="text-muted-foreground mt-2">Please wait</p>
      </div>
    </div>
  );
}

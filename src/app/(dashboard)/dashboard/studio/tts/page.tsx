"use client";

import { RedirectToSignIn, SignedIn } from "@daveyplate/better-auth-ui";
import TTSStudio from "~/components/studio/tts/tts-studio";

export default function TTSPage() {
  return (
    <>
      <RedirectToSignIn />
      <SignedIn>
        <div className="mx-auto max-w-7xl px-2 sm:px-4">
          <TTSStudio />
        </div>
      </SignedIn>
    </>
  );
}
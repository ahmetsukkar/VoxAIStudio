"use client";

import { RedirectToSignIn, SignedIn } from "@daveyplate/better-auth-ui";
import DialogueStudio from "~/components/studio/dialogue/dialogue-studio";

export default function DialoguePage() {
  return (
    <>
      <RedirectToSignIn />
      <SignedIn>
        <div className="mx-auto max-w-7xl px-2 sm:px-4">
          <DialogueStudio />
        </div>
      </SignedIn>
    </>
  );
}
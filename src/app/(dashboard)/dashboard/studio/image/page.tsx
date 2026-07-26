"use client";

import { RedirectToSignIn, SignedIn } from "@daveyplate/better-auth-ui";
import { ImageIcon } from "lucide-react";

export default function ImagePage() {
  return (
    <>
      <RedirectToSignIn />
      <SignedIn>
        <div className="mx-auto max-w-7xl px-2 sm:px-4">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ImageIcon className="size-12 text-muted-foreground mb-4" />
            <h1 className="text-xl font-semibold">Image Generator</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              AI image generation is coming soon. The database and architecture are ready — UI implementation is next.
            </p>
          </div>
        </div>
      </SignedIn>
    </>
  );
}
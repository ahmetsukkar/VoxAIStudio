"use client";

import { RedirectToSignIn, SignedIn } from "@daveyplate/better-auth-ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import TTSStudio from "~/components/studio/tts/tts-studio";
import DialogueStudio from "~/components/studio/dialogue/dialogue-studio";

export default function StudioPage() {
  return (
    <>
      <RedirectToSignIn />
      <SignedIn>
        <div className="mx-auto max-w-7xl px-2 sm:px-4">
          <Tabs defaultValue="tts">
            <div className="border-b border-gray-200 bg-white py-2">
              <TabsList className="mx-auto flex w-fit">
                <TabsTrigger value="tts">🎙️ Text to Speech</TabsTrigger>
                <TabsTrigger value="dialogue">🎭 Dialogue Studio</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="tts">
              <TTSStudio />
            </TabsContent>
            <TabsContent value="dialogue">
              <DialogueStudio />
            </TabsContent>
          </Tabs>
        </div>
      </SignedIn>
    </>
  );
}

/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  S3_BUCKET_URL,
  type GenerateSpeechResult,
  type ChatterboxRequestOptions,
  type TTSProvider,
  type TTSOptions,
} from "./base-tts-provider";
import { headers } from "next/headers";
import { db } from "~/server/db";
import { auth } from "~/lib/auth";
import { env } from "~/env";
import { calcChatterboxCredits } from "~/lib/credits/calculate";

export class ChatterboxProvider implements TTSProvider {
  getCredits(options: TTSOptions): number {
    const o = options as ChatterboxRequestOptions;
    return calcChatterboxCredits(o.text?.length ?? 0);
  }

  async generateSpeech(data: TTSOptions): Promise<GenerateSpeechResult> {
    // Cast to the correct type for this engine
    const options = data as ChatterboxRequestOptions;

    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
      }

      if (!options.text || !options.voice_S3_key || !options.language) {
        return { success: false, error: "Missing required fields" };
      }

      const creditsNeeded = this.getCredits(options);
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { credits: true },
      });

      if (!user) {
        return { success: false, error: "User not found" };
      }

      if (Number(user.credits) < creditsNeeded) {
        return {
          success: false,
          error: `Insufficient credits. Need ${creditsNeeded}, have ${user.credits}`,
        };
      }

      const response = await fetch(env.MODAL_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Modal-Key": env.MODAL_API_KEY,
          "Modal-Secret": env.MODAL_API_SECRET,
        },
        body: JSON.stringify({
          text: options.text,
          voice_S3_key: options.voice_S3_key,
          language: options.language,
          exaggeration: options.exaggeration ?? 0.5,
          cfg_weight: options.cfg_weight ?? 0.5,
        }),
      });

      if (!response.ok) {
        return { success: false, error: "Failed to generate speech" };
      }

      const result = (await response.json()) as { s3_Key: string };
      const audioUrl = `${S3_BUCKET_URL}/${result.s3_Key}`;

      await db.user.update({
        where: { id: session.user.id },
        data: { credits: { decrement: creditsNeeded } },
      });

      const audioProject = await db.audioProject.create({
        data: {
          text: options.text,
          audioUrl,
          s3Key: result.s3_Key,
          language: options.language,
          voiceS3Key: options.voice_S3_key,
          engine: "chatterbox",
          exaggeration: options.exaggeration,
          cfgWeight: options.cfg_weight,
          userId: session.user.id,
        },
      });

      return {
        success: true,
        s3_key: result.s3_Key,
        audioUrl,
        projectId: audioProject.id,
      };
    } catch (error) {
      console.error("Speech generation error:", error);
      return { success: false, error: "Internal server error" };
    }
  }

  getName(): string {
    return "chatterbox";
  }
}

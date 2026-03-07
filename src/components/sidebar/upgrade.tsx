"use client";

import { authClient, useSession } from "~/lib/auth-client";
import { Button } from "../ui/button";
import { Crown, AudioWaveform, Lock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export default function Upgrade() {
  const { data: session } = useSession();
  const isVerified = session?.user?.emailVerified;

  const upgrade = async () => {
    await authClient.checkout({
      products: [
        "b3e419e7-3a7e-4c06-8859-fb4d03ef99ec",
        "a17bb07f-8d75-46fe-9b18-04ae2ea46474",
        "faf28a2b-eee3-4091-85b0-d3565552db7e",
      ],
    });
  };

  if (!isVerified) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                variant="outline"
                size="sm"
                disabled
                className="group relative ml-2 overflow-hidden border-muted-foreground/20 bg-muted/30 text-muted-foreground cursor-not-allowed opacity-60"
              >
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span className="font-medium">Upgrade</span>
                </div>
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[200px] text-center text-xs">
            Please verify your email to purchase credits
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="group relative ml-2 overflow-hidden border-orange-400/50 bg-gradient-to-r from-orange-400/10 to-pink-500/10 text-orange-400 transition-all duration-300 hover:border-orange-500/70 hover:bg-gradient-to-r hover:from-orange-500 hover:to-pink-600 hover:text-white hover:shadow-lg hover:shadow-orange-500/25"
      onClick={upgrade}
    >
      <div className="flex items-center gap-2">
        <Crown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
        <span className="font-medium">Upgrade</span>
        <AudioWaveform className="h-3 w-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-orange-400/20 to-pink-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </Button>
  );
}

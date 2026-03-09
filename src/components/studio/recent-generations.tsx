"use client";

import { useEffect, useState, useCallback } from "react";
import { Music, Play, Download, Loader2, Pause, ArrowRight, Mic } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getRecentGenerations, type EngineGroup } from "~/actions/tts";
import type { AudioProject } from "@prisma/client";
import { audioManager } from "~/lib/audio/audio-manager";

interface RecentGenerationsProps {
  group: EngineGroup;
  refreshTrigger?: number;
  mode?: "cards" | "list";
  limit?: number;
  showHeader?: boolean;
}

export default function RecentGenerations({
  group,
  refreshTrigger = 0,
  mode = "cards",
  limit = 4,
  showHeader = true,
}: RecentGenerationsProps) {
  const [projects, setProjects] = useState<AudioProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const router = useRouter();

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    const result = await getRecentGenerations(group, limit);
    if (result.success) setProjects(result.projects);
    setIsLoading(false);
  }, [group, limit]);

  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects, refreshTrigger]);

  const handlePlay = (project: AudioProject) => {
    if (playingId === project.id) {
      audioManager.stopAll();
      setPlayingId(null);
      return;
    }
    const audio = new Audio(project.audioUrl);
    audioManager.register(audio, () => setPlayingId(null));
    setPlayingId(project.id);
    void audio.play();
    audio.onended = () => setPlayingId(null);
  };

  const handleDownload = (project: AudioProject) => {
    window.open(project.audioUrl, "_blank");
  };

  const headerTitle =
    group === "Dialogue"
      ? "Recent Generations"
      : group === "TTS"
        ? "Recent Generations"
        : "Recent Audio Projects";

  const headerSub =
    group === "Dialogue"
      ? "Your multi-speaker generation history"
      : group === "TTS"
        ? "Your speech generation history"
        : "Your latest generated audio";

  const emptyState = (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="border-muted bg-muted/20 mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed">
        <Music className="text-muted-foreground h-8 w-8" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">No audio projects yet</h3>
      <p className="text-muted-foreground mb-4 text-sm">
        {group === "Dialogue"
          ? "Start by creating your first multi-speaker audio"
          : "Start generating speech with AI voice cloning"}
      </p>
      <Button
        onClick={() => router.push("/dashboard/studio")}
        className="gap-2 bg-purple-600 hover:bg-purple-700"
      >
        <Mic className="h-4 w-4" />
        Create Your First Audio
      </Button>
    </div>
  );

  if (mode === "list") {
    return (
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          emptyState
        ) : (
          <>
            {projects.map((project) => (
              <div
                key={project.id}
                className="group hover:bg-muted/50 flex items-center gap-3 rounded-lg border p-3 transition-all hover:shadow-sm sm:gap-4 sm:p-4"
              >
                {/* Icon */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 sm:h-12 sm:w-12">
                  <Music className="h-5 w-5 text-purple-600 sm:h-6 sm:w-6" />
                </div>

                {/* Text info */}
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-medium">
                    {project.text}
                  </p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                    <span className="bg-muted rounded px-1.5 py-0.5 text-[10px] font-medium uppercase">
                      {project.language}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {new Date(project.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions — stack on mobile, row on desktop */}
                <div className="flex shrink-0 items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handlePlay(project)}
                  >
                    {playingId === project.id ? (
                      <Pause className="h-3.5 w-3.5" />
                    ) : (
                      <Play className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleDownload(project)}
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="pt-1 text-right">
              <Link
                href="/dashboard/projects"
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm hover:underline"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </>
        )}
      </div>
    );
  }

  // ── CARDS MODE
  return (
    <div className="border-t border-gray-200 bg-white px-2 py-3 sm:px-4 sm:py-4">
      <div className="mx-auto max-w-7xl">
        {showHeader && (
          <div className="mb-6 text-center">
            <div className="mb-2 inline-flex items-center gap-2">
              <div className="h-6 w-0.5 rounded-full bg-gradient-to-b from-blue-500 to-purple-600" />
              <h2 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-xl font-bold text-transparent">
                {headerTitle}
              </h2>
              <div className="h-6 w-0.5 rounded-full bg-gradient-to-b from-purple-600 to-blue-500" />
            </div>
            <p className="text-muted-foreground mx-auto max-w-md text-sm">
              {headerSub}
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          </div>
        ) : projects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                        <Music className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-900">
                          {project.language?.toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(project.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="mb-3 line-clamp-3 text-xs text-gray-700">
                    {project.text}
                  </p>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handlePlay(project)}
                      variant="outline"
                      size="sm"
                      className="h-7 flex-1 gap-1 px-2 text-xs"
                    >
                      {playingId === project.id ? (
                        <Pause className="h-3 w-3" />
                      ) : (
                        <Play className="h-3 w-3" />
                      )}
                      {playingId === project.id ? "Pause" : "Play"}
                    </Button>
                    <Button
                      onClick={() => handleDownload(project)}
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1 px-2 text-xs"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/dashboard/projects"
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm underline-offset-4 hover:underline"
              >
                View all in Projects →
              </Link>
            </div>
          </>
        ) : (
          <div className="py-16 text-center">
            <div className="relative mx-auto mb-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-32 w-32 animate-pulse rounded-full bg-gradient-to-br from-blue-100 to-purple-100" />
              </div>
              <div className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-white shadow-lg">
                <Music className="h-10 w-10 text-gray-400" />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900">No generations yet</h3>
              <p className="text-muted-foreground mx-auto max-w-md text-lg leading-relaxed">
                {group === "Dialogue"
                  ? "Start by creating your first multi-speaker audio"
                  : "Start by entering some text and generating your first speech"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

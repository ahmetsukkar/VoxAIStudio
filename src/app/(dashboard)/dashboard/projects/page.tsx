"use client";

import { RedirectToSignIn, SignedIn } from "@daveyplate/better-auth-ui";
import {
  Loader2,
  Search,
  Calendar,
  Music,
  Trash2,
  Download,
  Plus,
  Mic,
  Globe,
  Zap,
  MessageSquare,
  ChevronDown,
  Coins,
} from "lucide-react";
import { authClient } from "~/lib/auth-client";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  getUserAudioProjects,
  deleteAudioProject,
  getAudioProjectsMeta,
} from "~/actions/tts";
import type { AudioProjectFilters } from "~/actions/tts";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRouter } from "next/navigation";
import type { AudioProject } from "@prisma/client";
import { LanguageLabelMap } from "~/data/GeminiOptions";

type SortBy = "newest" | "oldest" | "name";

// ── Engine helpers ────────────────────────────────────────────────────────────

function getEngineLabel(engine: string): string {
  if (engine === "chatterbox") return "Voice Cloning";
  if (engine === "gemini-2.5-flash-preview-tts") return "AI Voice · Flash";
  if (engine === "gemini-2.5-pro-preview-tts") return "AI Voice · Pro";
  return engine;
}

function getTypeLabel(name: string | null): "TTS" | "Dialogue" {
  return name === "Dialogue" ? "Dialogue" : "TTS";
}

function TypeBadge({ name }: { name: string | null }) {
  const type = getTypeLabel(name);
  const styles =
    type === "Dialogue"
      ? "bg-purple-100 text-purple-700 border-purple-200"
      : "bg-blue-100 text-blue-700 border-blue-200";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${styles}`}
    >
      {type}
    </span>
  );
}

function ModelBadge({ engine }: { engine: string }) {
  const label = getEngineLabel(engine);
  const styles =
    engine === "chatterbox"
      ? "bg-orange-100 text-orange-700 border-orange-200"
      : "bg-green-100 text-green-700 border-green-200";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${styles}`}
    >
      {label}
    </span>
  );
}

function DetailTag({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="text-muted-foreground inline-flex items-center gap-1 text-xs capitalize">
      {icon}
      {label}
    </span>
  );
}

function ProjectDetails({ project }: { project: AudioProject }) {
  const isDialogue = getTypeLabel(project.name) === "Dialogue";
  const isChatterbox = project.engine === "chatterbox";

  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
      <TypeBadge name={project.name} />
      <ModelBadge engine={project.engine} />

      {project.language && project.language !== "autodetect" && (
        <DetailTag
          icon={<Globe className="h-3 w-3" />}
          label={project.language.toUpperCase()}
        />
      )}

      {project.geminiVoice && (
        <DetailTag
          icon={<Mic className="h-3 w-3" />}
          label={project.geminiVoice}
        />
      )}

      {!isChatterbox && (
        <>
          {project.geminiEmotion && !isDialogue && (
            <DetailTag
              icon={<span className="text-[10px]">😊</span>}
              label={project.geminiEmotion}
            />
          )}
          {project.geminiStyle && (
            <DetailTag
              icon={<MessageSquare className="h-3 w-3" />}
              label={project.geminiStyle}
            />
          )}
          {project.geminiPace && (
            <DetailTag
              icon={<Zap className="h-3 w-3" />}
              label={project.geminiPace}
            />
          )}
        </>
      )}

      {isChatterbox && (
        <>
          {project.exaggeration != null && (
            <DetailTag
              icon={<span className="text-[10px]">📊</span>}
              label={`Exag: ${project.exaggeration}`}
            />
          )}
          {project.cfgWeight != null && (
            <DetailTag
              icon={<span className="text-[10px]">⚙️</span>}
              label={`CFG: ${project.cfgWeight}`}
            />
          )}
        </>
      )}

      {project.creditsSpent != null && (
        <DetailTag
          icon={<Coins className="h-3 w-3" />}
          label={`${project.creditsSpent} credits`}
        />
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Projects() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [audioProjects, setAudioProjects] = useState<AudioProject[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const [allEngines, setAllEngines] = useState<string[]>([]);
  const [allLanguages, setAllLanguages] = useState<string[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [filterType, setFilterType] = useState("all");
  const [filterEngine, setFilterEngine] = useState("all");
  const [filterLanguage, setFilterLanguage] = useState("all");

  const router = useRouter();
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(value);
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const activeFilters: AudioProjectFilters = {
    type: filterType,
    engine: filterEngine,
    language: filterLanguage,
    search: debouncedSearch,
    sortBy,
  };

  // ── Initial load: meta + first page ──
  useEffect(() => {
    const init = async () => {
      try {
        await authClient.getSession();
        const [result, meta] = await Promise.all([
          getUserAudioProjects(undefined, {
            type: "all",
            engine: "all",
            language: "all",
            search: "",
            sortBy: "newest",
          }),
          getAudioProjectsMeta(),
        ]);
        if (result.success) {
          setAudioProjects(result.audioProjects);
          setNextCursor(result.nextCursor);
          setTotalCount(result.totalCount);
        }
        if (meta.success) {
          setAllEngines(meta.engines);
          setAllLanguages(meta.languages);
        }
      } catch (error) {
        console.error("Initialization failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    void init();
  }, []);

  // ── Re-fetch on filter change — uses isFiltering, NOT isLoading ──
  useEffect(() => {
    if (isLoading) return;

    const fetchFiltered = async () => {
      setIsFiltering(true);
      try {
        const result = await getUserAudioProjects(undefined, activeFilters);
        if (result.success) {
          setAudioProjects(result.audioProjects);
          setNextCursor(result.nextCursor);
          setTotalCount(result.totalCount);
        }
      } catch (error) {
        console.error("Filter fetch failed:", error);
      } finally {
        setIsFiltering(false);
      }
    };
    void fetchFiltered();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, filterEngine, filterLanguage, sortBy, debouncedSearch]);

  // ── Load more ──
  const handleLoadMore = useCallback(async () => {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const result = await getUserAudioProjects(nextCursor, activeFilters);
      if (result.success) {
        setAudioProjects((prev) => [...prev, ...result.audioProjects]);
        setNextCursor(result.nextCursor);
      }
    } catch (error) {
      console.error("Load more failed:", error);
    } finally {
      setIsLoadingMore(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    nextCursor,
    isLoadingMore,
    filterType,
    filterEngine,
    filterLanguage,
    sortBy,
    debouncedSearch,
  ]);

  const hasActiveFilters =
    filterType !== "all" ||
    filterEngine !== "all" ||
    filterLanguage !== "all" ||
    searchQuery !== "";

  const clearFilters = () => {
    setFilterType("all");
    setFilterEngine("all");
    setFilterLanguage("all");
    setSearchQuery("");
    setDebouncedSearch("");
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
  };

  const handleDelete = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this audio project?")) return;
    const result = await deleteAudioProject(projectId);
    if (result.success) {
      setAudioProjects((prev) => prev.filter((p) => p.id !== projectId));
      setTotalCount((prev) => prev - 1);
    }
  };

  const handleDownload = (audioUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `audio-${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const engineOptions = allEngines.map((e) => ({
    value: e,
    label: getEngineLabel(e),
  }));
  const languageOptions = allLanguages.map((l) => ({
    value: l,
    label: LanguageLabelMap[l] ?? l.toUpperCase(),
  }));

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            Loading your projects...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <RedirectToSignIn />
      <SignedIn>
        <div className="space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
                Your Audio Projects
              </h1>
              <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
                {isFiltering && <Loader2 className="h-3 w-3 animate-spin" />}
                {hasActiveFilters
                  ? `${audioProjects.length} of ${totalCount} audios (filtered)`
                  : `${totalCount} ${totalCount === 1 ? "audio" : "audios"}${nextCursor ? " · load more below" : ""}`}
              </p>
            </div>
            <Button
              onClick={() => router.push("/dashboard/studio")}
              className="gap-2 self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              New Audio
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col gap-3">
                <div className="relative w-full">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    placeholder="Search by text..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-9"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="border-input bg-background flex-1 rounded-md border px-3 py-2 text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="TTS">TTS</option>
                    <option value="Dialogue">Dialogue</option>
                  </select>

                  {engineOptions.length > 0 && (
                    <select
                      value={filterEngine}
                      onChange={(e) => setFilterEngine(e.target.value)}
                      className="border-input bg-background flex-1 rounded-md border px-3 py-2 text-sm"
                    >
                      <option value="all">All Models</option>
                      {engineOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {languageOptions.length > 0 && (
                    <select
                      value={filterLanguage}
                      onChange={(e) => setFilterLanguage(e.target.value)}
                      className="border-input bg-background flex-1 rounded-md border px-3 py-2 text-sm"
                    >
                      <option value="all">All Languages</option>
                      {languageOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  )}

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="border-input bg-background flex-1 rounded-md border px-3 py-2 text-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name">Text A-Z</option>
                  </select>

                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-muted-foreground"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Empty state */}
          {audioProjects.length === 0 && !isFiltering ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="border-muted bg-muted/20 mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed">
                  <Music className="text-muted-foreground h-10 w-10" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  {hasActiveFilters
                    ? "No audio matches your filters"
                    : "No audio projects yet"}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md text-sm">
                  {hasActiveFilters
                    ? "Try adjusting or clearing your filters."
                    : "Start creating text-to-speech audio to see them here."}
                </p>
                {hasActiveFilters ? (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="gap-2"
                  >
                    Clear Filters
                  </Button>
                ) : (
                  <Button
                    onClick={() => router.push("/dashboard/studio")}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create Your First Audio
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <div
                className={
                  isFiltering
                    ? "pointer-events-none opacity-50 transition-opacity duration-150"
                    : "transition-opacity duration-150"
                }
              >
                <div className="space-y-3">
                  {audioProjects.map((project) => (
                    <Card
                      key={project.id}
                      className="group transition-all hover:shadow-md"
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                            <Music className="text-muted-foreground h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-sm font-medium text-gray-900">
                              {project.text}
                            </p>
                            <ProjectDetails project={project} />
                            <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                              <Calendar className="h-3 w-3" />
                              {new Date(project.createdAt).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <audio
                            controls
                            className="h-8 flex-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <source src={project.audioUrl} type="audio/wav" />
                          </audio>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 shrink-0 p-0"
                            onClick={(e) => handleDownload(project.audioUrl, e)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive h-8 w-8 shrink-0 p-0"
                            onClick={(e) => void handleDelete(project.id, e)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Load More */}
              {nextCursor && (
                <div className="flex justify-center pt-2">
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="gap-2"
                  >
                    {isLoadingMore ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    {isLoadingMore ? "Loading..." : "Load More"}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </SignedIn>
    </>
  );
}

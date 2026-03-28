"use client";

import { RedirectToSignIn, SignedIn } from "@daveyplate/better-auth-ui";
import {
  Loader2,
  AudioWaveform,
  Calendar,
  TrendingUp,
  Star,
  ArrowRight,
  Music,
  Mic,
  Settings,
} from "lucide-react";
import { authClient } from "~/lib/auth-client";
import { useEffect, useState } from "react";
import { getAudioProjectsMeta } from "~/actions/tts";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import RecentGenerations from "~/components/studio/recent-generations";
import { useTranslations, useLocale } from "next-intl";

interface UserStats {
  totalAudioProjects: number;
  thisMonth: number;
  thisWeek: number;
}

export default function Dashboard() {
  const t = useTranslations("dashboard.page");
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats>({
    totalAudioProjects: 0,
    thisMonth: 0,
    thisWeek: 0,
  });
  const [user, setUser] = useState<{
    name?: string;
    createdAt?: string | Date;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const [sessionResult, meta] = await Promise.all([
          authClient.getSession(),
          getAudioProjectsMeta(),
        ]);

        if (sessionResult?.data?.user) {
          setUser(sessionResult.data.user);
        }

        if (meta.success) {
          setUserStats({
            totalAudioProjects: meta.totalCount,
            thisMonth: 0,
            thisWeek: 0,
          });
        }
      } catch (error) {
        console.error("Dashboard initialization failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void initializeDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">{t("loading")}</p>
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
          <div className="space-y-1">
            <h1 className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
              {t("welcome")}{user?.name ? `, ${user.name}` : ""}!
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              {t("subtitle")}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium sm:text-sm">
                  {t("stats.totalAudio")}
                </CardTitle>
                <Music className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-purple-600 sm:text-2xl">
                  {userStats.totalAudioProjects}
                </div>
                <p className="text-muted-foreground text-xs">{t("stats.ttsGenerations")}</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium sm:text-sm">
                  {t("stats.thisMonth")}
                </CardTitle>
                <Calendar className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-blue-600 sm:text-2xl">
                  {userStats.thisMonth}
                </div>
                <p className="text-muted-foreground text-xs">{t("stats.projectsCreated")}</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium sm:text-sm">
                  {t("stats.thisWeek")}
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-green-600 sm:text-2xl">
                  {userStats.thisWeek}
                </div>
                <p className="text-muted-foreground text-xs">{t("stats.recentActivity")}</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium sm:text-sm">
                  {t("stats.memberSince")}
                </CardTitle>
                <Star className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-yellow-600 sm:text-2xl">
                  {user?.createdAt
                    ? new Date(
                        user.createdAt as string | number | Date,
                      ).toLocaleDateString(locale, {
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </div>
                <p className="text-muted-foreground text-xs">{t("stats.accountCreated")}</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <AudioWaveform className="text-primary h-5 w-5" />
                {t("quickActions.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                <Button
                  onClick={() => router.push("/dashboard/studio")}
                  className="group h-auto flex-col gap-2 bg-purple-600 p-4 hover:bg-purple-700 sm:p-6"
                >
                  <Mic className="h-6 w-6 transition-transform group-hover:scale-110 sm:h-8 sm:w-8" />
                  <div className="text-center">
                    <div className="text-sm font-semibold sm:text-base">
                      {t("quickActions.tts")}
                    </div>
                    <div className="text-xs opacity-80">
                      {t("quickActions.ttsDesc")}
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => router.push("/dashboard/projects")}
                  variant="outline"
                  className="group hover:bg-muted h-auto flex-col gap-2 p-4 sm:p-6"
                >
                  <Music className="h-6 w-6 transition-transform group-hover:scale-110 sm:h-8 sm:w-8" />
                  <div className="text-center">
                    <div className="text-sm font-semibold sm:text-base">
                      {t("quickActions.viewAudio")}
                    </div>
                    <div className="text-xs opacity-70">
                      {t("quickActions.viewAudioDesc")}
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => router.push("/dashboard/settings")}
                  variant="outline"
                  className="group hover:bg-muted h-auto flex-col gap-2 p-4 sm:p-6"
                >
                  <Settings className="h-6 w-6 transition-transform group-hover:scale-110 sm:h-8 sm:w-8" />
                  <div className="text-center">
                    <div className="text-sm font-semibold sm:text-base">
                      {t("quickActions.settings")}
                    </div>
                    <div className="text-xs opacity-70">
                      {t("quickActions.settingsDesc")}
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Projects */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Music className="h-5 w-5 text-purple-600" />
                {t("recentProjects.title")}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard/projects")}
                className="gap-1 text-purple-600 hover:text-purple-700"
              >
                {t("recentProjects.viewAll")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <RecentGenerations
                group="all"
                mode="list"
                limit={5}
                showHeader={false}
              />
            </CardContent>
          </Card>
        </div>
      </SignedIn>
    </>
  );
}
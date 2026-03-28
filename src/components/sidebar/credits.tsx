"use client";

import { HandCoins } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserCredits } from "~/actions/tts";
import { getUserPlanStatus } from "~/actions/user-plan";
import { useCreditsStore } from "~/store/credits-store";
import { usePlanStore } from "~/store/plan-store";
import { useTranslations } from "next-intl";

export default function Credits() {
  const { credits, setCredits } = useCreditsStore();
  const { setPlan } = usePlanStore();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("dashboard.sidebar");

  useEffect(() => {
    setMounted(true);

    getUserCredits()
      .then((r) => {
        if (r.success) setCredits(r.credits);
      })
      .catch(console.error);

    getUserPlanStatus()
      .then((r) => {
        if (r.success && r.plan) setPlan(r.plan);
      })
      .catch(console.error);
  }, [setCredits, setPlan]);

  return (
    <div className="group flex items-center gap-2">
      <div className="flex items-center gap-1.5">
        <HandCoins className="h-6 w-6 text-yellow-500 transition-colors duration-200 group-hover:text-yellow-400" />
        <div className="flex flex-col">
          <span className="text-foreground text-sm font-bold transition-colors duration-200 group-hover:text-yellow-600">
            {mounted ? (credits ?? "...") : "..."}
          </span>
          <span className="text-muted-foreground text-xs leading-tight">
            {t("credits")}
          </span>
        </div>
      </div>
    </div>
  );
}
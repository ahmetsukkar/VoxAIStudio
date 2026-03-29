"use client";

import { Button } from "../ui/button";
import { Crown, AudioWaveform } from "lucide-react";
import { useState } from "react";
import PricingModal from "~/components/pricing-modal";
import { useTranslations } from "next-intl";

export default function Upgrade() {
  const [modalOpen, setModalOpen] = useState(false);
  const t = useTranslations("dashboard.sidebar");

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="group relative ml-2 overflow-hidden border-orange-400/50 bg-gradient-to-r from-orange-400/10 to-pink-500/10 text-orange-400 transition-all duration-300 hover:border-orange-500/70 hover:bg-gradient-to-r hover:from-orange-500 hover:to-pink-600 hover:text-white hover:shadow-lg hover:shadow-orange-500/25"
        onClick={() => setModalOpen(true)}
      >
        <div className="flex items-center gap-2">
          <Crown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
          <span className="font-medium">{t("upgrade")}</span>
          <AudioWaveform className="h-3 w-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-orange-400/20 to-pink-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Button>

      <PricingModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
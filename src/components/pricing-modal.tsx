"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import PricingCards from "~/components/pricing-cards";
import { useTranslations, useLocale } from "next-intl";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function PricingModal({ open, onClose }: Props) {
  const t = useTranslations("home.pricing.modal");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="flex max-h-[90vh] w-full !max-w-5xl flex-col p-0"
        style={{ overflow: "hidden" }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-2">
          <DialogTitle className="text-center text-2xl font-bold text-slate-800">
            {t("title")}
          </DialogTitle>
          <p className="mt-1 text-center text-sm text-slate-500">
            {t("subtitle")}
          </p>
        </DialogHeader>
        <div
          className="flex-1 px-6 pb-6"
          style={{ overflowX: "hidden", overflowY: "auto", paddingTop: "16px" }}
        >
          <PricingCards variant="modal" />
        </div>
      </DialogContent>
    </Dialog>
  );
}

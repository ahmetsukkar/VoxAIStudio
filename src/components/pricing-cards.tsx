"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, MailWarning } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { PLANS } from "~/config/plans";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import AuthCTA from "~/components/auth-cta";
import PricingButton from "~/components/pricing-button";
import Image from "next/image";
import { authClient, useSession } from "~/lib/auth-client";

type Props = {
  variant: "page" | "modal";
};

export default function PricingCards({ variant }: Props) {
  const { data: session } = useSession();
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [resendSent, setResendSent] = useState(false);
  const isVerified = session?.user?.emailVerified;
  const t = useTranslations("home.pricing");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const handleBuy = async (productId: string, slug: string) => {
    if (!session?.user || !isVerified) return;
    setLoadingSlug(slug);
    await authClient.checkout({ products: [productId] });
    setLoadingSlug(null);
  };

  const handleResend = async () => {
    await authClient.sendVerificationEmail({
      email: session?.user?.email ?? "",
      callbackURL: "/dashboard?upgrade=true",
    });
    setResendSent(true);
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {variant === "modal" && !isVerified && (
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <MailWarning className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
          <div className="flex-1">
            <p className="text-xs font-medium text-amber-800">
              {t("modal.verifyPrompt")}
            </p>
            <p className="mt-0.5 text-xs text-amber-600">
              {t("modal.verifyHint")}
            </p>
            {!resendSent ? (
              <button
                onClick={handleResend}
                className="mt-1 text-xs text-amber-700 underline hover:text-amber-900"
              >
                {t("modal.resendEmail")}
              </button>
            ) : (
              <p className="mt-0.5 text-xs text-emerald-600">
                {t("modal.resendSent")}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Wrapper: for modal we use a row of columns, each column has badge slot + card */}
      <div
        className={
          variant === "modal"
            ? "flex items-stretch gap-4"
            : "grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4"
        }
        style={{ direction: "ltr" }}
      >
        {/* ── FREE TRIAL ── */}
        {variant === "modal" ? (
          <div className="flex min-w-0 flex-1 flex-col pt-4">
            <Card className="relative flex flex-1 flex-col overflow-hidden border-slate-200 bg-white/70 backdrop-blur-sm">
              <CardContent className="flex flex-1 flex-col p-4">
                <div className="mb-3 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                    <Image
                      src="/plans/free.png"
                      alt="Free Trial"
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-center text-sm font-bold text-slate-800">
                  {t("freeTrial.name")}
                </h3>
                <div className="mt-2 text-center">
                  <span className="text-2xl font-bold text-slate-800">
                    {t("freeTrial.price")}
                  </span>
                </div>
                <p className="mt-1 text-center text-xs text-slate-500">
                  {t("freeTrial.period")}
                </p>
                <ul className="mt-3 flex-1 space-y-1.5">
                  {(t.raw("freeTrial.features") as string[]).map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-1.5 text-xs text-slate-700"
                    >
                      <CheckCircle2 className="mt-0.5 h-3 w-3 flex-shrink-0 text-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-3">
                  <AuthCTA
                    label={t("freeTrial.cta")}
                    variant="outline"
                    size="sm"
                    className="w-full font-semibold"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="relative flex flex-col overflow-hidden border-slate-200 bg-white/70 backdrop-blur-sm">
            <CardContent className="flex flex-1 flex-col p-6">
              <h3 className="text-xl font-bold text-slate-800">
                {t("freeTrial.name")}
              </h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-800">
                  {t("freeTrial.price")}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {t("freeTrial.period")}
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {(t.raw("freeTrial.features") as string[]).map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-1.5 text-xs text-slate-700"
                  >
                    <CheckCircle2 className="mt-0.5 h-3 w-3 flex-shrink-0 text-emerald-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-3">
                <AuthCTA
                  label={t("freeTrial.cta")}
                  variant="outline"
                  size="lg"
                  className="w-full font-semibold"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── PAID PLANS ── */}
        {PLANS.map((plan) =>
          variant === "modal" ? (
            <div
              key={plan.slug}
              className="relative flex min-w-0 flex-1 flex-col pt-4"
            >
              {/* Badge floats centered on the top border of the card */}
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 z-10 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-600 px-3 py-1 text-xs font-semibold whitespace-nowrap text-white shadow-md">
                  {t("mostPopular")}
                </div>
              )}
              <Card
                className={`relative flex flex-1 flex-col overflow-hidden bg-white/70 backdrop-blur-sm ${
                  plan.highlight
                    ? "border-2 border-indigo-400 shadow-lg"
                    : "border-slate-200"
                } ${!isVerified ? "opacity-60" : ""}`}
              >
                <CardContent className="flex flex-1 flex-col p-4">
                  <div className="mb-3 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                      <Image
                        src={plan.image}
                        alt={`${plan.name} plan`}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="text-center text-sm font-bold text-slate-800">
                    {t(`${plan.slug}.name`)}
                  </h3>
                  <div className="mt-2 text-center">
                    <span className="text-2xl font-bold text-slate-800">
                      {t(`${plan.slug}.price`)}
                    </span>
                  </div>
                  <p className="mt-1 text-center text-xs text-slate-500">
                    {t(`${plan.slug}.period`)}
                  </p>
                  <ul className="mt-3 flex-1 space-y-1.5">
                    {(t.raw(`${plan.slug}.features`) as string[]).map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-1.5 text-xs text-slate-700"
                      >
                        <CheckCircle2 className="mt-0.5 h-3 w-3 flex-shrink-0 text-emerald-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-3">
                    <Button
                      onClick={() => handleBuy(plan.productId, plan.slug)}
                      disabled={!isVerified || loadingSlug !== null}
                      className="w-full bg-gradient-to-r from-indigo-500 to-cyan-600 text-white hover:from-indigo-600 hover:to-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                      size="sm"
                    >
                      {loadingSlug === plan.slug && (
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      )}
                      {!isVerified
                        ? t("modal.verifyFirst")
                        : t("modal.getplan", { name: t(`${plan.slug}.name`) })}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card
              key={plan.slug}
              className={`relative flex flex-col overflow-hidden bg-white/70 backdrop-blur-sm ${
                plan.highlight
                  ? "border-2 border-indigo-400 shadow-lg"
                  : "border-slate-200"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-cyan-600 px-3 py-1 text-xs font-semibold text-white">
                  {t("mostPopular")}
                </div>
              )}
              <CardContent className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold text-slate-800">
                  {t(`${plan.slug}.name`)}
                </h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-800">
                    {t(`${plan.slug}.price`)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {t(`${plan.slug}.period`)}
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {(t.raw(`${plan.slug}.features`) as string[]).map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-1.5 text-xs text-slate-700"
                    >
                      <CheckCircle2 className="mt-0.5 h-3 w-3 flex-shrink-0 text-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-3">
                  <PricingButton
                    slug={plan.slug}
                    label={t(`${plan.slug}.cta`)}
                    className="w-full bg-gradient-to-r from-indigo-500 to-cyan-600 hover:from-indigo-600 hover:to-cyan-700"
                  />
                </div>
              </CardContent>
            </Card>
          ),
        )}
      </div>
    </div>
  );
}

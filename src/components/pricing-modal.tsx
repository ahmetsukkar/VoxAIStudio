"use client";

import { authClient, useSession } from "~/lib/auth-client";
import { useState } from "react";
import { Loader2, CheckCircle2, MailWarning } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { PLANS } from "~/config/plans";
import Image from "next/image";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function PricingModal({ open, onClose }: Props) {
  const { data: session } = useSession();
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [resendSent, setResendSent] = useState(false);
  const isVerified = session?.user?.emailVerified;

  const handleBuy = async (productId: string, slug: string) => {
    if (!session?.user || !isVerified) return;
    setLoadingSlug(slug);
    await authClient.checkout({ products: [productId] });
    setLoadingSlug(null);
  };

  const handleResendVerification = async () => {
    await authClient.sendVerificationEmail({
      email: session?.user?.email ?? "",
      callbackURL: "/dashboard?upgrade=true",
    });
    setResendSent(true);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[90vh] w-full !max-w-5xl flex-col overflow-hidden p-0">
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4">
          <DialogTitle className="text-center text-2xl font-bold text-slate-800">
            Choose Your Plan
          </DialogTitle>
          <p className="mt-1 text-center text-sm text-slate-500">
            One-time purchase · Credits never expire
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-x-hidden overflow-y-auto px-6 pt-4 pb-6">
          {!isVerified && (
            <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <MailWarning className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800">
                  Please verify your email to purchase credits
                </p>
                <p className="mt-1 text-xs text-amber-600">
                  Check your inbox for a verification link.
                </p>
                {!resendSent ? (
                  <button
                    onClick={handleResendVerification}
                    className="mt-1 text-xs text-amber-700 underline hover:text-amber-900"
                  >
                    Resend verification email
                  </button>
                ) : (
                  <p className="mt-1 text-xs text-emerald-600">
                    ✓ Verification email sent!
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.slug}
                className={`relative flex flex-col rounded-xl border p-5 transition-opacity ${
                  plan.highlight
                    ? "border-2 border-indigo-400 shadow-lg"
                    : "border-slate-200"
                } ${!isVerified ? "opacity-60" : ""}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-600 px-3 py-1 text-xs font-semibold whitespace-nowrap text-white">
                    Most Popular
                  </div>
                )}
                <div className="mb-4">
                  <div className="mb-3 flex justify-center">
                    <Image
                      src={plan.image}
                      alt={`${plan.name} plan`}
                      width={300}
                      height={300}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <h3 className="text-center text-lg font-bold text-slate-800">
                    {plan.name}
                  </h3>
                  <div className="mt-1 flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-slate-800">
                      {plan.price}
                    </span>
                  </div>
                  <p className="mt-2 text-center text-sm text-slate-500">
                    {plan.description}
                  </p>
                </div>
                <ul className="mb-6 flex-1 space-y-2">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleBuy(plan.productId, plan.slug)}
                  disabled={!isVerified || loadingSlug !== null}
                  className="w-full bg-gradient-to-r from-indigo-500 to-cyan-600 text-white hover:from-indigo-600 hover:to-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                  size="lg"
                >
                  {loadingSlug === plan.slug ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {!isVerified ? "Verify Email First" : `Get ${plan.name}`}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { authClient, useSession } from "~/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { getPlanBySlug } from "~/config/plans";
import type { PlanSlug } from "~/config/plans";
import { logCheckoutStarted } from "~/actions/analytics";

type Props = {
  slug: PlanSlug;
  label: string;
  className?: string;
};

export default function PricingButton({ slug, label, className }: Props) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (isPending) return;

    if (!session?.user) {
      router.push("/auth/sign-up?upgrade=true");
      return;
    }

    if (!session.user.emailVerified) {
      router.push("/dashboard?upgrade=true");
      return;
    }

    const plan = getPlanBySlug(slug);
    setLoading(true);
    void logCheckoutStarted(slug);
    await authClient.checkout({ products: [plan.productId] });
    setLoading(false);
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading || isPending}
      size="lg"
      className={className}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {label}
    </Button>
  );
}

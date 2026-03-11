"use client";

import { useSession } from "~/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

type Props = {
  slug: "start" | "creator" | "pro";
  label: string;
  className?: string;
};

export default function PricingButton({ slug, label, className }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!session?.user) {
      // Not logged in → send to sign-in, come back after
      router.push(`/sign-in?callbackURL=/api/auth/checkout?slug=${slug}`);
      return;
    }
    setLoading(true);
    // Logged in → go directly to Polar checkout for this plan only
    router.push(`/api/auth/checkout?slug=${slug}`);
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      size="lg"
      className={className}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
      {label}
    </Button>
  );
}

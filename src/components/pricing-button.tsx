"use client";

import { authClient, useSession } from "~/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const PRODUCT_IDS: Record<string, string> = {
  start: "98eca73c-5de0-4a22-9d46-264554e2326c",
  creator: "c9dac2c1-aa44-4378-90fb-fc845e347493",
  pro: "b0054483-c856-4415-8915-4bda36c3e86d",
};

type Props = {
  slug: "start" | "creator" | "pro";
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
      router.push(`/auth/sign-up?upgrade=true`);
      return;
    }

    if (!session.user.emailVerified) {
      router.push(`/dashboard?upgrade=true`);
      return;
    }

    setLoading(true);
    await authClient.checkout({
      products: [PRODUCT_IDS[slug]!],
    });
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

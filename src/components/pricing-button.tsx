"use client";

import { authClient, useSession } from "~/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

// Replace these with your actual Polar sandbox Product IDs
const PRODUCT_IDS = {
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
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!session?.user) {
      router.push(`/sign-in?callbackURL=/api/auth/checkout?slug=${slug}`);
      return;
    }
    setLoading(true);
    await authClient.checkout({
      products: [PRODUCT_IDS[slug]], // ← only ONE product ID for this plan
    });
    setLoading(false);
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      size="lg"
      className={className}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {label}
    </Button>
  );
}

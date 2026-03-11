"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import PricingModal from "~/components/pricing-modal";

export default function UpgradeModalTrigger() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("upgrade") === "true") {
      setOpen(true);

      router.replace(pathname);
    }
  }, [searchParams, router, pathname]);

  return <PricingModal open={open} onClose={() => setOpen(false)} />;
}

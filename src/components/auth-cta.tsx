"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AudioLines,
  AudioWaveform,
  ArrowRight,
  LayoutDashboard,
  Play,
  Download,
  type LucideIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";

const ICONS: Record<string, LucideIcon> = {
  AudioLines,
  AudioWaveform,
  ArrowRight,
  LayoutDashboard,
  Play,
  Download,
};

interface AuthCTAProps {
  label?: string;
  icon?: keyof typeof ICONS;
  iconPosition?: "left" | "right";
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost" | "secondary";
  className?: string;
  guestHref?: string;
  loggedInHref?: string;
}

export default function AuthCTA({
  label = "Try It Free",
  icon,
  iconPosition = "left",
  size = "default",
  variant = "default",
  className = "",
  guestHref = "/auth/sign-up",
  loggedInHref = "/dashboard",
}: AuthCTAProps) {
  const { data: session } = authClient.useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const href = mounted && session?.user ? loggedInHref : guestHref;
  const Icon = icon ? ICONS[icon] : null;

  return (
    <Link href={href}>
      <Button
        size={size}
        variant={variant}
        className={`cursor-pointer gap-2 ${className}`}
      >
        {Icon && iconPosition === "left" && <Icon className="h-4 w-4" />}
        {label}
        {Icon && iconPosition === "right" && <Icon className="h-4 w-4" />}
      </Button>
    </Link>
  );
}

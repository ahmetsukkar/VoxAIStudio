"use server";

import { UserButton } from "@daveyplate/better-auth-ui";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "../ui/sidebar";
import Link from "next/link";
import { AudioWaveform, Settings, User } from "lucide-react";
import { SidebarMenuItems } from "./sidebar-menu-items";
import MobileSidebarClose from "./mobile-sidebar-close";
import Credits from "./credits";
import Upgrade from "./upgrade";
import { getLocale } from "next-intl/server";
import LanguageSwitcher from "~/components/language-switcher";

export default async function AppSidebar() {
  const locale = await getLocale();
  const isRTL = locale === "ar";

  return (
    <Sidebar
      side={isRTL ? "right" : "left"}
      className="from-background to-muted/20 border-r-0 bg-gradient-to-b"
    >
      <SidebarContent className="px-3">
        <MobileSidebarClose />
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary mt-6 mb-8 flex flex-col items-start justify-start px-2">
            <Link
              href="/"
              className="mb-1 flex cursor-pointer items-center gap-2"
            >
              <AudioWaveform className="text-primary h-6 w-6" />
              <p className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-2xl font-bold tracking-tight text-transparent">
                Vox AI
              </p>
            </Link>
            <p className="text-muted-foreground ml-8 text-sm font-medium tracking-wide">
              Studio
            </p>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItems />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-muted/30 border-t p-3">
        <div className="mb-3 flex w-full items-center justify-center gap-2 text-xs">
          <Credits />
          <Upgrade />
        </div>

        {/* User block: language + user button grouped together */}
        <div className="border-muted-foreground/20 overflow-hidden rounded-md border">
          {/* Language row — looks like a menu item */}
          <div className="hover:bg-muted/50 flex items-center justify-between px-3 py-2 transition-colors">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground text-sm">Language</span>
            </div>
            <LanguageSwitcher />
          </div>

          {/* Divider */}
          <div className="border-muted-foreground/10 border-t" />

          {/* User button */}
          <UserButton
            variant="ghost"
            className="hover:bg-muted/50 w-full rounded-none transition-colors"
            disableDefaultLinks={true}
            additionalLinks={[
              {
                label: "Customer Portal",
                href: "/dashboard/customer-portal",
                icon: <User className="h-4 w-4" />,
              },
              {
                label: "Settings",
                href: "/dashboard/settings",
                icon: <Settings className="h-4 w-4" />,
              },
            ]}
          />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

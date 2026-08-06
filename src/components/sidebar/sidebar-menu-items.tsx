"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  ChevronRight,
  Clapperboard,
  FolderOpen,
  Gauge,
  Image,
  Mail,
  MessageSquare,
  Mic,
  Rss,
  Settings,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { authClient } from "~/lib/auth-client";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { STUDIO_NAV_ITEMS } from "~/config/studio-nav";

const ICON_MAP = {
  Mic,
  MessageSquare,
  Image,
} as const;

type IconName = keyof typeof ICON_MAP;

function StudioIcon({ name }: { name: string }) {
  const Icon = ICON_MAP[name as IconName] ?? Mic;
  return <Icon className="size-4" />;
}

export function SidebarMenuItems() {
  const pathname = usePathname();
  const t = useTranslations("dashboard.sidebar");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const session = await authClient.getSession();
      const role = (session?.data?.user as { role?: string } | undefined)?.role;
      setIsAdmin(role === "admin");
    };
    void checkAdmin();
  }, []);

  // Studio is "active" if the pathname starts with /dashboard/studio
  const isStudioActive = pathname.startsWith("/dashboard/studio");

  // Default studio open state — true if any studio sub-route is active
  const studioDefaultOpen = isStudioActive;

  return (
    <>
      {/* Main nav */}
      <SidebarGroup>
        <SidebarGroupLabel>{t("navigation")}</SidebarGroupLabel>
        <SidebarMenu>
          {/* Dashboard */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/dashboard"}
              tooltip={t("dashboard")}
            >
              <Link href="/dashboard">
                <Gauge className="size-4" />
                <span>{t("dashboard")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Studio — collapsible group */}
          <Collapsible defaultOpen={studioDefaultOpen} asChild className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={t("studio.label")}
                  isActive={isStudioActive}
                >
                  <Clapperboard className="size-4" />
                  <span>{t("studio.label")}</span>
                  <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarMenuSub>
                  {STUDIO_NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                      <SidebarMenuSubItem key={item.key}>
                        <SidebarMenuSubButton asChild isActive={isActive}>
                          <Link href={item.href}>
                            <StudioIcon name={item.icon} />
                            <span>{t(`studio.${item.labelKey}`)}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>

          {/* Projects */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith("/dashboard/projects")}
              tooltip={t("projects")}
            >
              <Link href="/dashboard/projects">
                <FolderOpen className="size-4" />
                <span>{t("projects")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Admin-only */}
          {isAdmin && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/dashboard/analytics")}
                  tooltip={t("analytics")}
                >
                  <Link href="/dashboard/analytics">
                    <BarChart3 className="size-4" />
                    <span>{t("analytics")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/dashboard/blog")}
                  tooltip={t("createBlogPost")}
                >
                  <Link href="/dashboard/blog/create">
                    <Rss className="size-4" />
                    <span>{t("createBlogPost")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/dashboard/send-email")}
                  tooltip={t("sendEmail")}
                >
                  <Link href="/dashboard/send-email">
                    <Mail className="size-4" />
                    <span>{t("sendEmail")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}

          {/* Settings */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith("/dashboard/settings")}
              tooltip={t("settings")}
            >
              <Link href="/dashboard/settings">
                <Settings className="size-4" />
                <span>{t("settings")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
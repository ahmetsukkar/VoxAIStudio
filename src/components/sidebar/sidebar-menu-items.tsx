"use client";

import {
  LayoutDashboard,
  Wand2,
  FolderOpen,
  Settings,
  Rss,
  Mail,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { useEffect, useState } from "react";
import { authClient } from "~/lib/auth-client";
import { useTranslations } from "next-intl";

export default function SidebarMenuItems() {
  const path = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();
  const [isAdmin, setIsAdmin] = useState(false);
  const t = useTranslations("dashboard.sidebar");

  useEffect(() => {
    const checkAdmin = async () => {
      const session = await authClient.getSession();
      const role = (session?.data?.user as { role?: string } | undefined)?.role;
      setIsAdmin(role === "admin");
    };
    void checkAdmin();
  }, []);

  const baseItems = [
    {
      title: t("dashboard"),
      url: "/dashboard",
      icon: LayoutDashboard,
      adminOnly: false,
    },
    {
      title: t("studio"),
      url: "/dashboard/studio",
      icon: Wand2,
      adminOnly: false,
    },
    {
      title: t("projects"),
      url: "/dashboard/projects",
      icon: FolderOpen,
      adminOnly: false,
    },
    {
      title: t("createBlogPost"),
      url: "/dashboard/blog/create",
      icon: Rss,
      adminOnly: true,
    },
    {
      title: t("sendEmail"),
      url: "/dashboard/send-email",
      icon: Mail,
      adminOnly: true,
    },
    {
      title: t("settings"),
      url: "/dashboard/settings",
      icon: Settings,
      adminOnly: false,
    },
  ];

  const items = baseItems
    .filter((item) => !item.adminOnly || isAdmin)
    .map((item) => ({
      ...item,
      active: path === item.url,
    }));

  const handleMenuClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            isActive={item.active}
            className={cn(
              "group relative h-10 w-full justify-start rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
              "hover:bg-purple-600/10 hover:text-purple-600",
              item.active && "bg-purple-600/15 text-purple-600 shadow-sm",
            )}
          >
            <Link
              href={item.url}
              onClick={handleMenuClick}
              className="flex cursor-pointer items-center gap-3"
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-colors duration-200",
                  item.active
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-primary",
                )}
              />
              <span className="truncate">{item.title}</span>
              {item.active && (
                <div className="bg-primary absolute top-1/2 left-0 h-6 w-1 -translate-y-1/2 rounded-r-full" />
              )}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}
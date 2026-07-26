// Data-driven Studio navigation configuration.
// Add new tools here — the sidebar automatically picks them up.
// This is the single source of truth for Studio sub-navigation.

export interface StudioNavItem {
  key: string;           // unique key, used as translation key
  href: string;          // route path
  icon: string;          // Lucide icon name (string so it works in both client and server)
  labelKey: string;      // next-intl translation key under "sidebar.studio"
}

export const STUDIO_NAV_ITEMS: StudioNavItem[] = [
  {
    key: "tts",
    href: "/dashboard/studio/tts",
    icon: "Mic",
    labelKey: "tts",
  },
  {
    key: "dialogue",
    href: "/dashboard/studio/dialogue",
    icon: "MessageSquare",
    labelKey: "dialogue",
  },
  {
    key: "image",
    href: "/dashboard/studio/image",
    icon: "Image",
    labelKey: "image",
  },
];
"use client"

import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { authClient } from "~/lib/auth-client"
import { useLocale } from "next-intl"
import { arLocalization } from "~/lib/auth-localization-ar"

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter()
  const locale = useLocale()

  return (
    <AuthUIProvider
      authClient={authClient}
      navigate={router.push.bind(router)}
      replace={router.replace.bind(router)}
      onSessionChange={() => {
        router.refresh()
      }}
      Link={Link}
      localization={locale === "ar" ? arLocalization : undefined}
    >
      {children}
    </AuthUIProvider>
  )
}
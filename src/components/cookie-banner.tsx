"use client";

import { useState, useEffect } from "react";
import CookieConsent from "react-cookie-consent";
import { useTranslations } from "next-intl";

type ConsentStatus = "granted" | "denied";

interface ConsentParams {
  analytics_storage: ConsentStatus;
  ad_storage: ConsentStatus;
  ad_user_data: ConsentStatus;
  ad_personalization: ConsentStatus;
}

type GtagFunction = (
  command: string,
  action: string,
  params: ConsentParams
) => void;

function updateConsent(params: ConsentParams) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    (window.gtag as GtagFunction)("consent", "update", params);
  }
}

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const t = useTranslations("common.cookie");

  useEffect(() => {
    setShowBanner(true);
  }, []);

  if (!showBanner) return null;

  return (
    <CookieConsent
      location="bottom"
      buttonText={t("accept")}
      declineButtonText={t("decline")}
      enableDeclineButton
      cookieName="vox-ai-studio-cookie-consent"
      style={{
        background: "#1e1b4b",
        padding: "20px",
        alignItems: "center",
      }}
      buttonStyle={{
        background: "#7c3aed",
        color: "#ffffff",
        fontSize: "14px",
        padding: "10px 24px",
        borderRadius: "6px",
        fontWeight: "600",
      }}
      declineButtonStyle={{
        background: "#64748b",
        color: "#ffffff",
        fontSize: "14px",
        padding: "10px 24px",
        borderRadius: "6px",
        fontWeight: "600",
      }}
      expires={365}
      onAccept={() => {
        updateConsent({
          analytics_storage: "granted",
          ad_storage: "granted",
          ad_user_data: "granted",
          ad_personalization: "granted",
        });
      }}
      onDecline={() => {
        updateConsent({
          analytics_storage: "denied",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
        });
      }}
    >
      <span style={{ fontSize: "14px", lineHeight: "1.6" }}>
        {t("message")}{" "}
        <a
          href="/legal/privacy"
          style={{ color: "#a78bfa", textDecoration: "underline" }}
        >
          Learn more in our Privacy Policy
        </a>
      </span>
    </CookieConsent>
  );
}
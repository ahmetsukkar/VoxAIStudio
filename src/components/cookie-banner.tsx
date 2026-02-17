"use client";

import { useState, useEffect } from "react";
import CookieConsent from "react-cookie-consent";

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Only show banner on client side
    setShowBanner(true);
  }, []);

  if (!showBanner) return null;

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept All Cookies"
      declineButtonText="Reject Non-Essential"
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
        // Enable Google Analytics and AdSense cookies
        console.log("Cookies accepted");
      }}
      onDecline={() => {
        // Disable non-essential cookies
        console.log("Non-essential cookies rejected");
      }}
    >
      <span style={{ fontSize: "14px", lineHeight: "1.6" }}>
        We use cookies to improve your experience, analyze site traffic, and serve personalized advertisements through{" "}
        <strong>Google AdSense</strong>. By clicking "Accept All Cookies", you consent to our use of cookies.{" "}
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

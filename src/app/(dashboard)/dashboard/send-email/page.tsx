"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Send,
  Eye,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Gift,
  PenLine,
} from "lucide-react";
import { cn } from "~/lib/utils";

type Mode = "custom" | "credits-gift";

export default function SendEmailPage() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("credits-gift");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [credits, setCredits] = useState("40000");
  const [to, setTo] = useState(searchParams.get("to") ?? "");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const creditsPreviewHtml = `
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td align="center" style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 50%,#a855f7 100%);padding:40px 40px 32px;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="background:rgba(255,255,255,0.15);border-radius:14px;padding:12px 22px;border:1px solid rgba(255,255,255,0.2);">
                <span style="color:#fff;font-size:24px;font-weight:800;">≋ Vox AI Studio</span>
              </td>
            </tr></table>
            <p style="color:rgba(255,255,255,0.8);margin:14px 0 0;font-size:13px;letter-spacing:1px;text-transform:uppercase;">AI Voice Generation Platform</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 40px 12px;background:#ffffff;">
            <p style="margin:0 0 20px;font-size:16px;color:#111827;">Hi <strong>${name || "there"}</strong>,</p>
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.8;">First of all, thank you for signing up to Vox AI Studio early on — it truly means a lot to us.</p>
            <p style="margin:0 0 28px;font-size:15px;color:#374151;line-height:1.8;">When you first visited, our platform wasn't fully ready yet, and we know that wasn't the experience you deserved. We're sorry for that.</p>
            <table cellpadding="0" cellspacing="0" width="100%" style="background:#f0f0ff;border-radius:14px;border:1px solid #c7d2fe;margin-bottom:28px;">
              <tr><td style="padding:24px 28px;">
                <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#4f46e5;text-transform:uppercase;letter-spacing:1px;">✨ What's new</p>
                <p style="margin:0 0 10px;font-size:15px;color:#111827;font-weight:600;">Vox AI Studio is now fully live.</p>
                <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;">Generate natural-sounding speech from text in multiple languages, and create multi-voice dialogue scenes — all powered by the latest AI engines.</p>
              </td></tr>
            </table>
            <table cellpadding="0" cellspacing="0" width="100%" style="background:linear-gradient(135deg,#ede9fe,#e0e7ff);border-radius:14px;border:1px solid #c4b5fd;margin-bottom:28px;">
              <tr><td style="padding:28px;text-align:center;">
                <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#7c3aed;text-transform:uppercase;letter-spacing:1px;">Your Free Gift 🎁</p>
                <p style="margin:0 0 4px;font-size:48px;font-weight:800;color:#4f46e5;letter-spacing:-2px;">${Number(credits || 0).toLocaleString()}</p>
                <p style="margin:0 0 14px;font-size:16px;color:#7c3aed;font-weight:600;">Credits</p>
                <p style="margin:0;font-size:13px;color:#6b7280;background:rgba(255,255,255,0.7);border-radius:8px;padding:8px 16px;display:inline-block;">Starter Plan — added to your account, completely free.</p>
              </td></tr>
            </table>
            <p style="margin:0 0 28px;font-size:15px;color:#374151;line-height:1.8;">No strings attached. Just log in with your existing account and the credits are already there waiting for you.</p>
            <table cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" style="padding:0 0 32px;">
              <a href="https://voxaistudio.com/auth/sign-in" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;padding:16px 40px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;box-shadow:0 4px 16px rgba(79,70,229,0.4);">🚀 &nbsp;Log In & Start Creating</a>
            </td></tr></table>
            <p style="margin:0 0 8px;font-size:14px;color:#6b7280;line-height:1.7;">We'd love to hear what you think. If you have any questions or feedback, just reply to this email — we read every message.</p>
            <p style="margin:0 0 32px;font-size:14px;color:#374151;line-height:1.7;">Thank you for giving us a second chance.<br/><strong>Warm regards,<br/>The Vox AI Studio Team</strong></p>
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
            <p style="margin:0 0 6px;font-size:12px;color:#9ca3af;">You're receiving this email because you signed up at voxaistudio.com</p>
            <p style="margin:0;font-size:12px;color:#9ca3af;">© 2026 Vox AI Studio · <a href="https://voxaistudio.com" style="color:#6b7280;text-decoration:none;">voxaistudio.com</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const customPreviewHtml = `
<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td align="center" style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);padding:36px 40px 28px;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="background:rgba(255,255,255,0.15);border-radius:12px;padding:10px 18px;">
                <span style="color:#fff;font-size:22px;font-weight:800;">≋ Vox AI Studio</span>
              </td>
            </tr></table>
            <p style="color:rgba(255,255,255,0.85);margin:14px 0 0;font-size:14px;">AI Voiceover Platform</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 40px 32px;">
            <h1 style="margin:0 0 24px;font-size:22px;font-weight:700;color:#111827;">${subject || "Your Subject Here"}</h1>
            <div style="font-size:15px;color:#374151;line-height:1.8;">${(content || "Your content here...").replace(/\n/g, "<br/>")}</div>
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">© 2026 Vox AI Studio · <a href="https://voxaistudio.com" style="color:#6b7280;text-decoration:none;">voxaistudio.com</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const canSend =
    mode === "credits-gift"
      ? !!to && !!credits
      : !!to && !!subject && !!content;

  async function handleSend() {
    if (!canSend) return;
    setLoading(true);
    setStatus("idle");
    try {
      const payload =
        mode === "credits-gift"
          ? { mode, to, name, credits }
          : { mode, to, subject, content };

      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("success");
        setTo("");
        setName("");
        setCredits("40000");
        setSubject("");
        setContent("");
      } else {
        const data = (await res.json()) as { error?: string };
        setErrorMsg(data.error ?? "Something went wrong");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Exact same outer structure as CreateBlogForm
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-3xl px-4">
        {/* Header — same style as CreateBlogForm */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Send Email</h1>
          <p className="mt-2 text-gray-600">
            Send a branded email from{" "}
            <span className="ml-1 text-purple-600">
              support@voxaistudio.com
            </span>
          </p>
        </div>

        {/* Template Selector */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => setMode("credits-gift")}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-4 text-left transition-colors",
              mode === "credits-gift"
                ? "border-purple-300 bg-purple-50 text-gray-900"
                : "border-gray-200 bg-white text-gray-500 hover:border-purple-200",
            )}
          >
            <Gift
              className={cn(
                "h-5 w-5 shrink-0",
                mode === "credits-gift" ? "text-purple-600" : "text-gray-400",
              )}
            />
            <div>
              <p className="text-sm font-semibold">Credits Gift</p>
              <p className="mt-0.5 text-xs opacity-60">
                Free credits to a user
              </p>
            </div>
          </button>
          <button
            onClick={() => setMode("custom")}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-4 text-left transition-colors",
              mode === "custom"
                ? "border-purple-300 bg-purple-50 text-gray-900"
                : "border-gray-200 bg-white text-gray-500 hover:border-purple-200",
            )}
          >
            <PenLine
              className={cn(
                "h-5 w-5 shrink-0",
                mode === "custom" ? "text-purple-600" : "text-gray-400",
              )}
            />
            <div>
              <p className="text-sm font-semibold">Custom Email</p>
              <p className="mt-0.5 text-xs opacity-60">
                Write your own message
              </p>
            </div>
          </button>
        </div>

        {/* Form Card — same style as CreateBlogForm's white card */}
        <div className="rounded-xl bg-white p-8 shadow-lg">
          {/* To */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              To *
            </label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Credits Gift Fields */}
          {mode === "credits-gift" && (
            <>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Customer Name{" "}
                  <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ahmed"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Credits Amount *
                </label>
                <input
                  type="number"
                  value={credits}
                  onChange={(e) => setCredits(e.target.value)}
                  placeholder="40000"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Default: 40,000 — change as needed per user
                </p>
              </div>
            </>
          )}

          {/* Custom Email Fields */}
          {mode === "custom" && (
            <>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Subject *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-700">
                    Content *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPreview(true)}
                    className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700"
                  >
                    <Eye className="h-4 w-4" />
                    Preview Email
                  </button>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your email message here..."
                  rows={8}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 font-mono text-sm focus:border-transparent focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </>
          )}

          {/* Status */}
          {status === "success" && (
            <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <CheckCircle className="h-4 w-4 shrink-0" />
              Email sent successfully!
            </div>
          )}
          {status === "error" && (
            <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errorMsg}
            </div>
          )}
        </div>

        {/* Action Buttons — same position as CreateBlogForm */}
        <div className="mt-6 flex flex-col justify-end gap-4 sm:flex-row">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="rounded-lg border border-gray-300 px-6 py-3 text-center font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <span className="flex items-center justify-center gap-2">
              <Eye className="h-5 w-5" />
              Preview Email
            </span>
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={loading || !canSend}
            className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-3 font-semibold text-white transition-all hover:from-purple-700 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Sending...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" /> Send Email
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <h2 className="font-semibold text-gray-900">
                Email Preview —{" "}
                {mode === "credits-gift" ? "Credits Gift" : "Custom"}
              </h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 transition-colors hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <iframe
                srcDoc={
                  mode === "credits-gift"
                    ? creditsPreviewHtml
                    : customPreviewHtml
                }
                className="h-[600px] w-full rounded-xl border-0"
                title="Email Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

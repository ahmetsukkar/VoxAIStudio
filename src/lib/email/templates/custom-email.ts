export function customEmailTemplate(subject: string, content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:16px;overflow:hidden;
                      box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td align="center"
                style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);
                       padding:36px 40px 28px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:rgba(255,255,255,0.15);border-radius:12px;padding:10px 18px;">
                    <span style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">
                      ≋ Vox AI Studio
                    </span>
                  </td>
                </tr>
              </table>
              <p style="color:rgba(255,255,255,0.85);margin:14px 0 0;font-size:14px;">
                AI Voiceover Platform
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="margin:0 0 24px;font-size:22px;font-weight:700;color:#111827;">
                ${subject}
              </h1>
              <div style="font-size:15px;color:#374151;line-height:1.8;">
                ${content.replace(/\n/g, "<br/>")}
              </div>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;color:#9ca3af;">
                This email was sent by the Vox AI Studio support team.
              </p>
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                © 2026 Vox AI Studio ·
                <a href="https://voxaistudio.com" style="color:#6b7280;text-decoration:none;">voxaistudio.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function creditsGiftTemplate(name: string, credits: string): string {
  const displayName = name || "there";
  const formattedCredits = Number(credits).toLocaleString();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>We're back — and we brought a gift 🎁</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:20px;overflow:hidden;
                      box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td align="center"
                style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 50%,#a855f7 100%);
                       padding:40px 40px 32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:rgba(255,255,255,0.15);border-radius:14px;
                             padding:12px 22px;border:1px solid rgba(255,255,255,0.2);">
                    <span style="color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px;">
                      ≋ Vox AI Studio
                    </span>
                  </td>
                </tr>
              </table>
              <p style="color:rgba(255,255,255,0.8);margin:14px 0 0;font-size:13px;
                         letter-spacing:1px;text-transform:uppercase;">
                AI Voice Generation Platform
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 12px;background:#ffffff;">
              <p style="margin:0 0 20px;font-size:16px;color:#111827;line-height:1.7;">
                Hi <strong>${displayName}</strong>,
              </p>
              <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.8;">
                First of all, thank you for signing up to Vox AI Studio early on — it truly means a lot to us.
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#374151;line-height:1.8;">
                When you first visited, our platform wasn't fully ready yet, and we know that wasn't the experience you deserved. We're sorry for that.
              </p>

              <!-- What's new box -->
              <table cellpadding="0" cellspacing="0" width="100%"
                     style="background:#f0f0ff;border-radius:14px;
                            border:1px solid #c7d2fe;margin-bottom:28px;">
                <tr>
                  <td style="padding:24px 28px;">
                    <p style="margin:0 0 10px;font-size:13px;font-weight:700;
                               color:#4f46e5;text-transform:uppercase;letter-spacing:1px;">
                      ✨ What's new
                    </p>
                    <p style="margin:0 0 10px;font-size:15px;color:#111827;font-weight:600;">
                      Vox AI Studio is now fully live.
                    </p>
                    <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;">
                      Generate natural-sounding speech from text in multiple languages,
                      and create multi-voice dialogue scenes — all powered by the latest AI engines.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Credits Gift box -->
              <table cellpadding="0" cellspacing="0" width="100%"
                     style="background:linear-gradient(135deg,#ede9fe,#e0e7ff);
                            border-radius:14px;border:1px solid #c4b5fd;margin-bottom:28px;">
                <tr>
                  <td style="padding:28px;text-align:center;">
                    <p style="margin:0 0 6px;font-size:13px;font-weight:700;
                               color:#7c3aed;text-transform:uppercase;letter-spacing:1px;">
                      Your Free Gift 🎁
                    </p>
                    <p style="margin:0 0 4px;font-size:48px;font-weight:800;
                               color:#4f46e5;letter-spacing:-2px;">
                      ${formattedCredits}
                    </p>
                    <p style="margin:0 0 14px;font-size:16px;color:#7c3aed;font-weight:600;">
                      Credits
                    </p>
                    <p style="margin:0;font-size:13px;color:#6b7280;
                               background:rgba(255,255,255,0.7);border-radius:8px;
                               padding:8px 16px;display:inline-block;">
                      Starter Plan — added to your account, completely free.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 28px;font-size:15px;color:#374151;line-height:1.8;">
                No strings attached. Just log in with your existing account and the credits are already there waiting for you.
              </p>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding:0 0 32px;">
                    <a href="https://voxaistudio.com/auth/sign-in"
                       style="display:inline-block;
                              background:linear-gradient(135deg,#4f46e5,#7c3aed);
                              color:#ffffff;padding:16px 40px;border-radius:12px;
                              text-decoration:none;font-weight:700;font-size:15px;
                              box-shadow:0 4px 16px rgba(79,70,229,0.4);">
                      🚀 &nbsp;Log In & Start Creating
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:14px;color:#6b7280;line-height:1.7;">
                We'd love to hear what you think. If you have any questions or feedback, just reply to this email — we read every message.
              </p>
              <p style="margin:0 0 32px;font-size:14px;color:#374151;line-height:1.7;">
                Thank you for giving us a second chance.<br/>
                <strong>Warm regards,<br/>The Vox AI Studio Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;
                       padding:20px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;color:#9ca3af;">
                You're receiving this email because you signed up at voxaistudio.com
              </p>
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                © 2026 Vox AI Studio ·
                <a href="https://voxaistudio.com" style="color:#6b7280;text-decoration:none;">
                  voxaistudio.com
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

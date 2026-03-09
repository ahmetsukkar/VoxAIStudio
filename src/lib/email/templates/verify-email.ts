export function verifyEmailTemplate(name: string, url: string): string {
  const displayName = name ?? "there";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify your email</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:16px;overflow:hidden;
                      box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td align="center"
                style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);
                       padding:36px 40px 28px;">
              <!-- Logo area -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:rgba(255,255,255,0.15);border-radius:12px;
                             padding:10px 18px;">
                    <span style="color:#ffffff;font-size:22px;font-weight:800;
                                 letter-spacing:-0.5px;">
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

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111827;">
                Verify your email ✉️
              </h1>
              <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
                Hi <strong style="color:#111827;">${displayName}</strong>,
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#374151;line-height:1.7;">
                Thanks for signing up to <strong>Vox AI Studio</strong>!
                You're one step away from creating stunning AI voiceovers.
                Click the button below to verify your email and activate your account.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding:8px 0 32px;">
                    <a href="${url}"
                       style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);
                              color:#ffffff;padding:14px 36px;border-radius:10px;
                              text-decoration:none;font-weight:700;font-size:15px;
                              letter-spacing:0.3px;
                              box-shadow:0 4px 14px rgba(79,70,229,0.4);">
                      ✓ &nbsp;Verify My Email
                    </a>
                  </td>
                </tr>
              </table>

              <!-- What you get box -->
              <table cellpadding="0" cellspacing="0" width="100%"
                     style="background:#f9fafb;border-radius:10px;border:1px solid #e5e7eb;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 12px;font-size:13px;font-weight:700;
                               color:#6b7280;text-transform:uppercase;letter-spacing:0.8px;">
                      What you get
                    </p>
                    <p style="margin:0 0 8px;font-size:14px;color:#374151;">
                      🎙️ &nbsp;<strong>10,000 free credits</strong> to start generating voices
                    </p>
                    <p style="margin:0 0 8px;font-size:14px;color:#374151;">
                      🌍 &nbsp;Multi-language AI voiceover support
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;
                       padding:20px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;color:#9ca3af;">
                If you didn't create an account, you can safely ignore this email.
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
</html>
  `;
}

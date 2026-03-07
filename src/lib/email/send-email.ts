import { Resend } from "resend";
import { env } from "~/env";

const resend = new Resend(String(env.RESEND_API_KEY));

const FROM = "Vox AI Studio <noreply@voxaistudio.com>";

export async function sendVerificationEmail(
  user: { email: string; name?: string | null },
  url: string,
  html: string,
) {
  await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: "Verify your Vox AI Studio email",
    html,
  });
}

export async function sendResetPasswordEmail(
  user: { email: string; name?: string | null },
  url: string,
  html: string,
) {
  await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: "Reset your Vox AI Studio password",
    html,
  });
}

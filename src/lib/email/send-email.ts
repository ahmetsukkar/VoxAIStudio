import { Resend } from "resend";
import { env } from "~/env";
import { contactFormTemplate } from "./templates/contact-form";

const resend = new Resend(String(env.RESEND_API_KEY));

const FROM = "Vox AI Studio <noreply@voxaistudio.com>";
const SUPPORT = "Vox AI Studio Support <support@voxaistudio.com>";
const SUPPORT_EMAIL = "support@voxaistudio.com";

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

export async function sendContactFormEmail(data: {
  name: string;
  email: string;
  subjectLabel: string;
  message: string;
}) {
  const html = contactFormTemplate(data);

  const { error } = await resend.emails.send({
    from: SUPPORT,
    to: SUPPORT_EMAIL,
    replyTo: data.email,
    subject: `[Contact] ${data.subjectLabel} — ${data.name}`,
    html,
  });

  if (error) throw new Error(error.message);
}

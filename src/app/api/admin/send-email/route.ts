import { NextResponse } from "next/server";
import { Resend } from "resend";
import { env } from "~/env";
import { auth } from "~/lib/auth";
import { headers } from "next/headers";
import { customEmailTemplate, creditsGiftTemplate } from "~/lib/email/templates/custom-email";

const resend = new Resend(String(env.RESEND_API_KEY));

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user || session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json() as {
    mode: "custom" | "credits-gift";
    to: string;
    subject?: string;
    content?: string;
    name?: string;
    credits?: string;
  };

  const { mode, to } = body;

  if (!to) {
    return NextResponse.json({ error: "Missing recipient email" }, { status: 400 });
  }

  let subject: string;
  let html: string;

  if (mode === "credits-gift") {
    const { name = "there", credits = "40000" } = body;
    subject = "We're back — and we brought a gift 🎁";
    html = creditsGiftTemplate(name, credits);
  } else {
    const { subject: customSubject, content } = body;
    if (!customSubject || !content) {
      return NextResponse.json({ error: "Missing subject or content" }, { status: 400 });
    }
    subject = customSubject;
    html = customEmailTemplate(subject, content);
  }

  const { error } = await resend.emails.send({
    from: "Vox AI Studio Support <support@voxaistudio.com>",
    to,
    subject,
    html,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

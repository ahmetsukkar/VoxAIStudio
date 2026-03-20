import { NextResponse } from "next/server";
import { sendContactFormEmail } from "~/lib/email/send-email";

const SUBJECT_LABELS: Record<string, string> = {
  general: "General Inquiry",
  support: "Technical Support",
  billing: "Billing Question",
  feature: "Feature Request",
  bug: "Report a Bug",
  partnership: "Partnership Opportunity",
};

export async function POST(request: Request) {
  const body = await request.json() as {
    name: string;
    email: string;
    subject: string;
    message: string;
  };

  const { name, email, subject, message } = body;

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const subjectLabel = SUBJECT_LABELS[subject] ?? subject;

  try {
    await sendContactFormEmail({ name, email, subjectLabel, message });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

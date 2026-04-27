import { NextRequest, NextResponse } from "next/server";

// Stub: will integrate Resend when API key is provided
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject } = body;

    // TODO: Replace with actual Resend integration
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({ from: 'noreply@correntinosclim.org', to, subject, html });

    console.log(`[EMAIL STUB] To: ${to}, Subject: ${subject}`);

    return NextResponse.json({ ok: true, stub: true });
  } catch {
    return NextResponse.json({ error: "Error al enviar email" }, { status: 500 });
  }
}

export async function sendMagicLinkEmail(email: string, url: string) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY is not set, cannot send magic link emails");
    }
    console.log(`\nMagic link for ${email}:\n${url}\n`);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? "TaskFlow <onboarding@resend.dev>",
      to: email,
      subject: "Your TaskFlow sign-in link",
      html: `<p>Click the link below to sign in to TaskFlow. It expires in 5 minutes.</p><p><a href="${url}">Sign in to TaskFlow</a></p>`,
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to send magic link email (${res.status})`);
  }
}

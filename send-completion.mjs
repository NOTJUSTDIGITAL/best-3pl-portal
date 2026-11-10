// Emails billing when a job is completed. Only signed-in staff can trigger it,
// and the recipient is decided here on the server, never by the browser.
import { Resend } from "resend";
import { json, whoIsCalling } from "../lib/auth.mjs";

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const caller = await whoIsCalling(req);
  if (caller.error) return caller.error;
  if (!["admin", "staff"].includes(caller.role)) return json({ error: "Not allowed." }, 403);

  if (!process.env.RESEND_API_KEY || !process.env.MAIL_FROM) {
    return json({ error: "Email is not configured (RESEND_API_KEY / MAIL_FROM)." }, 500);
  }

  let payload;
  try { payload = await req.json(); } catch { return json({ error: "Bad request." }, 400); }

  const to = (process.env.BILLING_EMAIL || "Dom@usawholesalesupplies.com")
    .split(",").map((s) => s.trim()).filter(Boolean);

  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { error } = await resend.emails.send({
      from: process.env.MAIL_FROM, // e.g. "Best 3PL <notifications@yourdomain.com>"
      to,
      subject: String(payload.subject || "Job completed").slice(0, 200),
      text: String(payload.body || "").slice(0, 20000),
    });
    if (error) return json({ error: String(error.message || error) }, 502);
    return json({ ok: true });
  } catch (e) {
    return json({ error: String(e) }, 502);
  }
};

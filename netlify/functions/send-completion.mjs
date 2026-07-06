import { Resend } from "resend";

const authorized = (req) =>
  process.env.ACCESS_CODE && req.headers.get("x-access-code") === process.env.ACCESS_CODE;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });

export default async (req) => {
  if (!authorized(req)) return new Response("Unauthorized", { status: 401 });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  if (!process.env.RESEND_API_KEY || !process.env.MAIL_FROM) {
    return json({ error: "Email is not configured (RESEND_API_KEY / MAIL_FROM)." }, 500);
  }

  let payload;
  try { payload = await req.json(); } catch { return new Response("Bad JSON", { status: 400 }); }
  const { to, subject, body } = payload;

  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { error } = await resend.emails.send({
      from: process.env.MAIL_FROM, // e.g. "Best 3PL <notifications@yourdomain.com>"
      to: [to || "Dom@usawholesalesupplies.com"],
      subject: subject || "Job completed",
      text: body || "",
    });
    if (error) return json({ error: String(error.message || error) }, 502);
    return json({ ok: true });
  } catch (e) {
    return json({ error: String(e) }, 502);
  }
};

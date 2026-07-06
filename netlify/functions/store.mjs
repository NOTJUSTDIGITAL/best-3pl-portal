import { getStore } from "@netlify/blobs";

// All clients + jobs live in one shared store. The access code is checked here
// so the data can't be read or written without it.
const authorized = (req) =>
  process.env.ACCESS_CODE && req.headers.get("x-access-code") === process.env.ACCESS_CODE;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });

export default async (req) => {
  if (!process.env.ACCESS_CODE) return json({ error: "ACCESS_CODE is not set in Netlify." }, 500);
  if (!authorized(req)) return new Response("Unauthorized", { status: 401 });

  const store = getStore("best3pl");

  if (req.method === "GET") {
    const clients = (await store.get("clients", { type: "json" })) || [];
    const jobs = (await store.get("jobs", { type: "json" })) || [];
    return json({ clients, jobs });
  }

  if (req.method === "POST") {
    let body;
    try { body = await req.json(); } catch { return new Response("Bad JSON", { status: 400 }); }
    await store.setJSON("clients", Array.isArray(body.clients) ? body.clients : []);
    await store.setJSON("jobs", Array.isArray(body.jobs) ? body.jobs : []);
    return json({ ok: true });
  }

  return new Response("Method not allowed", { status: 405 });
};

// READ-ONLY window onto the OLD shared-code portal's data. It exists only so an
// admin can bring that data into the new database from the Team page.
// It can no longer be written to. Once the import is done, delete the
// ACCESS_CODE variable in Netlify and this stops answering altogether.
import { getStore } from "@netlify/blobs";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

export default async (req) => {
  if (!process.env.ACCESS_CODE) return json({ error: "The old portal's access code has been removed." }, 401);
  if (req.headers.get("x-access-code") !== process.env.ACCESS_CODE) return json({ error: "Unauthorized" }, 401);
  if (req.method !== "GET") return json({ error: "The old data store is read-only now." }, 405);

  const store = getStore("best3pl");
  const clients = (await store.get("clients", { type: "json" })) || [];
  const jobs = (await store.get("jobs", { type: "json" })) || [];
  return json({ clients, jobs });
};

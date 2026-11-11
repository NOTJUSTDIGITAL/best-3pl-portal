// Shared helpers for the server functions. This file lives outside
// netlify/functions on purpose, so Netlify doesn't turn it into an endpoint.
import { createClient } from "@supabase/supabase-js";

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export const env = {
  url: () => process.env.SUPABASE_URL,
  publishable: () => process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY,
  secret: () => process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
};

const serverOnly = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } };

// Full-access client. Only ever used on the server, after the caller is checked.
export const adminClient = () => createClient(env.url(), env.secret(), serverOnly);

// Works out who is calling from their sign-in token, then reads their role
// with that same token, so the database's own access rules apply.
// Returns { user, role } or { error: Response }.
export async function whoIsCalling(req) {
  if (!env.url() || !env.publishable()) {
    return { error: json({ error: "The portal isn't connected to its database yet." }, 500) };
  }
  const header = req.headers.get("authorization") || "";
  const token = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
  if (!token) return { error: json({ error: "Please sign in again." }, 401) };

  const asCaller = createClient(env.url(), env.publishable(), {
    ...serverOnly,
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data, error } = await asCaller.auth.getUser(token);
  if (error || !data?.user) return { error: json({ error: "Please sign in again." }, 401) };

  const { data: profile } = await asCaller.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
  return { user: data.user, role: profile?.role || "none" };
}

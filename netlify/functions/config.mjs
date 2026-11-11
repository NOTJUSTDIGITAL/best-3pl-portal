// Hands the browser the two PUBLIC settings it needs to reach the database.
// Both are safe to expose: the publishable key can only do what the database's
// access rules allow for whoever is signed in. The secret key never leaves the server.
import { json, env } from "../lib/auth.mjs";

export default async () => {
  if (!env.url() || !env.publishable()) {
    return json({ error: "SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY are not set in Netlify." }, 500);
  }
  return json({ supabaseUrl: env.url(), supabaseKey: env.publishable() });
};

// Team management — admins only. Creating a login and resetting someone's
// password need the secret key, so they happen here on the server and never
// in the browser.
import { json, env, adminClient, whoIsCalling } from "../lib/auth.mjs";

const TEAM_ROLES = ["admin", "staff"];

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const caller = await whoIsCalling(req);
  if (caller.error) return caller.error;
  if (caller.role !== "admin") return json({ error: "Only an admin can manage the team." }, 403);
  if (!env.secret()) return json({ error: "SUPABASE_SECRET_KEY is not set in Netlify." }, 500);

  let body;
  try { body = await req.json(); } catch { return json({ error: "Bad request." }, 400); }

  const password = String(body.password || "");
  if (password.length < 8) return json({ error: "The temporary password must be at least 8 characters." }, 400);

  const admin = adminClient();

  if (body.action === "add") {
    const email = String(body.email || "").trim().toLowerCase();
    const full_name = String(body.full_name || "").trim();
    const role = String(body.role || "");
    if (!/^\S+@\S+\.\S+$/.test(email)) return json({ error: "That email address doesn't look right." }, 400);
    if (!full_name) return json({ error: "Add a name for this team member." }, 400);
    if (!TEAM_ROLES.includes(role)) return json({ error: "Pick Staff or Admin." }, 400);

    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // no confirmation email; the admin hands over the details
      user_metadata: { full_name },
    });
    if (error || !data?.user) {
      const taken = /already|registered|exists/i.test(error?.message || "");
      return json({ error: taken ? "Someone with that email already has a login." : `Couldn't create the login: ${error?.message || "unknown error"}` }, taken ? 409 : 502);
    }

    // The database created their profile with no access; now grant the role.
    const { error: e2 } = await admin.from("profiles")
      .update({ full_name, role, must_change_password: true })
      .eq("id", data.user.id);
    if (e2) return json({ error: `The login was created but its access couldn't be set: ${e2.message}. Set it from the Team page.` }, 502);

    return json({ ok: true, id: data.user.id });
  }

  if (body.action === "reset_password") {
    const id = String(body.id || "");
    if (!id) return json({ error: "Bad request." }, 400);

    const { error } = await admin.auth.admin.updateUserById(id, { password });
    if (error) return json({ error: `Couldn't reset the password: ${error.message}` }, 502);

    const { error: e2 } = await admin.from("profiles").update({ must_change_password: true }).eq("id", id);
    if (e2) return json({ error: `Password reset, but couldn't flag it as temporary: ${e2.message}` }, 502);

    return json({ ok: true });
  }

  return json({ error: "Unknown action." }, 400);
};

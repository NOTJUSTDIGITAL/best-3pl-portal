# Best 3PL — Job & Billing Portal (v2: individual logins)

The portal the Best 3PL team uses to track client jobs for billing.

**What changed in v2**

- Everyone signs in with their **own email and password**. The shared access code is gone.
- Data lives in a real database (**Supabase**) whose access rules decide who can see and change what.
- Each save writes one record, so two people working at the same time no longer overwrite each other.
- Every job shows who logged it and who completed it.
- Admins get a **Team** page: add people, set access (Admin / Staff / No access), reset passwords.
- One button brings the clients and jobs over from the old portal.

Still hosted on **Netlify**, still deployed from **GitHub**. Email still goes through **Resend** once that's set up.

This is Phase 1 of three. Phase 2 adds the customer portal (invite links, customer accounts, customer-submitted jobs). Phase 3 adds invoices, internal notes, and problem/review alerts.

---

## Before you start

1. Open the current portal and click **Export CSV**. Keep that file as a backup.
2. Have your Netlify login and GitHub login handy.
3. Do the steps in order. The site keeps running on the old version until Step 4.

---

## Step 1 — Create the database (Supabase)

1. Go to https://supabase.com, create an account, and click **New project**.
   - Name: `best-3pl-portal`
   - Database password: let it generate one and save it somewhere safe. You won't need it day to day.
   - Region: pick the one closest to you (East US).
2. Wait a minute or two for the project to finish setting up.

## Step 2 — Set up the tables and access rules

1. In Supabase, open **SQL Editor** (left sidebar) and start a **New query**.
2. Open the file `supabase/schema.sql` from this project, copy **all** of it, paste it in, and click **Run**.
3. You should see "Success. No rows returned". It's safe to run again if you're unsure it worked.

## Step 3 — Turn off public sign-ups and create your own login

1. In Supabase, open **Authentication**, then **Sign In / Providers**. Turn **off** "Allow new users to sign up" and save. People get logins only when an admin adds them.
2. Open **Authentication → Users**, click **Add user → Create new user**.
   - Enter your email and a password you'll remember.
   - Tick **Auto Confirm User**.
   - Click **Create user**.

**The first login created becomes the admin.** Make it yours.

## Step 4 — Connect the site and deploy

**4a. Copy three values from Supabase**

- **Project URL** — shown on the project's home page and under Settings → **Data API**. It looks like `https://abcdefgh.supabase.co`.
- **Publishable key** — Settings → **API Keys**. Starts with `sb_publishable_`.
- **Secret key** — same page. Starts with `sb_secret_`. Treat this one like a password: it goes into Netlify only, never into GitHub, email, or chat.

**4b. Add them in Netlify** — Site configuration → Environment variables → Add a variable:

| Key | Value |
|-----|-------|
| `SUPABASE_URL` | the Project URL |
| `SUPABASE_PUBLISHABLE_KEY` | the publishable key |
| `SUPABASE_SECRET_KEY` | the secret key |

Leave `ACCESS_CODE` in place for now. The data import in Step 5 uses it.

Make sure you are in the Netlify project that serves your real portal address.

**4c. Upload the new code to GitHub**

1. Unzip `best-3pl-portal-v2.zip`.
2. Open your `best-3pl-portal` repository on GitHub. Stay at the top level (where you see `netlify.toml`).
3. Click **Add file → Upload files**.
4. Open the unzipped folder, select **everything inside it** (the `public`, `netlify`, `src`, `supabase` folders and the loose files), and drag it all in.
5. Click **Commit changes**. Netlify redeploys on its own in about a minute.

**4d. Check the right version is live**

Visit `https://YOUR-SITE.netlify.app/app.js`. The first line should read:

```
/* BEST3PL BUILD-3 team-logins */
```

If it still says `BUILD-2`, the upload didn't land in the right place. Check that `public/app.js` in GitHub was updated just now.

## Step 5 — Sign in and bring your data over

1. Open the portal. You'll see the new sign-in screen. Sign in with the email and password from Step 3.
2. Click **Team** in the top bar.
3. Under **Bring over the old portal's data**, type the old access code and click **Bring data over**.
4. It reports how many clients and jobs came across. Check the Dashboard and Clients pages against your CSV backup.

Running it twice is harmless. Anything already brought over is skipped.

## Step 6 — Add the team

On the **Team** page, click **Add team member** for each person. Enter their name and email and pick **Staff** or **Admin**.

You get a temporary password to pass along (text it, say it, however you like). No email is sent. The first time they sign in, they choose their own password.

- **Staff** — add and edit clients, log and complete jobs.
- **Admin** — everything staff can do, plus the Team page and deleting clients.
- **No access** — blocks a login without deleting it. Use this when someone leaves.

## Step 7 — Lock the old door

Once your data is in and checked, delete the `ACCESS_CODE` variable in Netlify and redeploy (Deploys → Trigger deploy). The old data store stops answering. Your old data stays in Netlify as a fallback, it just can't be reached with the code any more.

---

## Email when a job is completed

Unchanged from before: it sends automatically once these are set in Netlify.

| Key | Value |
|-----|-------|
| `RESEND_API_KEY` | from Resend → API Keys |
| `MAIL_FROM` | e.g. `Best 3PL <notifications@yourdomain.com>` (the domain must be verified in Resend) |
| `BILLING_EMAIL` | optional. Who gets the email. Several addresses can be separated by commas. Defaults to Dom. |

Until then, completing a job still works and shows a "send it manually" link.

---

## Good to know

- **Forgot password:** an admin resets it from the Team page and passes along a new temporary password. Self-service reset emails come once Resend is set up.
- **Staying signed in:** the browser remembers you. Use **Sign out** on shared computers.
- **Seeing each other's work:** the portal refreshes every minute and whenever you come back to the tab.
- **Deleting a client** is admin-only, because it deletes that client's whole job history.
- **Supabase free plan:** fine to start. Two limits to know: a free project is paused after a week with no activity (anyone using the portal counts as activity, and a paused project is restored from the Supabase dashboard), and the free plan has no automatic backups. Keep exporting a CSV now and then. The Pro plan removes the pausing and adds daily backups.
- **The secret key** is the one thing in this setup that must stay private. If it is ever exposed, create a new one in Supabase → Settings → API Keys, update Netlify, and delete the old one.

---

## What's in this project

```
public/index.html            the page
public/app.js                the built app the browser runs (already built for you)
src/app.jsx                  the app's source
netlify/functions/config.mjs          gives the browser its public database settings
netlify/functions/team.mjs            add team members, reset passwords (admins only)
netlify/functions/send-completion.mjs emails billing when a job is completed
netlify/functions/store.mjs           read-only access to the OLD portal's data, for the import
netlify/lib/auth.mjs                  shared sign-in checks for the functions
supabase/schema.sql          the database tables and access rules
```

### Rebuilding after editing `src/app.jsx`

```bash
npm install
npm run build
```

That regenerates `public/app.js`. Upload the new `public/app.js`.

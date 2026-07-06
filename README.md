# Best 3PL — Job & Billing Portal

A login-protected portal for tracking 3PL jobs (prep, cross-dock, sanitization,
storage, freight, labor) per client, so billing has everything it needs. When a
job is marked complete, it emails the billing address automatically.

This runs on **Netlify**: the page is hosted for free, a small built-in store
(Netlify Blobs) holds your clients and jobs, and email goes out through
**Resend**. You don't run a server.

---

## What you'll need

- A **GitHub** account (you have one).
- A **Netlify** account (you have one).
- A **Resend** account — free, sign up at https://resend.com — for sending email.

That's the only new signup: Resend.

---

## Step 1 — Put this project on GitHub

**Easiest (no commands):**
1. Go to https://github.com/new and create a new repository, e.g. `best-3pl-portal`. Leave it empty.
2. On the new repo page, click **uploading an existing file**.
3. Drag in **everything inside this folder** (the `public`, `netlify`, `src` folders plus `netlify.toml`, `package.json`, `.gitignore`, `README.md`). Do **not** upload a `node_modules` folder if you see one.
4. Click **Commit changes**.

---

## Step 2 — Deploy on Netlify

1. In Netlify, click **Add new site → Import an existing project**.
2. Choose **GitHub** and pick the repo you just created.
3. Netlify reads the settings automatically (publish folder `public`, no build command needed). Click **Deploy**.

The first deploy will finish, but the app won't work yet until you add the
settings in Step 3.

---

## Step 3 — Add your settings (environment variables)

In Netlify: **Site configuration → Environment variables → Add a variable**.
Add these three:

| Key | Value | What it is |
|-----|-------|------------|
| `ACCESS_CODE` | a password you choose, e.g. `best3pl2025` | The code everyone types to sign in |
| `RESEND_API_KEY` | from Resend (Step 4) | Lets the app send email |
| `MAIL_FROM` | e.g. `Best 3PL <notifications@yourdomain.com>` | The "from" address on completion emails |

After adding them, go to **Deploys → Trigger deploy → Deploy site** so the new
settings take effect.

---

## Step 4 — Set up email in Resend

1. Sign up at https://resend.com.
2. **Verify a sending domain** (Resend → Domains → Add domain). Use a domain you
   own — for example `usawholesalesupplies.com`. Resend gives you a few DNS
   records to add at your domain registrar. Once verified, you can send from an
   address at that domain, like `notifications@usawholesalesupplies.com`. Put
   that into `MAIL_FROM` (Step 3).
3. **Create an API key** (Resend → API Keys → Create). Copy it into
   `RESEND_API_KEY` (Step 3).

> The billing recipient (Dom@usawholesalesupplies.com) is the person who
> *receives* the email — no setup needed for them. `MAIL_FROM` is who it's
> *sent from*, and that domain is the one that must be verified.
>
> If you can't add DNS records to a domain right now, you can still test:
> Resend lets you send to your own verified account email using their
> `onboarding@resend.dev` sender. Switch `MAIL_FROM` to a real verified domain
> when you're ready for it to reach Dom.

---

## Step 5 — Use it

Open your Netlify site URL, type your `ACCESS_CODE`, and you're in.
Add clients, log jobs, and when you mark a job complete, billing gets emailed
automatically. The **Export CSV** button (top of the dashboard) gives billing a
spreadsheet of every job.

Everyone who has the site link and the access code sees the same shared list of
clients and jobs.

---

## Changing things later

- **Billing email address:** edit `BILLING_EMAIL` near the top of
  `src/app.jsx`, then rebuild (below) and re-upload `public/app.js`.
- **Access code:** just change the `ACCESS_CODE` variable in Netlify (Step 3) and
  redeploy. No code change needed.
- **Service rates / auto-totaling:** the portal records quantities (units,
  pallets, trucks, hours, costs); billing applies your rates. Ask if you want a
  rate card built in so each job totals automatically.

### Rebuilding the app after editing `src/app.jsx`

The file the browser actually runs is `public/app.js` (already built for you).
If you edit `src/app.jsx`, rebuild it:

```bash
npm install
npm run build
```

That regenerates `public/app.js`. Commit/upload the updated `public/app.js`.

---

## Good to know

- **Where data lives:** Netlify Blobs, tied to your site. It's shared for
  everyone with the code. Use **Export CSV** regularly to keep your own backups.
- **Security level:** one shared access code keeps casual visitors out. It is not
  per-person logins or bank-grade security. If you later want individual accounts
  and audit trails, that's a bigger build — ask and it can be added.
- **Costs:** Netlify, Netlify Blobs, and Resend all have free tiers that
  comfortably cover a portal like this.

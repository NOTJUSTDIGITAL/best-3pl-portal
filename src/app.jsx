import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  Package, Truck, Recycle, Warehouse, ArrowLeftRight, Hammer,
  Plus, Search, ArrowLeft, CheckCircle2, Clock, Mail, Download,
  Trash2, Pencil, Building2, Phone, MapPin, User, X, LogOut, ClipboardList,
} from "lucide-react";

/* ----------------------------------------------------------------------------
   BEST 3PL — Job & Billing Portal
   Settings are Netlify environment variables (see README):
     ACCESS_CODE, RESEND_API_KEY, MAIL_FROM
   Billing recipient is below.
---------------------------------------------------------------------------- */
const BILLING_EMAIL = "Dom@usawholesalesupplies.com";
const LOGO = "data:image/png;base64,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";

/* ---- look & feel (a clean operations "manifest" identity) ---------------- */
const C = {
  paper: "#F6F5F1",
  card: "#FFFFFF",
  ink: "#17181A",
  slate: "#A66D56",
  slateSoft: "#8A5A47",
  espresso: "#6E4636",
  blue: "#A66D56",
  blueDark: "#8A5A47",
  line: "#E4E2DB",
  muted: "#6B6F76",
  amberBg: "#FEF3C7",
  amberInk: "#92500A",
  greenBg: "#DCFCE7",
  greenInk: "#166534",
  redBg: "#FEE2E2",
  redInk: "#B42318",
};
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const SANS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/* ---- backend client (Netlify Functions: data store + email) ------------- */
let ACCESS = "";
try { ACCESS = sessionStorage.getItem("b3pl_code") || ""; } catch {}
function setAccess(code) { ACCESS = code; try { sessionStorage.setItem("b3pl_code", code); } catch {} }
function clearAccess() { ACCESS = ""; try { sessionStorage.removeItem("b3pl_code"); } catch {} }

async function apiGet() {
  const res = await fetch("/api/store", { headers: { "x-access-code": ACCESS } });
  if (!res.ok) throw new Error("load failed " + res.status);
  return res.json();
}
async function apiSave(clients, jobs) {
  try {
    const res = await fetch("/api/store", {
      method: "POST",
      headers: { "content-type": "application/json", "x-access-code": ACCESS },
      body: JSON.stringify({ clients, jobs }),
    });
    return res.ok;
  } catch { return false; }
}
async function apiSendCompletion(payload) {
  try {
    const res = await fetch("/api/send-completion", {
      method: "POST",
      headers: { "content-type": "application/json", "x-access-code": ACCESS },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch { return false; }
}

/* ---- helpers ------------------------------------------------------------- */
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const today = () => new Date().toISOString().slice(0, 10);
const fmtDate = (d) =>
  d ? new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
const money = (n) =>
  n === "" || n == null || isNaN(Number(n)) ? "—" : "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const num = (n) => (n === "" || n == null || isNaN(Number(n)) ? "" : Number(n));

const PREP_LABEL = {
  amazon_walmart: "Amazon / Walmart prep — FNSKU label + box labels",
  box_labels_only: "Box labels only",
};

const newTruck = () => ({ id: uid(), fba: "", cost: "", pallets: "" });

/* freight stores a list of trucks; this also upgrades any older single-truck data */
function freightTrucks(f) {
  if (!f) return [];
  if (Array.isArray(f.trucks)) return f.trucks;
  if (f.fba || f.cost || f.pallets || (f.trucks && f.trucks !== ""))
    return [{ id: "legacy", fba: f.fba || "", cost: f.cost || "", pallets: f.pallets || "" }];
  return [];
}
function freightTotals(f) {
  const t = freightTrucks(f);
  const sum = (k) => t.reduce((a, x) => a + (Number(x[k]) || 0), 0);
  return { count: t.length, pallets: sum("pallets"), cost: sum("cost") };
}
/* make sure a job loaded for editing has freight.trucks as an array */
function normalizeJob(j) {
  const f = j.freight || {};
  let trucks = freightTrucks(f);
  if (trucks.length === 0) trucks = [newTruck()];
  return { ...j, freight: { on: !!f.on, trucks, note: f.note || "" } };
}

function blankJob(clientId) {
  return {
    id: uid(),
    clientId,
    jobDate: today(),
    reference: "",
    prep: { on: false, type: "amazon_walmart", units: "", pallets: "" },
    cross: { on: false, pallets: "", items: "", destination: "", note: "" },
    sanit: { on: false, units: "", note: "" },
    storage: { on: false, pallets: "", items: "", startDate: today(), note: "" },
    freight: { on: false, trucks: [newTruck()], note: "" },
    labor: { on: false, boxes: "", otherDesc: "", otherHours: "", otherCost: "" },
    notes: "",
    status: "in_progress",
    completedAt: null,
    createdAt: Date.now(),
  };
}

/* a short, human summary of what a job involved — used in lists + emails */
function jobServices(j) {
  const out = [];
  if (j.prep?.on) out.push(j.prep.type === "amazon_walmart" ? "Amazon/Walmart prep" : "Box labels");
  if (j.cross?.on) out.push("Cross dock");
  if (j.sanit?.on) out.push("Sanitization");
  if (j.storage?.on) out.push("Storage");
  if (j.freight?.on) out.push("Freight");
  if (j.labor?.on) out.push("Labor");
  return out;
}

/* ========================================================================== */
export default function App() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  const [clients, setClients] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [saveErr, setSaveErr] = useState(false);

  const [view, setView] = useState({ name: "dashboard" }); // {name, id}

  useEffect(() => {
    (async () => {
      if (ACCESS) {
        try {
          const data = await apiGet();
          setClients(data.clients || []);
          setJobs(data.jobs || []);
          setAuthed(true);
        } catch { clearAccess(); }
      }
      setReady(true);
    })();
  }, []);

  const onLogin = async (code) => {
    setAccess(code);
    try {
      const data = await apiGet();
      setClients(data.clients || []);
      setJobs(data.jobs || []);
      setAuthed(true);
      return true;
    } catch { clearAccess(); return false; }
  };
  const onLogout = () => { clearAccess(); setAuthed(false); };

  const persist = async (nextClients, nextJobs) => {
    setClients(nextClients);
    setJobs(nextJobs);
    const ok = await apiSave(nextClients, nextJobs);
    setSaveErr(!ok);
  };

  /* client ops */
  const upsertClient = (c) => {
    const exists = clients.some((x) => x.id === c.id);
    persist(exists ? clients.map((x) => (x.id === c.id ? c : x)) : [...clients, c], jobs);
  };
  const deleteClient = (id) => persist(clients.filter((c) => c.id !== id), jobs.filter((j) => j.clientId !== id));

  /* job ops */
  const upsertJob = (j) => {
    const exists = jobs.some((x) => x.id === j.id);
    persist(clients, exists ? jobs.map((x) => (x.id === j.id ? j : x)) : [...jobs, j]);
  };
  const deleteJob = (id) => persist(clients, jobs.filter((j) => j.id !== id));

  if (!ready) return <div style={{ minHeight: "100vh", background: C.espresso }} />;
  if (!authed) return <Login onLogin={onLogin} />;

  return (
    <div style={{ minHeight: "100vh", background: C.paper, color: C.ink, fontFamily: SANS }}>
      <Header view={view} setView={setView} onLogout={onLogout} />

      {saveErr && (
        <div style={{ background: C.redBg, color: C.redInk, fontSize: 13, padding: "8px 20px", textAlign: "center", borderBottom: `1px solid ${C.line}` }}>
          Couldn't save your last change to the server. Your edit is still on screen — check your connection and try again.
        </div>
      )}

      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 20px 80px" }}>
        {!ready ? (
          <div style={{ color: C.muted, padding: 40, textAlign: "center" }}>Loading…</div>
        ) : view.name === "dashboard" ? (
          <Dashboard clients={clients} jobs={jobs} setView={setView} />
        ) : view.name === "clients" ? (
          <Clients clients={clients} jobs={jobs} setView={setView} onSave={upsertClient} onDelete={deleteClient} />
        ) : view.name === "client" ? (
          <ClientDetail
            client={clients.find((c) => c.id === view.id)}
            jobs={jobs.filter((j) => j.clientId === view.id)}
            setView={setView}
            onSave={upsertClient}
            onDelete={deleteClient}
          />
        ) : view.name === "job" ? (
          <JobDetail
            job={jobs.find((j) => j.id === view.id)}
            client={clients.find((c) => c.id === jobs.find((j) => j.id === view.id)?.clientId)}
            setView={setView}
            onSave={upsertJob}
            onDelete={deleteJob}
          />
        ) : view.name === "jobform" ? (
          <JobForm
            existing={view.id ? jobs.find((j) => j.id === view.id) : null}
            clients={clients}
            preselect={view.clientId}
            setView={setView}
            onSave={upsertJob}
          />
        ) : null}
      </main>
    </div>
  );
}

/* ---- Login --------------------------------------------------------------- */
function Login({ onLogin }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);
  const go = async () => {
    if (busy || !code.trim()) return;
    setBusy(true); setErr(false);
    const ok = await onLogin(code.trim());
    setBusy(false);
    if (!ok) setErr(true);
  };
  return (
    <div style={{ minHeight: "100vh", background: C.espresso, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 380, background: C.card, borderRadius: 14, padding: 32, boxShadow: "0 20px 50px rgba(0,0,0,.25)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <img src={LOGO} alt="Best 3PL" style={{ width: 40, height: 40, borderRadius: 9, display: "block" }} />
          <div style={{ fontFamily: MONO, fontWeight: 700, letterSpacing: 1, fontSize: 18 }}>BEST 3PL</div>
        </div>
        <div style={{ color: C.muted, fontSize: 13, marginBottom: 22 }}>Job & billing portal</div>
        <label style={{ fontSize: 12, fontWeight: 600, color: C.slateSoft }}>Access code</label>
        <input
          autoFocus
          type="password"
          value={code}
          onChange={(e) => { setCode(e.target.value); setErr(false); }}
          onKeyDown={(e) => e.key === "Enter" && go()}
          placeholder="Enter code"
          style={{ ...inputStyle, marginTop: 6, marginBottom: err ? 6 : 18 }}
        />
        {err && <div style={{ color: C.redInk, fontSize: 13, marginBottom: 14 }}>That code didn't match. Try again.</div>}
        <button onClick={go} disabled={busy} style={{ ...btnPrimary, width: "100%", justifyContent: "center", opacity: busy ? 0.6 : 1 }}>{busy ? "Signing in…" : "Sign in"}</button>
      </div>
    </div>
  );
}

/* ---- Header / nav -------------------------------------------------------- */
function Header({ view, setView, onLogout }) {
  const tab = (name, label) => (
    <button
      onClick={() => setView({ name })}
      style={{
        background: "none", border: "none", cursor: "pointer", fontFamily: SANS, fontSize: 14,
        fontWeight: view.name === name || (name === "clients" && (view.name === "client")) ? 700 : 500,
        color: view.name === name || (name === "clients" && view.name === "client") ? "#fff" : "rgba(255,255,255,.65)",
        padding: "6px 2px", borderBottom: view.name === name || (name === "clients" && view.name === "client") ? "2px solid #fff" : "2px solid transparent",
      }}
    >
      {label}
    </button>
  );
  return (
    <header style={{ background: C.espresso, color: "#fff", position: "sticky", top: 0, zIndex: 5 }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 20px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <button onClick={() => setView({ name: "dashboard" })} style={{ display: "flex", alignItems: "center", gap: 9, background: "none", border: "none", cursor: "pointer" }}>
            <img src={LOGO} alt="Best 3PL" style={{ width: 32, height: 32, borderRadius: 7, display: "block" }} />
            <span style={{ fontFamily: MONO, fontWeight: 700, letterSpacing: 1, fontSize: 16, color: "#fff" }}>BEST 3PL</span>
          </button>
          <nav style={{ display: "flex", gap: 18, alignItems: "center" }}>
            {tab("dashboard", "Dashboard")}
            {tab("clients", "Clients")}
          </nav>
        </div>
        <button onClick={onLogout} title="Sign out" style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,.12)", color: "#fff", border: "none", borderRadius: 8, padding: "7px 12px", cursor: "pointer", fontSize: 13, fontFamily: SANS }}>
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </header>
  );
}

/* ---- Dashboard ----------------------------------------------------------- */
function Dashboard({ clients, jobs, setView }) {
  const open = jobs.filter((j) => j.status === "in_progress");
  const done = jobs.filter((j) => j.status === "completed");
  const thisMonth = done.filter((j) => (j.completedAt || "").slice(0, 7) === today().slice(0, 7));
  const clientName = (id) => clients.find((c) => c.id === id)?.businessName || clients.find((c) => c.id === id)?.name || "Unknown client";

  const recent = [...open].sort((a, b) => (a.jobDate < b.jobDate ? 1 : -1));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Dashboard</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => exportCSV(jobs, clients)} style={btnGhost}><Download size={15} /> Export CSV</button>
          <button onClick={() => setView({ name: "jobform" })} style={btnPrimary}><Plus size={16} /> New job</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: 12, marginBottom: 26 }}>
        <Stat icon={<Clock size={18} />} label="Jobs in progress" value={open.length} tint={C.amberInk} />
        <Stat icon={<CheckCircle2 size={18} />} label="Completed this month" value={thisMonth.length} tint={C.greenInk} />
        <Stat icon={<ClipboardList size={18} />} label="Total jobs" value={jobs.length} tint={C.slate} />
        <Stat icon={<Building2 size={18} />} label="Clients" value={clients.length} tint={C.blue} />
      </div>

      <SectionTitle>Jobs in progress</SectionTitle>
      {recent.length === 0 ? (
        <Empty text="No open jobs. Start one with “New job.”" />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {recent.map((j) => (
            <JobRow key={j.id} job={j} client={clientName(j.clientId)} onOpen={() => setView({ name: "job", id: j.id })} />
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ icon, label, value, tint }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: "16px 16px" }}>
      <div style={{ color: tint, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontFamily: MONO, fontSize: 28, fontWeight: 700, lineHeight: 1 }}>{value}</div>
      <div style={{ color: C.muted, fontSize: 12.5, marginTop: 6 }}>{label}</div>
    </div>
  );
}

function JobRow({ job, client, onOpen }) {
  const svcs = jobServices(job);
  return (
    <button onClick={onOpen} style={{ textAlign: "left", background: C.card, border: `1px solid ${C.line}`, borderRadius: 10, padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, fontFamily: SANS }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {client}{job.reference ? <span style={{ color: C.muted, fontWeight: 500 }}> · {job.reference}</span> : null}
        </div>
        <div style={{ color: C.muted, fontSize: 12.5, marginTop: 3 }}>
          {fmtDate(job.jobDate)} · {svcs.length ? svcs.join(", ") : "No services tagged"}
        </div>
      </div>
      <Stamp status={job.status} />
    </button>
  );
}

/* ---- Clients list -------------------------------------------------------- */
function Clients({ clients, jobs, setView, onSave, onDelete }) {
  const [q, setQ] = useState("");
  const [adding, setAdding] = useState(false);
  const filtered = clients
    .filter((c) => `${c.name} ${c.businessName}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (a.businessName || a.name).localeCompare(b.businessName || b.name));
  const jobCount = (id) => jobs.filter((j) => j.clientId === id).length;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Clients</h1>
        <button onClick={() => setAdding(true)} style={btnPrimary}><Plus size={16} /> Add client</button>
      </div>

      <div style={{ position: "relative", marginBottom: 16 }}>
        <Search size={16} style={{ position: "absolute", left: 12, top: 12, color: C.muted }} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or business" style={{ ...inputStyle, paddingLeft: 36 }} />
      </div>

      {clients.length === 0 ? (
        <Empty text="No clients yet. Add your first client to start logging jobs." />
      ) : filtered.length === 0 ? (
        <Empty text="No clients match that search." />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 12 }}>
          {filtered.map((c) => (
            <button key={c.id} onClick={() => setView({ name: "client", id: c.id })} style={{ textAlign: "left", background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 16, cursor: "pointer", fontFamily: SANS }}>
              <div style={{ fontWeight: 700, fontSize: 15.5 }}>{c.businessName || c.name}</div>
              {c.businessName && c.name && <div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>{c.name}</div>}
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.muted, fontSize: 12.5, marginTop: 10 }}>
                <Phone size={13} /> {c.phone || "—"}
              </div>
              <div style={{ marginTop: 12, fontFamily: MONO, fontSize: 12, color: C.slate, fontWeight: 600 }}>
                {jobCount(c.id)} job{jobCount(c.id) === 1 ? "" : "s"}
              </div>
            </button>
          ))}
        </div>
      )}

      {adding && <ClientForm onClose={() => setAdding(false)} onSave={(c) => { onSave(c); setAdding(false); setView({ name: "client", id: c.id }); }} />}
    </div>
  );
}

/* ---- Client form (modal) ------------------------------------------------- */
function ClientForm({ existing, onClose, onSave }) {
  const [c, setC] = useState(existing || { id: uid(), name: "", businessName: "", address: "", phone: "", email: "" });
  const set = (k, v) => setC({ ...c, [k]: v });
  const valid = (c.businessName || c.name).trim().length > 0;
  return (
    <Modal onClose={onClose} title={existing ? "Edit client" : "Add client"}>
      <Field label="Business name"><input value={c.businessName} onChange={(e) => set("businessName", e.target.value)} style={inputStyle} placeholder="e.g. Acme Wholesale LLC" /></Field>
      <Field label="Contact name"><input value={c.name} onChange={(e) => set("name", e.target.value)} style={inputStyle} placeholder="Person you deal with" /></Field>
      <Field label="Phone"><input value={c.phone} onChange={(e) => set("phone", e.target.value)} style={inputStyle} placeholder="(555) 555-5555" /></Field>
      <Field label="Email"><input value={c.email} onChange={(e) => set("email", e.target.value)} style={inputStyle} placeholder="name@company.com" /></Field>
      <Field label="Address"><textarea value={c.address} onChange={(e) => set("address", e.target.value)} style={{ ...inputStyle, minHeight: 64, resize: "vertical" }} placeholder="Street, city, state, ZIP" /></Field>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
        <button onClick={onClose} style={btnGhost}>Cancel</button>
        <button disabled={!valid} onClick={() => onSave(c)} style={{ ...btnPrimary, opacity: valid ? 1 : 0.5, cursor: valid ? "pointer" : "not-allowed" }}>Save client</button>
      </div>
    </Modal>
  );
}

/* ---- Client detail + job history ---------------------------------------- */
function ClientDetail({ client, jobs, setView, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  if (!client) return <Empty text="Client not found." />;
  const history = [...jobs].sort((a, b) => (a.jobDate < b.jobDate ? 1 : -1));

  return (
    <div>
      <BackLink onClick={() => setView({ name: "clients" })}>All clients</BackLink>

      <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: 22, marginBottom: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 23, fontWeight: 800 }}>{client.businessName || client.name}</h1>
            {client.businessName && client.name && <div style={{ color: C.muted, marginTop: 3 }}><User size={13} style={{ verticalAlign: -2 }} /> {client.name}</div>}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setEditing(true)} style={btnGhost}><Pencil size={14} /> Edit</button>
            <button onClick={() => setView({ name: "jobform", clientId: client.id })} style={btnPrimary}><Plus size={15} /> New job</button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14, marginTop: 18 }}>
          <Info icon={<Phone size={14} />} label="Phone" value={client.phone} />
          <Info icon={<Mail size={14} />} label="Email" value={client.email} />
          <Info icon={<MapPin size={14} />} label="Address" value={client.address} />
        </div>
        <button onClick={() => setConfirmDel(true)} style={{ ...linkBtn, color: C.redInk, marginTop: 16 }}><Trash2 size={13} /> Delete client</button>
      </div>

      <SectionTitle>Job history</SectionTitle>
      {history.length === 0 ? (
        <Empty text="No jobs logged for this client yet." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {history.map((j) => (
            <JobRow key={j.id} job={j} client={`${fmtDate(j.jobDate)}`} onOpen={() => setView({ name: "job", id: j.id })} />
          ))}
        </div>
      )}

      {editing && <ClientForm existing={client} onClose={() => setEditing(false)} onSave={(c) => { onSave(c); setEditing(false); }} />}
      {confirmDel && (
        <Modal onClose={() => setConfirmDel(false)} title="Delete this client?">
          <p style={{ color: C.muted, fontSize: 14, marginTop: 0 }}>This also removes all {history.length} job{history.length === 1 ? "" : "s"} on file for them. This can't be undone.</p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button onClick={() => setConfirmDel(false)} style={btnGhost}>Keep client</button>
            <button onClick={() => { onDelete(client.id); setView({ name: "clients" }); }} style={btnDanger}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---- Job form ------------------------------------------------------------ */
function JobForm({ existing, clients, preselect, setView, onSave }) {
  const [j, setJ] = useState(existing ? normalizeJob(existing) : blankJob(preselect || (clients[0]?.id ?? "")));
  const set = (k, v) => setJ({ ...j, [k]: v });
  const setIn = (sec, k, v) => setJ({ ...j, [sec]: { ...j[sec], [k]: v } });
  const toggle = (sec) => setJ({ ...j, [sec]: { ...j[sec], on: !j[sec].on } });
  const setTruck = (i, k, v) => setJ({ ...j, freight: { ...j.freight, trucks: j.freight.trucks.map((t, ti) => (ti === i ? { ...t, [k]: v } : t)) } });
  const addTruck = () => setJ({ ...j, freight: { ...j.freight, trucks: [...j.freight.trucks, newTruck()] } });
  const removeTruck = (i) => setJ({ ...j, freight: { ...j.freight, trucks: j.freight.trucks.filter((_, ti) => ti !== i) } });
  const valid = !!j.clientId;

  return (
    <div>
      <BackLink onClick={() => setView(existing ? { name: "job", id: j.id } : { name: "dashboard" })}>Cancel</BackLink>
      <h1 style={{ margin: "4px 0 18px", fontSize: 23, fontWeight: 800 }}>{existing ? "Edit job" : "New job"}</h1>

      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
          <Field label="Client">
            <select value={j.clientId} onChange={(e) => set("clientId", e.target.value)} style={inputStyle}>
              <option value="">Select client…</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.businessName || c.name}</option>)}
            </select>
          </Field>
          <Field label="Job date"><input type="date" value={j.jobDate} onChange={(e) => set("jobDate", e.target.value)} style={inputStyle} /></Field>
          <Field label="Reference (optional)"><input value={j.reference} onChange={(e) => set("reference", e.target.value)} style={inputStyle} placeholder="PO #, shipment name…" /></Field>
        </div>
      </Card>

      <div style={{ color: C.muted, fontSize: 13, margin: "20px 4px 10px", fontWeight: 600 }}>Tag the services on this job</div>

      <Service icon={<Package size={17} />} title="Prep" on={j.prep.on} onToggle={() => toggle("prep")}>
        <Field label="Prep type">
          <select value={j.prep.type} onChange={(e) => setIn("prep", "type", e.target.value)} style={inputStyle}>
            <option value="amazon_walmart">Amazon / Walmart — FNSKU label + box labels</option>
            <option value="box_labels_only">Box labels only</option>
          </select>
        </Field>
        <Row>
          <NumField label="Units prepped" value={j.prep.units} onChange={(v) => setIn("prep", "units", v)} />
          <NumField label="Pallets used (this order)" value={j.prep.pallets} onChange={(v) => setIn("prep", "pallets", v)} />
        </Row>
      </Service>

      <Service icon={<ArrowLeftRight size={17} />} title="Cross docking" subtitle="Held, then forwarded — no prep" on={j.cross.on} onToggle={() => toggle("cross")}>
        <Row>
          <NumField label="Pallets" value={j.cross.pallets} onChange={(v) => setIn("cross", "pallets", v)} />
          <NumField label="Items" value={j.cross.items} onChange={(v) => setIn("cross", "items", v)} />
        </Row>
        <Field label="Forwarded to"><input value={j.cross.destination} onChange={(e) => setIn("cross", "destination", e.target.value)} style={inputStyle} placeholder="Destination" /></Field>
      </Service>

      <Service icon={<Recycle size={17} />} title="Sanitization" subtitle="Remove old labels, apply new" on={j.sanit.on} onToggle={() => toggle("sanit")}>
        <NumField label="Units sanitized" value={j.sanit.units} onChange={(v) => setIn("sanit", "units", v)} />
      </Service>

      <Service icon={<Warehouse size={17} />} title="Storage" on={j.storage.on} onToggle={() => toggle("storage")}>
        <Row>
          <NumField label="Pallets stored" value={j.storage.pallets} onChange={(v) => setIn("storage", "pallets", v)} />
          <NumField label="Items stored" value={j.storage.items} onChange={(v) => setIn("storage", "items", v)} />
        </Row>
        <Field label="Storage start date"><input type="date" value={j.storage.startDate} onChange={(e) => setIn("storage", "startDate", e.target.value)} style={inputStyle} /></Field>
      </Service>

      <Service icon={<Truck size={17} />} title="Freight" subtitle="One row per truck" on={j.freight.on} onToggle={() => toggle("freight")}>
        {j.freight.trucks.map((t, i) => (
          <div key={t.id} style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: C.slate }}>TRUCK {i + 1}</span>
              {j.freight.trucks.length > 1 && (
                <button onClick={() => removeTruck(i)} style={{ ...linkBtn, color: C.redInk }}><Trash2 size={13} /> Remove</button>
              )}
            </div>
            <Row>
              <Field label="FBA number"><input value={t.fba} onChange={(e) => setTruck(i, "fba", e.target.value)} style={{ ...inputStyle, fontFamily: MONO }} placeholder="FBA15ABC…" /></Field>
              <NumField label="Cost ($)" value={t.cost} onChange={(v) => setTruck(i, "cost", v)} money />
              <NumField label="Pallets" value={t.pallets} onChange={(v) => setTruck(i, "pallets", v)} />
            </Row>
          </div>
        ))}
        <button onClick={addTruck} style={{ ...btnGhost, alignSelf: "flex-start" }}><Plus size={15} /> Add truck</button>
        {j.freight.trucks.length > 1 && (
          <div style={{ fontFamily: MONO, fontSize: 13, color: C.muted }}>
            {freightTotals(j.freight).count} trucks · {freightTotals(j.freight).pallets} pallets · total {money(freightTotals(j.freight).cost)}
          </div>
        )}
      </Service>

      <Service icon={<Hammer size={17} />} title="Labor" subtitle="Box making + any other 3PL labor" on={j.labor.on} onToggle={() => toggle("labor")}>
        <NumField label="Boxes made" value={j.labor.boxes} onChange={(v) => setIn("labor", "boxes", v)} />
        <Field label="Other labor — description"><input value={j.labor.otherDesc} onChange={(e) => setIn("labor", "otherDesc", e.target.value)} style={inputStyle} placeholder="Describe the work" /></Field>
        <Row>
          <NumField label="Hours" value={j.labor.otherHours} onChange={(v) => setIn("labor", "otherHours", v)} />
          <NumField label="Labor cost ($)" value={j.labor.otherCost} onChange={(v) => setIn("labor", "otherCost", v)} money />
        </Row>
      </Service>

      <Card>
        <Field label="Notes / problems"><textarea value={j.notes} onChange={(e) => set("notes", e.target.value)} style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} placeholder="Anything billing or the team should know" /></Field>
      </Card>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
        <button onClick={() => setView(existing ? { name: "job", id: j.id } : { name: "dashboard" })} style={btnGhost}>Cancel</button>
        <button disabled={!valid} onClick={() => { onSave(j); setView({ name: "job", id: j.id }); }} style={{ ...btnPrimary, opacity: valid ? 1 : 0.5, cursor: valid ? "pointer" : "not-allowed" }}>
          {existing ? "Save changes" : "Save job"}
        </button>
      </div>
      {!valid && <div style={{ color: C.redInk, fontSize: 13, textAlign: "right", marginTop: 8 }}>Pick a client first.</div>}
    </div>
  );
}

/* ---- Job detail ---------------------------------------------------------- */
function JobDetail({ job, client, setView, onSave, onDelete }) {
  const [confirmDel, setConfirmDel] = useState(false);
  const [emailStatus, setEmailStatus] = useState("idle");
  if (!job) return <Empty text="Job not found." />;
  const cname = client?.businessName || client?.name || "Unknown client";

  const sendEmail = async (target) => {
    setEmailStatus("sending");
    const mail = buildEmail(target, cname);
    const ok = await apiSendCompletion({ to: BILLING_EMAIL, subject: mail.subject, body: mail.body });
    setEmailStatus(ok ? "sent" : "failed");
  };
  const complete = async () => {
    const updated = { ...job, status: "completed", completedAt: today() };
    onSave(updated);
    sendEmail(updated);
  };

  return (
    <div>
      <BackLink onClick={() => setView(client ? { name: "client", id: client.id } : { name: "dashboard" })}>{client ? "Back to client" : "Back"}</BackLink>

      <div style={{ position: "relative", background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: 22, marginBottom: 18, overflow: "hidden" }}>
        {job.status === "completed" && (
          <div style={{ position: "absolute", top: 18, right: -2, transform: "rotate(8deg)", border: `2px solid ${C.greenInk}`, color: C.greenInk, fontFamily: MONO, fontWeight: 700, letterSpacing: 2, fontSize: 13, padding: "4px 12px", borderRadius: 6, opacity: 0.85 }}>
            COMPLETED
          </div>
        )}
        <div style={{ color: C.muted, fontSize: 13 }}>{fmtDate(job.jobDate)}</div>
        <h1 style={{ margin: "4px 0 4px", fontSize: 22, fontWeight: 800 }}>{cname}</h1>
        {job.reference && <div style={{ color: C.muted }}>{job.reference}</div>}
        <div style={{ marginTop: 12 }}><Stamp status={job.status} /></div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 18 }}>
          {job.status === "in_progress" ? (
            <button onClick={complete} style={btnSuccess}><CheckCircle2 size={16} /> Mark complete</button>
          ) : (
            <button onClick={() => sendEmail(job)} disabled={emailStatus === "sending"} style={{ ...btnPrimary, opacity: emailStatus === "sending" ? 0.6 : 1 }}>
              <Mail size={15} /> {emailStatus === "sending" ? "Sending…" : "Re-send email to Dom"}
            </button>
          )}
          <button onClick={() => setView({ name: "jobform", id: job.id })} style={btnGhost}><Pencil size={14} /> Edit</button>
          <button onClick={() => setConfirmDel(true)} style={{ ...btnGhost, color: C.redInk }}><Trash2 size={14} /> Delete</button>
        </div>

        {job.status === "completed" && (
          <div style={{ marginTop: 14, background: emailStatus === "failed" ? C.amberBg : C.greenBg, color: emailStatus === "failed" ? C.amberInk : C.greenInk, borderRadius: 8, padding: "10px 12px", fontSize: 13 }}>
            Completed {fmtDate(job.completedAt)}.{" "}
            {emailStatus === "sending" && <>Notifying billing ({BILLING_EMAIL})…</>}
            {emailStatus === "sent" && <>Billing ({BILLING_EMAIL}) was emailed automatically.</>}
            {emailStatus === "idle" && <>Use the button above to email billing ({BILLING_EMAIL}).</>}
            {emailStatus === "failed" && (() => { const m = buildEmail(job, cname); return (<>Automatic email didn't go through — <a href={mailtoLink(BILLING_EMAIL, m.subject, m.body)} style={{ color: C.amberInk, fontWeight: 700 }}>send it manually</a>.</>); })()}
          </div>
        )}
      </div>

      <SectionTitle>Billable detail</SectionTitle>
      <Card>
        {jobServices(job).length === 0 && <div style={{ color: C.muted, fontSize: 14 }}>No services were tagged on this job.</div>}
        {job.prep.on && <Detail title="Prep" rows={[[PREP_LABEL[job.prep.type], ""], ["Units prepped", num(job.prep.units)], ["Pallets used (order)", num(job.prep.pallets)]]} />}
        {job.cross.on && <Detail title="Cross docking" rows={[["Pallets", num(job.cross.pallets)], ["Items", num(job.cross.items)], ["Forwarded to", job.cross.destination]]} />}
        {job.sanit.on && <Detail title="Sanitization" rows={[["Units sanitized", num(job.sanit.units)]]} />}
        {job.storage.on && <Detail title="Storage" rows={[["Pallets stored", num(job.storage.pallets)], ["Items stored", num(job.storage.items)], ["Start date", fmtDate(job.storage.startDate)]]} />}
        {job.freight.on && <FreightDetail freight={job.freight} />}
        {job.labor.on && <Detail title="Labor" rows={[["Boxes made", num(job.labor.boxes)], ["Other labor", job.labor.otherDesc], ["Hours", num(job.labor.otherHours)], ["Labor cost", money(job.labor.otherCost)]]} />}
      </Card>

      {job.notes && (
        <>
          <SectionTitle>Notes / problems</SectionTitle>
          <Card><div style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.5 }}>{job.notes}</div></Card>
        </>
      )}

      {confirmDel && (
        <Modal onClose={() => setConfirmDel(false)} title="Delete this job?">
          <p style={{ color: C.muted, fontSize: 14, marginTop: 0 }}>This can't be undone.</p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button onClick={() => setConfirmDel(false)} style={btnGhost}>Keep job</button>
            <button onClick={() => { onDelete(job.id); setView(client ? { name: "client", id: client.id } : { name: "dashboard" }); }} style={btnDanger}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function FreightDetail({ freight }) {
  const trucks = freightTrucks(freight);
  const tot = freightTotals(freight);
  return (
    <div style={{ padding: "12px 0", borderTop: `1px solid ${C.line}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8, gap: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>Freight</div>
        <div style={{ fontFamily: MONO, fontSize: 12.5, color: C.muted }}>
          {tot.count} truck{tot.count === 1 ? "" : "s"} · {tot.pallets} pallets · {money(tot.cost)}
        </div>
      </div>
      <div>
        {trucks.map((t, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 12, alignItems: "center", fontSize: 13.5, padding: "7px 0", borderBottom: i < trucks.length - 1 ? `1px solid ${C.line}` : "none" }}>
            <span style={{ fontFamily: MONO, fontWeight: 700, color: C.slate }}>#{i + 1}</span>
            <span style={{ fontFamily: MONO }}>{t.fba || "—"}</span>
            <span style={{ color: C.muted, fontFamily: MONO }}>{num(t.pallets) !== "" ? `${t.pallets} plt` : ""}</span>
            <span style={{ fontFamily: MONO, fontWeight: 600 }}>{money(t.cost)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Detail({ title, rows, mono }) {
  const shown = rows.filter(([, v]) => v !== "" && v != null && v !== "—");
  return (
    <div style={{ padding: "12px 0", borderTop: `1px solid ${C.line}` }}>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{title}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "8px 24px" }}>
        {shown.length === 0 ? <div style={{ color: C.muted, fontSize: 13 }}>Included</div> :
          shown.map(([k, v], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13.5 }}>
              <span style={{ color: C.muted }}>{k}</span>
              <span style={{ fontFamily: mono ? MONO : SANS, fontWeight: 600, textAlign: "right" }}>{v}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

/* ---- shared UI bits ------------------------------------------------------ */
function Service({ icon, title, subtitle, on, onToggle, children }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${on ? C.slate : C.line}`, borderRadius: 12, marginBottom: 10, overflow: "hidden", transition: "border-color .15s" }}>
      <button onClick={onToggle} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", background: on ? "#FBF6F2" : "transparent", border: "none", cursor: "pointer", fontFamily: SANS, textAlign: "left" }}>
        <span style={{ color: on ? C.slate : C.muted }}>{icon}</span>
        <span style={{ flex: 1 }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>{title}</span>
          {subtitle && <span style={{ color: C.muted, fontSize: 12.5, display: "block", marginTop: 1 }}>{subtitle}</span>}
        </span>
        <span style={{ width: 40, height: 22, borderRadius: 99, background: on ? C.slate : "#D7D5CD", position: "relative", transition: "background .15s", flexShrink: 0 }}>
          <span style={{ position: "absolute", top: 2, left: on ? 20 : 2, width: 18, height: 18, borderRadius: 99, background: "#fff", transition: "left .15s" }} />
        </span>
      </button>
      {on && <div style={{ padding: "4px 16px 16px", display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>}
    </div>
  );
}

const Row = ({ children }) => <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>{children}</div>;
const Card = ({ children }) => <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 18 }}>{children}</div>;
const SectionTitle = ({ children }) => <div style={{ fontSize: 13, fontWeight: 700, color: C.slateSoft, textTransform: "uppercase", letterSpacing: 0.6, margin: "8px 4px 10px" }}>{children}</div>;
const Empty = ({ text }) => <div style={{ background: C.card, border: `1px dashed ${C.line}`, borderRadius: 12, padding: "34px 20px", textAlign: "center", color: C.muted, fontSize: 14 }}>{text}</div>;

function Field({ label, children }) {
  return <label style={{ display: "block" }}><span style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.slateSoft, marginBottom: 5 }}>{label}</span>{children}</label>;
}
function NumField({ label, value, onChange, money }) {
  return <Field label={label}><input type="number" min="0" step={money ? "0.01" : "1"} value={value} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle, fontFamily: MONO }} placeholder={money ? "0.00" : "0"} /></Field>;
}
function Info({ icon, label, value }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.muted, fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{icon}{label}</div>
      <div style={{ fontSize: 14, marginTop: 4, whiteSpace: "pre-wrap" }}>{value || "—"}</div>
    </div>
  );
}
function Stamp({ status }) {
  const done = status === "completed";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: MONO, fontSize: 11.5, fontWeight: 700, letterSpacing: 0.5, padding: "4px 10px", borderRadius: 99, background: done ? C.greenBg : C.amberBg, color: done ? C.greenInk : C.amberInk }}>
      {done ? <CheckCircle2 size={13} /> : <Clock size={13} />}{done ? "COMPLETED" : "IN PROGRESS"}
    </span>
  );
}
function BackLink({ onClick, children }) {
  return <button onClick={onClick} style={{ ...linkBtn, marginBottom: 14 }}><ArrowLeft size={15} /> {children}</button>;
}
function Modal({ title, children, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(20,24,28,.45)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 20, zIndex: 20, overflowY: "auto" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: C.card, borderRadius: 14, width: "100%", maxWidth: 460, padding: 22, marginTop: "6vh", boxShadow: "0 24px 60px rgba(0,0,0,.3)", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted }}><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---- email + csv --------------------------------------------------------- */
function buildEmail(j, cname) {
  const lines = [`Client: ${cname}`, `Job date: ${fmtDate(j.jobDate)}`, j.reference ? `Reference: ${j.reference}` : "", "", "Services & billable detail:"];
  if (j.prep.on) lines.push(`• ${PREP_LABEL[j.prep.type]} — units: ${num(j.prep.units) || 0}, pallets used: ${num(j.prep.pallets) || 0}`);
  if (j.cross.on) lines.push(`• Cross dock — pallets: ${num(j.cross.pallets) || 0}, items: ${num(j.cross.items) || 0}, to: ${j.cross.destination || "—"}`);
  if (j.sanit.on) lines.push(`• Sanitization — units: ${num(j.sanit.units) || 0}`);
  if (j.storage.on) lines.push(`• Storage — pallets: ${num(j.storage.pallets) || 0}, items: ${num(j.storage.items) || 0}, since: ${fmtDate(j.storage.startDate)}`);
  if (j.freight.on) {
    const tr = freightTrucks(j.freight), tt = freightTotals(j.freight);
    lines.push(`• Freight — ${tt.count} truck${tt.count === 1 ? "" : "s"}, ${tt.pallets} pallets, total ${money(tt.cost)}`);
    tr.forEach((t, i) => lines.push(`    Truck ${i + 1}: FBA ${t.fba || "—"}, cost ${money(t.cost)}${num(t.pallets) !== "" ? `, ${t.pallets} pallets` : ""}`));
  }
  if (j.labor.on) lines.push(`• Labor — boxes made: ${num(j.labor.boxes) || 0}${j.labor.otherDesc ? `, other: ${j.labor.otherDesc}` : ""}${j.labor.otherHours ? ` (${j.labor.otherHours} hrs)` : ""}${j.labor.otherCost ? `, cost: ${money(j.labor.otherCost)}` : ""}`);
  if (j.notes) lines.push("", `Notes/problems: ${j.notes}`);
  const subject = `Job completed — ${cname} — ${fmtDate(j.jobDate)}`;
  return { subject, body: lines.filter((l) => l !== undefined).join("\n") };
}
function mailtoLink(to, subject, body) {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function freightRow(j) {
  if (!j.freight?.on) return ["", "", "", "", ""];
  const tt = freightTotals(j.freight), tr = freightTrucks(j.freight);
  const detail = tr.map((x, i) => `T${i + 1} ${x.fba || "-"} ${money(x.cost)}${num(x.pallets) !== "" ? ` ${x.pallets}plt` : ""}`).join(" | ");
  return [tt.count, tt.pallets, tt.cost, tr.map((x) => x.fba).filter(Boolean).join("; "), detail];
}

function exportCSV(jobs, clients) {
  const cmap = Object.fromEntries(clients.map((c) => [c.id, c]));
  const head = [
    "Job date", "Status", "Completed", "Business", "Contact", "Reference",
    "Prep type", "Units prepped", "Pallets used",
    "Cross-dock pallets", "Cross-dock items", "Cross-dock to",
    "Sanitized units", "Storage pallets", "Storage items", "Storage start",
    "Freight trucks", "Freight pallets", "Freight cost", "FBA numbers", "Freight detail",
    "Boxes made", "Other labor", "Labor hours", "Labor cost", "Notes",
  ];
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = jobs.map((j) => {
    const c = cmap[j.clientId] || {};
    return [
      j.jobDate, j.status === "completed" ? "Completed" : "In progress", j.completedAt || "",
      c.businessName || "", c.name || "", j.reference || "",
      j.prep.on ? PREP_LABEL[j.prep.type] : "", j.prep.on ? j.prep.units : "", j.prep.on ? j.prep.pallets : "",
      j.cross.on ? j.cross.pallets : "", j.cross.on ? j.cross.items : "", j.cross.on ? j.cross.destination : "",
      j.sanit.on ? j.sanit.units : "", j.storage.on ? j.storage.pallets : "", j.storage.on ? j.storage.items : "", j.storage.on ? j.storage.startDate : "",
      ...freightRow(j),
      j.labor.on ? j.labor.boxes : "", j.labor.on ? j.labor.otherDesc : "", j.labor.on ? j.labor.otherHours : "", j.labor.on ? j.labor.otherCost : "",
      j.notes || "",
    ].map(esc).join(",");
  });
  const csv = [head.map(esc).join(","), ...rows].join("\n");
  try {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `best3pl-jobs-${today()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch {
    alert("Couldn't download here. Open this artifact in a full browser tab to export.");
  }
}

/* ---- styles -------------------------------------------------------------- */
const inputStyle = {
  width: "100%", boxSizing: "border-box", padding: "10px 12px", fontSize: 14,
  border: `1px solid ${C.line}`, borderRadius: 9, background: "#fff", color: C.ink,
  fontFamily: SANS, outlineColor: C.blue,
};
const btnBase = { display: "inline-flex", alignItems: "center", gap: 7, fontFamily: SANS, fontSize: 14, fontWeight: 600, border: "none", borderRadius: 9, padding: "9px 15px", cursor: "pointer" };
const btnPrimary = { ...btnBase, background: C.slate, color: "#fff" };
const btnSuccess = { ...btnBase, background: C.greenInk, color: "#fff" };
const btnDanger = { ...btnBase, background: C.redInk, color: "#fff" };
const btnGhost = { ...btnBase, background: "#fff", color: C.slate, border: `1px solid ${C.line}` };
const linkBtn = { display: "inline-flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", color: C.slateSoft, fontSize: 13.5, fontWeight: 600, fontFamily: SANS, padding: 0 };

/* ---- mount --------------------------------------------------------------- */
const rootEl = document.getElementById("root");
if (rootEl) createRoot(rootEl).render(<App />);

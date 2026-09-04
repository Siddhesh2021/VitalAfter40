import { useState, useRef, useEffect } from "react";
import { Lang, t, programs, professionals } from "./data";
import {
  AreaChart, Area, BarChart as RBarChart, Bar, LineChart as RLineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  FunnelChart, Funnel, LabelList,
} from "recharts";

interface Props { lang: Lang; setLang: (l: Lang) => void; onBack: () => void; }

// ─── Admin colour tokens ────────────────────────────────────────────────
const A = {
  sidebar:   "#0d0f14",
  sideHover: "rgba(255,255,255,0.05)",
  sideActive:"rgba(101,136,87,0.18)",
  border:    "#1e2129",
  surface:   "#ffffff",
  muted:     "#f5f6f8",
  ink:       "#0d0f14",
  ink60:     "#5a6172",
  ink30:     "#b8bcc8",
  sage:      "#658857",
  sagePale:  "#eef2ea",
  gold:      "#b8965a",
  red:       "#c0392b",
  blue:      "#2e5fa8",
  label:     "0.6875rem",
};

// ─── Mock data ───────────────────────────────────────────────────────────
const METRICS = [
  { id: "users",       icon: "👥", label: "Total Users",          value: "2,847",  delta: "+124 this wk",  pos: true },
  { id: "leads",       icon: "📥", label: "New Leads",            value: "318",    delta: "+47 vs last wk", pos: true },
  { id: "assessments", icon: "📋", label: "Assessments",          value: "1,204",  delta: "42% completion", pos: true },
  { id: "conv",        icon: "💰", label: "Conversions",          value: "284",    delta: "23.6% rate",     pos: true },
  { id: "revenue",     icon: "₹",  label: "Revenue (MTD)",        value: "₹8.4L",  delta: "+18% vs last mo",pos: true },
  { id: "sessions",    icon: "📡", label: "Upcoming Sessions",    value: "47",     delta: "Next 7 days",    pos: null },
  { id: "programs",    icon: "🎯", label: "Active Programs",      value: "6",      delta: "1 launching soon",pos: null },
  { id: "whatsapp",    icon: "💬", label: "WhatsApp Leads",       value: "193",    delta: "+29 this week",  pos: true },
];

const REVENUE_DATA = [
  { mo: "Mar", rev: 280000, leads: 180, conv: 42 },
  { mo: "Apr", rev: 320000, leads: 210, conv: 51 },
  { mo: "May", rev: 410000, leads: 245, conv: 58 },
  { mo: "Jun", rev: 380000, leads: 230, conv: 54 },
  { mo: "Jul", rev: 520000, leads: 298, conv: 72 },
  { mo: "Aug", rev: 840000, leads: 318, conv: 284 },
];

const FUNNEL_DATA = [
  { name: "Visitors",     value: 8420, fill: "#658857" },
  { name: "Assessment",   value: 2847, fill: "#7a9f6a" },
  { name: "Leads",        value: 1204, fill: "#93b684" },
  { name: "Conversions",  value: 284,  fill: "#b8965a" },
];

const PROGRAM_DATA = [
  { name: "Pilates",     group: 124, individual: 38, recorded: 67 },
  { name: "Nutrition",   group: 52,  individual: 28, recorded: 0 },
  { name: "Physio",      group: 0,   individual: 44, recorded: 0 },
  { name: "Strength",    group: 38,  individual: 12, recorded: 44 },
  { name: "Doctor",      group: 0,   individual: 62, recorded: 0 },
  { name: "Hormonal",    group: 0,   individual: 31, recorded: 0 },
];

const AGE_DATA = [
  { age: "40–44", count: 480 }, { age: "45–49", count: 720 },
  { age: "50–54", count: 890 }, { age: "55–59", count: 512 },
  { age: "60–64", count: 198 }, { age: "65+",   count: 47  },
];

const LANG_DATA = [
  { name: "English", value: 62, fill: "#658857" },
  { name: "Marathi", value: 38, fill: "#b8965a" },
];

const FORMAT_DATA = [
  { name: "Live",     value: 58, fill: "#2e5fa8" },
  { name: "Recorded", value: 42, fill: "#658857" },
];

const GOALS_DATA = [
  { goal: "Pain relief",     pct: 68 },
  { goal: "Weight",          pct: 54 },
  { goal: "Energy",          pct: 82 },
  { goal: "Strength",        pct: 61 },
  { goal: "Mobility",        pct: 77 },
  { goal: "Hormonal",        pct: 43 },
];

const USERS_DATA = [
  { id: 1, name: "Meera Joshi",       phone: "98765 43210", age: 52, lang: "MR", goal: "Mobility", program: "Pilates", assessment: true,  status: "active",   activity: "2h ago" },
  { id: 2, name: "Sunita Patil",      phone: "91234 56789", age: 47, lang: "EN", goal: "Weight",   program: "Nutrition",assessment: true,  status: "active",   activity: "1d ago" },
  { id: 3, name: "Rajesh Sharma",     phone: "98877 65432", age: 55, lang: "EN", goal: "Strength", program: "Physio",  assessment: true,  status: "active",   activity: "3h ago" },
  { id: 4, name: "Anita Kulkarni",    phone: "97654 32109", age: 49, lang: "MR", goal: "Energy",   program: "—",       assessment: false, status: "lead",     activity: "5m ago" },
  { id: 5, name: "Prakash Deshpande", phone: "96543 21098", age: 61, lang: "EN", goal: "Pain",     program: "Doctor",  assessment: true,  status: "active",   activity: "Yesterday" },
  { id: 6, name: "Kavita Bhat",       phone: "95432 10987", age: 44, lang: "MR", goal: "Hormonal", program: "Hormonal",assessment: true,  status: "inactive", activity: "5d ago" },
  { id: 7, name: "Suresh Naik",       phone: "94321 09876", age: 58, lang: "EN", goal: "Mobility", program: "Pilates", assessment: true,  status: "active",   activity: "1h ago" },
  { id: 8, name: "Priya Mehta",       phone: "93210 98765", age: 45, lang: "MR", goal: "Strength", program: "—",       assessment: false, status: "lead",     activity: "10m ago" },
];

const BATCHES_DATA = [
  { id: 1, program: "Group Pilates",   trainer: "Priya Nair",       days: "Mon/Wed/Fri", time: "7:00 AM", lang: "EN+MR", capacity: 12, booked: 9,  status: "active" },
  { id: 2, program: "Group Pilates",   trainer: "Priya Nair",       days: "Tue/Thu/Sat", time: "9:00 AM", lang: "EN",    capacity: 12, booked: 12, status: "full" },
  { id: 3, program: "Group Pilates",   trainer: "Priya Nair",       days: "Mon/Wed/Fri", time: "6:00 PM", lang: "MR",    capacity: 12, booked: 4,  status: "active" },
  { id: 4, program: "Group Strength",  trainer: "Amit Verma",       days: "Mon/Thu",     time: "8:00 AM", lang: "EN",    capacity: 10, booked: 7,  status: "active" },
  { id: 5, program: "Nutrition Class", trainer: "Sneha Deshpande",  days: "Wednesday",   time: "6:00 PM", lang: "EN+MR", capacity: 8,  booked: 5,  status: "active" },
];

const SESSIONS_DATA = [
  { id: 1, date: "Mon, 26 Aug", time: "7:00 AM", program: "Group Pilates",  trainer: "Priya Nair",    enrolled: 9,  attended: null, status: "upcoming" },
  { id: 2, date: "Mon, 26 Aug", time: "9:00 AM", program: "Group Pilates",  trainer: "Priya Nair",    enrolled: 12, attended: null, status: "upcoming" },
  { id: 3, date: "Mon, 26 Aug", time: "6:00 PM", program: "Nutrition",      trainer: "Sneha Deshpande",enrolled: 5, attended: null, status: "upcoming" },
  { id: 4, date: "Fri, 23 Aug", time: "7:00 AM", program: "Group Pilates",  trainer: "Priya Nair",    enrolled: 9,  attended: 8,   status: "done" },
  { id: 5, date: "Wed, 21 Aug", time: "9:00 AM", program: "Group Pilates",  trainer: "Priya Nair",    enrolled: 12, attended: 11,  status: "done" },
];

const QUESTIONS_DATA = [
  { id: "q1",  order: 1,  type: "single",   en: "What is your primary health goal?",   mr: "तुमचे प्राथमिक आरोग्य उद्दिष्ट काय आहे?",   opts_en: ["Pain relief","Mobility","Strength","Weight","Energy","Hormonal balance"], condition: null },
  { id: "q2",  order: 2,  type: "single",   en: "Where do you feel discomfort most?",  mr: "तुम्हाला सर्वाधिक अस्वस्थता कुठे जाणवते?",   opts_en: ["Lower back","Neck","Knees","Hips","Shoulders","None"], condition: null },
  { id: "q3",  order: 3,  type: "single",   en: "How active are you currently?",       mr: "तुम्ही सध्या किती सक्रिय आहात?",              opts_en: ["Sedentary","Light","Moderate","Active"], condition: null },
  { id: "q4",  order: 4,  type: "multi",    en: "What have you tried before?",         mr: "तुम्ही आधी काय केले आहे?",                    opts_en: ["Gym","Yoga","Pilates","Physio","Nothing","Doctor"], condition: null },
  { id: "q5",  order: 5,  type: "single",   en: "How is your energy level?",           mr: "तुमची ऊर्जा पातळी कशी आहे?",                 opts_en: ["Very low","Low","Moderate","High"], condition: null },
];

const CMS_SECTIONS = [
  { id: "homepage",     icon: "🏠", label: "Homepage",    fields: 8,  complete: 8,  draft: 0 },
  { id: "programs",     icon: "🎯", label: "Programs",    fields: 48, complete: 44, draft: 4 },
  { id: "experts",      icon: "👥", label: "Experts",     fields: 24, complete: 24, draft: 0 },
  { id: "testimonials", icon: "💬", label: "Testimonials",fields: 18, complete: 14, draft: 4 },
  { id: "faqs",         icon: "❓", label: "FAQs",        fields: 20, complete: 16, draft: 2 },
  { id: "blogs",        icon: "📝", label: "Blog Posts",  fields: 12, complete: 8,  draft: 2 },
  { id: "pricing",      icon: "₹",  label: "Pricing",     fields: 16, complete: 16, draft: 0 },
  { id: "footer",       icon: "—",  label: "Footer",      fields: 10, complete: 10, draft: 0 },
];

const WA_TEMPLATES = [
  { id: 1, name: "Welcome",            status: "approved", sent: 1204, rate: "68%" },
  { id: 2, name: "Session Reminder",   status: "approved", sent: 847,  rate: "82%" },
  { id: 3, name: "Assessment Nudge",   status: "approved", sent: 628,  rate: "54%" },
  { id: 4, name: "Payment Confirmed",  status: "approved", sent: 284,  rate: "91%" },
  { id: 5, name: "Missed Session",     status: "pending",  sent: 0,    rate: "—"   },
];

const PAYMENTS_DATA = [
  { id: "TXN001", user: "Meera Joshi",       program: "Group Pilates",   amount: 8999,  date: "22 Aug 2026", method: "UPI",  status: "success" },
  { id: "TXN002", user: "Rajesh Sharma",     program: "Physiotherapy",   amount: 12999, date: "21 Aug 2026", method: "Card", status: "success" },
  { id: "TXN003", user: "Sunita Patil",      program: "Nutrition Plan",  amount: 6999,  date: "20 Aug 2026", method: "UPI",  status: "success" },
  { id: "TXN004", user: "Prakash Deshpande", program: "Doctor Consult",  amount: 2499,  date: "19 Aug 2026", method: "NB",   status: "success" },
  { id: "TXN005", user: "Anonymous",         program: "Hormonal Wellness",amount: 9999, date: "18 Aug 2026", method: "Card", status: "failed"  },
  { id: "TXN006", user: "Suresh Naik",       program: "Group Pilates",   amount: 8999,  date: "17 Aug 2026", method: "UPI",  status: "success" },
];

// ─── Sidebar ─────────────────────────────────────────────────────────────
type Section = "overview"|"users"|"assessments"|"programs"|"batches"|"sessions"|"experts"|"bookings"|"payments"|"whatsapp"|"cms"|"translations"|"analytics"|"settings";

const NAV_ITEMS: { id: Section; label: string; group?: string }[] = [
  { id: "overview",     label: "Dashboard",     group: "Main" },
  { id: "users",        label: "Users",         group: "CRM" },
  { id: "assessments",  label: "Assessments",   group: "CRM" },
  { id: "programs",     label: "Programs",      group: "Operations" },
  { id: "batches",      label: "Batches",       group: "Operations" },
  { id: "sessions",     label: "Sessions",      group: "Operations" },
  { id: "experts",      label: "Experts",       group: "Operations" },
  { id: "bookings",     label: "Bookings",      group: "Operations" },
  { id: "payments",     label: "Payments",      group: "Finance" },
  { id: "whatsapp",     label: "WhatsApp",      group: "Marketing" },
  { id: "cms",          label: "Content (CMS)", group: "Content" },
  { id: "translations", label: "Translations",  group: "Content" },
  { id: "analytics",    label: "Analytics",     group: "Insights" },
  { id: "settings",     label: "Settings",      group: "System" },
];

const ICONS: Record<Section, string> = {
  overview: "▪", users: "◈", assessments: "◧", programs: "◉", batches: "◫",
  sessions: "◱", experts: "◎", bookings: "◈", payments: "₹", whatsapp: "◌",
  cms: "◪", translations: "◫", analytics: "◤", settings: "◇",
};

function Sidebar({ section, setSection, onBack }: { section: Section; setSection: (s: Section) => void; onBack: () => void }) {
  const groups = [...new Set(NAV_ITEMS.map(n => n.group!))];
  return (
    <aside style={{ background: A.sidebar, width: 210, minHeight: "100dvh", display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100dvh", overflowY: "auto" }}>
      {/* Logo */}
      <div style={{ padding: "1.25rem 1rem 1rem", borderBottom: `1px solid ${A.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: A.sage, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.75rem", fontWeight: 600, flexShrink: 0 }}>V</div>
          <span style={{ color: "#fff", fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 500, letterSpacing: "-0.01em" }}>VitalAfter40</span>
        </div>
        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.6rem", letterSpacing: "0.08em", textTransform: "uppercase", paddingLeft: "0.25rem" }}>Admin Console</span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0.75rem 0", overflowY: "auto" }}>
        {groups.map(group => (
          <div key={group} style={{ marginBottom: "0.25rem" }}>
            <div style={{ padding: "0.75rem 1rem 0.375rem", color: "rgba(255,255,255,0.2)", fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>{group}</div>
            {NAV_ITEMS.filter(n => n.group === group).map(item => {
              const active = section === item.id;
              return (
                <button key={item.id} onClick={() => setSection(item.id)}
                  style={{ display: "flex", alignItems: "center", gap: "0.625rem", width: "100%", padding: "0.5rem 1rem", textAlign: "left", background: active ? A.sideActive : "transparent", borderRadius: "0 4px 4px 0", borderLeft: active ? `2px solid ${A.sage}` : "2px solid transparent", color: active ? "#fff" : "rgba(255,255,255,0.45)", fontSize: "0.8125rem", fontWeight: active ? 500 : 400, transition: "all 0.15s ease", cursor: "pointer" }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = A.sideHover; }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                  <span style={{ fontSize: "0.75rem", opacity: 0.7, width: 14, textAlign: "center", flexShrink: 0 }}>{ICONS[item.id]}</span>
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ borderTop: `1px solid ${A.border}`, padding: "0.75rem 1rem" }}>
        <button onClick={onBack}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", cursor: "pointer", width: "100%", padding: "0.375rem 0" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"}>
          ← Exit admin
        </button>
      </div>
    </aside>
  );
}

// ─── Shared: TopBar ───────────────────────────────────────────────────────
function TopBar({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
      <div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", fontWeight: 600, color: A.ink, letterSpacing: "-0.025em", lineHeight: 1.2 }}>{title}</h1>
        {subtitle && <p style={{ color: A.ink60, fontSize: "0.8125rem", marginTop: "0.125rem" }}>{subtitle}</p>}
      </div>
      {action && <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>{action}</div>}
    </div>
  );
}

// ─── Shared: Btn ─────────────────────────────────────────────────────────
function Btn({ children, variant = "primary", onClick, size = "sm" }: { children: React.ReactNode; variant?: "primary"|"ghost"|"danger"|"outline"; onClick?: () => void; size?: "sm"|"xs" }) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: A.sage,  color: "#fff", border: `1px solid ${A.sage}` },
    ghost:   { background: "transparent", color: A.ink60, border: `1px solid ${A.border}` },
    outline: { background: "#fff", color: A.ink, border: `1px solid ${A.border}` },
    danger:  { background: "transparent", color: A.red, border: `1px solid rgba(192,57,43,0.3)` },
  };
  const px = size === "xs" ? "0.5rem" : "0.75rem";
  const py = size === "xs" ? "0.25rem" : "0.4375rem";
  return (
    <button onClick={onClick} style={{ ...styles[variant], padding: `${py} ${px}`, borderRadius: 6, fontSize: "0.75rem", fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.375rem", whiteSpace: "nowrap", transition: "opacity 0.15s ease" }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.8"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}>
      {children}
    </button>
  );
}

// ─── Shared: Pill ────────────────────────────────────────────────────────
function Pill({ label, color }: { label: string; color?: string }) {
  const colors: Record<string, [string, string]> = {
    active:   ["#e8f5e9","#2e7d32"],
    inactive: ["#f5f5f5","#777"],
    lead:     ["#fff8e1","#b8965a"],
    full:     ["#fce4ec","#c0392b"],
    done:     ["#e8f5e9","#2e7d32"],
    upcoming: ["#e3f2fd","#1565c0"],
    success:  ["#e8f5e9","#2e7d32"],
    failed:   ["#fce4ec","#c0392b"],
    approved: ["#e8f5e9","#2e7d32"],
    pending:  ["#fff8e1","#b8965a"],
    complete: ["#eef2ea","#658857"],
    draft:    ["#fff8e1","#b8965a"],
    missing:  ["#fce4ec","#c0392b"],
  };
  const [bg, fg] = colors[label.toLowerCase()] || ["#f0f0f0","#555"];
  return <span style={{ background: color ?? bg, color: fg, padding: "0.125rem 0.5rem", borderRadius: 4, fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.04em", textTransform: "capitalize" }}>{label}</span>;
}

// ─── Shared: Table wrapper ────────────────────────────────────────────────
function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${A.border}` }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
        <thead>
          <tr style={{ background: A.muted }}>
            {headers.map(h => (
              <th key={h} style={{ padding: "0.625rem 0.875rem", textAlign: "left", color: A.ink60, fontWeight: 600, fontSize: "0.6875rem", letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap", borderBottom: `1px solid ${A.border}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody style={{ background: "#fff" }}>{children}</tbody>
      </table>
    </div>
  );
}

function TR({ children, onClick, hover = true }: { children: React.ReactNode; onClick?: () => void; hover?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <tr onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ borderBottom: `1px solid ${A.border}`, background: hov && hover ? A.muted : "#fff", cursor: onClick ? "pointer" : "default", transition: "background 0.12s ease" }}>
      {children}
    </tr>
  );
}

function TD({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
  return <td style={{ padding: "0.625rem 0.875rem", color: A.ink, fontFamily: mono ? "var(--font-mono)" : undefined, fontSize: mono ? "0.75rem" : undefined, whiteSpace: "nowrap" }}>{children}</td>;
}

// ─── Shared: Drawer ───────────────────────────────────────────────────────
function Drawer({ open, onClose, title, width = 420, children }: { open: boolean; onClose: () => void; title: string; width?: number; children: React.ReactNode }) {
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 40, opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity 0.25s ease" }}/>
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width, background: "#fff", zIndex: 50, transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform 0.28s cubic-bezier(0.16,1,0.3,1)", display: "flex", flexDirection: "column", boxShadow: "-8px 0 40px rgba(0,0,0,0.12)" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: `1px solid ${A.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.0625rem", fontWeight: 600, color: A.ink, letterSpacing: "-0.02em" }}>{title}</h2>
          <button onClick={onClose} style={{ color: A.ink60, fontSize: "1.125rem", cursor: "pointer", padding: "0.25rem" }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>{children}</div>
      </div>
    </>
  );
}

// ─── Shared: Field ────────────────────────────────────────────────────────
function Field({ label, value, onChange, multiline }: { label: string; value: string; onChange?: (v: string) => void; multiline?: boolean }) {
  const style: React.CSSProperties = { width: "100%", padding: "0.5rem 0.625rem", border: `1px solid ${A.border}`, borderRadius: 6, fontSize: "0.8125rem", color: A.ink, background: onChange ? "#fff" : A.muted, resize: "vertical" as const, fontFamily: "inherit", outline: "none", boxSizing: "border-box" };
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", color: A.ink60, fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.375rem" }}>{label}</label>
      {multiline
        ? <textarea style={{ ...style, minHeight: 80 }} value={value} onChange={e => onChange?.(e.target.value)} readOnly={!onChange}/>
        : <input style={style} value={value} onChange={e => onChange?.(e.target.value)} readOnly={!onChange}/>}
    </div>
  );
}

// ─── Shared: SectionCard ─────────────────────────────────────────────────
function SectionCard({ title, action, children }: { title?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", borderRadius: 10, border: `1px solid ${A.border}`, overflow: "hidden", marginBottom: "1.25rem" }}>
      {title && (
        <div style={{ padding: "0.875rem 1.25rem", borderBottom: `1px solid ${A.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 600, fontSize: "0.875rem", color: A.ink, letterSpacing: "-0.01em" }}>{title}</span>
          {action}
        </div>
      )}
      <div style={{ padding: "1.25rem" }}>{children}</div>
    </div>
  );
}

// ─── Chart helpers ────────────────────────────────────────────────────────
const TTIP_STYLE: React.CSSProperties = { background: A.ink, border: "none", borderRadius: 6, color: "#fff", fontSize: "0.75rem", padding: "0.375rem 0.625rem" };
const AXIS_STYLE = { fontSize: "0.65rem", fill: A.ink60 };

// ═══════════════════════════════════════════════════════════════════════════
// OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════
function OverviewSection() {
  return (
    <div>
      <TopBar title="Dashboard" subtitle="Monday, 25 August 2026 · VitalAfter40 Admin"/>

      {/* Metrics grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", marginBottom: "1.25rem" }}>
        {METRICS.map(m => (
          <div key={m.id} style={{ background: "#fff", border: `1px solid ${A.border}`, borderRadius: 10, padding: "1rem 1.125rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.875rem" }}>{m.icon}</span>
              {m.pos !== null && <span style={{ fontSize: "0.6rem", fontWeight: 600, color: m.pos ? "#2e7d32" : "#c0392b", background: m.pos ? "#e8f5e9" : "#fce4ec", padding: "0.1rem 0.375rem", borderRadius: 3 }}>↑</span>}
            </div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "1.375rem", fontWeight: 700, color: A.ink, lineHeight: 1, marginBottom: "0.25rem" }}>{m.value}</p>
            <p style={{ color: A.ink60, fontSize: "0.6875rem", fontWeight: 600, marginBottom: "0.125rem" }}>{m.label}</p>
            <p style={{ color: A.ink30, fontSize: "0.625rem" }}>{m.delta}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
        <SectionCard title="Revenue & Conversions (6 months)">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={REVENUE_DATA} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={A.sage} stopOpacity={0.25}/>
                  <stop offset="100%" stopColor={A.sage} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={A.gold} stopOpacity={0.25}/>
                  <stop offset="100%" stopColor={A.gold} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={A.border} vertical={false}/>
              <XAxis dataKey="mo" tick={AXIS_STYLE} axisLine={false} tickLine={false}/>
              <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} width={48} tickFormatter={v => v >= 100000 ? `₹${v/100000}L` : String(v)}/>
              <Tooltip contentStyle={TTIP_STYLE} formatter={(v: unknown, n: unknown) => { const num = Number(v); const name = String(n); return [name === "rev" ? `₹${(num/1000).toFixed(0)}K` : num, name === "rev" ? "Revenue" : "Conversions"]; }}/>
              <Area type="monotone" dataKey="rev" stroke={A.sage} fill="url(#revGrad)" strokeWidth={2}/>
              <Area type="monotone" dataKey="conv" stroke={A.gold} fill="url(#convGrad)" strokeWidth={2}/>
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Lead Funnel">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", paddingTop: "0.25rem" }}>
            {FUNNEL_DATA.map((f, i) => (
              <div key={f.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                  <span style={{ color: A.ink60, fontSize: "0.75rem" }}>{f.name}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 600, color: A.ink }}>{f.value.toLocaleString()}</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: A.muted }}>
                  <div style={{ height: "100%", borderRadius: 3, background: f.fill, width: `${(f.value/FUNNEL_DATA[0].value)*100}%`, transition: "width 1s ease" }}/>
                </div>
                {i < FUNNEL_DATA.length - 1 && (
                  <p style={{ color: A.ink30, fontSize: "0.6rem", textAlign: "right", marginTop: "0.125rem" }}>
                    {Math.round((FUNNEL_DATA[i+1].value/f.value)*100)}% →
                  </p>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
        <SectionCard title="Programs — Group/Indiv/Recorded">
          <ResponsiveContainer width="100%" height={160}>
            <RBarChart data={PROGRAM_DATA} margin={{ top: 0, right: 0, bottom: 0, left: -20 }} barSize={6}>
              <CartesianGrid strokeDasharray="3 3" stroke={A.border} vertical={false}/>
              <XAxis dataKey="name" tick={{ ...AXIS_STYLE, fontSize: "0.6rem" }} axisLine={false} tickLine={false}/>
              <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={TTIP_STYLE}/>
              <Bar dataKey="group" fill={A.sage} stackId="a" radius={[0,0,0,0]}/>
              <Bar dataKey="individual" fill={A.gold} stackId="a" radius={[0,0,0,0]}/>
              <Bar dataKey="recorded" fill={A.blue} stackId="a" radius={[3,3,0,0]}/>
            </RBarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Age Distribution">
          <ResponsiveContainer width="100%" height={160}>
            <RBarChart data={AGE_DATA} barSize={18} margin={{ top: 0, right: 0, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={A.border} vertical={false}/>
              <XAxis dataKey="age" tick={{ ...AXIS_STYLE, fontSize: "0.6rem" }} axisLine={false} tickLine={false}/>
              <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={TTIP_STYLE}/>
              <Bar dataKey="count" fill={A.sage} radius={[3,3,0,0]}>
                {AGE_DATA.map((_, i) => <Cell key={i} fill={i === 2 ? A.sage : `${A.sage}88`}/>)}
              </Bar>
            </RBarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Language / Format">
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", paddingTop: "0.25rem" }}>
            <div>
              <p style={{ color: A.ink60, fontSize: "0.65rem", textAlign: "center", marginBottom: "0.25rem" }}>Language</p>
              <PieChart width={110} height={110}>
                <Pie data={LANG_DATA} cx={50} cy={50} innerRadius={28} outerRadius={48} paddingAngle={2} dataKey="value">
                  {LANG_DATA.map((e, i) => <Cell key={i} fill={e.fill}/>)}
                </Pie>
                <Tooltip contentStyle={TTIP_STYLE}/>
              </PieChart>
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "-0.5rem" }}>
                {LANG_DATA.map(l => <span key={l.name} style={{ fontSize: "0.58rem", color: A.ink60 }}><span style={{ color: l.fill }}>●</span> {l.name}</span>)}
              </div>
            </div>
            <div>
              <p style={{ color: A.ink60, fontSize: "0.65rem", textAlign: "center", marginBottom: "0.25rem" }}>Format</p>
              <PieChart width={110} height={110}>
                <Pie data={FORMAT_DATA} cx={50} cy={50} innerRadius={28} outerRadius={48} paddingAngle={2} dataKey="value">
                  {FORMAT_DATA.map((e, i) => <Cell key={i} fill={e.fill}/>)}
                </Pie>
                <Tooltip contentStyle={TTIP_STYLE}/>
              </PieChart>
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "-0.5rem" }}>
                {FORMAT_DATA.map(l => <span key={l.name} style={{ fontSize: "0.58rem", color: A.ink60 }}><span style={{ color: l.fill }}>●</span> {l.name}</span>)}
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// USERS
// ═══════════════════════════════════════════════════════════════════════════
function UsersSection() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [drawer, setDrawer] = useState<typeof USERS_DATA[0] | null>(null);
  const [tab, setTab] = useState<"overview"|"assessment"|"purchases">("overview");

  const filtered = USERS_DATA.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.phone.includes(search);
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <TopBar title="Users" subtitle={`${USERS_DATA.length} total · ${USERS_DATA.filter(u => u.status === "active").length} active`}
        action={<><Btn variant="outline">Export CSV</Btn><Btn>+ Add User</Btn></>}/>

      <SectionCard>
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", alignItems: "center" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or phone..."
              style={{ width: "100%", padding: "0.5rem 0.75rem 0.5rem 2rem", border: `1px solid ${A.border}`, borderRadius: 6, fontSize: "0.8125rem", color: A.ink, outline: "none", boxSizing: "border-box" }}/>
            <span style={{ position: "absolute", left: "0.625rem", top: "50%", transform: "translateY(-50%)", color: A.ink30, fontSize: "0.875rem" }}>⌕</span>
          </div>
          {["all","active","lead","inactive"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{ padding: "0.4375rem 0.75rem", borderRadius: 6, fontSize: "0.75rem", fontWeight: 500, cursor: "pointer", border: `1px solid ${statusFilter === s ? A.sage : A.border}`, background: statusFilter === s ? A.sagePale : "#fff", color: statusFilter === s ? A.sage : A.ink60, textTransform: "capitalize" }}>
              {s}
            </button>
          ))}
        </div>

        <Table headers={["Name","Phone","Age","Lang","Goal","Program","Assessment","Status","Last seen","Actions"]}>
          {filtered.map(u => (
            <TR key={u.id} onClick={() => { setDrawer(u); setTab("overview"); }}>
              <TD><span style={{ fontWeight: 500, color: A.ink }}>{u.name}</span></TD>
              <TD mono>{u.phone}</TD>
              <TD>{u.age}</TD>
              <TD><span style={{ fontWeight: 600, fontSize: "0.7rem", color: A.ink60 }}>{u.lang}</span></TD>
              <TD>{u.goal}</TD>
              <TD>{u.program}</TD>
              <TD><span style={{ color: u.assessment ? "#2e7d32" : A.ink30, fontSize: "0.75rem" }}>{u.assessment ? "✓ Done" : "Pending"}</span></TD>
              <TD><Pill label={u.status}/></TD>
              <TD><span style={{ color: A.ink30, fontSize: "0.7rem" }}>{u.activity}</span></TD>
              <TD>
                <div style={{ display: "flex", gap: "0.375rem" }} onClick={e => e.stopPropagation()}>
                  <Btn size="xs" variant="ghost" onClick={() => { setDrawer(u); setTab("overview"); }}>View</Btn>
                  <Btn size="xs" variant="ghost">WA</Btn>
                </div>
              </TD>
            </TR>
          ))}
        </Table>
      </SectionCard>

      {/* User drawer */}
      <Drawer open={!!drawer} onClose={() => setDrawer(null)} title={drawer?.name ?? ""} width={460}>
        {drawer && (
          <>
            {/* Tabs */}
            <div style={{ display: "flex", gap: "0", marginBottom: "1.25rem", borderBottom: `1px solid ${A.border}`, marginLeft: "-1.5rem", marginRight: "-1.5rem", marginTop: "-1.5rem", padding: "0 1.5rem" }}>
              {(["overview","assessment","purchases"] as const).map(tb => (
                <button key={tb} onClick={() => setTab(tb)}
                  style={{ padding: "0.625rem 0.875rem", fontSize: "0.75rem", fontWeight: 500, color: tab === tb ? A.sage : A.ink60, borderBottom: tab === tb ? `2px solid ${A.sage}` : "2px solid transparent", cursor: "pointer", textTransform: "capitalize", background: "transparent" }}>
                  {tb}
                </button>
              ))}
            </div>

            {tab === "overview" && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
                  {[["Status", <Pill label={drawer.status}/>],["Language", drawer.lang],["Age", drawer.age],["Goal", drawer.goal],["Program", drawer.program],["Last seen", drawer.activity]].map(([k,v]) => (
                    <div key={String(k)} style={{ background: A.muted, borderRadius: 6, padding: "0.625rem 0.75rem" }}>
                      <p style={{ color: A.ink30, fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.25rem" }}>{String(k)}</p>
                      <p style={{ color: A.ink, fontSize: "0.8125rem", fontWeight: 500 }}>{v as React.ReactNode}</p>
                    </div>
                  ))}
                </div>
                <Field label="Phone" value={drawer.phone}/>
                <Field label="Assessment status" value={drawer.assessment ? "Completed" : "Not started"}/>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                  <Btn variant="outline">Edit Profile</Btn>
                  <Btn variant="ghost">Send WhatsApp</Btn>
                  <Btn>Assign Expert</Btn>
                </div>
              </>
            )}

            {tab === "assessment" && (
              <>
                <p style={{ color: A.ink60, fontSize: "0.75rem", marginBottom: "1rem" }}>Assessment responses for this user.</p>
                {drawer.assessment ? QUESTIONS_DATA.slice(0,3).map(q => (
                  <div key={q.id} style={{ borderBottom: `1px solid ${A.border}`, paddingBottom: "0.75rem", marginBottom: "0.75rem" }}>
                    <p style={{ color: A.ink60, fontSize: "0.7rem", marginBottom: "0.25rem" }}>Q{q.order}. {q.en}</p>
                    <p style={{ color: A.ink, fontSize: "0.8125rem", fontWeight: 500 }}>{q.opts_en[0]}</p>
                  </div>
                )) : <p style={{ color: A.ink30, fontSize: "0.8125rem" }}>No assessment submitted yet.</p>}
              </>
            )}

            {tab === "purchases" && (
              <>
                {PAYMENTS_DATA.filter(p => p.user === drawer.name).map(p => (
                  <div key={p.id} style={{ border: `1px solid ${A.border}`, borderRadius: 8, padding: "0.875rem 1rem", marginBottom: "0.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                      <span style={{ fontWeight: 600, fontSize: "0.8125rem", color: A.ink }}>{p.program}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: A.ink }}>₹{p.amount.toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      <span style={{ color: A.ink30, fontSize: "0.7rem" }}>{p.date}</span>
                      <span style={{ color: A.ink30, fontSize: "0.7rem" }}>{p.method}</span>
                      <Pill label={p.status}/>
                    </div>
                  </div>
                ))}
                {!PAYMENTS_DATA.find(p => p.user === drawer.name) && <p style={{ color: A.ink30, fontSize: "0.8125rem" }}>No purchases yet.</p>}
              </>
            )}
          </>
        )}
      </Drawer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ASSESSMENTS
// ═══════════════════════════════════════════════════════════════════════════
function AssessmentsSection() {
  const [questions, setQuestions] = useState(QUESTIONS_DATA);
  const [editQ, setEditQ] = useState<typeof QUESTIONS_DATA[0] | null>(null);
  const [preview, setPreview] = useState(false);
  const [previewIdx, setPreviewIdx] = useState(0);

  return (
    <div>
      <TopBar title="Assessment Builder" subtitle="20 questions · 1,204 completions · 42% rate"
        action={<><Btn variant="ghost" onClick={() => setPreview(true)}>Preview</Btn><Btn>Publish Changes</Btn></>}/>

      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "1rem" }}>
        {/* Question list */}
        <div>
          <SectionCard title="Questions" action={<Btn size="xs">+ Add Question</Btn>}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {questions.map((q, i) => (
                <div key={q.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", border: `1px solid ${A.border}`, borderRadius: 8, cursor: "pointer", background: editQ?.id === q.id ? A.sagePale : "#fff", transition: "background 0.1s" }}
                  onClick={() => setEditQ(q)}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: A.ink30, width: 20, textAlign: "center", flexShrink: 0 }}>{String(i+1).padStart(2,"0")}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.8125rem", fontWeight: 500, color: A.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q.en}</p>
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
                      <span style={{ fontSize: "0.65rem", color: A.ink30, background: A.muted, padding: "0.1rem 0.375rem", borderRadius: 3 }}>{q.type}</span>
                      <span style={{ fontSize: "0.65rem", color: A.ink30 }}>{q.opts_en.length} options</span>
                      {q.condition && <span style={{ fontSize: "0.65rem", color: A.gold }}>conditional</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.375rem" }}>
                    <Btn size="xs" variant="ghost" onClick={() => setQuestions(qs => { const c = [...qs]; if (i > 0) [c[i], c[i-1]] = [c[i-1], c[i]]; return c; })}>↑</Btn>
                    <Btn size="xs" variant="ghost" onClick={() => setQuestions(qs => { const c = [...qs]; if (i < c.length-1) [c[i], c[i+1]] = [c[i+1], c[i]]; return c; })}>↓</Btn>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Edit panel */}
        <div>
          {editQ ? (
            <SectionCard title="Edit Question">
              <Field label="English" value={editQ.en} onChange={v => setEditQ({...editQ, en: v})}/>
              <Field label="Marathi" value={editQ.mr} onChange={v => setEditQ({...editQ, mr: v})}/>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", color: A.ink60, fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.375rem" }}>Type</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {["single","multi"].map(tp => (
                    <button key={tp} onClick={() => setEditQ({...editQ, type: tp})}
                      style={{ padding: "0.375rem 0.75rem", borderRadius: 6, fontSize: "0.75rem", border: `1px solid ${editQ.type === tp ? A.sage : A.border}`, background: editQ.type === tp ? A.sagePale : "#fff", color: editQ.type === tp ? A.sage : A.ink60, cursor: "pointer", textTransform: "capitalize" }}>
                      {tp}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", color: A.ink60, fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.375rem" }}>Options (English)</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                  {editQ.opts_en.map((opt, i) => (
                    <input key={i} value={opt}
                      onChange={e => { const o = [...editQ.opts_en]; o[i] = e.target.value; setEditQ({...editQ, opts_en: o}); }}
                      style={{ padding: "0.4375rem 0.625rem", border: `1px solid ${A.border}`, borderRadius: 6, fontSize: "0.8125rem", outline: "none" }}/>
                  ))}
                  <Btn size="xs" variant="ghost">+ Option</Btn>
                </div>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", color: A.ink60, fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.375rem" }}>Conditional Logic</label>
                <div style={{ padding: "0.625rem 0.75rem", border: `1px dashed ${A.border}`, borderRadius: 6, fontSize: "0.75rem", color: A.ink30 }}>
                  {editQ.condition ? "Condition set — click to edit" : "No condition (always shown)"}
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Btn onClick={() => setQuestions(qs => qs.map(q => q.id === editQ.id ? editQ : q))}>Save</Btn>
                <Btn variant="ghost" onClick={() => setEditQ(null)}>Cancel</Btn>
                <Btn variant="danger">Delete</Btn>
              </div>
            </SectionCard>
          ) : (
            <SectionCard title="Select a question to edit">
              <p style={{ color: A.ink30, fontSize: "0.8125rem" }}>Click any question on the left to open the editor.</p>
              <div style={{ marginTop: "1rem", padding: "1rem", borderRadius: 8, background: A.sagePale, border: `1px solid ${A.sage}22` }}>
                <p style={{ color: A.sage, fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.25rem" }}>Publishing</p>
                <p style={{ color: A.ink60, fontSize: "0.75rem" }}>Changes are in draft until you publish. Live assessment shows the last published version.</p>
              </div>
            </SectionCard>
          )}

          <SectionCard title="Scoring &amp; Recommendations">
            <p style={{ color: A.ink60, fontSize: "0.75rem", marginBottom: "0.75rem" }}>Answers drive program recommendations via conditional scoring rules.</p>
            {[
              { rule: "goal = 'Pain relief' → High: Physio + Pilates" },
              { rule: "goal = 'Strength' → High: Strength + Individual Pilates" },
              { rule: "pain_area = 'Lower back' → Always: Physio consult" },
            ].map(r => (
              <div key={r.rule} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.625rem", borderRadius: 6, border: `1px solid ${A.border}`, marginBottom: "0.375rem" }}>
                <span style={{ color: A.sage, fontSize: "0.6rem" }}>◉</span>
                <span style={{ fontSize: "0.75rem", color: A.ink, fontFamily: "var(--font-mono)" }}>{r.rule}</span>
              </div>
            ))}
            <Btn size="xs" variant="ghost">+ Add Rule</Btn>
          </SectionCard>
        </div>
      </div>

      {/* Preview drawer */}
      <Drawer open={preview} onClose={() => setPreview(false)} title="Assessment Preview" width={440}>
        <div style={{ background: A.ink, borderRadius: 12, padding: "1.5rem", marginBottom: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", letterSpacing: "0.1em" }}>QUESTION {previewIdx + 1} OF {questions.length}</p>
          </div>
          <div style={{ height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 2, marginBottom: "1.25rem" }}>
            <div style={{ height: "100%", borderRadius: 2, background: A.sage, width: `${((previewIdx+1)/questions.length)*100}%`, transition: "width 0.4s ease" }}/>
          </div>
          <p style={{ color: "#fff", fontFamily: "var(--font-display)", fontSize: "1.0625rem", fontWeight: 500, lineHeight: 1.4, marginBottom: "1.25rem" }}>{questions[previewIdx]?.en}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {questions[previewIdx]?.opts_en.map(opt => (
              <div key={opt} style={{ padding: "0.75rem 1rem", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "rgba(255,255,255,0.7)", fontSize: "0.875rem", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = A.sage}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"}>
                {opt}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Btn variant="ghost" onClick={() => setPreviewIdx(i => Math.max(0, i-1))}>← Back</Btn>
          <Btn onClick={() => setPreviewIdx(i => Math.min(questions.length-1, i+1))}>Next →</Btn>
        </div>
      </Drawer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PROGRAMS
// ═══════════════════════════════════════════════════════════════════════════
function ProgramsSection() {
  const [drawer, setDrawer] = useState<typeof programs[0] | null>(null);

  return (
    <div>
      <TopBar title="Programs" subtitle={`${programs.length} programs`} action={<Btn>+ New Program</Btn>}/>
      <SectionCard>
        <Table headers={["Program","Category","Expert","Price","Duration","Group","Individual","Live","Recorded","Status","Actions"]}>
          {programs.map(p => (
            <TR key={p.id} onClick={() => setDrawer(p)}>
              <TD><span style={{ fontWeight: 500 }}>{p.title_en}</span></TD>
              <TD><span style={{ textTransform: "capitalize", color: A.ink60, fontSize: "0.7rem" }}>{p.category}</span></TD>
              <TD><span style={{ fontSize: "0.75rem" }}>{p.category === "pilates" ? "Priya Nair" : p.category === "nutrition" ? "Sneha Deshpande" : "—"}</span></TD>
              <TD mono>₹{p.price.toLocaleString()}</TD>
              <TD>{p.duration_en}</TD>
              <TD><span style={{ color: ["pilates","strength","nutrition"].includes(p.category) ? "#2e7d32" : A.ink30 }}>◉</span></TD>
              <TD><span style={{ color: ["pilates","physio","doctor","hormonal","sexual-wellness"].includes(p.category) ? "#2e7d32" : A.ink30 }}>◉</span></TD>
              <TD><span style={{ color: "#2e7d32" }}>◉</span></TD>
              <TD><span style={{ color: p.category === "recorded" ? "#2e7d32" : A.ink30 }}>◉</span></TD>
              <TD><Pill label="active"/></TD>
              <TD><div onClick={e => e.stopPropagation()} style={{ display: "flex", gap: "0.375rem" }}>
                <Btn size="xs" variant="ghost" onClick={() => setDrawer(p)}>Edit</Btn>
              </div></TD>
            </TR>
          ))}
        </Table>
      </SectionCard>

      <Drawer open={!!drawer} onClose={() => setDrawer(null)} title={drawer?.title_en ?? "Program"} width={480}>
        {drawer && (
          <>
            <div style={{ height: 140, borderRadius: 8, overflow: "hidden", marginBottom: "1.25rem" }}>
              <img src={drawer.image} alt={drawer.title_en} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
            </div>
            <Field label="Title (English)" value={drawer.title_en}/>
            <Field label="Title (Marathi)" value={drawer.title_mr}/>
            <Field label="Description (English)" value={drawer.desc_en} multiline/>
            <Field label="Description (Marathi)" value={drawer.desc_mr} multiline/>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <Field label="Category" value={drawer.category}/>
              <Field label="Price (₹)" value={String(drawer.price)}/>
              <Field label="Duration" value={drawer.duration_en}/>
              <Field label="Level" value={drawer.level_en}/>
            </div>
            <div style={{ marginTop: "0.25rem", marginBottom: "1rem" }}>
              <label style={{ display: "block", color: A.ink60, fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Availability</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {["Group","Individual","Live","Recorded"].map(opt => (
                  <button key={opt} style={{ padding: "0.375rem 0.75rem", borderRadius: 6, fontSize: "0.75rem", border: `1px solid ${A.sage}`, background: A.sagePale, color: A.sage, cursor: "pointer" }}>{opt}</button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Btn>Save Changes</Btn>
              <Btn variant="ghost" onClick={() => setDrawer(null)}>Cancel</Btn>
            </div>
          </>
        )}
      </Drawer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BATCHES
// ═══════════════════════════════════════════════════════════════════════════
function BatchesSection() {
  const [drawer, setDrawer] = useState<typeof BATCHES_DATA[0] | null>(null);

  return (
    <div>
      <TopBar title="Batches" subtitle="Schedule, capacity & Zoom management" action={<Btn>+ New Batch</Btn>}/>
      <SectionCard>
        <Table headers={["#","Program","Trainer","Schedule","Time","Lang","Booked/Cap","Remaining","Status","Actions"]}>
          {BATCHES_DATA.map(b => (
            <TR key={b.id} onClick={() => setDrawer(b)}>
              <TD mono>{String(b.id).padStart(2,"0")}</TD>
              <TD><span style={{ fontWeight: 500 }}>{b.program}</span></TD>
              <TD>{b.trainer}</TD>
              <TD><span style={{ fontSize: "0.75rem" }}>{b.days}</span></TD>
              <TD mono>{b.time}</TD>
              <TD><span style={{ fontSize: "0.7rem", fontWeight: 600, color: A.ink60 }}>{b.lang}</span></TD>
              <TD>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ width: 56, height: 4, borderRadius: 2, background: A.muted }}>
                    <div style={{ height: "100%", borderRadius: 2, background: b.booked === b.capacity ? A.red : A.sage, width: `${(b.booked/b.capacity)*100}%` }}/>
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem" }}>{b.booked}/{b.capacity}</span>
                </div>
              </TD>
              <TD><span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: b.capacity - b.booked === 0 ? A.red : A.sage }}>{b.capacity - b.booked}</span></TD>
              <TD><Pill label={b.status}/></TD>
              <TD><div onClick={e => e.stopPropagation()} style={{ display: "flex", gap: "0.375rem" }}>
                <Btn size="xs" variant="ghost" onClick={() => setDrawer(b)}>Edit</Btn>
              </div></TD>
            </TR>
          ))}
        </Table>
      </SectionCard>

      <Drawer open={!!drawer} onClose={() => setDrawer(null)} title={drawer ? `${drawer.program} — Batch ${drawer.id}` : ""}>
        {drawer && (
          <>
            <Field label="Program" value={drawer.program}/>
            <Field label="Trainer" value={drawer.trainer}/>
            <Field label="Schedule (days)" value={drawer.days}/>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <Field label="Time" value={drawer.time}/>
              <Field label="Language" value={drawer.lang}/>
              <Field label="Capacity" value={String(drawer.capacity)}/>
              <Field label="Booked" value={String(drawer.booked)}/>
            </div>
            <Field label="Zoom Link" value="https://zoom.us/j/123456789"/>
            <Field label="Status" value={drawer.status}/>
            <div style={{ marginTop: "0.25rem" }}>
              <div style={{ padding: "0.875rem", borderRadius: 8, background: A.sagePale, border: `1px solid ${A.sage}33`, marginBottom: "1rem" }}>
                <p style={{ color: A.sage, fontWeight: 600, fontSize: "0.75rem", marginBottom: "0.25rem" }}>Enrolled users</p>
                <p style={{ color: A.ink60, fontSize: "0.75rem" }}>{drawer.booked} users enrolled. Click to see user list.</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Btn>Save Changes</Btn>
              <Btn variant="ghost" onClick={() => setDrawer(null)}>Cancel</Btn>
              <Btn variant="danger">Archive</Btn>
            </div>
          </>
        )}
      </Drawer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SESSIONS
// ═══════════════════════════════════════════════════════════════════════════
function SessionsSection() {
  return (
    <div>
      <TopBar title="Sessions" subtitle="Live schedule and attendance tracking"/>
      <SectionCard>
        <Table headers={["Date","Time","Program","Trainer","Enrolled","Attended","Rate","Status","Actions"]}>
          {SESSIONS_DATA.map(s => (
            <TR key={s.id}>
              <TD>{s.date}</TD>
              <TD mono>{s.time}</TD>
              <TD><span style={{ fontWeight: 500 }}>{s.program}</span></TD>
              <TD>{s.trainer}</TD>
              <TD>{s.enrolled}</TD>
              <TD>{s.attended ?? "—"}</TD>
              <TD mono>{s.attended ? `${Math.round((s.attended/s.enrolled)*100)}%` : "—"}</TD>
              <TD><Pill label={s.status}/></TD>
              <TD>
                <div style={{ display: "flex", gap: "0.375rem" }}>
                  {s.status === "upcoming" ? <Btn size="xs">Launch Zoom</Btn> : <Btn size="xs" variant="ghost">View</Btn>}
                </div>
              </TD>
            </TR>
          ))}
        </Table>
      </SectionCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPERTS
// ═══════════════════════════════════════════════════════════════════════════
function ExpertsSection() {
  const [drawer, setDrawer] = useState<typeof professionals[0] | null>(null);
  return (
    <div>
      <TopBar title="Experts & Professionals" subtitle={`${professionals.length} professionals`} action={<Btn>+ Add Expert</Btn>}/>
      <SectionCard>
        <Table headers={["Photo","Name","Role","Qualifications","Specialty","Sessions","Status","Actions"]}>
          {professionals.map(p => (
            <TR key={p.id} onClick={() => setDrawer(p)}>
              <TD><div style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden" }}><img src={p.image} alt={p.name_en} style={{ width: "100%", height: "100%", objectFit: "cover" }}/></div></TD>
              <TD><span style={{ fontWeight: 500 }}>{p.name_en}</span></TD>
              <TD><span style={{ fontSize: "0.75rem", color: A.ink60 }}>{p.role_en}</span></TD>
              <TD><span style={{ fontSize: "0.7rem" }}>{p.qual_en}</span></TD>
              <TD><span style={{ fontSize: "0.7rem" }}>{p.spec_en.slice(0,2).join(", ")}</span></TD>
              <TD mono>—</TD>
              <TD><Pill label="active"/></TD>
              <TD><Btn size="xs" variant="ghost" onClick={() => setDrawer(p)}>Edit</Btn></TD>
            </TR>
          ))}
        </Table>
      </SectionCard>
      <Drawer open={!!drawer} onClose={() => setDrawer(null)} title={drawer?.name_en ?? ""}>
        {drawer && (
          <>
            <div style={{ width: 80, height: 80, borderRadius: "50%", overflow: "hidden", marginBottom: "1rem" }}>
              <img src={drawer.image} alt={drawer.name_en} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
            </div>
            <Field label="Name (English)" value={drawer.name_en}/>
            <Field label="Name (Marathi)" value={drawer.name_mr}/>
            <Field label="Role (English)" value={drawer.role_en}/>
            <Field label="Qualifications" value={drawer.qual_en}/>
            <Field label="Bio (English)" value={drawer.bio_en} multiline/>
            <Btn>Save Changes</Btn>
          </>
        )}
      </Drawer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BOOKINGS
// ═══════════════════════════════════════════════════════════════════════════
function BookingsSection() {
  const BOOKINGS = USERS_DATA.filter(u => u.assessment).map((u, i) => ({ ...u, program: u.program, date: "26 Aug 2026", amount: [8999,6999,12999,2499,9999][i % 5], ref: `BK${String(1000+i).padStart(4,"0")}` }));
  return (
    <div>
      <TopBar title="Bookings" subtitle={`${BOOKINGS.length} total bookings`}/>
      <SectionCard>
        <Table headers={["Ref","User","Program","Date","Expert","Amount","Status"]}>
          {BOOKINGS.map(b => (
            <TR key={b.id}>
              <TD mono><span style={{ color: A.ink60 }}>{b.ref}</span></TD>
              <TD><span style={{ fontWeight: 500 }}>{b.name}</span></TD>
              <TD>{b.program}</TD>
              <TD>{b.date}</TD>
              <TD>{b.program === "Pilates" ? "Priya Nair" : b.program === "Nutrition" ? "Sneha Deshpande" : "Dr. Rahul"}</TD>
              <TD mono>₹{b.amount.toLocaleString()}</TD>
              <TD><Pill label="success"/></TD>
            </TR>
          ))}
        </Table>
      </SectionCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAYMENTS
// ═══════════════════════════════════════════════════════════════════════════
function PaymentsSection() {
  const total = PAYMENTS_DATA.filter(p => p.status === "success").reduce((s, p) => s + p.amount, 0);
  return (
    <div>
      <TopBar title="Payments" subtitle={`₹${total.toLocaleString()} collected`} action={<Btn variant="outline">Export</Btn>}/>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1.25rem" }}>
        {[
          { label: "Total Collected", val: `₹${total.toLocaleString()}`, sub: "All time" },
          { label: "MTD Revenue",     val: "₹8,40,000", sub: "August 2026" },
          { label: "Failed txns",     val: "1", sub: "Needs attention" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", border: `1px solid ${A.border}`, borderRadius: 10, padding: "1rem 1.125rem" }}>
            <p style={{ color: A.ink60, fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.375rem" }}>{s.label}</p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "1.25rem", fontWeight: 700, color: A.ink }}>{s.val}</p>
            <p style={{ color: A.ink30, fontSize: "0.65rem", marginTop: "0.125rem" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <SectionCard>
        <Table headers={["Txn ID","User","Program","Amount","Date","Method","Status"]}>
          {PAYMENTS_DATA.map(p => (
            <TR key={p.id}>
              <TD mono><span style={{ color: A.ink60 }}>{p.id}</span></TD>
              <TD><span style={{ fontWeight: 500 }}>{p.user}</span></TD>
              <TD>{p.program}</TD>
              <TD mono>₹{p.amount.toLocaleString()}</TD>
              <TD>{p.date}</TD>
              <TD><span style={{ fontSize: "0.7rem", fontWeight: 600, color: A.ink60 }}>{p.method}</span></TD>
              <TD><Pill label={p.status}/></TD>
            </TR>
          ))}
        </Table>
      </SectionCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// WHATSAPP
// ═══════════════════════════════════════════════════════════════════════════
function WhatsappSection() {
  const [selected, setSelected] = useState(WA_TEMPLATES[0]);
  const [editMode, setEditMode] = useState(false);

  return (
    <div>
      <TopBar title="WhatsApp" subtitle="Templates, broadcasts & delivery tracking" action={<Btn>+ New Template</Btn>}/>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 3fr", gap: "1rem" }}>
        <div>
          <SectionCard title="Templates">
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              {WA_TEMPLATES.map(tpl => (
                <div key={tpl.id} onClick={() => { setSelected(tpl); setEditMode(false); }}
                  style={{ padding: "0.75rem 0.875rem", borderRadius: 8, border: `1px solid ${selected.id === tpl.id ? A.sage : A.border}`, background: selected.id === tpl.id ? A.sagePale : "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.12s" }}>
                  <div>
                    <p style={{ fontWeight: 500, fontSize: "0.8125rem", color: A.ink }}>{tpl.name}</p>
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
                      <Pill label={tpl.status}/>
                      <span style={{ fontSize: "0.65rem", color: A.ink30 }}>{tpl.sent} sent</span>
                    </div>
                  </div>
                  <span style={{ color: A.sage, fontSize: "0.75rem", fontFamily: "var(--font-mono)", fontWeight: 700 }}>{tpl.rate}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div>
          <SectionCard title={selected.name} action={<Btn size="xs" onClick={() => setEditMode(!editMode)}>{editMode ? "Preview" : "Edit"}</Btn>}>
            <div style={{ background: "#ece5dd", borderRadius: 12, padding: "1.25rem" }}>
              <div style={{ maxWidth: 280, background: "#fff", borderRadius: "18px 18px 18px 4px", padding: "0.875rem 1rem", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                <p style={{ fontWeight: 600, color: "#1a1a1a", fontSize: "0.8125rem", marginBottom: "0.375rem" }}>VitalAfter40 💚</p>
                {selected.name === "Welcome" && (
                  <p style={{ color: "#333", fontSize: "0.8125rem", lineHeight: 1.5 }}>
                    Hello {"{{name}}"}! 👋 Welcome to VitalAfter40.<br/><br/>
                    You have taken the first step towards a healthier, stronger you.<br/><br/>
                    Your personalised plan is ready. Tap to view: {"{{link}}"}
                  </p>
                )}
                {selected.name === "Session Reminder" && (
                  <p style={{ color: "#333", fontSize: "0.8125rem", lineHeight: 1.5 }}>
                    Reminder {"{{name}}"} — your {"{{program}}"} session is tomorrow at {"{{time}}"}.<br/><br/>
                    Join Zoom: {"{{zoom_link}}"}
                  </p>
                )}
                {!["Welcome","Session Reminder"].includes(selected.name) && (
                  <p style={{ color: "#333", fontSize: "0.8125rem", lineHeight: 1.5 }}>
                    Hi {"{{name}}"} 👋,<br/><br/>
                    This is a message from VitalAfter40 regarding {"{{context}}"}.<br/><br/>
                    {"{{cta_text}}"}: {"{{link}}"}
                  </p>
                )}
                <p style={{ color: "#aaa", fontSize: "0.6rem", textAlign: "right", marginTop: "0.375rem" }}>10:42 AM ✓✓</p>
              </div>
            </div>

            <div style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
              {[["Sent", selected.sent.toString()], ["Read rate", selected.rate], ["Status", selected.status]].map(([k,v]) => (
                <div key={k} style={{ background: A.muted, borderRadius: 6, padding: "0.5rem 0.625rem" }}>
                  <p style={{ color: A.ink30, fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{k}</p>
                  <p style={{ color: A.ink, fontWeight: 600, fontSize: "0.8125rem", marginTop: "0.125rem" }}>{v}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
              <Btn>Send Broadcast</Btn>
              <Btn variant="outline">Schedule</Btn>
              {selected.status === "pending" && <Btn variant="ghost">Submit for Approval</Btn>}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CMS
// ═══════════════════════════════════════════════════════════════════════════
function CmsSection() {
  const [activeSection, setActiveSection] = useState(CMS_SECTIONS[0]);
  const [activeLang, setActiveLang] = useState<"en"|"mr">("en");

  const CMS_FIELDS: Record<string, { en: string; mr: string; key: string }[]> = {
    homepage: [
      { key: "hero_title", en: "Your best years aren't behind you.", mr: "तुमची सर्वोत्तम वर्षे मागे नाहीत." },
      { key: "hero_subtitle", en: "Doctor-led health, fitness and wellness programs designed around your body, your goals and your life after 40.", mr: "तुमचे शरीर, तुमची उद्दिष्टे आणि ४० नंतरच्या जीवनाभोवती डॉक्टर-नेतृत्व कार्यक्रम." },
      { key: "assessment_cta", en: "Take Your Health Assessment", mr: "आरोग्य मूल्यांकन करा" },
      { key: "hero_tagline", en: "Doctor-led · 40+ Wellness", mr: "डॉक्टर नेतृत्व · ४०+ वेलनेस" },
    ],
    programs: programs.slice(0,3).map(p => ({ key: p.id, en: p.title_en, mr: p.title_mr })),
    experts: professionals.map(p => ({ key: p.id, en: p.name_en, mr: p.name_mr })),
  };

  const fields = CMS_FIELDS[activeSection.id] ?? [
    { key: "placeholder_1", en: "Content field", mr: "सामग्री फील्ड" },
    { key: "placeholder_2", en: "Another content field", mr: "दुसरे सामग्री फील्ड" },
  ];

  return (
    <div>
      <TopBar title="Content Management" subtitle="All website content in one place" action={<Btn>Publish to Live</Btn>}/>
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "1rem" }}>
        {/* Section list */}
        <div style={{ background: "#fff", border: `1px solid ${A.border}`, borderRadius: 10, overflow: "hidden", alignSelf: "start" }}>
          <div style={{ padding: "0.75rem 1rem", borderBottom: `1px solid ${A.border}` }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, color: A.ink }}>Website sections</p>
          </div>
          {CMS_SECTIONS.map(s => {
            const pct = Math.round((s.complete/s.fields)*100);
            return (
              <div key={s.id} onClick={() => setActiveSection(s)}
                style={{ padding: "0.75rem 1rem", borderBottom: `1px solid ${A.border}`, cursor: "pointer", background: activeSection.id === s.id ? A.sagePale : "#fff", transition: "background 0.12s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontSize: "0.875rem" }}>{s.icon}</span>
                  <span style={{ fontSize: "0.8125rem", fontWeight: activeSection.id === s.id ? 600 : 400, color: A.ink }}>{s.label}</span>
                  <span style={{ marginLeft: "auto", fontSize: "0.6rem", fontWeight: 600, color: pct === 100 ? "#2e7d32" : A.gold }}>{pct}%</span>
                </div>
                <div style={{ height: 2, borderRadius: 1, background: A.muted }}>
                  <div style={{ height: "100%", borderRadius: 1, background: pct === 100 ? A.sage : A.gold, width: `${pct}%` }}/>
                </div>
              </div>
            );
          })}
        </div>

        {/* Content editor */}
        <div>
          <SectionCard title={activeSection.label}
            action={
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <div style={{ display: "flex", border: `1px solid ${A.border}`, borderRadius: 6, overflow: "hidden" }}>
                  {(["en","mr"] as const).map(l => (
                    <button key={l} onClick={() => setActiveLang(l)}
                      style={{ padding: "0.3125rem 0.625rem", fontSize: "0.7rem", fontWeight: 600, cursor: "pointer", background: activeLang === l ? A.sage : "#fff", color: activeLang === l ? "#fff" : A.ink60, border: "none" }}>
                      {l === "en" ? "EN" : "मराठी"}
                    </button>
                  ))}
                </div>
                <Btn size="xs">Save Draft</Btn>
              </div>
            }>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {fields.map(f => {
                const val = activeLang === "en" ? f.en : f.mr;
                const hasContent = activeLang === "en" ? !!f.en : !!f.mr;
                return (
                  <div key={f.key} style={{ borderBottom: `1px solid ${A.border}`, paddingBottom: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
                      <label style={{ color: A.ink60, fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", flex: 1 }}>{f.key.replace(/_/g," ")}</label>
                      <Pill label={hasContent ? "complete" : "missing"}/>
                    </div>
                    <textarea defaultValue={val}
                      style={{ width: "100%", padding: "0.5rem 0.625rem", border: `1px solid ${A.border}`, borderRadius: 6, fontSize: "0.8125rem", color: A.ink, resize: "vertical", minHeight: 64, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}/>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TRANSLATIONS
// ═══════════════════════════════════════════════════════════════════════════
function TranslationsSection() {
  const TRANS = [
    { key: "btn.start_assessment", en: "Start Assessment", mr: "मूल्यांकन सुरू करा",    status: "complete" },
    { key: "btn.enrol",            en: "Enrol",            mr: "प्रवेश घ्या",           status: "complete" },
    { key: "btn.join_zoom",        en: "Join Zoom",        mr: "झूम जॉइन",              status: "complete" },
    { key: "label.programs",       en: "Programs",         mr: "प्रोग्राम्स",           status: "complete" },
    { key: "label.upcoming",       en: "Upcoming",         mr: "येणारे",                status: "complete" },
    { key: "label.sessions",       en: "Sessions",         mr: "सेशन्स",                status: "complete" },
    { key: "msg.no_account",       en: "No account?",      mr: "",                      status: "missing"  },
    { key: "msg.payment_done",     en: "Payment complete!", mr: "",                      status: "missing"  },
    { key: "label.expert",         en: "Expert",           mr: "तज्ञ",                  status: "complete" },
    { key: "nav.home",             en: "Home",             mr: "होम",                   status: "complete" },
  ];
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = TRANS.filter(t => {
    const matchFilter = filter === "all" || t.status === filter;
    const matchSearch = !search || t.key.includes(search) || t.en.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const missing = TRANS.filter(t => t.status === "missing").length;

  return (
    <div>
      <TopBar title="Translations" subtitle={`${TRANS.length} strings · ${missing} missing Marathi`}
        action={<><Btn variant="outline">Import CSV</Btn><Btn>Export</Btn></>}/>

      <SectionCard>
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", alignItems: "center" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search keys or text..."
            style={{ flex: 1, padding: "0.5rem 0.75rem", border: `1px solid ${A.border}`, borderRadius: 6, fontSize: "0.8125rem", outline: "none" }}/>
          {["all","complete","missing"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "0.4375rem 0.75rem", borderRadius: 6, fontSize: "0.75rem", fontWeight: 500, cursor: "pointer", border: `1px solid ${filter === f ? A.sage : A.border}`, background: filter === f ? A.sagePale : "#fff", color: filter === f ? A.sage : A.ink60, textTransform: "capitalize" }}>
              {f}
            </button>
          ))}
        </div>

        <Table headers={["Key","English","Marathi","Status"]}>
          {filtered.map(tr => (
            <TR key={tr.key}>
              <TD mono><span style={{ color: A.ink60, fontSize: "0.7rem" }}>{tr.key}</span></TD>
              <TD>{tr.en}</TD>
              <TD>
                {tr.mr
                  ? <span className="mr">{tr.mr}</span>
                  : <input placeholder="Enter Marathi translation..." style={{ padding: "0.25rem 0.5rem", border: `1px solid ${A.gold}55`, borderRadius: 4, fontSize: "0.8125rem", outline: "none", width: "100%", background: "#fff8e1" }}/>
                }
              </TD>
              <TD><Pill label={tr.status}/></TD>
            </TR>
          ))}
        </Table>

        {missing > 0 && (
          <div style={{ marginTop: "1rem", padding: "0.875rem 1rem", borderRadius: 8, background: "#fff8e1", border: "1px solid rgba(184,150,90,0.3)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ color: "#8a6930", fontSize: "0.8125rem" }}>⚠ {missing} strings are missing Marathi translations</p>
            <Btn size="xs">AI-suggest missing</Btn>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ANALYTICS
// ═══════════════════════════════════════════════════════════════════════════
function AnalyticsSection() {
  const [timeRange, setTimeRange] = useState("6mo");

  return (
    <div>
      <TopBar title="Analytics" subtitle="Platform health, funnels and program performance"
        action={
          <div style={{ display: "flex", gap: "0.375rem" }}>
            {["1mo","3mo","6mo","12mo"].map(r => (
              <button key={r} onClick={() => setTimeRange(r)}
                style={{ padding: "0.3125rem 0.625rem", borderRadius: 5, fontSize: "0.7rem", fontWeight: 500, cursor: "pointer", border: `1px solid ${timeRange === r ? A.sage : A.border}`, background: timeRange === r ? A.sagePale : "#fff", color: timeRange === r ? A.sage : A.ink60 }}>
                {r}
              </button>
            ))}
          </div>
        }/>

      {/* Row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
        <SectionCard title="Revenue trend">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="rg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={A.sage} stopOpacity={0.3}/>
                  <stop offset="100%" stopColor={A.sage} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={A.border} vertical={false}/>
              <XAxis dataKey="mo" tick={AXIS_STYLE} axisLine={false} tickLine={false}/>
              <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} width={52} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`}/>
              <Tooltip contentStyle={TTIP_STYLE} formatter={(v: unknown) => [`₹${(Number(v)/1000).toFixed(0)}K`, "Revenue"]}/>
              <Area type="monotone" dataKey="rev" stroke={A.sage} fill="url(#rg2)" strokeWidth={2}/>
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Leads & Conversions">
          <ResponsiveContainer width="100%" height={200}>
            <RBarChart data={REVENUE_DATA} barGap={3} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke={A.border} vertical={false}/>
              <XAxis dataKey="mo" tick={AXIS_STYLE} axisLine={false} tickLine={false}/>
              <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={TTIP_STYLE}/>
              <Bar dataKey="leads" fill={`${A.sage}66`} radius={[3,3,0,0]} name="Leads"/>
              <Bar dataKey="conv" fill={A.gold} radius={[3,3,0,0]} name="Conversions"/>
            </RBarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
        <SectionCard title="Program popularity">
          <ResponsiveContainer width="100%" height={200}>
            <RBarChart data={PROGRAM_DATA} layout="vertical" margin={{ left: 20, right: 0 }} barSize={8}>
              <CartesianGrid strokeDasharray="3 3" stroke={A.border} horizontal={false}/>
              <XAxis type="number" tick={AXIS_STYLE} axisLine={false} tickLine={false}/>
              <YAxis type="category" dataKey="name" tick={{ ...AXIS_STYLE, fontSize: "0.6rem" }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={TTIP_STYLE}/>
              <Bar dataKey="group" fill={A.sage} stackId="a" name="Group"/>
              <Bar dataKey="individual" fill={A.gold} stackId="a" name="Individual"/>
              <Bar dataKey="recorded" fill={A.blue} stackId="a" name="Recorded" radius={[0,3,3,0]}/>
            </RBarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Goals distribution">
          <ResponsiveContainer width="100%" height={200}>
            <RBarChart data={GOALS_DATA} layout="vertical" barSize={8} margin={{ left: 32, right: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={A.border} horizontal={false}/>
              <XAxis type="number" tick={AXIS_STYLE} axisLine={false} tickLine={false} unit="%"/>
              <YAxis type="category" dataKey="goal" tick={{ ...AXIS_STYLE, fontSize: "0.6rem" }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={TTIP_STYLE} formatter={(v: unknown) => [`${Number(v)}%`, "Users"]}/>
              <Bar dataKey="pct" radius={[0,3,3,0]}>
                {GOALS_DATA.map((_, i) => <Cell key={i} fill={`${A.sage}${["ff","dd","bb","99","88","77"][i]}`}/>)}
              </Bar>
            </RBarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Age &amp; Language">
          <div style={{ marginBottom: "1rem" }}>
            <p style={{ fontSize: "0.65rem", color: A.ink60, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Language</p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {LANG_DATA.map(l => (
                <div key={l.name} style={{ flex: l.value, height: 20, borderRadius: 4, background: l.fill, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#fff", fontSize: "0.6rem", fontWeight: 700 }}>{l.value}%</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "1rem", marginTop: "0.25rem" }}>
              {LANG_DATA.map(l => <span key={l.name} style={{ fontSize: "0.6rem", color: A.ink60 }}><span style={{ color: l.fill }}>●</span> {l.name}</span>)}
            </div>
          </div>
          <p style={{ fontSize: "0.65rem", color: A.ink60, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Format</p>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            {FORMAT_DATA.map(l => (
              <div key={l.name} style={{ flex: l.value, height: 20, borderRadius: 4, background: l.fill, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#fff", fontSize: "0.6rem", fontWeight: 700 }}>{l.value}%</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "1rem", marginTop: "0.25rem" }}>
            {FORMAT_DATA.map(l => <span key={l.name} style={{ fontSize: "0.6rem", color: A.ink60 }}><span style={{ color: l.fill }}>●</span> {l.name}</span>)}
          </div>
        </SectionCard>
      </div>

      {/* Pilates attendance */}
      <SectionCard title="Pilates attendance — last 8 weeks">
        <ResponsiveContainer width="100%" height={160}>
          <RLineChart data={[
            { wk: "Wk1", rate: 72 }, { wk: "Wk2", rate: 78 }, { wk: "Wk3", rate: 68 },
            { wk: "Wk4", rate: 85 }, { wk: "Wk5", rate: 82 }, { wk: "Wk6", rate: 91 },
            { wk: "Wk7", rate: 88 }, { wk: "Wk8", rate: 94 },
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke={A.border} vertical={false}/>
            <XAxis dataKey="wk" tick={AXIS_STYLE} axisLine={false} tickLine={false}/>
            <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} unit="%" width={36}/>
            <Tooltip contentStyle={TTIP_STYLE} formatter={(v: unknown) => [`${Number(v)}%`, "Attendance"]}/>
            <Line type="monotone" dataKey="rate" stroke={A.sage} strokeWidth={2} dot={{ fill: A.sage, r: 3 }}/>
          </RLineChart>
        </ResponsiveContainer>
      </SectionCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════════════════════
function SettingsSection({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div>
      <TopBar title="Settings" subtitle="Platform configuration"/>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <SectionCard title="General">
            <Field label="Platform name" value="VitalAfter40"/>
            <Field label="Support email" value="support@vitalafter40.com"/>
            <Field label="WhatsApp number" value="+91 98765 43210"/>
            <Field label="Razorpay key" value="rzp_live_••••••••"/>
            <Btn>Save</Btn>
          </SectionCard>

          <SectionCard title="Language">
            <p style={{ color: A.ink60, fontSize: "0.75rem", marginBottom: "0.75rem" }}>Default language for admin interface</p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {(["en","mr"] as const).map(l => (
                <button key={l} onClick={() => setLang(l)}
                  style={{ padding: "0.5rem 1rem", borderRadius: 6, fontSize: "0.8125rem", fontWeight: 500, cursor: "pointer", border: `1px solid ${lang === l ? A.sage : A.border}`, background: lang === l ? A.sagePale : "#fff", color: lang === l ? A.sage : A.ink60 }}>
                  {l === "en" ? "🇬🇧 English" : "🇮🇳 मराठी"}
                </button>
              ))}
            </div>
          </SectionCard>
        </div>

        <div>
          <SectionCard title="Team access">
            <Table headers={["Name","Role","Email","Status"]}>
              {[
                { name: "Dr. Rahul Sharma", role: "Owner",  email: "rahul@vitalafter40.com", status: "active" },
                { name: "Priya Nair",        role: "Expert", email: "priya@vitalafter40.com", status: "active" },
                { name: "Admin User",        role: "Admin",  email: "admin@vitalafter40.com",  status: "active" },
              ].map(u => (
                <TR key={u.email}>
                  <TD><span style={{ fontWeight: 500 }}>{u.name}</span></TD>
                  <TD><Pill label={u.role.toLowerCase()}/></TD>
                  <TD mono><span style={{ fontSize: "0.7rem" }}>{u.email}</span></TD>
                  <TD><Pill label={u.status}/></TD>
                </TR>
              ))}
            </Table>
            <div style={{ marginTop: "0.75rem" }}><Btn size="xs">+ Invite team member</Btn></div>
          </SectionCard>

          <SectionCard title="Integrations">
            {[
              { name: "Razorpay",  status: "Connected",   icon: "💳" },
              { name: "Zoom",      status: "Connected",   icon: "📡" },
              { name: "WhatsApp",  status: "Connected",   icon: "💬" },
              { name: "Google Cal",status: "Not connected",icon: "📅" },
            ].map(i => (
              <div key={i.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.625rem 0", borderBottom: `1px solid ${A.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span>{i.icon}</span>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: A.ink }}>{i.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                  <span style={{ fontSize: "0.7rem", color: i.status === "Connected" ? "#2e7d32" : A.ink30 }}>{i.status}</span>
                  <Btn size="xs" variant={i.status === "Connected" ? "ghost" : "outline"}>{i.status === "Connected" ? "Configure" : "Connect"}</Btn>
                </div>
              </div>
            ))}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SHELL
// ═══════════════════════════════════════════════════════════════════════════
export default function AdminDashboard({ lang, setLang, onBack }: Props) {
  const [section, setSection] = useState<Section>("overview");
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdVal, setCmdVal] = useState("");
  const cmdRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCmdOpen(v => !v); }
      if (e.key === "Escape") setCmdOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => { if (cmdOpen) cmdRef.current?.focus(); }, [cmdOpen]);

  const CMD_ITEMS: { label: string; section: Section }[] = NAV_ITEMS.map(n => ({ label: n.label, section: n.id }));
  const filteredCmd = CMD_ITEMS.filter(c => c.label.toLowerCase().includes(cmdVal.toLowerCase()));

  return (
    <div style={{ display: "flex", minHeight: "100dvh", background: A.muted, fontFamily: "'Inter', var(--font-body)", overflowX: "hidden" }}>
      <Sidebar section={section} setSection={setSection} onBack={onBack}/>

      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
        {/* Topbar */}
        <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(245,246,248,0.92)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${A.border}`, padding: "0.625rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => setCmdOpen(true)}
            style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.4375rem 0.875rem", border: `1px solid ${A.border}`, borderRadius: 8, background: "#fff", color: A.ink30, fontSize: "0.8125rem", cursor: "pointer", minWidth: 240 }}>
            <span>⌕</span>
            <span>Search or jump to...</span>
            <span style={{ marginLeft: "auto", fontSize: "0.65rem", color: A.ink30, fontFamily: "var(--font-mono)", background: A.muted, padding: "0.1rem 0.375rem", borderRadius: 3 }}>⌘K</span>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ display: "flex", border: `1px solid ${A.border}`, borderRadius: 6, overflow: "hidden" }}>
              {(["en","mr"] as const).map(l => (
                <button key={l} onClick={() => setLang(l)}
                  style={{ padding: "0.3125rem 0.625rem", fontSize: "0.7rem", fontWeight: 600, cursor: "pointer", background: lang === l ? A.sage : "#fff", color: lang === l ? "#fff" : A.ink60, border: "none" }}>
                  {l === "en" ? "EN" : "MR"}
                </button>
              ))}
            </div>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: A.sage, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700 }}>A</div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: "1.75rem 1.5rem", maxWidth: 1400 }}>
          {section === "overview"     && <OverviewSection/>}
          {section === "users"        && <UsersSection/>}
          {section === "assessments"  && <AssessmentsSection/>}
          {section === "programs"     && <ProgramsSection/>}
          {section === "batches"      && <BatchesSection/>}
          {section === "sessions"     && <SessionsSection/>}
          {section === "experts"      && <ExpertsSection/>}
          {section === "bookings"     && <BookingsSection/>}
          {section === "payments"     && <PaymentsSection/>}
          {section === "whatsapp"     && <WhatsappSection/>}
          {section === "cms"          && <CmsSection/>}
          {section === "translations" && <TranslationsSection/>}
          {section === "analytics"    && <AnalyticsSection/>}
          {section === "settings"     && <SettingsSection lang={lang} setLang={setLang}/>}
        </div>
      </div>

      {/* Command palette */}
      {cmdOpen && (
        <>
          <div onClick={() => setCmdOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100 }}/>
          <div style={{ position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", width: 520, background: "#fff", borderRadius: 12, boxShadow: "0 25px 60px rgba(0,0,0,0.2)", zIndex: 110, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", borderBottom: `1px solid ${A.border}` }}>
              <span style={{ color: A.ink30, fontSize: "1rem" }}>⌕</span>
              <input ref={cmdRef} value={cmdVal} onChange={e => setCmdVal(e.target.value)}
                placeholder="Search sections, users, programs..."
                style={{ flex: 1, fontSize: "0.9375rem", color: A.ink, background: "transparent", border: "none", outline: "none" }}/>
              <span style={{ fontSize: "0.7rem", color: A.ink30, fontFamily: "var(--font-mono)", background: A.muted, padding: "0.1rem 0.375rem", borderRadius: 3 }}>ESC</span>
            </div>
            <div style={{ maxHeight: 320, overflowY: "auto" }}>
              {filteredCmd.length === 0 ? (
                <p style={{ padding: "1.25rem", color: A.ink30, fontSize: "0.875rem", textAlign: "center" }}>No results</p>
              ) : filteredCmd.map(c => (
                <button key={c.section} onClick={() => { setSection(c.section); setCmdOpen(false); setCmdVal(""); }}
                  style={{ display: "flex", alignItems: "center", gap: "0.75rem", width: "100%", padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.875rem", color: A.ink, cursor: "pointer", background: "transparent", border: "none", borderBottom: `1px solid ${A.border}` }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = A.muted}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                  <span style={{ color: A.ink30, width: 16, textAlign: "center", fontSize: "0.75rem" }}>{ICONS[c.section]}</span>
                  <span>{c.label}</span>
                  <span style={{ marginLeft: "auto", color: A.ink30, fontSize: "0.75rem" }}>→</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

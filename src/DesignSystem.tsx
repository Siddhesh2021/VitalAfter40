import { useState, useEffect, useRef } from "react";

/* ─── Section IDs for sticky nav ──────────────────── */
const sections = [
  { id: "brand",      label: "Brand" },
  { id: "colors",     label: "Colors" },
  { id: "typography", label: "Typography" },
  { id: "spacing",    label: "Spacing" },
  { id: "buttons",    label: "Buttons" },
  { id: "inputs",     label: "Inputs" },
  { id: "badges",     label: "Badges" },
  { id: "cards",      label: "Cards" },
  { id: "navigation", label: "Navigation" },
  { id: "assessment", label: "Assessment" },
  { id: "health",     label: "Health" },
  { id: "progress",   label: "Progress" },
  { id: "motion",     label: "Motion" },
];

/* ─── Helpers ─────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="t-label text-[var(--text-muted)] mb-8">
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="t-h2 text-[var(--text-primary)] mb-2" style={{ fontFamily: "var(--font-display)" }}>
      {children}
    </h2>
  );
}

function Swatch({ token, hex, name, dark = false }: { token: string; hex: string; name: string; dark?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard?.writeText(hex); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="group text-left"
    >
      <div
        className="w-full rounded-xl mb-2.5 transition-transform group-hover:-translate-y-1 border"
        style={{
          background: hex,
          height: 72,
          borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"
        }}
      />
      <p className="t-xs font-medium text-[var(--text-primary)]">{name}</p>
      <p className="t-caption" style={{ fontFamily: "var(--font-mono)" }}>
        {copied ? "Copied!" : hex}
      </p>
      <p className="t-caption opacity-60">{token}</p>
    </button>
  );
}

function TokenRow({ token, value, desc }: { token: string; value: string; desc?: string }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-[var(--border-subtle)] last:border-0">
      <code className="t-xs text-[var(--sage)] shrink-0" style={{ fontFamily: "var(--font-mono)", minWidth: 180 }}>{token}</code>
      <code className="t-xs text-[var(--text-muted)] shrink-0" style={{ fontFamily: "var(--font-mono)", minWidth: 100 }}>{value}</code>
      {desc && <span className="t-xs text-[var(--text-muted)]">{desc}</span>}
    </div>
  );
}

function Ring({ value, size = 64, stroke = 5, color = "var(--sage)", label }: { value: number; size?: number; stroke?: number; color?: string; label?: string }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="ring-progress absolute inset-0">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border-subtle)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" />
      </svg>
      {label && <span className="t-xs font-semibold text-[var(--text-primary)] relative z-10">{label}</span>}
    </div>
  );
}

/* ─── Design System Page ──────────────────────────── */
export default function DesignSystem() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState("brand");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [selectedMulti, setSelectedMulti] = useState<number[]>([]);
  const [inputVal, setInputVal] = useState("");
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    return () => document.documentElement.classList.remove("dark");
  }, [darkMode]);

  // Intersection observer for active section
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`} style={{ background: "var(--bg-primary)", fontFamily: "var(--font-body)" }}>

      {/* ── Top bar ─────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b" style={{ background: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[var(--sage)] flex items-center justify-center">
              <span className="text-white text-xs font-bold">V</span>
            </div>
            <span className="t-label text-[var(--text-muted)]">Design System</span>
            <span className="t-label text-[var(--border-default)]">—</span>
            <span className="t-label text-[var(--text-muted)]">v2.0</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="t-xs text-[var(--text-muted)] hidden sm:block">VitalAfter40</span>
            <button
              onClick={() => setDarkMode(d => !d)}
              className="btn btn-sm btn-outline gap-2"
            >
              {darkMode
                ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7" cy="7" r="3"/><path d="M7 1v1M7 12v1M1 7h1M12 7h1M2.93 2.93l.7.7M10.37 10.37l.7.7M10.37 3.63l-.7.7M3.63 10.37l-.7.7" strokeLinecap="round"/></svg>
                : <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11.5 8.5A5 5 0 015.5 2.5a5.002 5.002 0 000 9 5 5 0 006-3z" strokeLinecap="round" strokeLinejoin="round"/></svg>
              }
              {darkMode ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto flex">

        {/* ── Sticky sidebar nav ───────────────────────── */}
        <aside className="hidden lg:block w-52 shrink-0 sticky top-14 h-[calc(100vh-56px)] overflow-y-auto py-8 px-6 border-r" style={{ borderColor: "var(--border-subtle)" }}>
          <nav className="space-y-1">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`w-full text-left px-3 py-1.5 rounded transition-all t-xs font-medium ${
                  activeSection === s.id
                    ? "bg-[var(--sage-ghost)] text-[var(--sage)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]"
                }`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Main content ─────────────────────────────── */}
        <main ref={mainRef} className="flex-1 min-w-0">

          {/* ══ BRAND ══════════════════════════════════ */}
          <section id="brand" className="px-8 sm:px-12 pt-20 pb-24 border-b" style={{ borderColor: "var(--border-subtle)" }}>
            <SectionLabel>01 — Brand Identity</SectionLabel>

            {/* Wordmark */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-[var(--sage)] flex items-center justify-center">
                  <span className="text-white text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>V</span>
                </div>
                <div>
                  <h1 className="text-4xl font-light text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
                    VitalAfter<em className="italic text-[var(--sage)]">40</em>
                  </h1>
                  <p className="t-small text-[var(--text-muted)] mt-1">Doctor-led health, fitness & wellness for 40+</p>
                </div>
              </div>

              {/* Brand on dark */}
              <div className="rounded-2xl p-8 flex items-center justify-between gap-6" style={{ background: "var(--ink)" }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--sage)] flex items-center justify-center">
                    <span className="text-white text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>V</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-light text-white" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
                      VitalAfter<em className="italic" style={{ color: "var(--sage-light)" }}>40</em>
                    </h2>
                    <p className="text-xs text-white/40 mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>ON DARK — PRIMARY</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center">
                    <span className="text-white text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>V</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-light text-white" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
                      VitalAfter<em className="italic">40</em>
                    </h2>
                    <p className="text-xs text-white/40 mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>ON DARK — REVERSED</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Taglines */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl border" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-elevated)" }}>
                <p className="t-label text-[var(--text-muted)] mb-3">Primary Tagline</p>
                <p className="text-2xl text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}>
                  Thrive in your <em className="italic text-[var(--sage)]">finest</em> years.
                </p>
              </div>
              <div className="p-6 rounded-2xl border" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-elevated)" }}>
                <p className="t-label text-[var(--text-muted)] mb-3">Marathi Tagline</p>
                <p className="text-2xl text-[var(--text-primary)] mr" style={{ fontFamily: "var(--font-devanagari)", lineHeight: 1.4 }}>
                  तुमच्या <em className="italic" style={{ color: "var(--sage)" }}>सर्वोत्कृष्ट</em> वर्षांत जगा.
                </p>
              </div>
            </div>
          </section>

          {/* ══ COLORS ══════════════════════════════════ */}
          <section id="colors" className="px-8 sm:px-12 pt-20 pb-24 border-b" style={{ borderColor: "var(--border-subtle)" }}>
            <SectionLabel>02 — Color System</SectionLabel>
            <SectionTitle>Palette</SectionTitle>
            <p className="t-body text-[var(--text-muted)] mb-12 max-w-lg">
              Rooted in sage, warm cream, and deep charcoal. Gold for premium emphasis. Status colors are desaturated to feel clinical, not alarming.
            </p>

            {/* Sage */}
            <p className="t-label text-[var(--text-muted)] mb-4">Sage — Primary Brand</p>
            <div className="grid grid-cols-5 gap-3 mb-10">
              <Swatch token="--sage" hex="#4a6741" name="Sage" />
              <Swatch token="--sage-mid" hex="#6b7c5c" name="Sage Mid" />
              <Swatch token="--sage-light" hex="#8fa07a" name="Sage Light" />
              <Swatch token="--sage-pale" hex="#d6dece" name="Sage Pale" />
              <Swatch token="--sage-ghost" hex="#f0f3ee" name="Sage Ghost" />
            </div>

            {/* Gold */}
            <p className="t-label text-[var(--text-muted)] mb-4">Gold — Premium Accent</p>
            <div className="grid grid-cols-3 gap-3 mb-10">
              <Swatch token="--gold" hex="#b8965a" name="Gold" />
              <Swatch token="--gold-mid" hex="#c9a96e" name="Gold Mid" />
              <Swatch token="--gold-pale" hex="#f5eddb" name="Gold Pale" />
            </div>

            {/* Ink scale */}
            <p className="t-label text-[var(--text-muted)] mb-4">Ink Scale — Neutral</p>
            <div className="grid grid-cols-7 gap-3 mb-10">
              {[["--ink","#0f0f0f","Ink"],["--ink-80","#1c1c1c","80"],["--ink-60","#404040","60"],["--ink-40","#737373","40"],["--ink-20","#b8b8b8","20"],["--ink-10","#e0e0e0","10"],["--ink-06","#f0f0f0","06"]].map(([t,h,n]) => (
                <Swatch key={t} token={t} hex={h} name={n} />
              ))}
            </div>

            {/* Warm surfaces */}
            <p className="t-label text-[var(--text-muted)] mb-4">Warm Surfaces</p>
            <div className="grid grid-cols-3 gap-3 mb-10">
              <Swatch token="--cream" hex="#faf7f2" name="Cream — bg" />
              <Swatch token="--paper" hex="#f3ede3" name="Paper — surface" />
              <Swatch token="--warm-white" hex="#fefcfa" name="Warm White — elevated" />
            </div>

            {/* Status */}
            <p className="t-label text-[var(--text-muted)] mb-4">Status</p>
            <div className="grid grid-cols-4 gap-3 mb-12">
              <Swatch token="--success" hex="#3d7a4e" name="Success" />
              <Swatch token="--warning" hex="#c4822a" name="Warning" />
              <Swatch token="--error" hex="#b84040" name="Error" />
              <Swatch token="--info" hex="#3a6fa8" name="Info" />
            </div>

            {/* Dark theme preview */}
            <p className="t-label text-[var(--text-muted)] mb-4">Dark Theme Grounds</p>
            <div className="grid grid-cols-4 gap-3">
              {[["bg-primary","#0d0d0b"],["bg-surface","#141412"],["bg-elevated","#1c1b18"],["bg-muted","#222220"]].map(([n,h]) => (
                <div key={n} className="text-left">
                  <div className="w-full rounded-xl mb-2.5 border border-white/10" style={{ background: h, height: 72 }} />
                  <p className="t-xs font-medium" style={{ color: "var(--text-primary)" }}>{n}</p>
                  <p className="t-caption" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{h}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ══ TYPOGRAPHY ══════════════════════════════ */}
          <section id="typography" className="px-8 sm:px-12 pt-20 pb-24 border-b" style={{ borderColor: "var(--border-subtle)" }}>
            <SectionLabel>03 — Typography</SectionLabel>

            {/* Font specimens */}
            <div className="grid sm:grid-cols-3 gap-6 mb-16">
              {[
                { name: "Fraunces", role: "Display / Serif", weight: "400 → 700 + Italic", sample: "Health is an investment.", var: "--font-display" },
                { name: "DM Sans", role: "Body / UI", weight: "300 → 700 + Italic", sample: "Premium wellness for 40+.", var: "--font-body" },
                { name: "Noto Sans Devanagari", role: "Marathi", weight: "400 → 700", sample: "आरोग्य हीच संपत्ती.", var: "--font-devanagari" },
              ].map(f => (
                <div key={f.name} className="p-6 rounded-2xl border" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-elevated)" }}>
                  <p className="t-label text-[var(--text-muted)] mb-4">{f.role}</p>
                  <p className="text-4xl text-[var(--text-primary)] mb-4" style={{ fontFamily: `var(${f.var})`, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
                    Aa
                  </p>
                  <p className="text-base text-[var(--text-primary)] mb-3" style={{ fontFamily: `var(${f.var})` }}>
                    {f.sample}
                  </p>
                  <p className="t-xs text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>{f.name}</p>
                  <p className="t-xs text-[var(--text-muted)]">{f.weight}</p>
                </div>
              ))}
            </div>

            {/* Type scale */}
            <div className="space-y-8">
              {[
                { cls: "t-display", label: "Display", sample: "Vital health for 40+" },
                { cls: "t-hero", label: "Hero", sample: "Begin your journey" },
                { cls: "t-h1", label: "H1", sample: "Expert-led programs" },
                { cls: "t-h2", label: "H2", sample: "Pilates & Strength" },
                { cls: "t-h3", label: "H3", sample: "Live Zoom sessions" },
                { cls: "t-h4", label: "H4", sample: "Weekly batch schedule" },
              ].map(t => (
                <div key={t.cls} className="flex items-baseline gap-6 pb-8 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                  <span className="t-label text-[var(--text-muted)] w-20 shrink-0">{t.label}</span>
                  <p className={`${t.cls} text-[var(--text-primary)] leading-none flex-1`}>{t.sample}</p>
                  <code className="t-xs text-[var(--text-muted)] shrink-0 hidden md:block" style={{ fontFamily: "var(--font-mono)" }}>.{t.cls}</code>
                </div>
              ))}

              {/* Body sizes */}
              <div className="space-y-4 pt-2">
                {[
                  { cls: "t-body-lg", label: "Body Lg", sample: "Doctor-led guidance on Pilates, strength training, physiotherapy, nutrition and hormonal wellness designed for adults over 40." },
                  { cls: "t-body", label: "Body", sample: "Each program is designed by our core medical team and reviewed quarterly for clinical accuracy." },
                  { cls: "t-small", label: "Small", sample: "Sessions include warm-up, core work, and guided recovery." },
                  { cls: "t-xs", label: "Extra Small", sample: "Batch size: 12 participants · Live on Zoom" },
                  { cls: "t-label", label: "Label / Mono", sample: "PROGRAM — 8 WEEKS — GROUP" },
                  { cls: "t-caption", label: "Caption", sample: "Last updated Aug 2026" },
                ].map(t => (
                  <div key={t.cls} className="flex gap-6 items-baseline border-b pb-4" style={{ borderColor: "var(--border-subtle)" }}>
                    <code className="t-xs text-[var(--text-muted)] w-20 shrink-0" style={{ fontFamily: "var(--font-mono)" }}>.{t.cls}</code>
                    <p className={`${t.cls} text-[var(--text-primary)] flex-1`}>{t.sample}</p>
                  </div>
                ))}
              </div>

              {/* Devanagari scale */}
              <div className="mt-10 p-8 rounded-2xl" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
                <p className="t-label text-[var(--text-muted)] mb-6">Marathi / Devanagari Scale</p>
                <div className="space-y-5">
                  {[
                    { cls: "t-h1 mr", sample: "आरोग्य आणि जीवनशक्ती" },
                    { cls: "t-h2 mr", sample: "पिलाटेस आणि व्यायाम" },
                    { cls: "t-body-lg mr", sample: "डॉक्टर-नेतृत्वाखाली ४०+ वयोगटासाठी आरोग्य कार्यक्रम." },
                    { cls: "t-small mr", sample: "सेशन: दर आठवड्याला ३ वेळा · झूम वर लाइव्ह" },
                  ].map(t => (
                    <p key={t.sample} className={`${t.cls} text-[var(--text-primary)]`}>{t.sample}</p>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ══ SPACING ════════════════════════════════ */}
          <section id="spacing" className="px-8 sm:px-12 pt-20 pb-24 border-b" style={{ borderColor: "var(--border-subtle)" }}>
            <SectionLabel>04 — Spacing</SectionLabel>
            <SectionTitle>Scale</SectionTitle>
            <p className="t-body text-[var(--text-muted)] mb-12 max-w-lg">
              8-point base grid. Generous whitespace is a design principle — do not compress unless absolutely necessary.
            </p>
            <div className="space-y-3">
              {[
                { token: "--space-1",  val: "4px",   desc: "Micro gap — icon to text" },
                { token: "--space-2",  val: "8px",   desc: "Tight gap — between labels" },
                { token: "--space-3",  val: "12px",  desc: "Close — within component" },
                { token: "--space-4",  val: "16px",  desc: "Standard — component padding" },
                { token: "--space-5",  val: "20px",  desc: "Comfortable — card padding" },
                { token: "--space-6",  val: "24px",  desc: "Relaxed — section elements" },
                { token: "--space-8",  val: "32px",  desc: "Open — between cards" },
                { token: "--space-10", val: "40px",  desc: "Airy — section inner padding" },
                { token: "--space-12", val: "48px",  desc: "Section gap mobile" },
                { token: "--space-16", val: "64px",  desc: "Section gap desktop" },
                { token: "--space-20", val: "80px",  desc: "Hero padding" },
                { token: "--space-24", val: "96px",  desc: "Section vertical rhythm" },
                { token: "--space-32", val: "128px", desc: "Large editorial gap" },
              ].map(s => (
                <div key={s.token} className="flex items-center gap-4">
                  <code className="t-xs text-[var(--sage)] w-28 shrink-0" style={{ fontFamily: "var(--font-mono)" }}>{s.token}</code>
                  <div className="bg-[var(--sage)] rounded" style={{ width: parseInt(s.val) * 1.5, height: 20, maxWidth: 240, minWidth: 4 }} />
                  <code className="t-xs text-[var(--text-muted)] w-12 shrink-0" style={{ fontFamily: "var(--font-mono)" }}>{s.val}</code>
                  <span className="t-xs text-[var(--text-muted)]">{s.desc}</span>
                </div>
              ))}
            </div>

            {/* Radius */}
            <p className="t-label text-[var(--text-muted)] mt-12 mb-6">Border Radius</p>
            <div className="flex items-center gap-6 flex-wrap">
              {[["xs","4px"],["sm","6px"],["md","12px"],["lg","20px"],["xl","32px"],["full","999px"]].map(([n,v]) => (
                <div key={n} className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-[var(--sage)] opacity-20 border-2 border-[var(--sage)]"
                    style={{ borderRadius: v === "999px" ? "9999px" : v }} />
                  <code className="t-xs text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>{n}</code>
                  <span className="t-caption">{v}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ══ BUTTONS ════════════════════════════════ */}
          <section id="buttons" className="px-8 sm:px-12 pt-20 pb-24 border-b" style={{ borderColor: "var(--border-subtle)" }}>
            <SectionLabel>05 — Buttons</SectionLabel>
            <SectionTitle>Button System</SectionTitle>
            <p className="t-body text-[var(--text-muted)] mb-12 max-w-lg">
              Pill shape by default. No gradients. Transform on hover signals interactivity. Every state is distinct.
            </p>

            {/* Main variants */}
            <p className="t-label text-[var(--text-muted)] mb-5">Variants</p>
            <div className="flex flex-wrap gap-3 mb-12">
              <button className="btn btn-primary">Book a session</button>
              <button className="btn btn-outline">Learn more</button>
              <button className="btn btn-ghost">View all</button>
              <button className="btn btn-dark">Start assessment</button>
              <button className="btn btn-gold">Upgrade plan</button>
              <div className="rounded-2xl p-4 flex gap-3 items-center" style={{ background: "var(--ink)" }}>
                <button className="btn btn-white">Get started</button>
                <button className="btn btn-outline" style={{ borderColor: "rgba(255,255,255,0.2)", color: "white" }}>
                  Learn more
                </button>
              </div>
            </div>

            {/* Sizes */}
            <p className="t-label text-[var(--text-muted)] mb-5">Sizes</p>
            <div className="flex flex-wrap gap-3 items-center mb-12">
              <button className="btn btn-primary btn-sm">Small</button>
              <button className="btn btn-primary btn-md">Medium</button>
              <button className="btn btn-primary">Default</button>
              <button className="btn btn-primary btn-lg">Large</button>
              <button className="btn btn-primary btn-xl">Extra Large</button>
            </div>

            {/* States */}
            <p className="t-label text-[var(--text-muted)] mb-5">States</p>
            <div className="flex flex-wrap gap-3 mb-12">
              <button className="btn btn-primary">Default</button>
              <button className="btn btn-primary" style={{ background: "var(--ink-80)" }}>Hover</button>
              <button className="btn btn-primary btn-loading">
                <svg className="spin" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="8" r="6" strokeDasharray="20 10" /></svg>
                Loading
              </button>
              <button className="btn btn-primary" disabled>Disabled</button>
            </div>

            {/* With icons */}
            <p className="t-label text-[var(--text-muted)] mb-5">With Icons</p>
            <div className="flex flex-wrap gap-3 mb-8">
              <button className="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5"><rect x="2" y="3" width="12" height="11" rx="1.5"/><path d="M2 6h12M6 2v3M10 2v3"/></svg>
                Book session
              </button>
              <button className="btn btn-outline">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="5.5"/><path d="M8 6v2.5l1.5 1" strokeLinecap="round"/></svg>
                View schedule
              </button>
              <button className="btn btn-primary">
                Start program
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>

            {/* Icon-only */}
            <p className="t-label text-[var(--text-muted)] mb-5">Icon Only</p>
            <div className="flex gap-3">
              {["primary", "outline", "ghost", "dark"].map(v => (
                <button key={v} className={`btn btn-icon btn-${v}`}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3v10M3 8h10" strokeLinecap="round"/></svg>
                </button>
              ))}
            </div>
          </section>

          {/* ══ INPUTS ════════════════════════════════ */}
          <section id="inputs" className="px-8 sm:px-12 pt-20 pb-24 border-b" style={{ borderColor: "var(--border-subtle)" }}>
            <SectionLabel>06 — Inputs & Forms</SectionLabel>
            <SectionTitle>Form Components</SectionTitle>
            <p className="t-body text-[var(--text-muted)] mb-12 max-w-lg">
              Clean, minimal inputs with clear focus states. Sage focus ring reinforces the brand on every interaction.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
              {/* Text */}
              <div className="field-group">
                <label className="field-label">Full Name</label>
                <input className="field" type="text" placeholder="Meera Joshi" />
              </div>

              {/* Phone */}
              <div className="field-group">
                <label className="field-label">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 t-small text-[var(--text-muted)]">+91</span>
                  <input className="field" style={{ paddingLeft: "3rem" }} type="tel" placeholder="98765 43210" />
                </div>
              </div>

              {/* Email */}
              <div className="field-group">
                <label className="field-label">Email</label>
                <input className="field" type="email" placeholder="meera@example.com" />
                <span className="field-hint">We never share your email.</span>
              </div>

              {/* Select */}
              <div className="field-group">
                <label className="field-label">Program</label>
                <select className="field">
                  <option>Select program</option>
                  <option>Group Pilates</option>
                  <option>Individual Strength</option>
                  <option>Nutrition Coaching</option>
                </select>
              </div>

              {/* Date */}
              <div className="field-group">
                <label className="field-label">Preferred Start Date</label>
                <input className="field" type="date" />
              </div>

              {/* Search */}
              <div className="field-group">
                <label className="field-label">Search Programs</label>
                <div className="relative">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <circle cx="7" cy="7" r="4.5"/><path d="M11 11l2.5 2.5" strokeLinecap="round"/>
                  </svg>
                  <input className="field field-search" type="search" placeholder="Search Pilates, physio…" />
                </div>
              </div>

              {/* Textarea — full width */}
              <div className="field-group sm:col-span-2">
                <label className="field-label">Health Goals</label>
                <textarea className="field" placeholder="Tell us what you want to achieve…" rows={3} />
                <span className="field-hint">Be as specific as possible — it helps our doctors personalise your plan.</span>
              </div>

              {/* Error state */}
              <div className="field-group">
                <label className="field-label">Age</label>
                <input className="field error" type="number" value="25" readOnly />
                <span className="field-error">Minimum age for this program is 40.</span>
              </div>

              {/* Disabled */}
              <div className="field-group">
                <label className="field-label">Referral Code</label>
                <input className="field" disabled placeholder="Not applicable" />
                <span className="field-hint">No referral code for this program.</span>
              </div>
            </div>
          </section>

          {/* ══ BADGES ════════════════════════════════ */}
          <section id="badges" className="px-8 sm:px-12 pt-20 pb-24 border-b" style={{ borderColor: "var(--border-subtle)" }}>
            <SectionLabel>07 — Badges & Chips</SectionLabel>
            <SectionTitle>Status & Labels</SectionTitle>
            <p className="t-body text-[var(--text-muted)] mb-12 max-w-lg">
              Monospace labels on subtle tinted backgrounds. Never decorative — every badge communicates state or context.
            </p>

            {/* Semantic */}
            <p className="t-label text-[var(--text-muted)] mb-4">Semantic</p>
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="badge badge-sage">Recommended</span>
              <span className="badge badge-gold">Premium</span>
              <span className="badge badge-success">Active</span>
              <span className="badge badge-warn">Limited spots</span>
              <span className="badge badge-error">Sold out</span>
              <span className="badge badge-info">Upcoming</span>
              <span className="badge badge-dark">Featured</span>
              <span className="badge badge-warm">General</span>
              <span className="badge badge-stone">On hold</span>
            </div>

            {/* Health context */}
            <p className="t-label text-[var(--text-muted)] mb-4">Health Context</p>
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="badge badge-live">● Live now</span>
              <span className="badge badge-recorded">Recorded</span>
              <span className="badge badge-group">Group</span>
              <span className="badge badge-individual">Individual</span>
              <span className="badge badge-popular">Popular</span>
              <span className="badge badge-new">New</span>
              <span className="badge badge-upcoming">Starting soon</span>
              <span className="badge badge-full">Full</span>
              <span className="badge badge-recommended">★ Recommended for you</span>
            </div>

            {/* In context */}
            <p className="t-label text-[var(--text-muted)] mb-4">In Context</p>
            <div className="p-5 rounded-2xl border flex items-center gap-3" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-elevated)" }}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="t-h4 text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Group Pilates</span>
                  <span className="badge badge-popular">Popular</span>
                </div>
                <p className="t-small text-[var(--text-muted)]">Mon · Wed · Fri · 7:00 AM</p>
              </div>
              <span className="badge badge-group">Group · 12</span>
              <span className="badge badge-upcoming">Mon 26 Aug</span>
            </div>
          </section>

          {/* ══ CARDS ════════════════════════════════ */}
          <section id="cards" className="px-8 sm:px-12 pt-20 pb-24 border-b" style={{ borderColor: "var(--border-subtle)" }}>
            <SectionLabel>08 — Cards</SectionLabel>
            <SectionTitle>Card System</SectionTitle>
            <p className="t-body text-[var(--text-muted)] mb-12 max-w-lg">
              Cards use image zoom on hover, subtle elevation, and typography hierarchy — not color or border weight — as the primary differentiator.
            </p>

            {/* Program card */}
            <p className="t-label text-[var(--text-muted)] mb-6">Program Card</p>
            <div className="grid sm:grid-cols-3 gap-5 mb-12">
              {[
                { title: "Group Pilates", cat: "Pilates", weeks: "8 weeks", img: "1571019613454-1cb2f99b2d8b", badge: "badge-popular", badgeText: "Popular", price: "₹6,500" },
                { title: "Strength & Conditioning", cat: "Strength", weeks: "12 weeks", img: "1534438327980-b954516b-bad2-4a57-9b56-5c8e2b4abbe4", badge: "badge-new", badgeText: "New", price: "₹8,200" },
                { title: "Nutrition Coaching", cat: "Nutrition", weeks: "8 weeks", img: "1490645935967-10de6ba17061", badge: "badge-recommended", badgeText: "★ For you", price: "₹5,800" },
              ].map(p => (
                <div key={p.title} className="program-card">
                  <div className="program-card-img" style={{ height: 200 }}>
                    <img
                      src={`https://images.unsplash.com/photo-${p.img}?w=400&h=200&fit=crop&auto=format`}
                      alt={p.title}
                      style={{ height: 200 }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`badge ${p.badge}`}>{p.badgeText}</span>
                    </div>
                  </div>
                  <div className="program-card-body">
                    <p className="t-label text-[var(--text-muted)] mb-1">{p.cat}</p>
                    <h3 className="t-h4 text-[var(--text-primary)] mb-2" style={{ fontFamily: "var(--font-display)" }}>{p.title}</h3>
                    <p className="t-small text-[var(--text-muted)] mb-4">{p.weeks} · Group · Live Zoom</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="t-h4 text-[var(--text-primary)]" style={{ fontFamily: "var(--font-mono)" }}>{p.price}</span>
                      <button className="btn btn-sm btn-primary">Enroll</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Expert card */}
            <p className="t-label text-[var(--text-muted)] mb-6">Expert Card</p>
            <div className="grid sm:grid-cols-3 gap-5 mb-12">
              {[
                { name: "Dr. Anjali Sharma", role: "Medical Director & Founder", img: "1559839734-2b71ea197ec2", isFounder: true },
                { name: "Priya Nair", role: "Certified Pilates Instructor", img: "1571019613454-1cb2f99b2d8b", isFounder: false },
                { name: "Sneha Deshpande", role: "Nutritionist & Wellness Coach", img: "1484516-8a4b-4b0c-8a60-a9a24f5ee1b7", isFounder: false },
              ].map(e => (
                <div key={e.name} className={`expert-card ${e.isFounder ? "expert-card-founder" : ""}`}>
                  <div className="expert-card-img" style={{ height: 240 }}>
                    <img
                      src={`https://images.unsplash.com/photo-${e.img}?w=400&h=240&fit=crop&auto=format`}
                      alt={e.name}
                      style={{ height: 240 }}
                    />
                  </div>
                  <div className="expert-card-body">
                    {e.isFounder && <span className="badge badge-gold mb-2">Founder</span>}
                    <h3 className="t-h4 text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>{e.name}</h3>
                    <p className="t-small text-[var(--text-muted)]">{e.role}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing card */}
            <p className="t-label text-[var(--text-muted)] mb-6">Pricing Card</p>
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                { plan: "Starter", price: "₹3,500", period: "/month", desc: "1 program · Group sessions", features: ["Group Pilates", "Nutrition guides", "WhatsApp support"], style: "", btn: "btn-outline" },
                { plan: "Core", price: "₹7,500", period: "/month", desc: "3 programs · Group + Individual", features: ["All group programs", "2 individual sessions", "Doctor consultation", "Progress tracking"], style: "pricing-recommended", btn: "btn-primary" },
                { plan: "Elite", price: "₹15,000", period: "/month", desc: "Unlimited · Priority access", features: ["All programs", "Unlimited individual", "Weekly doctor check-in", "24/7 WhatsApp", "Custom meal plan"], style: "pricing-featured", btn: "btn-white" },
              ].map(p => (
                <div key={p.plan} className={`pricing-card ${p.style}`} style={p.style === "pricing-featured" ? { color: "white" } : {}}>
                  {p.style === "pricing-recommended" && (
                    <span className="badge badge-gold">Most popular</span>
                  )}
                  <div>
                    <p className="t-label mb-1" style={{ color: p.style === "pricing-featured" ? "rgba(255,255,255,0.5)" : "var(--text-muted)" }}>{p.plan}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="t-h1" style={{ fontFamily: "var(--font-display)", color: p.style === "pricing-featured" ? "white" : "var(--text-primary)" }}>{p.price}</span>
                      <span className="t-small" style={{ color: p.style === "pricing-featured" ? "rgba(255,255,255,0.5)" : "var(--text-muted)" }}>{p.period}</span>
                    </div>
                    <p className="t-small mt-1" style={{ color: p.style === "pricing-featured" ? "rgba(255,255,255,0.6)" : "var(--text-muted)" }}>{p.desc}</p>
                  </div>
                  <div className="space-y-2">
                    {p.features.map(f => (
                      <div key={f} className="flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="6" fill={p.style === "pricing-featured" ? "rgba(107,124,92,0.4)" : "var(--sage-ghost)"} />
                          <path d="M4.5 7l2 2 3-3" stroke={p.style === "pricing-featured" ? "white" : "var(--sage)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="t-small" style={{ color: p.style === "pricing-featured" ? "rgba(255,255,255,0.8)" : "var(--text-secondary)" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button className={`btn ${p.btn} w-full justify-center`}>Get started</button>
                </div>
              ))}
            </div>
          </section>

          {/* ══ NAVIGATION ═══════════════════════════ */}
          <section id="navigation" className="px-8 sm:px-12 pt-20 pb-24 border-b" style={{ borderColor: "var(--border-subtle)" }}>
            <SectionLabel>09 — Navigation</SectionLabel>
            <SectionTitle>Nav Components</SectionTitle>

            {/* Desktop navbar */}
            <p className="t-label text-[var(--text-muted)] mb-4">Desktop Navbar — Transparent (on hero)</p>
            <div className="rounded-2xl overflow-hidden mb-6">
              <div className="relative h-24">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--ink)] to-[var(--ink-80)]" />
                <div className="absolute inset-0 px-8 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[var(--sage)] flex items-center justify-center">
                      <span className="text-white text-sm font-bold">V</span>
                    </div>
                    <span className="text-white text-xl" style={{ fontFamily: "var(--font-display)" }}>VitalAfter40</span>
                  </div>
                  <div className="flex items-center gap-8">
                    {["Programs", "Experts", "About"].map(l => (
                      <span key={l} className="text-white/70 text-sm font-medium hover:text-white cursor-pointer transition-colors">{l}</span>
                    ))}
                  </div>
                  <button className="btn btn-white btn-sm">Book free call</button>
                </div>
              </div>
            </div>

            <p className="t-label text-[var(--text-muted)] mb-4">Desktop Navbar — Solid (scrolled)</p>
            <div className="rounded-2xl border mb-10 px-8 flex items-center justify-between h-16" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-elevated)" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[var(--sage)] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">V</span>
                </div>
                <span className="text-[var(--text-primary)] text-lg" style={{ fontFamily: "var(--font-display)" }}>VitalAfter40</span>
              </div>
              <div className="flex items-center gap-8">
                {["Programs", "Experts", "About"].map((l, i) => (
                  <span key={l} className={`nav-link cursor-pointer ${i === 0 ? "active" : ""}`}>{l}</span>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="lang-toggle">
                  <button className="active">EN</button>
                  <button className="mr">मराठी</button>
                </div>
                <button className="btn btn-primary btn-sm">Book free call</button>
              </div>
            </div>

            {/* Bottom nav */}
            <p className="t-label text-[var(--text-muted)] mb-4">Bottom Navigation (PWA / Mobile)</p>
            <div className="max-w-[360px] border rounded-2xl overflow-hidden" style={{ borderColor: "var(--border-subtle)" }}>
              <div className="h-16 border-t flex" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-elevated)" }}>
                {[
                  { label: "Home", icon: "M3 9l7-7 7 7v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9z", active: true },
                  { label: "Programs", icon: "M3 3h5v5H3zM8 3h5v5H8zM3 8h5v5H3zM8 8h5v5H8z", active: false },
                  { label: "Sessions", icon: "M3 4h14v13H3zM3 8h14", active: false },
                  { label: "Progress", icon: "M3 14l4-4 3 3 4-5 3 3", active: false },
                  { label: "Profile", icon: "M8 9a3 3 0 100-6 3 3 0 000 6zM4 17c0-2.8 1.8-5 4-5s4 2.2 4 5", active: false },
                ].map(item => (
                  <div key={item.label} className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 cursor-pointer ${item.active ? "text-[var(--sage)]" : "text-[var(--text-muted)]"}`}>
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
                      <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[10px]" style={{ fontFamily: "var(--font-mono)" }}>{item.label}</span>
                    {item.active && <div className="w-4 h-0.5 rounded-full bg-[var(--sage)] absolute bottom-0" />}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══ ASSESSMENT ═══════════════════════════ */}
          <section id="assessment" className="px-8 sm:px-12 pt-20 pb-24 border-b" style={{ borderColor: "var(--border-subtle)" }}>
            <SectionLabel>10 — Assessment Components</SectionLabel>
            <SectionTitle>Health Assessment UX</SectionTitle>
            <p className="t-body text-[var(--text-muted)] mb-12 max-w-lg">
              Designed to feel like a conversation, not a form. Clear question hierarchy, smooth selection states, honest progress indication.
            </p>

            {/* Assessment progress */}
            <p className="t-label text-[var(--text-muted)] mb-4">Assessment Progress</p>
            <div className="max-w-lg mb-10">
              <div className="flex items-center justify-between mb-2">
                <span className="t-xs text-[var(--text-muted)]">Question 5 of 13</span>
                <span className="t-xs text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>38%</span>
              </div>
              <div className="assessment-progress mb-1">
                {Array.from({ length: 13 }, (_, i) => (
                  <div key={i} className={`assessment-progress-step ${i < 5 ? "done" : i === 5 ? "current" : ""}`} />
                ))}
              </div>
              <span className="t-caption text-[var(--text-muted)]">Lifestyle & Exercise</span>
            </div>

            {/* Question display */}
            <p className="t-label text-[var(--text-muted)] mb-4">Question Screen</p>
            <div className="max-w-lg rounded-2xl p-8 border mb-10" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-elevated)" }}>
              <div className="flex items-center gap-3 mb-6">
                <span className="t-label text-[var(--text-muted)]">05 / 13</span>
                <span className="t-label text-[var(--border-default)]">—</span>
                <span className="t-label text-[var(--text-muted)]">Lifestyle & Exercise</span>
              </div>
              <h3 className="t-h3 text-[var(--text-primary)] mb-8" style={{ fontFamily: "var(--font-display)" }}>
                How would you describe your current exercise level?
              </h3>
              <div className="space-y-2.5">
                {["Sedentary — desk work, minimal movement","Lightly active — 1–2 days exercise/week","Moderately active — 3–4 days/week","Very active — 5+ days/week"].map((opt, i) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedAnswer(i)}
                    className={`answer-tile w-full ${selectedAnswer === i ? "selected" : ""}`}
                  >
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      selectedAnswer === i ? "bg-[var(--sage)] border-[var(--sage)]" : "border-[var(--border-default)]"
                    }`}>
                      {selectedAnswer === i && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2">
                          <path d="M2 5l2.5 2.5 3.5-4" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "tick-in 0.2s var(--ease-spring) both" }} />
                        </svg>
                      )}
                    </span>
                    <span className="t-small text-[var(--text-primary)]">{opt}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Multi-select */}
            <p className="t-label text-[var(--text-muted)] mb-4">Multi-select Question</p>
            <div className="max-w-lg rounded-2xl p-8 border mb-10" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-elevated)" }}>
              <h3 className="t-h3 text-[var(--text-primary)] mb-2" style={{ fontFamily: "var(--font-display)" }}>
                What are your main health concerns?
              </h3>
              <p className="t-small text-[var(--text-muted)] mb-6">Select all that apply.</p>
              <div className="grid grid-cols-2 gap-2.5">
                {["Joint pain","Low energy","Weight management","Hormonal changes","Sleep issues","Muscle weakness","Back pain","Stress"].map((opt, i) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedMulti(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
                    className={`answer-tile ${selectedMulti.includes(i) ? "selected" : ""}`}
                  >
                    <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                      selectedMulti.includes(i) ? "bg-[var(--sage)] border-[var(--sage)]" : "border-[var(--border-default)]"
                    }`}>
                      {selectedMulti.includes(i) && (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="white" strokeWidth="2">
                          <path d="M1.5 4l1.5 2 3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className="t-small text-[var(--text-primary)]">{opt}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Results / Recommendation */}
            <p className="t-label text-[var(--text-muted)] mb-4">Recommendation Card</p>
            <div className="max-w-lg space-y-3">
              {[
                { label: "Priority", title: "Group Pilates", desc: "Based on your joint pain and low energy profile, Pilates will restore mobility and build deep core strength safely.", accent: "var(--sage)", badge: "badge-recommended" },
                { label: "Also consider", title: "Nutrition Coaching", desc: "Hormonal changes at 40+ are significantly influenced by diet. A structured plan will amplify your results.", accent: "var(--gold)", badge: "badge-gold" },
              ].map(r => (
                <div key={r.title} className="rec-card">
                  <div className="rec-card-accent" style={{ background: r.accent }} />
                  <div className="rec-card-body">
                    <p className="t-label text-[var(--text-muted)] mb-1">{r.label}</p>
                    <h3 className="t-h4 text-[var(--text-primary)] mb-1" style={{ fontFamily: "var(--font-display)" }}>{r.title}</h3>
                    <p className="t-small text-[var(--text-muted)]">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ══ HEALTH COMPONENTS ════════════════════ */}
          <section id="health" className="px-8 sm:px-12 pt-20 pb-24 border-b" style={{ borderColor: "var(--border-subtle)" }}>
            <SectionLabel>11 — Health-specific Components</SectionLabel>
            <SectionTitle>Session & Batch</SectionTitle>

            {/* Session cards */}
            <p className="t-label text-[var(--text-muted)] mb-4">Session Cards</p>
            <div className="space-y-2.5 max-w-lg mb-10">
              {[
                { type: "session-live", badge: "badge-live", badgeText: "● Live now", title: "Morning Pilates — Group", coach: "Priya Nair", time: "7:00 – 7:45 AM", seats: "10 / 12 joined" },
                { type: "session-upcoming", badge: "badge-upcoming", badgeText: "Tomorrow", title: "Nutrition Q&A", coach: "Sneha Deshpande", time: "6:00 PM", seats: "8 / 15 registered" },
                { type: "session-done", badge: "badge-success", badgeText: "Attended", title: "Strength Basics", coach: "Rahul Mehta", time: "Mon, 19 Aug · 8:00 AM", seats: "Completed" },
              ].map(s => (
                <div key={s.title} className={`session-card ${s.type}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`badge ${s.badge}`}>{s.badgeText}</span>
                      </div>
                      <h4 className="t-h4 text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>{s.title}</h4>
                      <p className="t-xs text-[var(--text-muted)] mt-0.5">{s.coach} · {s.time}</p>
                    </div>
                    <span className="t-xs text-[var(--text-muted)] shrink-0">{s.seats}</span>
                  </div>
                  {s.type === "session-live" && (
                    <button className="btn btn-sm btn-primary mt-3">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="1.5"><rect x="1" y="3" width="7" height="6" rx="1"/><path d="M8 5.5l3-2v5l-3-2z"/></svg>
                      Join Zoom
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Batch card */}
            <p className="t-label text-[var(--text-muted)] mb-4">Batch Cards</p>
            <div className="space-y-2.5 max-w-lg mb-10">
              {[
                { day: "Mon / Wed / Fri", time: "7:00 – 7:45 AM", label: "Morning batch", seats: "4 seats left", badge: "badge-warn" },
                { day: "Tue / Thu", time: "7:00 – 8:00 PM", label: "Evening batch", seats: "12 seats", badge: "badge-success" },
                { day: "Saturday", time: "9:00 – 10:30 AM", label: "Weekend intensive", seats: "Full", badge: "badge-full" },
              ].map(b => (
                <div key={b.label} className="batch-card">
                  <div className="w-10 h-10 rounded-xl bg-[var(--sage-ghost)] flex items-center justify-center shrink-0">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--sage)" strokeWidth="1.5"><rect x="2" y="3" width="12" height="11" rx="1.5"/><path d="M2 7h12M6 1v4M10 1v4"/></svg>
                  </div>
                  <div className="flex-1">
                    <p className="t-small font-semibold text-[var(--text-primary)]">{b.label}</p>
                    <p className="t-xs text-[var(--text-muted)]">{b.day} · {b.time}</p>
                  </div>
                  <span className={`badge ${b.badge}`}>{b.seats}</span>
                  <button className="btn btn-sm btn-outline">Book</button>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <p className="t-label text-[var(--text-muted)] mb-4">Testimonial</p>
            <div className="max-w-lg">
              <div className="testimonial-card">
                <p className="t-body-lg text-[var(--text-primary)] relative z-10 pt-8 mb-5" style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}>
                  After 3 months of Pilates and nutrition coaching, I feel stronger than I did in my 30s. The Zoom format means I can join from anywhere.
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&auto=format"
                    alt="Meera Joshi"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="t-small font-semibold text-[var(--text-primary)]">Meera Joshi, 53</p>
                    <p className="t-caption">Pune · Group Pilates</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="var(--gold)"><path d="M6 1l1.5 3L11 4.5 8.5 7l.5 3.5L6 9 3 10.5l.5-3.5L1 4.5 4.5 4z"/></svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══ PROGRESS ═════════════════════════════ */}
          <section id="progress" className="px-8 sm:px-12 pt-20 pb-24 border-b" style={{ borderColor: "var(--border-subtle)" }}>
            <SectionLabel>12 — Progress & Stats</SectionLabel>
            <SectionTitle>Data Visualization</SectionTitle>
            <p className="t-body text-[var(--text-muted)] mb-12 max-w-lg">
              Use rings for single metrics. Use bars for comparison. Use stats sparingly — let the number breathe.
            </p>

            {/* Rings */}
            <p className="t-label text-[var(--text-muted)] mb-6">Progress Rings</p>
            <div className="flex gap-8 flex-wrap mb-12">
              {[
                { value: 87, label: "Consistency", color: "var(--sage)" },
                { value: 72, label: "Mobility", color: "var(--gold)" },
                { value: 55, label: "Strength", color: "var(--info)" },
                { value: 94, label: "Attendance", color: "var(--success)" },
                { value: 38, label: "Nutrition", color: "var(--warning)" },
              ].map(m => (
                <div key={m.label} className="flex flex-col items-center gap-3">
                  <Ring value={m.value} size={80} stroke={7} color={m.color} label={`${m.value}%`} />
                  <p className="t-xs text-[var(--text-muted)] text-center">{m.label}</p>
                </div>
              ))}
            </div>

            {/* Stats */}
            <p className="t-label text-[var(--text-muted)] mb-6">Stats</p>
            <div className="grid grid-cols-4 gap-4 mb-12">
              {[
                { value: "24", label: "Sessions completed" },
                { value: "87%", label: "Attendance rate" },
                { value: "6 wks", label: "Streak" },
                { value: "₹0", label: "Invested in health" },
              ].map(s => (
                <div key={s.label} className="p-5 rounded-2xl border" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-elevated)" }}>
                  <p className="t-stat text-[var(--text-primary)] mb-1">{s.value}</p>
                  <p className="t-xs text-[var(--text-muted)]">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Progress bars */}
            <p className="t-label text-[var(--text-muted)] mb-6">Progress Bars</p>
            <div className="space-y-4 max-w-sm mb-12">
              {[
                { label: "Mobility", pct: 72, color: "var(--sage)" },
                { label: "Strength", pct: 55, color: "var(--info)" },
                { label: "Consistency", pct: 87, color: "var(--gold)" },
              ].map(m => (
                <div key={m.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="t-small text-[var(--text-secondary)]">{m.label}</span>
                    <span className="t-xs text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>{m.pct}%</span>
                  </div>
                  <div className="progress-track progress-track-thick">
                    <div className="progress-fill" style={{ width: `${m.pct}%`, background: m.color }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Stepper */}
            <p className="t-label text-[var(--text-muted)] mb-6">Stepper (Checkout / Onboarding)</p>
            <div className="max-w-md">
              <div className="stepper">
                {["Details", "Payment", "Confirm"].map((step, i) => (
                  <div key={step} className="stepper-step">
                    <div className={`stepper-dot ${i === 0 ? "done" : i === 1 ? "current" : ""}`}>
                      {i === 0
                        ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2"><path d="M2.5 6l2.5 2.5 4.5-4.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        : i + 1
                      }
                    </div>
                    {i < 2 && <div className={`stepper-line ${i === 0 ? "done" : ""}`} />}
                  </div>
                ))}
              </div>
              <div className="flex mt-2">
                {["Details", "Payment", "Confirm"].map((s, i) => (
                  <div key={s} className="flex-1">
                    <p className={`t-xs ${i === 1 ? "text-[var(--sage)] font-medium" : "text-[var(--text-muted)]"}`}
                      style={{ fontFamily: "var(--font-mono)" }}>{s}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══ MOTION ═══════════════════════════════ */}
          <section id="motion" className="px-8 sm:px-12 pt-20 pb-24" style={{ borderColor: "var(--border-subtle)" }}>
            <SectionLabel>13 — Motion System</SectionLabel>
            <SectionTitle>Timing & Easing</SectionTitle>
            <p className="t-body text-[var(--text-muted)] mb-12 max-w-lg">
              Motion is expressive, not decorative. Every duration and easing is intentional. Nothing animates without purpose.
            </p>

            {/* Duration tokens */}
            <p className="t-label text-[var(--text-muted)] mb-6">Duration Scale</p>
            <div className="grid sm:grid-cols-3 gap-4 mb-12">
              {[
                { token: "--dur-micro", val: "150ms", use: "Micro-interactions", eg: "Button press, checkbox, toggle", role: "Immediate feedback — blink fast" },
                { token: "--dur-fast", val: "250ms", use: "UI transitions", eg: "Hover state, badge appearance, tooltip", role: "Snappy — user initiated" },
                { token: "--dur-mid", val: "400ms", use: "Component transitions", eg: "Answer tile, modal open, dropdown", role: "Composed — system response" },
                { token: "--dur-slow", val: "600ms", use: "Page transitions", eg: "Page enter, section change", role: "Deliberate — context shift" },
                { token: "--dur-reveal", val: "800ms", use: "Scroll reveals", eg: "Section reveal, editorial image", role: "Editorial — content arrival" },
                { token: "--dur-instant", val: "80ms", use: "Instant response", eg: "Active/pressed state", role: "Physical — feel of touch" },
              ].map(d => (
                <div key={d.token} className="p-5 rounded-2xl border" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-elevated)" }}>
                  <code className="t-xs text-[var(--sage)] block mb-3" style={{ fontFamily: "var(--font-mono)" }}>{d.token}</code>
                  <p className="text-3xl font-light text-[var(--text-primary)] mb-2" style={{ fontFamily: "var(--font-display)" }}>{d.val}</p>
                  <p className="t-small font-medium text-[var(--text-secondary)] mb-1">{d.use}</p>
                  <p className="t-caption">{d.eg}</p>
                </div>
              ))}
            </div>

            {/* Easing tokens */}
            <p className="t-label text-[var(--text-muted)] mb-6">Easing Curves</p>
            <div className="grid sm:grid-cols-3 gap-4 mb-12">
              {[
                { token: "--ease-out-expo", val: "cubic-bezier(0.16, 1, 0.3, 1)", name: "Out Expo", use: "Most UI — fast start, gradual stop. Energy releases outward." },
                { token: "--ease-out-quart", val: "cubic-bezier(0.25, 1, 0.5, 1)", name: "Out Quart", use: "Hover states, shorter animations. Snappy but smooth." },
                { token: "--ease-spring", val: "cubic-bezier(0.34, 1.56, 0.64, 1)", name: "Spring", use: "Selection feedback, checkboxes, answer tiles. Playful, physical." },
                { token: "--ease-in-out", val: "cubic-bezier(0.45, 0, 0.55, 1)", name: "In-Out", use: "Crossfades, bidirectional transitions. Equal energy." },
              ].map(e => (
                <div key={e.token} className="p-5 rounded-2xl border" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-elevated)" }}>
                  <code className="t-xs text-[var(--sage)] block mb-2" style={{ fontFamily: "var(--font-mono)" }}>{e.token}</code>
                  <p className="t-small font-semibold text-[var(--text-primary)] mb-1">{e.name}</p>
                  <p className="t-small text-[var(--text-muted)] mb-3">{e.use}</p>
                  <code className="t-xs text-[var(--text-muted)] block" style={{ fontFamily: "var(--font-mono)", wordBreak: "break-all" }}>{e.val}</code>
                </div>
              ))}
            </div>

            {/* Motion principles */}
            <p className="t-label text-[var(--text-muted)] mb-6">Motion Principles</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { principle: "Reveal", desc: "Content enters from below (translateY 28px → 0) with opacity fade. Used for scroll-triggered sections. Never bounce.", token: "fade-up · 800ms · ease-out-expo" },
                { principle: "Fade", desc: "Pure opacity transition for overlays, modals, and secondary content. No transform — calm, non-directional.", token: "fade-in · 400ms · ease" },
                { principle: "Scale", desc: "Subtle scale (0.94 → 1) with opacity for modals and menu panels. Creates depth without translation.", token: "scale-in · 400ms · ease-out-expo" },
                { principle: "Slide", desc: "Directional entry for drawers (translateX) and bottom sheets (translateY). Always ease-out-expo — not linear.", token: "slide-up · 600ms · ease-out-expo" },
                { principle: "Stagger", desc: "Sequential delay between list items or cards. Max 6 items, 100ms step. Beyond 6, simultaneous.", token: "delay-100 through delay-600" },
                { principle: "Micro", desc: "Button press (scale 0.99), answer tile slide (translateX 3px), selection pulse. 150ms maximum. Instant feeling.", token: "150ms · ease-spring" },
                { principle: "Image Zoom", desc: "On card hover, image scales 1.04 over 600ms. Smooth, not aggressive. Container clips the overflow.", token: "scale(1.04) · 600ms · ease-out-expo" },
                { principle: "Progress Fill", desc: "Bars animate from 0 to target width on mount. Rings transition stroke-dasharray. Never pulse when idle.", token: "progress-fill · 800ms · ease-out-expo" },
              ].map(p => (
                <div key={p.principle} className="p-5 rounded-2xl border" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-elevated)" }}>
                  <p className="t-h4 text-[var(--text-primary)] mb-1" style={{ fontFamily: "var(--font-display)" }}>{p.principle}</p>
                  <p className="t-small text-[var(--text-muted)] mb-3">{p.desc}</p>
                  <code className="t-xs text-[var(--sage)]" style={{ fontFamily: "var(--font-mono)" }}>{p.token}</code>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-20 pt-12 border-t flex items-center justify-between" style={{ borderColor: "var(--border-subtle)" }}>
              <div>
                <p className="t-label text-[var(--text-muted)] mb-1">VitalAfter40 Design System</p>
                <p className="t-caption">Phase 1 complete — v2.0 · August 2026</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[var(--sage)] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">V</span>
                </div>
                <span className="t-xs text-[var(--text-muted)]" style={{ fontFamily: "var(--font-display)" }}>VitalAfter40</span>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}

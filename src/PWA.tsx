import { useState, useCallback } from "react";
import { programs as allPrograms, professionals, t, type Lang } from "./data";

interface Props { lang: Lang; setLang: (l: Lang) => void; onBack: () => void; }

type Tab = "home" | "programs" | "sessions" | "progress" | "profile";
type TransDir = "left" | "right";
const TAB_ORDER: Tab[] = ["home", "programs", "sessions", "progress", "profile"];

// ─── Mock data ────────────────────────────────────────────────────────────
const USER = { name: "Meera", age: 52, city: "Pune", avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=80&h=80&fit=crop" };

const UPCOMING = [
  { id: 1, prog_en: "Group Pilates", prog_mr: "ग्रुप पिलाटेस", trainer: "Priya Nair", trainer_img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=60&h=60&fit=crop", date: "Mon, 26 Aug", time: "7:00 AM", countdown_h: 14, img: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=400&h=220&fit=crop", category: "Pilates", zoom: "https://zoom.us/j/123" },
  { id: 2, prog_en: "Nutrition Check-in", prog_mr: "पोषण तपासणी", trainer: "Sneha Deshpande", trainer_img: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=60&h=60&fit=crop", date: "Wed, 28 Aug", time: "6:00 PM", countdown_h: 62, img: "https://images.unsplash.com/photo-1621886178958-be42369fc9e7?w=400&h=220&fit=crop", category: "Nutrition", zoom: "https://zoom.us/j/456" },
  { id: 3, prog_en: "Individual Pilates", prog_mr: "वैयक्तिक पिलाटेस", trainer: "Priya Nair", trainer_img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=60&h=60&fit=crop", date: "Fri, 30 Aug", time: "8:00 AM", countdown_h: 110, img: "https://images.unsplash.com/photo-1679688301686-b164852aed9b?w=400&h=220&fit=crop", category: "Pilates", zoom: "https://zoom.us/j/789" },
];

const PAST_SESSIONS = [
  { id: 10, prog_en: "Group Pilates", prog_mr: "ग्रुप पिलाटेस", trainer: "Priya Nair", date: "Mon, 19 Aug", time: "7:00 AM", attended: true, feedback: 5, notes: "Felt great today. Core work was challenging." },
  { id: 11, prog_en: "Group Pilates", prog_mr: "ग्रुप पिलाटेस", trainer: "Priya Nair", date: "Wed, 14 Aug", time: "7:00 AM", attended: true, feedback: 4, notes: "" },
  { id: 12, prog_en: "Nutrition Check-in", prog_mr: "पोषण तपासणी", trainer: "Sneha Deshpande", date: "Wed, 7 Aug", time: "6:00 PM", attended: false, feedback: 0, notes: "" },
  { id: 13, prog_en: "Group Pilates", prog_mr: "ग्रुप पिलाटेस", trainer: "Priya Nair", date: "Mon, 5 Aug", time: "7:00 AM", attended: true, feedback: 5, notes: "Back pain significantly reduced." },
  { id: 14, prog_en: "Group Pilates", prog_mr: "ग्रुप पिलाटेस", trainer: "Priya Nair", date: "Wed, 31 Jul", time: "7:00 AM", attended: true, feedback: 4, notes: "" },
];

const STREAK_DAYS = [1,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,0,1,1,1,0,1,1,1,1,1,0,0,1,1];
const WEEKLY_SESSIONS = [2,3,3,2,3,3,2];
const MOBILITY_PROGRESS = [45,48,52,55,58,62,68,72];
const STRENGTH_PROGRESS = [30,33,36,40,43,47,52,55];

const MILESTONES = [
  { en: "Completed first session", mr: "पहिले सेशन पूर्ण केले", date: "1 Aug", done: true },
  { en: "7-day streak", mr: "७-दिवसांची स्ट्रीक", date: "10 Aug", done: true },
  { en: "10 sessions completed", mr: "१० सेशन्स पूर्ण", date: "19 Aug", done: true },
  { en: "First pain-free session", mr: "पहिले वेदनामुक्त सेशन", date: "22 Aug", done: true },
  { en: "25 sessions completed", mr: "२५ सेशन्स पूर्ण", date: "Coming soon", done: false },
  { en: "8-week program complete", mr: "८-आठवडे कार्यक्रम पूर्ण", date: "Coming soon", done: false },
];

const ACTIVE_PROGRAMS = [
  { id: "pilates-group", week: 4, total_weeks: 8, sessions_done: 12, sessions_total: 24, next: "Mon 7:00 AM" },
  { id: "nutrition", week: 2, total_weeks: 8, sessions_done: 2, sessions_total: 8, next: "Wed 6:00 PM" },
];

const TODAY_FOCUS = [
  { en: "10 min morning mobility", mr: "१० मिनिट सकाळची गतिशीलता" },
  { en: "Drink 8 glasses of water", mr: "८ ग्लास पाणी प्या" },
  { en: "15-min evening walk", mr: "१५ मिनिट संध्याकाळची चाल" },
];

// ─── Ring ─────────────────────────────────────────────────────────────────
function Ring({ pct, size = 72, stroke = 5, color = "var(--sage)", label, sublabel }: {
  pct: number; size?: number; stroke?: number; color?: string; label?: string; sublabel?: string;
}) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative flex items-center justify-center flex-col" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="ring-progress absolute inset-0">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border-subtle)" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${(pct/100)*circ} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1.2s var(--ease-out-expo)" }}/>
      </svg>
      {label && <span className="relative z-10 font-bold leading-none text-[var(--text-primary)]"
        style={{ fontFamily: "var(--font-mono)", fontSize: size * 0.22 }}>{label}</span>}
      {sublabel && <span className="relative z-10 text-[var(--text-muted)]" style={{ fontSize: size * 0.13 }}>{sublabel}</span>}
    </div>
  );
}

// ─── Bar chart ────────────────────────────────────────────────────────────
function BarChart({ data, color = "var(--sage)" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1.5" style={{ height: 56 }}>
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-t transition-all duration-700"
          style={{ height: `${(v/max)*100}%`, background: i === data.length - 1 ? color : `${color}55`, minWidth: 6 }}/>
      ))}
    </div>
  );
}

// ─── Line chart ───────────────────────────────────────────────────────────
function LineChart({ data, color = "var(--sage)", height = 56 }: { data: number[]; color?: string; height?: number }) {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const w = 240, h = height;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - ((v - min) / range) * (h - 8) - 4]);
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  const area = `${d} L ${pts[pts.length-1][0]} ${h} L 0 ${h} Z`;
  const id = `lg${color.replace(/[^a-z]/gi,"")}`;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`}/>
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="3" fill={color}/>
    </svg>
  );
}

// ─── Bottom Sheet ─────────────────────────────────────────────────────────
function BottomSheet({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: React.ReactNode; title?: string }) {
  return (
    <>
      <div className={`fixed inset-0 z-40 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose}/>
      <div className={`fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden transition-transform duration-350 ${open ? "translate-y-0" : "translate-y-full"}`}
        style={{ background: "var(--bg-elevated)", maxHeight: "88vh", transitionTimingFunction: "var(--ease-out-expo)" }}>
        <div className="flex items-center justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full" style={{ background: "var(--border-default)" }}/>
        </div>
        {title && (
          <div className="px-6 pb-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
            <p className="t-h4 text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>{title}</p>
          </div>
        )}
        <div className="overflow-y-auto" style={{ maxHeight: "calc(88vh - 64px)" }}>{children}</div>
      </div>
    </>
  );
}

// ─── Press Card ───────────────────────────────────────────────────────────
function PressCard({ onClick, children, className, style }: { onClick?: () => void; children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const [pressed, setPressed] = useState(false);
  return (
    <div onClick={onClick}
      onPointerDown={() => setPressed(true)} onPointerUp={() => setPressed(false)} onPointerLeave={() => setPressed(false)}
      className={className}
      style={{ ...style, transform: pressed ? "scale(0.975)" : "scale(1)", transition: "transform 0.12s var(--ease-spring)", cursor: onClick ? "pointer" : undefined }}>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HOME TAB
// ═══════════════════════════════════════════════════════════════════════════
function HomeTab({ lang }: { lang: Lang }) {
  const [focusDone, setFocusDone] = useState([false, false, false]);
  const [showZoom, setShowZoom] = useState(false);
  const next = UPCOMING[0];
  const countStr = next.countdown_h < 24 ? `${next.countdown_h}h` : `${Math.floor(next.countdown_h/24)}d ${next.countdown_h%24}h`;
  const h = new Date().getHours();
  const greeting = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  const greeting_mr = h < 12 ? "सुप्रभात" : h < 17 ? "शुभ दुपार" : "शुभ संध्याकाळ";
  const prog = allPrograms.find(p => p.id === ACTIVE_PROGRAMS[0].id)!;
  const ap = ACTIVE_PROGRAMS[0];

  return (
    <div className="pb-24">
      {/* Header */}
      <div style={{ background: "var(--ink)", padding: "3rem 1.25rem 4rem" }}>
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="t-xs text-white/30">VitalAfter40</p>
            <h1 className={`text-white font-semibold mt-0.5 ${lang === "mr" ? "mr" : ""}`}
              style={{ fontFamily: "var(--font-display)", fontSize: "1.45rem", letterSpacing: "-0.02em" }}>
              {t(`${greeting}, ${USER.name}`, `${greeting_mr}, ${USER.name}`, lang)}
            </h1>
          </div>
          <div className="w-11 h-11 rounded-full overflow-hidden border-2" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
            <img src={USER.avatar} alt={USER.name} className="w-full h-full object-cover"/>
          </div>
        </div>
        <p className="t-xs text-white/35 mt-1">{t("Week 4 of 8 · 12 sessions done · 4-day streak", "आठवडा ४ पैकी ८ · १२ सेशन्स पूर्ण · ४-दिवसांची स्ट्रीक", lang)}</p>
      </div>

      <div className="px-4 space-y-4" style={{ marginTop: "-2.5rem" }}>
        {/* Upcoming session card */}
        <PressCard onClick={() => setShowZoom(true)}
          className="rounded-2xl overflow-hidden"
          style={{ background: "var(--bg-elevated)", boxShadow: "var(--shadow-xl)", border: "1px solid var(--border-subtle)" }}>
          <div className="relative overflow-hidden" style={{ height: 168 }}>
            <img src={next.img} alt="" className="w-full h-full object-cover opacity-75"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-black/10"/>
            <div className="absolute top-3 left-3">
              <span className="badge badge-live">{t("Next · In", "पुढील · मध्ये", lang)} {countStr}</span>
            </div>
            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
              <div>
                <p className={`text-white font-semibold ${lang === "mr" ? "mr" : ""}`}
                  style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", letterSpacing: "-0.01em" }}>
                  {lang === "en" ? next.prog_en : next.prog_mr}
                </p>
                <p className="text-white/55 t-xs">{next.date} · {next.time}</p>
              </div>
              <div className="text-right shrink-0 ml-3">
                <p className="text-white font-bold" style={{ fontFamily: "var(--font-mono)", fontSize: "1.4rem", lineHeight: 1 }}>{countStr}</p>
                <p className="text-white/40 t-xs">{t("remaining", "बाकी", lang)}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
                <img src={next.trainer_img} alt={next.trainer} className="w-full h-full object-cover"/>
              </div>
              <p className="t-xs text-[var(--text-muted)]">{next.trainer}</p>
            </div>
            <button className={`btn btn-sm btn-primary ${lang === "mr" ? "mr" : ""}`} onClick={e => { e.stopPropagation(); setShowZoom(true); }}>
              {t("Join Zoom", "झूम जॉइन", lang)}
            </button>
          </div>
        </PressCard>

        {/* Today's focus */}
        <div className="rounded-2xl p-4 border" style={{ background: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
          <div className="flex items-center justify-between mb-3">
            <p className={`t-label text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`}>{t("Today's focus", "आजचा फोकस", lang)}</p>
            <span className="t-xs font-medium text-[var(--sage)]" style={{ fontFamily: "var(--font-mono)" }}>
              {focusDone.filter(Boolean).length}/{focusDone.length}
            </span>
          </div>
          {/* Focus progress bar */}
          <div className="h-1 rounded-full mb-3" style={{ background: "var(--border-subtle)" }}>
            <div className="h-full rounded-full bg-[var(--sage)] transition-all duration-500"
              style={{ width: `${(focusDone.filter(Boolean).length/focusDone.length)*100}%` }}/>
          </div>
          <div className="space-y-2.5">
            {TODAY_FOCUS.map((f, i) => (
              <div key={f.en} onClick={() => setFocusDone(d => d.map((v, j) => j === i ? !v : v))}
                className="flex items-center gap-3 cursor-pointer">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${focusDone[i] ? "bg-[var(--sage)] border-[var(--sage)]" : "border-[var(--border-default)]"}`}>
                  {focusDone[i] && <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="white" strokeWidth="2"><path d="M1.5 4.5l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span className={`t-xs text-[var(--text-primary)] ${focusDone[i] ? "line-through text-[var(--text-muted)]" : ""} ${lang === "mr" ? "mr" : ""}`}>
                  {lang === "en" ? f.en : f.mr}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress rings */}
        <div className="rounded-2xl p-4 border" style={{ background: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
          <p className={`t-label text-[var(--text-muted)] mb-4 ${lang === "mr" ? "mr" : ""}`}>{t("Your scores", "तुमचे स्कोअर्स", lang)}</p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label_en: "Mobility", label_mr: "गतिशीलता", pct: 72, color: "var(--sage)" },
              { label_en: "Strength", label_mr: "ताकद", pct: 55, color: "#3a6fa8" },
              { label_en: "Consistent", label_mr: "सातत्य", pct: 87, color: "var(--gold)" },
              { label_en: "Energy", label_mr: "ऊर्जा", pct: 68, color: "#8a4fa8" },
            ].map(m => (
              <div key={m.label_en} className="flex flex-col items-center gap-1.5">
                <Ring pct={m.pct} size={58} stroke={4} color={m.color} label={`${m.pct}`}/>
                <p className={`text-center text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`} style={{ fontSize: "0.58rem", lineHeight: 1.3 }}>
                  {lang === "en" ? m.label_en : m.label_mr}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Active program progress */}
        <div className="rounded-2xl overflow-hidden border" style={{ background: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
          <div className="relative h-24 overflow-hidden">
            <img src={prog.image} alt="" className="w-full h-full object-cover opacity-50"/>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex items-center px-4">
              <div>
                <p className="text-white/40 t-xs">{t("Active program", "सक्रिय प्रोग्राम", lang)}</p>
                <p className={`text-white font-semibold ${lang === "mr" ? "mr" : ""}`}
                  style={{ fontFamily: "var(--font-display)", fontSize: "1rem" }}>
                  {lang === "en" ? prog.title_en : prog.title_mr}
                </p>
              </div>
            </div>
          </div>
          <div className="px-4 py-3">
            <div className="flex justify-between text-[var(--text-muted)] t-xs mb-1.5">
              <span className={lang === "mr" ? "mr" : ""}>{t(`Week ${ap.week} of ${ap.total_weeks}`, `आठवडा ${ap.week}/${ap.total_weeks}`, lang)}</span>
              <span style={{ fontFamily: "var(--font-mono)" }}>{ap.sessions_done}/{ap.sessions_total} {t("sessions", "सेशन्स", lang)}</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: "var(--border-subtle)" }}>
              <div className="h-full rounded-full bg-[var(--sage)]" style={{ width: `${(ap.sessions_done/ap.sessions_total)*100}%`, transition: "width 1s var(--ease-out-expo)" }}/>
            </div>
          </div>
        </div>

        {/* Upcoming mini */}
        <div>
          <p className={`t-label text-[var(--text-muted)] mb-2.5 ${lang === "mr" ? "mr" : ""}`}>{t("Coming up", "येणारे", lang)}</p>
          <div className="space-y-2">
            {UPCOMING.slice(1).map(s => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl border"
                style={{ background: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
                <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0">
                  <img src={s.img} alt="" className="w-full h-full object-cover"/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`t-xs font-semibold text-[var(--text-primary)] truncate ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? s.prog_en : s.prog_mr}</p>
                  <p className="t-xs text-[var(--text-muted)]">{s.date} · {s.time}</p>
                </div>
                <span className="t-xs text-[var(--text-muted)] shrink-0" style={{ fontFamily: "var(--font-mono)" }}>
                  {Math.floor(s.countdown_h/24)}d
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Zoom bottom sheet */}
      <BottomSheet open={showZoom} onClose={() => setShowZoom(false)} title={t("Join Session", "सेशन जॉइन करा", lang)}>
        <div className="p-6">
          <div className="flex gap-3 items-center mb-5 p-4 rounded-2xl" style={{ background: "var(--bg-muted)" }}>
            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
              <img src={next.img} alt="" className="w-full h-full object-cover"/>
            </div>
            <div>
              <p className={`t-small font-semibold text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                {lang === "en" ? next.prog_en : next.prog_mr}
              </p>
              <p className="t-xs text-[var(--text-muted)]">{next.date} · {next.time}</p>
              <p className="t-xs text-[var(--text-muted)]">{next.trainer}</p>
            </div>
          </div>
          {[
            { en: "Zoom link is ready", mr: "झूम लिंक तयार आहे" },
            { en: "Live · 60 minutes", mr: "लाइव्ह · ६० मिनिटे" },
            { en: "Bring your mat", mr: "तुमचा मॅट आणा" },
          ].map(it => (
            <div key={it.en} className="flex items-center gap-2 mb-3 t-xs text-[var(--text-muted)]">
              <div className="w-1 h-1 rounded-full bg-[var(--text-muted)] shrink-0"/>
              <span className={lang === "mr" ? "mr" : ""}>{lang === "en" ? it.en : it.mr}</span>
            </div>
          ))}
          <a href={next.zoom} target="_blank" rel="noopener noreferrer"
            className={`btn btn-primary btn-xl w-full justify-center mt-4 ${lang === "mr" ? "mr" : ""}`}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="1.5">
              <rect x="1" y="4" width="11" height="10" rx="1.5"/><path d="M12 8l6-3v8l-6-3"/>
            </svg>
            {t("Join Zoom Now", "झूम जॉइन करा", lang)}
          </a>
        </div>
      </BottomSheet>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SESSIONS TAB
// ═══════════════════════════════════════════════════════════════════════════
function SessionsTab({ lang }: { lang: Lang }) {
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");
  const [joinSheet, setJoinSheet] = useState<typeof UPCOMING[0] | null>(null);
  const [feedbackSheet, setFeedbackSheet] = useState<typeof PAST_SESSIONS[0] | null>(null);
  const [stars, setStars] = useState(5);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  return (
    <div className="pb-24">
      <div style={{ background: "var(--ink)", padding: "3rem 1.25rem 1.5rem" }}>
        <h2 className={`text-white mb-4 ${lang === "mr" ? "mr" : ""}`}
          style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", letterSpacing: "-0.02em" }}>
          {t("Sessions", "सेशन्स", lang)}
        </h2>
        <div className="flex p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.08)" }}>
          {(["upcoming", "past"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex-1 py-2 rounded-lg t-label transition-all ${filter === f ? "bg-white text-[var(--ink-80)]" : "text-white/50"} ${lang === "mr" ? "mr" : ""}`}>
              {f === "upcoming" ? t("Upcoming", "येणारे", lang) : t("Past", "मागील", lang)}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {filter === "upcoming" ? UPCOMING.map(s => (
          <PressCard key={s.id} onClick={() => setJoinSheet(s)}
            className="rounded-2xl overflow-hidden border"
            style={{ background: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
            <div className="relative" style={{ height: 160 }}>
              <img src={s.img} alt="" className="w-full h-full object-cover"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent"/>
              <div className="absolute top-3 left-3">
                <span className="badge badge-live">{t("Upcoming", "येणारे", lang)}</span>
              </div>
              <div className="absolute bottom-3 left-4 right-4">
                <p className={`text-white font-semibold ${lang === "mr" ? "mr" : ""}`}
                  style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem" }}>
                  {lang === "en" ? s.prog_en : s.prog_mr}
                </p>
                <p className="text-white/55 t-xs">{s.date} · {s.time} · {s.trainer}</p>
              </div>
            </div>
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full overflow-hidden">
                  <img src={s.trainer_img} alt="" className="w-full h-full object-cover"/>
                </div>
                <div>
                  <p className="t-xs font-medium text-[var(--text-primary)]">{s.category}</p>
                  <p className="text-[var(--text-muted)]" style={{ fontSize: "0.6rem" }}>
                    {t("In", "मध्ये", lang)} {Math.floor(s.countdown_h/24) > 0 ? `${Math.floor(s.countdown_h/24)}d` : `${s.countdown_h}h`}
                  </p>
                </div>
              </div>
              <button onClick={e => { e.stopPropagation(); setJoinSheet(s); }}
                className={`btn btn-primary btn-sm ${lang === "mr" ? "mr" : ""}`}>
                {t("Join", "जॉइन", lang)}
              </button>
            </div>
          </PressCard>
        )) : PAST_SESSIONS.map(s => (
          <PressCard key={s.id} onClick={() => { setNote(s.notes); setStars(s.feedback || 5); setFeedbackSheet(s); }}
            className="flex items-start gap-3 p-4 rounded-2xl border"
            style={{ background: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${s.attended ? "bg-[var(--sage-pale)]" : "bg-[var(--bg-muted)]"}`}>
              {s.attended
                ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--sage)" strokeWidth="2"><path d="M2.5 7l3 3 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                : <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--text-muted)" strokeWidth="2"><path d="M2 2l8 8M10 2L2 10" strokeLinecap="round"/></svg>
              }
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className={`t-small font-semibold text-[var(--text-primary)] truncate ${lang === "mr" ? "mr" : ""}`}>
                  {lang === "en" ? s.prog_en : s.prog_mr}
                </p>
                <span className={`t-xs ml-2 shrink-0 ${s.attended ? "text-[var(--sage)]" : "text-[var(--text-muted)]"}`}>
                  {s.attended ? t("Attended", "उपस्थित", lang) : t("Missed", "गहाळ", lang)}
                </span>
              </div>
              <p className="t-xs text-[var(--text-muted)]">{s.trainer} · {s.date}</p>
              {s.feedback > 0 && (
                <div className="flex gap-0.5 mt-1">
                  {Array.from({length:5}).map((_,i) => (
                    <span key={i} style={{ color: i < s.feedback ? "var(--gold)" : "var(--border-default)", fontSize: "0.65rem" }}>★</span>
                  ))}
                </div>
              )}
              {s.notes && <p className="t-xs text-[var(--text-muted)] mt-1 italic line-clamp-1">"{s.notes}"</p>}
            </div>
          </PressCard>
        ))}
      </div>

      {/* Join sheet */}
      {joinSheet && (
        <BottomSheet open={!!joinSheet} onClose={() => setJoinSheet(null)} title={t("Join Session", "सेशन जॉइन करा", lang)}>
          <div className="p-6">
            <div className="flex gap-3 items-center p-4 rounded-2xl mb-5" style={{ background: "var(--bg-muted)" }}>
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                <img src={joinSheet.img} alt="" className="w-full h-full object-cover"/>
              </div>
              <div>
                <p className={`t-small font-semibold text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                  {lang === "en" ? joinSheet.prog_en : joinSheet.prog_mr}
                </p>
                <p className="t-xs text-[var(--text-muted)]">{joinSheet.date} · {joinSheet.time}</p>
                <p className="t-xs text-[var(--text-muted)]">{joinSheet.trainer}</p>
              </div>
            </div>
            <a href={joinSheet.zoom} target="_blank" rel="noopener noreferrer"
              className={`btn btn-primary btn-xl w-full justify-center mb-3 ${lang === "mr" ? "mr" : ""}`}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5">
                <rect x="0.5" y="3" width="10" height="10" rx="1.5"/><path d="M11 7l5-3v8l-5-3"/>
              </svg>
              {t("JOIN SESSION", "सेशन जॉइन करा", lang)}
            </a>
            <button onClick={() => setJoinSheet(null)} className={`btn btn-ghost w-full justify-center ${lang === "mr" ? "mr" : ""}`}>
              {t("Not now", "आत्ता नाही", lang)}
            </button>
          </div>
        </BottomSheet>
      )}

      {/* Feedback sheet */}
      {feedbackSheet && (
        <BottomSheet open={!!feedbackSheet} onClose={() => setFeedbackSheet(null)} title={t("Session review", "सेशन पुनरावलोकन", lang)}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5 pb-5 border-b" style={{ borderColor: "var(--border-subtle)" }}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${feedbackSheet.attended ? "bg-[var(--sage-pale)]" : "bg-[var(--bg-muted)]"}`}>
                {feedbackSheet.attended ? "✓" : "✕"}
              </div>
              <div>
                <p className={`t-small font-semibold text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? feedbackSheet.prog_en : feedbackSheet.prog_mr}</p>
                <p className="t-xs text-[var(--text-muted)]">{feedbackSheet.date} · {feedbackSheet.trainer}</p>
              </div>
            </div>

            <p className={`t-label text-[var(--text-muted)] mb-3 ${lang === "mr" ? "mr" : ""}`}>{t("How was it?", "कसे होते?", lang)}</p>
            <div className="flex gap-4 mb-5">
              {Array.from({length:5}).map((_,i) => (
                <button key={i} onClick={() => setStars(i+1)} className="text-3xl transition-transform hover:scale-110"
                  style={{ color: i < stars ? "var(--gold)" : "var(--border-default)" }}>★</button>
              ))}
            </div>

            <p className={`t-label text-[var(--text-muted)] mb-2 ${lang === "mr" ? "mr" : ""}`}>{t("Notes", "नोट्स", lang)}</p>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
              placeholder={lang === "en" ? "How did it feel? Any progress or pain to note?" : "कसे वाटले?"}
              className="field w-full resize-none mb-4"/>

            {feedbackSheet.attended && (
              <div className="p-4 rounded-2xl mb-5" style={{ background: "var(--sage-ghost)", border: "1px solid var(--sage-pale)" }}>
                <p className={`t-label text-[var(--sage)] mb-1 ${lang === "mr" ? "mr" : ""}`}>{t("Next session", "पुढील सेशन", lang)}</p>
                <p className={`t-small font-semibold text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                  {UPCOMING[0].date} · {UPCOMING[0].time}
                </p>
              </div>
            )}

            <button onClick={() => { setSaved(true); setTimeout(() => { setSaved(false); setFeedbackSheet(null); }, 1500); }}
              className={`btn btn-primary w-full justify-center ${lang === "mr" ? "mr" : ""}`}>
              {saved ? t("✓ Saved!", "✓ जतन केले!", lang) : t("Save notes", "नोट्स जतन करा", lang)}
            </button>
          </div>
        </BottomSheet>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PROGRAMS TAB
// ═══════════════════════════════════════════════════════════════════════════
function ProgramsTab({ lang }: { lang: Lang }) {
  const [recCat, setRecCat] = useState("All");
  const CATS = ["All", "Mobility", "Back & Neck", "Pilates", "Strength"];
  const VIDEOS = [
    { title: "Morning Mobility Flow", cat: "Mobility", dur: "18 min", thumb: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=120&fit=crop" },
    { title: "Lower Back Relief", cat: "Back & Neck", dur: "22 min", thumb: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=200&h=120&fit=crop" },
    { title: "Core Foundation", cat: "Pilates", dur: "25 min", thumb: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=200&h=120&fit=crop" },
    { title: "Hip Strength", cat: "Strength", dur: "30 min", thumb: "https://images.unsplash.com/photo-1692372372810-c848c9cca1c5?w=200&h=120&fit=crop" },
    { title: "Neck Care", cat: "Back & Neck", dur: "15 min", thumb: "https://images.unsplash.com/photo-1621886178958-be42369fc9e7?w=200&h=120&fit=crop" },
    { title: "Evening Recovery", cat: "Mobility", dur: "20 min", thumb: "https://images.unsplash.com/photo-1574310094148-ca48ab86734c?w=200&h=120&fit=crop" },
  ];
  const filtered = recCat === "All" ? VIDEOS : VIDEOS.filter(v => v.cat === recCat);

  return (
    <div className="pb-24">
      <div style={{ background: "var(--ink)", padding: "3rem 1.25rem 1.5rem" }}>
        <h2 className={`text-white ${lang === "mr" ? "mr" : ""}`}
          style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", letterSpacing: "-0.02em" }}>
          {t("My Programs", "माझे प्रोग्राम्स", lang)}
        </h2>
      </div>

      <div className="px-4 pt-4 space-y-5">
        {/* Active */}
        <div>
          <p className={`t-label text-[var(--text-muted)] mb-3 ${lang === "mr" ? "mr" : ""}`}>{t("Active", "सक्रिय", lang)}</p>
          <div className="space-y-3">
            {ACTIVE_PROGRAMS.map(ap => {
              const prog = allPrograms.find(p => p.id === ap.id)!;
              const exp = professionals.find(p => prog.category === "pilates" ? p.id === "priya-pilates" : p.id === "sneha-nutrition");
              return (
                <PressCard key={ap.id} className="rounded-2xl overflow-hidden border"
                  style={{ background: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
                  <div className="relative" style={{ height: 116 }}>
                    <img src={prog.image} alt="" className="w-full h-full object-cover opacity-60"/>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex items-center px-4">
                      <div>
                        <span className="badge badge-live mb-1.5">{t("Active", "सक्रिय", lang)}</span>
                        <p className={`text-white font-semibold ${lang === "mr" ? "mr" : ""}`}
                          style={{ fontFamily: "var(--font-display)", fontSize: "1rem" }}>
                          {lang === "en" ? prog.title_en : prog.title_mr}
                        </p>
                        <p className="text-white/45 t-xs">{t(`Week ${ap.week} of ${ap.total_weeks}`, `आठवडा ${ap.week}/${ap.total_weeks}`, lang)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {exp && <div className="w-5 h-5 rounded-full overflow-hidden"><img src={exp.image} alt="" className="w-full h-full object-cover"/></div>}
                        <span className="t-xs text-[var(--text-muted)]">{exp?.name_en}</span>
                      </div>
                      <span className="t-xs text-[var(--sage)]" style={{ fontFamily: "var(--font-mono)" }}>
                        {ap.sessions_done}/{ap.sessions_total}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: "var(--border-subtle)" }}>
                      <div className="h-full rounded-full bg-[var(--sage)]" style={{ width: `${(ap.sessions_done/ap.sessions_total)*100}%` }}/>
                    </div>
                    <p className={`t-xs text-[var(--text-muted)] mt-2 ${lang === "mr" ? "mr" : ""}`}>{t("Next:", "पुढील:", lang)} {ap.next}</p>
                  </div>
                </PressCard>
              );
            })}
          </div>
        </div>

        {/* Recommended */}
        <div>
          <p className={`t-label text-[var(--text-muted)] mb-3 ${lang === "mr" ? "mr" : ""}`}>{t("Recommended for you", "तुमच्यासाठी शिफारस", lang)}</p>
          {allPrograms.filter(p => p.id === "strength" || p.id === "doctor").map(prog => (
            <div key={prog.id} className="flex items-center gap-3 p-3 rounded-xl border mb-2"
              style={{ background: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
              <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0">
                <img src={prog.image} alt="" className="w-full h-full object-cover"/>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`t-xs font-semibold text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? prog.title_en : prog.title_mr}</p>
                <p className="t-xs text-[var(--text-muted)]">₹{prog.price.toLocaleString()}</p>
              </div>
              <button className={`btn btn-sm btn-outline ${lang === "mr" ? "mr" : ""}`}>{t("Add", "जोडा", lang)}</button>
            </div>
          ))}
        </div>

        {/* Recorded library */}
        <div>
          <p className={`t-label text-[var(--text-muted)] mb-3 ${lang === "mr" ? "mr" : ""}`}>{t("Recorded library", "रेकॉर्डेड लायब्ररी", lang)}</p>
          <div className="h-scroll mb-3">
            {CATS.map(c => (
              <button key={c} onClick={() => setRecCat(c)}
                className={`shrink-0 px-3 py-1.5 rounded-full t-xs font-medium transition-all border ${recCat === c ? "bg-[var(--sage)] border-[var(--sage)] text-white" : "border-[var(--border-subtle)] text-[var(--text-muted)]"}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(v => (
              <PressCard key={v.title} className="rounded-xl overflow-hidden border"
                style={{ background: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
                <div className="relative" style={{ height: 88 }}>
                  <img src={v.thumb} alt={v.title} className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-white text-sm ml-0.5">▶</span>
                    </div>
                  </div>
                  <div className="absolute bottom-1.5 right-2">
                    <span className="text-white/80" style={{ fontSize: "0.6rem", fontFamily: "var(--font-mono)" }}>{v.dur}</span>
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="t-xs font-semibold text-[var(--text-primary)] line-clamp-1">{v.title}</p>
                </div>
              </PressCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PROGRESS TAB
// ═══════════════════════════════════════════════════════════════════════════
function ProgressTab({ lang }: { lang: Lang }) {
  const attended = PAST_SESSIONS.filter(s => s.attended).length;
  const streak = 4, maxStreak = 11;

  return (
    <div className="pb-24">
      <div style={{ background: "var(--ink)", padding: "3rem 1.25rem 1.5rem" }}>
        <h2 className={`text-white ${lang === "mr" ? "mr" : ""}`}
          style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", letterSpacing: "-0.02em" }}>
          {t("Progress", "प्रगती", lang)}
        </h2>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Stat row */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { val: `${attended}`, label_en: "Sessions done", label_mr: "सेशन्स पूर्ण", color: "var(--sage)" },
            { val: `${Math.round((attended/PAST_SESSIONS.length)*100)}%`, label_en: "Attendance", label_mr: "उपस्थिती", color: "var(--gold)" },
            { val: `${streak}`, label_en: "Day streak", label_mr: "दिवसांची स्ट्रीक", color: "#e07b39" },
          ].map(s => (
            <div key={s.label_en} className="p-3 rounded-2xl border text-center"
              style={{ background: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
              <p className="font-bold leading-none mb-1" style={{ fontFamily: "var(--font-mono)", fontSize: "1.4rem", color: s.color }}>{s.val}</p>
              <p className={`text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`} style={{ fontSize: "0.58rem" }}>
                {lang === "en" ? s.label_en : s.label_mr}
              </p>
            </div>
          ))}
        </div>

        {/* Score rings */}
        <div className="p-4 rounded-2xl border" style={{ background: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
          <p className={`t-label text-[var(--text-muted)] mb-4 ${lang === "mr" ? "mr" : ""}`}>{t("Overall scores", "एकूण स्कोअर्स", lang)}</p>
          <div className="grid grid-cols-2 gap-5">
            {[
              { label_en: "Mobility", label_mr: "गतिशीलता", pct: 72, color: "var(--sage)", trend: "+8 this month" },
              { label_en: "Strength", label_mr: "ताकद", pct: 55, color: "#3a6fa8", trend: "+12 this month" },
              { label_en: "Consistency", label_mr: "सातत्य", pct: 87, color: "var(--gold)", trend: "+3 this month" },
              { label_en: "Energy", label_mr: "ऊर्जा", pct: 68, color: "#8a4fa8", trend: "+15 this month" },
            ].map(m => (
              <div key={m.label_en} className="flex items-center gap-3">
                <Ring pct={m.pct} size={52} stroke={4} color={m.color} label={`${m.pct}`}/>
                <div>
                  <p className={`t-xs font-semibold text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? m.label_en : m.label_mr}</p>
                  <p className="text-[var(--sage)]" style={{ fontSize: "0.6rem" }}>{m.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Streak calendar */}
        <div className="p-4 rounded-2xl border" style={{ background: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
          <div className="flex items-center justify-between mb-3">
            <p className={`t-label text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`}>{t("Activity streak", "क्रियाकलाप स्ट्रीक", lang)}</p>
            <span className="t-xs font-bold text-[var(--gold)]" style={{ fontFamily: "var(--font-mono)" }}>{streak} days</span>
          </div>
          <div className="flex gap-1 flex-wrap">
            {STREAK_DAYS.map((d, i) => (
              <div key={i} className="rounded" style={{ width: 18, height: 18, background: d ? "var(--sage)" : "var(--bg-muted)", opacity: d ? (i >= STREAK_DAYS.length - streak ? 1 : 0.5) : 0.3 }}/>
            ))}
          </div>
          <p className="t-xs text-[var(--text-muted)] mt-2">{t(`Best: ${maxStreak} days · Current: ${streak} days`, `सर्वोत्तम: ${maxStreak} दिवस · सध्या: ${streak} दिवस`, lang)}</p>
        </div>

        {/* Mobility line */}
        <div className="p-4 rounded-2xl border" style={{ background: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
          <div className="flex justify-between items-center mb-3">
            <p className={`t-label text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`}>{t("Mobility score", "गतिशीलता स्कोअर", lang)}</p>
            <span className="t-xs text-[var(--sage)]" style={{ fontFamily: "var(--font-mono)" }}>45 → 72 pts</span>
          </div>
          <LineChart data={MOBILITY_PROGRESS} color="var(--sage)" height={60}/>
          <div className="flex justify-between mt-1">
            <span className="t-xs text-[var(--text-muted)]">Week 1</span>
            <span className="t-xs text-[var(--text-muted)]">Now</span>
          </div>
        </div>

        {/* Strength bars */}
        <div className="p-4 rounded-2xl border" style={{ background: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
          <div className="flex justify-between items-center mb-3">
            <p className={`t-label text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`}>{t("Strength progress", "ताकद प्रगती", lang)}</p>
            <span className="t-xs text-[#3a6fa8]" style={{ fontFamily: "var(--font-mono)" }}>30 → 55 pts</span>
          </div>
          <BarChart data={STRENGTH_PROGRESS} color="#3a6fa8"/>
          <div className="flex justify-between mt-1">
            <span className="t-xs text-[var(--text-muted)]">Week 1</span>
            <span className="t-xs text-[var(--text-muted)]">Now</span>
          </div>
        </div>

        {/* Sessions/week */}
        <div className="p-4 rounded-2xl border" style={{ background: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
          <p className={`t-label text-[var(--text-muted)] mb-3 ${lang === "mr" ? "mr" : ""}`}>{t("Sessions per week", "आठवड्यातील सेशन्स", lang)}</p>
          <BarChart data={WEEKLY_SESSIONS} color="var(--gold)"/>
          <p className={`t-xs text-[var(--text-muted)] mt-2 ${lang === "mr" ? "mr" : ""}`}>{t("Avg 2.6 / week · Target 3 / week", "सरासरी २.६/आठवडा · लक्ष्य ३/आठवडा", lang)}</p>
        </div>

        {/* Milestones */}
        <div>
          <p className={`t-label text-[var(--text-muted)] mb-3 ${lang === "mr" ? "mr" : ""}`}>{t("Milestones", "टप्पे", lang)}</p>
          <div className="space-y-2">
            {MILESTONES.map(m => (
              <div key={m.en} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${m.done ? "" : "opacity-50"}`}
                style={{ background: m.done ? "var(--bg-elevated)" : "var(--bg-muted)", borderColor: m.done ? "var(--border-subtle)" : "transparent" }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: m.done ? "var(--sage-pale)" : "var(--bg-muted)" }}>
                  {m.done
                    ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--sage)" strokeWidth="2"><path d="M2 6l3.5 3.5 5-5.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    : <div className="w-2 h-2 rounded-full" style={{ background: "var(--border-default)" }}/>
                  }
                </div>
                <div className="flex-1">
                  <p className={`t-xs font-semibold text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? m.en : m.mr}</p>
                  <p className="t-xs text-[var(--text-muted)]">{m.date}</p>
                </div>
                {!m.done && <span className="t-xs text-[var(--text-muted)]">–</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PROFILE TAB
// ═══════════════════════════════════════════════════════════════════════════
function ProfileTab({ lang, setLang, onBack }: { lang: Lang; setLang: (l: Lang) => void; onBack: () => void }) {
  const [notifs, setNotifs] = useState({ sessions: true, progress: true, offers: false });

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-4">
      <p className="t-label text-[var(--text-muted)] mb-2">{title}</p>
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-elevated)" }}>
        {children}
      </div>
    </div>
  );

  const Row = ({ icon, label, value, chevron = true, onClick, toggle, toggled }: {
    icon: string; label: string; value?: string; chevron?: boolean;
    onClick?: () => void; toggle?: boolean; toggled?: boolean;
  }) => (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b last:border-0 cursor-pointer hover:bg-[var(--bg-muted)] transition-colors active:bg-[var(--bg-muted)]"
      style={{ borderColor: "var(--border-subtle)" }} onClick={onClick}>
      <span className="text-base w-5 text-center shrink-0">{icon}</span>
      <span className={`t-small text-[var(--text-primary)] flex-1 ${lang === "mr" ? "mr" : ""}`}>{label}</span>
      {toggle !== undefined ? (
        <div className="relative shrink-0" style={{ width: 42, height: 24 }} onClick={e => { e.stopPropagation(); onClick?.(); }}>
          <div className={`absolute inset-0 rounded-full transition-colors duration-200 ${toggled ? "bg-[var(--sage)]" : "bg-[var(--border-default)]"}`}/>
          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${toggled ? "left-[18px]" : "left-0.5"}`}/>
        </div>
      ) : (
        <>
          {value && <span className="t-xs text-[var(--text-muted)] shrink-0">{value}</span>}
          {chevron && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" className="shrink-0">
            <path d="M4 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>}
        </>
      )}
    </div>
  );

  return (
    <div className="pb-28">
      {/* Profile header */}
      <div style={{ background: "var(--ink)", padding: "3rem 1.25rem 2rem" }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
            <img src={USER.avatar} alt={USER.name} className="w-full h-full object-cover"/>
          </div>
          <div className="flex-1">
            <h2 className="text-white font-semibold" style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", letterSpacing: "-0.01em" }}>{USER.name}</h2>
            <p className="text-white/45 t-xs">Age {USER.age} · {USER.city}</p>
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {["Movement", "Strength", "Energy"].map(g => (
                <span key={g} className="px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", fontSize: "0.6rem" }}>{g}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        <Section title={t("Personal information", "वैयक्तिक माहिती", lang)}>
          <Row icon="–" label={t("Full name", "पूर्ण नाव", lang)} value={USER.name}/>
          <Row icon="–" label={t("Age", "वय", lang)} value={String(USER.age)}/>
          <Row icon="–" label={t("City", "शहर", lang)} value={USER.city}/>
          <Row icon="–" label={t("Phone", "फोन", lang)} value="+91 98765 43210"/>
          <Row icon="–" label={t("Email", "ईमेल", lang)} value="meera@email.com"/>
          <Row icon="–" label={t("Goals", "उद्दिष्टे", lang)} value="Movement, Strength"/>
        </Section>

        <Section title={t("Language", "भाषा", lang)}>
          <div className="px-4 py-3">
            <div className="flex gap-2">
              {(["en", "mr"] as const).map(l => (
                <button key={l} onClick={() => setLang(l)}
                  className={`flex-1 py-2.5 rounded-xl t-label border transition-all ${lang === l ? "bg-[var(--sage)] border-[var(--sage)] text-white" : "border-[var(--border-subtle)] text-[var(--text-muted)]"}`}>
                  {l === "en" ? "English" : "मराठी"}
                </button>
              ))}
            </div>
          </div>
        </Section>

        <Section title={t("Programs", "प्रोग्राम्स", lang)}>
          {ACTIVE_PROGRAMS.map(ap => {
            const prog = allPrograms.find(p => p.id === ap.id)!;
            return <Row key={ap.id} icon="–" label={lang === "en" ? prog.title_en : prog.title_mr} value={t(`Wk ${ap.week}/${ap.total_weeks}`, `आठ ${ap.week}/${ap.total_weeks}`, lang)}/>;
          })}
        </Section>

        <Section title={t("Payments", "पेमेंट्स", lang)}>
          <Row icon="–" label={t("Payment history", "पेमेंट इतिहास", lang)}/>
          <Row icon="–" label={t("Download receipts", "पावत्या डाउनलोड करा", lang)}/>
        </Section>

        <Section title={t("Notifications", "सूचना", lang)}>
          <Row icon="–" label={t("Session reminders", "सेशन स्मरणपत्रे", lang)} toggle toggled={notifs.sessions} onClick={() => setNotifs(n => ({...n, sessions: !n.sessions}))}/>
          <Row icon="–" label={t("Progress updates", "प्रगती अपडेट्स", lang)} toggle toggled={notifs.progress} onClick={() => setNotifs(n => ({...n, progress: !n.progress}))}/>
          <Row icon="–" label={t("Special offers", "विशेष ऑफर", lang)} toggle toggled={notifs.offers} onClick={() => setNotifs(n => ({...n, offers: !n.offers}))}/>
        </Section>

        <Section title={t("Support", "समर्थन", lang)}>
          <Row icon="–" label={t("Chat with us", "आमच्याशी चॅट करा", lang)}/>
          <Row icon="–" label={t("Call support", "फोन समर्थन", lang)}/>
          <Row icon="–" label={t("Terms of service", "सेवा अटी", lang)}/>
          <Row icon="–" label={t("Privacy policy", "गोपनीयता धोरण", lang)}/>
          <Row icon="–" label="VitalAfter40" value="v1.0.0" chevron={false}/>
        </Section>

        <button onClick={onBack}
          className={`btn w-full justify-center text-[var(--error)] border mt-1 mb-4 ${lang === "mr" ? "mr" : ""}`}
          style={{ borderColor: "color-mix(in srgb, var(--error) 20%, transparent)", background: "color-mix(in srgb, var(--error) 4%, transparent)" }}>
          {t("Sign out", "साइन आउट करा", lang)}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BOTTOM NAV
// ═══════════════════════════════════════════════════════════════════════════
const NAV_TABS = [
  { id: "home" as Tab, label_en: "Home", label_mr: "होम" },
  { id: "programs" as Tab, label_en: "Programs", label_mr: "प्रोग्राम्स" },
  { id: "sessions" as Tab, label_en: "Sessions", label_mr: "सेशन्स" },
  { id: "progress" as Tab, label_en: "Progress", label_mr: "प्रगती" },
  { id: "profile" as Tab, label_en: "Profile", label_mr: "प्रोफाइल" },
];

function NavIcon({ id, active }: { id: Tab; active: boolean }) {
  const c = active ? "var(--sage)" : "var(--text-muted)";
  const f = active ? "var(--sage-pale)" : "none";
  if (id === "home") return <svg width="22" height="22" viewBox="0 0 22 22" fill={f} stroke={c} strokeWidth="1.5"><path d="M3 9.5L11 3l8 6.5V19a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 20v-9h6v9" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (id === "programs") return <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke={c} strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1.5" fill={f}/><rect x="12" y="3" width="7" height="7" rx="1.5" fill={f}/><rect x="3" y="12" width="7" height="7" rx="1.5" fill={f}/><rect x="12" y="12" width="7" height="7" rx="1.5" fill={f}/></svg>;
  if (id === "sessions") return <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke={c} strokeWidth="1.5"><rect x="3" y="4" width="16" height="15" rx="2" fill={f}/><path d="M3 9h16M8 2v4M14 2v4"/>{active && <circle cx="11" cy="14" r="2" fill={c} stroke="none"/>}</svg>;
  if (id === "progress") return <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke={c} strokeWidth="1.5"><path d="M3 17l4.5-5 4 3.5 4.5-6L20 13" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 17h18" strokeLinecap="round"/></svg>;
  return <svg width="22" height="22" viewBox="0 0 22 22" fill={f} stroke={c} strokeWidth="1.5"><circle cx="11" cy="7.5" r="3.5"/><path d="M3.5 19c0-4.142 3.358-7.5 7.5-7.5s7.5 3.358 7.5 7.5" strokeLinecap="round"/></svg>;
}

function BottomNav({ tab, setTab, lang }: { tab: Tab; setTab: (t: Tab) => void; lang: Lang }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t"
      style={{ background: "var(--bg-elevated)", borderColor: "var(--border-subtle)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <div className="flex">
        {NAV_TABS.map(tb => {
          const active = tab === tb.id;
          return (
            <button key={tb.id} onClick={() => setTab(tb.id)}
              className="flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-all"
              style={{ WebkitTapHighlightColor: "transparent", outline: "none" }}>
              {/* Icon with spring scale */}
              <div style={{ transform: active ? "scale(1.12)" : "scale(1)", transition: "transform 0.2s var(--ease-spring)" }}>
                <NavIcon id={tb.id} active={active}/>
              </div>
              <span className={`transition-all ${active ? "text-[var(--sage)] font-semibold" : "text-[var(--text-muted)]"} ${lang === "mr" ? "mr" : ""}`}
                style={{ fontSize: "0.6rem", letterSpacing: "0.02em" }}>
                {lang === "en" ? tb.label_en : tb.label_mr}
              </span>
              {/* Dot indicator */}
              <div style={{
                width: active ? 16 : 4, height: 2, borderRadius: 2,
                background: active ? "var(--sage)" : "transparent",
                transition: "width 0.25s var(--ease-spring), background 0.2s ease",
              }}/>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PWA SHELL
// ═══════════════════════════════════════════════════════════════════════════
export default function PWADashboard({ lang, setLang, onBack }: Props) {
  const [tab, setTab] = useState<Tab>("home");
  const [animating, setAnimating] = useState(false);
  const [transDir, setTransDir] = useState<TransDir>("left");
  const [displayTab, setDisplayTab] = useState<Tab>("home");

  const changeTab = useCallback((newTab: Tab) => {
    if (newTab === tab || animating) return;
    const oldIdx = TAB_ORDER.indexOf(tab);
    const newIdx = TAB_ORDER.indexOf(newTab);
    setTransDir(newIdx > oldIdx ? "left" : "right");
    setAnimating(true);
    setTab(newTab);
    setTimeout(() => {
      setDisplayTab(newTab);
      setAnimating(false);
    }, 160);
  }, [tab, animating]);

  const exitStyle: React.CSSProperties = animating ? {
    opacity: 0,
    transform: transDir === "left" ? "translateX(-12px)" : "translateX(12px)",
  } : {};
  const enterStyle: React.CSSProperties = !animating ? {
    opacity: 1, transform: "translateX(0)",
  } : { opacity: 0, transform: transDir === "left" ? "translateX(12px)" : "translateX(-12px)" };

  return (
    <div className="pwa-shell" style={{ background: "var(--bg-primary)", fontFamily: "var(--font-body)", position: "relative", overflow: "hidden" }}>
      <div className="h-full overflow-y-auto overscroll-contain"
        style={{ transition: "opacity 0.16s ease, transform 0.16s var(--ease-out-expo)", ...(animating ? exitStyle : enterStyle) }}>
        {displayTab === "home" && <HomeTab lang={lang}/>}
        {displayTab === "programs" && <ProgramsTab lang={lang}/>}
        {displayTab === "sessions" && <SessionsTab lang={lang}/>}
        {displayTab === "progress" && <ProgressTab lang={lang}/>}
        {displayTab === "profile" && <ProfileTab lang={lang} setLang={setLang} onBack={onBack}/>}
      </div>
      <BottomNav tab={tab} setTab={changeTab} lang={lang}/>
    </div>
  );
}

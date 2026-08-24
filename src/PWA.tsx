import { useState } from "react";
import { Lang, t } from "./data";

interface Props { lang: Lang; setLang: (l: Lang) => void; onBack: () => void; }

type Tab = "home" | "programs" | "sessions" | "progress" | "profile";

const upcomingSessions = [
  { id: 1, title_en: "Group Pilates", title_mr: "ग्रुप पिलाटेस", coach_en: "Priya Nair", coach_mr: "प्रिया नायर", date: "Mon, 26 Aug", time: "7:00 AM", type: "zoom", countdown: "2 days", img: "https://images.unsplash.com/photo-1679688301686-b164852aed9b?w=100&h=100&fit=crop" },
  { id: 2, title_en: "Nutrition Check-in", title_mr: "पोषण तपासणी", coach_en: "Sneha Deshpande", coach_mr: "स्नेहा देशपांडे", date: "Wed, 28 Aug", time: "6:00 PM", type: "zoom", countdown: "4 days", img: "https://images.unsplash.com/photo-1621886178958-be42369fc9e7?w=100&h=100&fit=crop" },
  { id: 3, title_en: "Individual Pilates", title_mr: "वैयक्तिक पिलाटेस", coach_en: "Priya Nair", coach_mr: "प्रिया नायर", date: "Fri, 30 Aug", time: "8:00 AM", type: "zoom", countdown: "6 days", img: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=100&h=100&fit=crop" },
];

const habits = [
  { l_en: "Morning movement", l_mr: "सकाळची हालचाल", done: true },
  { l_en: "Drink 8 glasses of water", l_mr: "८ ग्लास पाणी", done: true },
  { l_en: "Evening walk 20 min", l_mr: "संध्याकाळची चाल", done: false },
  { l_en: "Sleep by 10:30 PM", l_mr: "रात्री १०:३० पर्यंत झोपा", done: false },
];

const progressMetrics = [
  { label_en: "Mobility", label_mr: "गतिशीलता", value: 72, color: "var(--sage)" },
  { label_en: "Strength", label_mr: "ताकद", value: 55, color: "#3a6fa8" },
  { label_en: "Consistency", label_mr: "सातत्य", value: 87, color: "var(--gold)" },
  { label_en: "Nutrition", label_mr: "पोषण", value: 64, color: "#6a4fa8" },
];

const sessionHistory = [
  { title_en: "Group Pilates", title_mr: "ग्रुप पिलाटेस", coach: "Priya Nair", date: "Tomorrow", time: "7:00 AM", status: "upcoming" as const },
  { title_en: "Group Pilates", title_mr: "ग्रुप पिलाटेस", coach: "Priya Nair", date: "Wed, 28 Aug", time: "7:00 AM", status: "upcoming" as const },
  { title_en: "Group Pilates", title_mr: "ग्रुप पिलाटेस", coach: "Priya Nair", date: "Mon, 26 Aug", time: "7:00 AM", status: "attended" as const },
  { title_en: "Nutrition Check-in", title_mr: "पोषण तपासणी", coach: "Sneha Deshpande", date: "Wed, 21 Aug", time: "6:00 PM", status: "attended" as const },
  { title_en: "Group Pilates", title_mr: "ग्रुप पिलाटेस", coach: "Priya Nair", date: "Mon, 19 Aug", time: "7:00 AM", status: "missed" as const },
];

// ─── Circular progress ring ────────────────────────────────────────────
function Ring({ value, size = 64, stroke = 5, color = "var(--sage)", label }: { value: number; size?: number; stroke?: number; color?: string; label?: string }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="ring-progress absolute inset-0">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ink-10)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s var(--ease-out-expo)" }} />
      </svg>
      {label && <span className="text-xs font-semibold text-[var(--ink-80)] relative z-10">{label}</span>}
    </div>
  );
}

export default function PWADashboard({ lang, setLang, onBack }: Props) {
  const [tab, setTab] = useState<Tab>("home");
  const [habitsDone, setHabitsDone] = useState([true, true, false, false]);
  const [showZoom, setShowZoom] = useState(false);

  const tabs: { id: Tab; label_en: string; label_mr: string; icon: React.ReactNode }[] = [
    { id: "home", label_en: "Home", label_mr: "मुख्य",
      icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l7-7 7 7v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9z" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 19V12h6v7"/></svg> },
    { id: "programs", label_en: "Programs", label_mr: "प्रोग्राम्स",
      icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="11" y="3" width="6" height="6" rx="1"/><rect x="3" y="11" width="6" height="6" rx="1"/><rect x="11" y="11" width="6" height="6" rx="1"/></svg> },
    { id: "sessions", label_en: "Sessions", label_mr: "सेशन्स",
      icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="14" height="13" rx="2"/><path d="M3 8h14M7 2v4M13 2v4"/></svg> },
    { id: "progress", label_en: "Progress", label_mr: "प्रगती",
      icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 14l4-4 3 3 4-5 3 3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { id: "profile", label_en: "Profile", label_mr: "प्रोफाइल",
      icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="7" r="3"/><path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6"/></svg> },
  ];

  return (
    <div className="pwa-shell" style={{ fontFamily: "var(--font-body)" }}>
      {/* Zoom modal */}
      {showZoom && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end" onClick={() => setShowZoom(false)}>
          <div className="bg-white w-full rounded-t-3xl p-6 anim-slide-up" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-[var(--ink-10)] rounded-full mx-auto mb-6" />
            <h3 className="font-display text-xl text-[var(--ink-80)] mb-2" style={{ fontFamily: "var(--font-display)" }}>
              {t("Group Pilates with Priya", "प्रियासह ग्रुप पिलाटेस", lang)}
            </h3>
            <p className="t-small text-[var(--ink-40)] mb-6">Tomorrow · 7:00 AM · 45 min</p>
            <button className="btn btn-primary w-full justify-center mb-3">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="1.5"><rect x="2" y="5" width="10" height="8" rx="1.5"/><path d="M12 8l4-2v6l-4-2V8z"/></svg>
              <span>{t("Join Zoom →", "झूम जॉइन करा →", lang)}</span>
            </button>
            <button className="btn btn-outline w-full justify-center" onClick={() => setShowZoom(false)}>
              {t("Reschedule", "पुनर्निर्धारित करा", lang)}
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="pb-20 overflow-y-auto min-h-dvh">
        {tab === "home" && (
          <div className="page-enter">
            {/* Header */}
            <div className="bg-[var(--ink)] px-5 pt-12 pb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className={`t-xs text-white/40 mb-0.5 ${lang === "mr" ? "mr" : ""}`}>{t("Good morning,", "शुभ सकाळ,", lang)}</p>
                  <h2 className="font-display text-2xl text-white" style={{ fontFamily: "var(--font-display)" }}>
                    {t("Meera 👋", "मीरा 👋", lang)}
                  </h2>
                </div>
                <button className="relative">
                  <div className="w-10 h-10 rounded-full bg-[var(--sage)]/30 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="1.5"><path d="M9 3a4 4 0 014 4v3l1.5 2H3.5L5 10V7a4 4 0 014-4zM7 13a2 2 0 004 0"/></svg>
                  </div>
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[var(--warning)] rounded-full border-2 border-[var(--ink)]" />
                </button>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { val: "12", label_en: "Sessions", label_mr: "सेशन्स" },
                  { val: "87%", label_en: "Attendance", label_mr: "उपस्थिती" },
                  { val: "4", label_en: "Wk streak", label_mr: "स्ट्रीक" },
                  { val: "3", label_en: "Active", label_mr: "सक्रिय" },
                ].map(s => (
                  <div key={s.val} className="bg-white/8 rounded-xl p-3 text-center">
                    <p className="font-display text-lg text-white font-light" style={{ fontFamily: "var(--font-display)" }}>{s.val}</p>
                    <p className={`t-xs text-white/35 mt-0.5 ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? s.label_en : s.label_mr}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-4 pt-5 space-y-4">
              {/* Next session card */}
              <div>
                <p className={`t-label text-[var(--ink-40)] mb-3 ${lang === "mr" ? "mr" : ""}`}>{t("Next session", "पुढील सेशन", lang)}</p>
                <div className="bg-[var(--ink-80)] rounded-2xl p-5 text-white">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[var(--sage)]/20 shrink-0">
                      <img src={upcomingSessions[0].img} alt="" className="w-full h-full object-cover opacity-80" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${lang === "mr" ? "mr" : ""}`}>{t(upcomingSessions[0].title_en, upcomingSessions[0].title_mr, lang)}</p>
                      <p className={`t-xs text-white/50 mt-0.5 ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? upcomingSessions[0].coach_en : upcomingSessions[0].coach_mr}</p>
                    </div>
                    <span className="badge badge-sage text-xs">{upcomingSessions[0].countdown}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/40 t-xs mb-4">
                    <span className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="2" width="10" height="9" rx="1"/><path d="M1 5h10M4 1v3M8 1v3"/></svg>
                      {upcomingSessions[0].date}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="6" cy="6" r="4"/><path d="M6 4v2.5l1.5 1.5"/></svg>
                      {upcomingSessions[0].time}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowZoom(true)} className="flex-1 btn btn-sm btn-primary justify-center">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.5"><rect x="1.5" y="4" width="7" height="6" rx="1"/><path d="M8.5 6.5l3.5-2v5l-3.5-2z"/></svg>
                      {t("Join Zoom", "झूम जॉइन करा", lang)}
                    </button>
                    <button className="btn btn-sm border border-white/20 text-white/70 hover:bg-white/10 rounded-full px-3">
                      {t("Notes", "नोट्स", lang)}
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick progress */}
              <div>
                <p className={`t-label text-[var(--ink-40)] mb-3 ${lang === "mr" ? "mr" : ""}`}>{t("Your progress", "तुमची प्रगती", lang)}</p>
                <div className="grid grid-cols-4 gap-3">
                  {progressMetrics.map(m => (
                    <div key={m.label_en} className="bg-white border border-[var(--ink-10)] rounded-2xl p-3 flex flex-col items-center gap-2">
                      <Ring value={m.value} size={52} stroke={4} color={m.color} label={`${m.value}%`} />
                      <p className={`t-xs text-[var(--ink-40)] text-center leading-tight ${lang === "mr" ? "mr" : ""}`}>
                        {lang === "en" ? m.label_en : m.label_mr}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Habits */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className={`t-label text-[var(--ink-40)] ${lang === "mr" ? "mr" : ""}`}>{t("Today's habits", "आजच्या सवयी", lang)}</p>
                  <span className="t-xs text-[var(--sage)] font-mono">{habitsDone.filter(Boolean).length}/{habitsDone.length}</span>
                </div>
                <div className="bg-white border border-[var(--ink-10)] rounded-2xl overflow-hidden">
                  {habits.map((h, i) => (
                    <button key={h.l_en} onClick={() => setHabitsDone(prev => prev.map((v, j) => j === i ? !v : v))}
                      className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-[var(--ink-10)] last:border-0 hover:bg-[var(--paper)] transition-colors">
                      <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${habitsDone[i] ? "bg-[var(--sage)] border-[var(--sage)]" : "border-[var(--ink-20)]"}`}>
                        {habitsDone[i] && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2">
                            <path d="M2.5 6l2.5 2.5 4.5-4.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </span>
                      <span className={`t-small flex-1 text-left ${habitsDone[i] ? "text-[var(--ink-20)] line-through" : "text-[var(--ink-60)]"} ${lang === "mr" ? "mr" : ""}`}>
                        {lang === "en" ? h.l_en : h.l_mr}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div>
                <p className={`t-label text-[var(--ink-40)] mb-3 ${lang === "mr" ? "mr" : ""}`}>{t("Messages", "संदेश", lang)}</p>
                <div className="bg-white border border-[var(--ink-10)] rounded-2xl overflow-hidden">
                  {[
                    { from_en: "Priya Nair", from_mr: "प्रिया नायर", msg_en: "Great session yesterday! Focus on breathing today.", msg_mr: "काल उत्कृष्ट सेशन! आज श्वासावर लक्ष केंद्रित करा.", time: "2h ago", unread: true, img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=50&h=50&fit=crop" },
                    { from_en: "VitalAfter40", from_mr: "VitalAfter40", msg_en: "Your next batch starts Monday. Zoom link ready.", msg_mr: "तुमचा पुढचा बॅच सोमवारी सुरू होतो.", time: "1d ago", unread: false, img: "" },
                  ].map((m, i) => (
                    <div key={i} className="flex items-start gap-3 px-4 py-3.5 border-b border-[var(--ink-10)] last:border-0">
                      <div className="w-9 h-9 rounded-full bg-[var(--sage)]/20 shrink-0 overflow-hidden">
                        {m.img ? <img src={m.img} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-[var(--sage)]">V</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline gap-2">
                          <p className={`t-small font-medium text-[var(--ink-80)] ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? m.from_en : m.from_mr}</p>
                          <span className="t-xs text-[var(--ink-20)] shrink-0">{m.time}</span>
                        </div>
                        <p className={`t-xs text-[var(--ink-40)] mt-0.5 truncate ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? m.msg_en : m.msg_mr}</p>
                      </div>
                      {m.unread && <span className="w-2 h-2 rounded-full bg-[var(--sage)] shrink-0 mt-1.5" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "sessions" && (
          <div className="page-enter px-4 pt-8">
            <h2 className={`t-h2 text-[var(--ink-80)] mb-6 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
              {t("Sessions", "सेशन्स", lang)}
            </h2>

            <p className={`t-label text-[var(--ink-40)] mb-3 ${lang === "mr" ? "mr" : ""}`}>{t("Upcoming", "आगामी", lang)}</p>
            <div className="space-y-3 mb-6">
              {sessionHistory.filter(s => s.status === "upcoming").map((s, i) => (
                <div key={i} className="bg-white border border-[var(--ink-10)] rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--sage-ghost)] flex items-center justify-center shrink-0">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--sage)" strokeWidth="1.5"><rect x="1.5" y="4" width="7" height="6" rx="1"/><path d="M8.5 6.5l3.5-2v5l-3.5-2z"/></svg>
                    </div>
                    <div className="flex-1">
                      <p className={`t-small font-semibold text-[var(--ink-80)] ${lang === "mr" ? "mr" : ""}`}>{t(s.title_en, s.title_mr, lang)}</p>
                      <p className="t-xs text-[var(--ink-40)]">{s.coach} · {s.date} · {s.time}</p>
                    </div>
                    <button onClick={() => setShowZoom(true)} className="btn btn-sm btn-primary">
                      {t("Join", "जॉइन", lang)}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className={`t-label text-[var(--ink-40)] mb-3 ${lang === "mr" ? "mr" : ""}`}>{t("Past", "मागील", lang)}</p>
            <div className="space-y-3">
              {sessionHistory.filter(s => s.status !== "upcoming").map((s, i) => (
                <div key={i} className="bg-white border border-[var(--ink-10)] rounded-2xl p-4 flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${s.status === "attended" ? "bg-[var(--sage)]" : "bg-[var(--error)]"}`} />
                  <div className="flex-1">
                    <p className={`t-small font-medium text-[var(--ink-80)] ${lang === "mr" ? "mr" : ""}`}>{t(s.title_en, s.title_mr, lang)}</p>
                    <p className="t-xs text-[var(--ink-40)]">{s.coach} · {s.date}</p>
                  </div>
                  <span className={`badge ${s.status === "attended" ? "badge-sage" : "badge-error"} ${lang === "mr" ? "mr" : ""}`}>
                    {s.status === "attended" ? t("Attended", "उपस्थित", lang) : t("Missed", "मिस", lang)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "progress" && (
          <div className="page-enter px-4 pt-8">
            <h2 className={`t-h2 text-[var(--ink-80)] mb-6 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
              {t("Your Progress", "तुमची प्रगती", lang)}
            </h2>

            {/* Big rings */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {progressMetrics.map(m => (
                <div key={m.label_en} className="bg-white border border-[var(--ink-10)] rounded-2xl p-5 flex flex-col items-center gap-3">
                  <Ring value={m.value} size={80} stroke={6} color={m.color} label={`${m.value}%`} />
                  <p className={`t-small font-medium text-[var(--ink-80)] ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? m.label_en : m.label_mr}</p>
                  <div className="w-full progress-track h-1">
                    <div className="h-full rounded-full transition-all" style={{ width: `${m.value}%`, background: m.color }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Milestones */}
            <p className={`t-label text-[var(--ink-40)] mb-3 ${lang === "mr" ? "mr" : ""}`}>{t("Milestones", "माइलस्टोन", lang)}</p>
            <div className="bg-white border border-[var(--ink-10)] rounded-2xl overflow-hidden">
              {[
                { label_en: "First session completed", label_mr: "पहिले सेशन पूर्ण", done: true },
                { label_en: "1-week streak", label_mr: "१ आठवडा स्ट्रीक", done: true },
                { label_en: "10 sessions", label_mr: "१० सेशन्स", done: true },
                { label_en: "1-month consistent", label_mr: "१ महिना सातत्यपूर्ण", done: false },
                { label_en: "25 sessions", label_mr: "२५ सेशन्स", done: false },
              ].map((ms, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--ink-10)] last:border-0">
                  <span className={`text-lg ${ms.done ? "" : "grayscale opacity-40"}`}>{ms.done ? "🏅" : "○"}</span>
                  <span className={`t-small flex-1 ${ms.done ? "text-[var(--ink-80)]" : "text-[var(--ink-40)]"} ${lang === "mr" ? "mr" : ""}`}>
                    {lang === "en" ? ms.label_en : ms.label_mr}
                  </span>
                  {ms.done && <span className="badge badge-sage">{t("Done", "पूर्ण", lang)}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "programs" && (
          <div className="page-enter px-4 pt-8">
            <h2 className={`t-h2 text-[var(--ink-80)] mb-6 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
              {t("My Programs", "माझे प्रोग्राम्स", lang)}
            </h2>
            {[
              { title_en: "Group Pilates", title_mr: "ग्रुप पिलाटेस", pct: 60, dur_en: "8 weeks · 3x/week", dur_mr: "८ आठवडे · ३ वेळा", img: "https://images.unsplash.com/photo-1679688301686-b164852aed9b?w=200&h=120&fit=crop" },
              { title_en: "Nutrition Program", title_mr: "पोषण प्रोग्राम", pct: 40, dur_en: "8 weeks · Weekly", dur_mr: "८ आठवडे · साप्ताहिक", img: "https://images.unsplash.com/photo-1621886178958-be42369fc9e7?w=200&h=120&fit=crop" },
            ].map(p => (
              <div key={p.title_en} className="bg-white border border-[var(--ink-10)] rounded-2xl overflow-hidden mb-4">
                <img src={p.img} alt={p.title_en} className="w-full h-36 object-cover" />
                <div className="p-4">
                  <h3 className={`font-semibold text-[var(--ink-80)] mb-1 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                    {lang === "en" ? p.title_en : p.title_mr}
                  </h3>
                  <p className={`t-xs text-[var(--ink-40)] mb-3 ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? p.dur_en : p.dur_mr}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 progress-track"><div className="progress-fill" style={{ width: `${p.pct}%` }} /></div>
                    <span className="t-xs text-[var(--ink-40)] font-mono shrink-0">{p.pct}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "profile" && (
          <div className="page-enter px-4 pt-8">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 rounded-full bg-[var(--sage)] text-white text-2xl font-semibold flex items-center justify-center mb-3">MJ</div>
              <h2 className={`font-display text-xl text-[var(--ink-80)] ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                {t("Meera Joshi", "मीरा जोशी", lang)}
              </h2>
              <p className="t-xs text-[var(--ink-40)]">meera@example.com · {t("Age 52", "वय ५२", lang)}</p>
            </div>

            <div className="bg-white border border-[var(--ink-10)] rounded-2xl overflow-hidden mb-4">
              {[
                { icon: "📋", en: "My Programs", mr: "माझे प्रोग्राम्स" },
                { icon: "📊", en: "Health Assessment", mr: "आरोग्य मूल्यांकन" },
                { icon: "📅", en: "Booking History", mr: "बुकिंग इतिहास" },
                { icon: "💳", en: "Payments", mr: "पेमेंट" },
                { icon: "🔔", en: "Notifications", mr: "सूचना" },
                { icon: "🌐", en: "Language", mr: "भाषा" },
              ].map(item => (
                <button key={item.en} className={`w-full flex items-center gap-4 px-4 py-4 border-b border-[var(--ink-10)] last:border-0 hover:bg-[var(--paper)] transition-colors text-left ${lang === "mr" ? "mr" : ""}`}>
                  <span className="text-lg">{item.icon}</span>
                  <span className="flex-1 t-small text-[var(--ink-60)]">{lang === "en" ? item.en : item.mr}</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--ink-20)" strokeWidth="1.5"><path d="M5 10l4-3-4-3"/></svg>
                </button>
              ))}
            </div>

            <button onClick={onBack} className="btn btn-outline w-full justify-center text-[var(--ink-40)]">
              {t("Back to Website", "वेबसाइटवर परत जा", lang)}
            </button>

            <button className="btn w-full justify-center text-[var(--error)] mt-2">
              {t("Log out", "लॉग आउट", lang)}
            </button>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-[var(--ink-10)] flex z-30 safe-bottom">
        {tabs.map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)}
            className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${tab === tb.id ? "text-[var(--sage)]" : "text-[var(--ink-20)]"}`}>
            <span className="block">{tb.icon}</span>
            <span className={`t-xs ${tab === tb.id ? "font-medium" : ""} ${lang === "mr" ? "mr" : ""}`}>
              {lang === "en" ? tb.label_en : tb.label_mr}
            </span>
            {tab === tb.id && <span className="absolute bottom-0 w-6 h-0.5 bg-[var(--sage)] rounded-full" style={{ left: "50%", transform: "translateX(-50%)" }} />}
          </button>
        ))}
      </div>
    </div>
  );
}

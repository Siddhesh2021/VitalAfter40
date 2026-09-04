import { useState } from "react";
import { programs, professionals, t, type Lang } from "./data";

interface Props {
  lang: Lang;
  programId: string;
  onConfirm: (cart: string[]) => void;
  onBack: () => void;
}

// ─── Batch data ──────────────────────────────────────────────────────────
const BATCHES = [
  { id: "b1", days: "Mon / Wed / Fri", time: "7:00 AM", mode: "Live Zoom", lang: "English + Marathi", seats_filled: 8, seats_total: 12, level: "Beginner", trainer_id: "priya-pilates", badge: "Popular" },
  { id: "b2", days: "Tue / Thu / Sat", time: "8:30 AM", mode: "Live Zoom", lang: "Marathi", seats_filled: 6, seats_total: 10, level: "Beginner", trainer_id: "priya-pilates", badge: "" },
  { id: "b3", days: "Mon / Wed / Fri", time: "6:30 PM", mode: "Live Zoom", lang: "English", seats_filled: 10, seats_total: 12, level: "Intermediate", trainer_id: "priya-pilates", badge: "Almost full" },
  { id: "b4", days: "Sat / Sun", time: "9:00 AM", mode: "Live Zoom", lang: "English + Marathi", seats_filled: 4, seats_total: 8, level: "All levels", trainer_id: "priya-pilates", badge: "New" },
];

// ─── Time slots ───────────────────────────────────────────────────────────
const TIME_SLOTS = [
  "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM",
  "11:00 AM", "12:00 PM", "4:00 PM", "5:00 PM",
  "6:00 PM", "7:00 PM", "8:00 PM",
];
const UNAVAILABLE = ["10:00 AM", "12:00 PM", "4:00 PM"];

// ─── Consultation types ───────────────────────────────────────────────────
const CONSULT_TYPES = [
  { id: "first", en: "First consultation", mr: "पहिली सल्लामसलत", desc_en: "Comprehensive 60-min intake", desc_mr: "सर्वसमावेशक ६०-मिनिट" },
  { id: "followup", en: "Follow-up", mr: "पाठपुरावा", desc_en: "30-min progress check-in", desc_mr: "३०-मिनिट प्रगती तपासणी" },
  { id: "specific", en: "Specific concern", mr: "विशिष्ट समस्या", desc_en: "Focus on a particular issue", desc_mr: "एखाद्या विशिष्ट समस्येवर लक्ष" },
];

// ─── Recorded videos ──────────────────────────────────────────────────────
const VIDEO_CATS = ["All", "Mobility", "Back & Neck", "Strength", "Recovery", "Beginners", "Pilates"];

const VIDEOS = [
  { id: "v1", title: "Morning Mobility Flow", cat: "Mobility", dur: "18 min", level: "Beginner", thumb: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=180&fit=crop" },
  { id: "v2", title: "Lower Back Relief", cat: "Back & Neck", dur: "22 min", level: "All levels", thumb: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=300&h=180&fit=crop" },
  { id: "v3", title: "Core Foundation", cat: "Pilates", dur: "25 min", level: "Beginner", thumb: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=300&h=180&fit=crop" },
  { id: "v4", title: "Hip & Glute Strength", cat: "Strength", dur: "30 min", level: "Intermediate", thumb: "https://images.unsplash.com/photo-1692372372810-c848c9cca1c5?w=300&h=180&fit=crop" },
  { id: "v5", title: "Neck & Shoulder Care", cat: "Back & Neck", dur: "15 min", level: "All levels", thumb: "https://images.unsplash.com/photo-1621886178958-be42369fc9e7?w=300&h=180&fit=crop" },
  { id: "v6", title: "Evening Wind-Down", cat: "Recovery", dur: "20 min", level: "Beginner", thumb: "https://images.unsplash.com/photo-1574310094148-ca48ab86734c?w=300&h=180&fit=crop" },
  { id: "v7", title: "Reformer Simulation", cat: "Pilates", dur: "35 min", level: "Intermediate", thumb: "https://images.unsplash.com/photo-1679688301686-b164852aed9b?w=300&h=180&fit=crop" },
  { id: "v8", title: "Full Body Recovery", cat: "Recovery", dur: "18 min", level: "All levels", thumb: "https://images.unsplash.com/photo-1658314755561-389d5660ee54?w=300&h=180&fit=crop" },
  { id: "v9", title: "Beginner Pilates 101", cat: "Beginners", dur: "28 min", level: "Beginner", thumb: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=180&fit=crop" },
];

// ─── Calendar helper ──────────────────────────────────────────────────────
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ═══════════════════════════════════════════════════════════════════════════
// GROUP BOOKING
// ═══════════════════════════════════════════════════════════════════════════
function GroupBooking({ programId, lang, onConfirm, onBack }: { programId: string; lang: Lang; onConfirm: (ids: string[]) => void; onBack: () => void }) {
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const prog = programs.find(p => p.id === programId)!;

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0" style={{ background: "var(--bg-muted)" }}>
          <img src={prog.image} alt={prog.title_en} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className={`t-h4 text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
            {lang === "en" ? prog.title_en : prog.title_mr}
          </p>
          <p className={`t-xs text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`}>
            {t("8-week program · 3 sessions/week · Live Zoom", "८-आठवडे · ३ सेशन्स/आठवडा · लाइव्ह झूम", lang)}
          </p>
        </div>
      </div>

      <h3 className={`t-h4 text-[var(--text-primary)] mb-4 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
        {t("Choose a batch", "बॅच निवडा", lang)}
      </h3>

      <div className="space-y-3 mb-8">
        {BATCHES.map(b => {
          const trainer = professionals.find(p => p.id === b.trainer_id)!;
          const pct = (b.seats_filled / b.seats_total) * 100;
          const isSel = selectedBatch === b.id;
          const isFull = b.seats_filled >= b.seats_total;

          return (
            <div key={b.id}
              onClick={() => !isFull && setSelectedBatch(b.id)}
              className={`rounded-2xl border p-5 transition-all duration-200 ${!isFull ? "cursor-pointer" : "opacity-45 cursor-not-allowed"} ${isSel ? "border-[var(--sage)] bg-[var(--sage-ghost)] ring-1 ring-[var(--sage)]" : "border-[var(--border-subtle)] hover:border-[var(--border-default)]"}`}>

              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 transition-all ${isSel ? "border-[var(--sage)] bg-[var(--sage)]" : "border-[var(--border-default)]"}`}>
                  {isSel && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="font-semibold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}>
                      {b.days}
                    </span>
                    <span className="font-bold text-[var(--sage)]" style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}>
                      {b.time}
                    </span>
                    {b.badge && !isFull && (
                      <span className={`badge ${b.badge === "Almost full" ? "badge-warn" : b.badge === "New" ? "badge-sage" : "badge-dark"}`}>{b.badge}</span>
                    )}
                    {isFull && <span className="badge badge-stone">Full</span>}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {[b.mode, b.lang, b.level].map(val => (
                      <span key={val} className="px-2.5 py-1 rounded-lg t-xs text-[var(--text-muted)]"
                        style={{ background: "var(--bg-muted)" }}>
                        {val}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--border-subtle)" }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct > 75 ? "var(--warning)" : "var(--sage)", transition: "width 0.4s ease" }} />
                    </div>
                    <span className="t-xs text-[var(--text-muted)] shrink-0" style={{ fontFamily: "var(--font-mono)" }}>
                      {b.seats_filled}/{b.seats_total} {t("seats", "जागा", lang)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-[var(--border-subtle)]">
                      <img src={trainer.image} alt={trainer.name_en} className="w-full h-full object-cover" />
                    </div>
                    <span className="t-xs text-[var(--text-muted)]">{trainer.name_en} · {trainer.qual_en.split("·")[0].trim()}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedBatch && (
        <div className="p-5 rounded-2xl border mb-6" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-elevated)" }}>
          <div className="flex justify-between items-center">
            <p className={`t-small text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`}>{t("Total", "एकूण", lang)}</p>
            <p className="t-h4 text-[var(--text-primary)]" style={{ fontFamily: "var(--font-mono)" }}>₹{prog.price.toLocaleString()}</p>
          </div>
          <p className="t-xs text-[var(--text-muted)] mt-1">{t("8 weeks · Includes all sessions", "८ आठवडे · सर्व सेशन्स समाविष्ट", lang)}</p>
        </div>
      )}

      <button onClick={() => onConfirm([programId])} disabled={!selectedBatch}
        className={`btn btn-primary btn-xl w-full justify-center ${lang === "mr" ? "mr" : ""}`}>
        {t("Confirm Batch →", "बॅच पुष्टी करा →", lang)}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// INDIVIDUAL BOOKING
// ═══════════════════════════════════════════════════════════════════════════
function IndividualBooking({ programId, lang, onConfirm, onBack }: { programId: string; lang: Lang; onConfirm: (ids: string[]) => void; onBack: () => void }) {
  const now = new Date();
  const [step, setStep] = useState<"expert" | "datetime" | "type" | "review">("expert");
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null);
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const prog = programs.find(p => p.id === programId)!;

  const relevantExperts = professionals.filter(p => {
    if (programId === "pilates-individual") return p.id === "priya-pilates";
    if (programId === "physio") return p.id === "amit-physio";
    if (programId === "nutrition") return p.id === "sneha-nutrition";
    return true;
  });

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const todayDate = now.getDate();

  const expert = professionals.find(p => p.id === selectedExpert);

  const stepConfig = [
    { id: "expert", en: "Expert", mr: "तज्ञ" },
    { id: "datetime", en: "Date & Time", mr: "तारीख आणि वेळ" },
    { id: "type", en: "Session type", mr: "सेशन प्रकार" },
    { id: "review", en: "Review", mr: "पुनरावलोकन" },
  ];
  const stepIdx = stepConfig.findIndex(s => s.id === step);

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {stepConfig.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center t-xs font-semibold transition-all ${i < stepIdx ? "bg-[var(--sage)] text-white" : i === stepIdx ? "bg-[var(--sage)] text-white" : "bg-[var(--bg-muted)] text-[var(--text-muted)]"}`}
              style={{ fontFamily: "var(--font-mono)" }}>
              {i < stepIdx ? (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2">
                  <path d="M2 5l2.5 2.5 3.5-4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : i + 1}
            </div>
            <span className={`t-xs hidden sm:block ${i === stepIdx ? "text-[var(--text-primary)] font-medium" : "text-[var(--text-muted)]"} ${lang === "mr" ? "mr" : ""}`}>
              {lang === "en" ? s.en : s.mr}
            </span>
            {i < stepConfig.length - 1 && (
              <div className="w-6 h-px mx-1" style={{ background: i < stepIdx ? "var(--sage)" : "var(--border-subtle)" }} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Choose expert */}
      {step === "expert" && (
        <div>
          <h3 className={`t-h4 text-[var(--text-primary)] mb-5 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
            {t("Choose your expert", "तुमचा तज्ञ निवडा", lang)}
          </h3>
          <div className="space-y-3">
            {relevantExperts.map(exp => (
              <div key={exp.id} onClick={() => setSelectedExpert(exp.id)}
                className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${selectedExpert === exp.id ? "border-[var(--sage)] bg-[var(--sage-ghost)] ring-1 ring-[var(--sage)]" : "border-[var(--border-subtle)] hover:border-[var(--border-default)]"}`}>
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                  <img src={exp.image} alt={exp.name_en} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`t-small font-semibold text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                      {lang === "en" ? exp.name_en : exp.name_mr}
                    </p>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${selectedExpert === exp.id ? "border-[var(--sage)] bg-[var(--sage)]" : "border-[var(--border-default)]"}`}>
                      {selectedExpert === exp.id && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                  <p className={`t-xs text-[var(--sage)] mb-1 ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? exp.role_en : exp.role_mr}</p>
                  <p className="t-xs text-[var(--text-muted)]">{exp.qual_en}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {exp.spec_en.slice(0, 3).map(s => (
                      <span key={s} className="px-2 py-0.5 rounded t-xs text-[var(--text-muted)]"
                        style={{ background: "var(--bg-muted)", fontSize: "0.65rem" }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setStep("datetime")} disabled={!selectedExpert}
            className={`btn btn-primary btn-lg w-full justify-center mt-6 ${lang === "mr" ? "mr" : ""}`}>
            {t("Continue →", "पुढे →", lang)}
          </button>
        </div>
      )}

      {/* Step 2: Calendar + time */}
      {step === "datetime" && (
        <div>
          <h3 className={`t-h4 text-[var(--text-primary)] mb-5 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
            {t("Choose date & time", "तारीख आणि वेळ निवडा", lang)}
          </h3>

          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); }}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[var(--bg-muted)] transition-colors">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><path d="M9 2L4 7l5 5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <p className="t-small font-semibold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-mono)" }}>
              {MONTH_NAMES[month]} {year}
            </p>
            <button onClick={() => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); }}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[var(--bg-muted)] transition-colors">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><path d="M5 2l5 5-5 5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-1 mb-6">
            {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
              <div key={d} className="h-8 flex items-center justify-center t-xs text-[var(--text-muted)]"
                style={{ fontFamily: "var(--font-mono)" }}>{d}</div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isPast = year === now.getFullYear() && month === now.getMonth() && day < todayDate;
              const isSel = selectedDay === day;
              return (
                <button key={day} onClick={() => !isPast && setSelectedDay(day)} disabled={isPast}
                  className={`h-9 rounded-xl t-xs font-medium transition-all ${isSel ? "bg-[var(--sage)] text-white" : isPast ? "text-[var(--text-muted)] opacity-30 cursor-not-allowed" : "hover:bg-[var(--bg-muted)] text-[var(--text-primary)]"}`}
                  style={{ fontFamily: "var(--font-mono)" }}>
                  {day}
                </button>
              );
            })}
          </div>

          {/* Time slots */}
          {selectedDay && (
            <div>
              <p className={`t-label text-[var(--text-muted)] mb-3 ${lang === "mr" ? "mr" : ""}`}>{t("Available times", "उपलब्ध वेळा", lang)}</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-6">
                {TIME_SLOTS.map(slot => {
                  const unavail = UNAVAILABLE.includes(slot);
                  const isSel = selectedTime === slot;
                  return (
                    <button key={slot} onClick={() => !unavail && setSelectedTime(slot)} disabled={unavail}
                      className={`py-2.5 rounded-xl t-xs font-medium transition-all border ${isSel ? "bg-[var(--sage)] border-[var(--sage)] text-white" : unavail ? "opacity-30 cursor-not-allowed border-[var(--border-subtle)] text-[var(--text-muted)]" : "border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--sage)] hover:text-[var(--sage)]"}`}
                      style={{ fontFamily: "var(--font-mono)" }}>
                      {slot}
                      {unavail && <span className="block text-[0.55rem] mt-0.5 opacity-70">{t("Booked", "बुक", lang)}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button onClick={() => setStep("type")} disabled={!selectedDay || !selectedTime}
            className={`btn btn-primary btn-lg w-full justify-center ${lang === "mr" ? "mr" : ""}`}>
            {t("Continue →", "पुढे →", lang)}
          </button>
        </div>
      )}

      {/* Step 3: Session type */}
      {step === "type" && (
        <div>
          <h3 className={`t-h4 text-[var(--text-primary)] mb-5 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
            {t("What kind of session?", "कोणत्या प्रकारचे सेशन?", lang)}
          </h3>
          <div className="space-y-3 mb-8">
            {CONSULT_TYPES.map(ct => (
              <div key={ct.id} onClick={() => setSelectedType(ct.id)}
                className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${selectedType === ct.id ? "border-[var(--sage)] bg-[var(--sage-ghost)] ring-1 ring-[var(--sage)]" : "border-[var(--border-subtle)] hover:border-[var(--border-default)]"}`}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: selectedType === ct.id ? "var(--sage-pale)" : "var(--bg-muted)" }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: selectedType === ct.id ? "var(--sage)" : "var(--border-default)" }}/>
                </div>
                <div className="flex-1">
                  <p className={`t-small font-semibold text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                    {lang === "en" ? ct.en : ct.mr}
                  </p>
                  <p className={`t-xs text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`}>
                    {lang === "en" ? ct.desc_en : ct.desc_mr}
                  </p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${selectedType === ct.id ? "border-[var(--sage)] bg-[var(--sage)]" : "border-[var(--border-default)]"}`}>
                  {selectedType === ct.id && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setStep("review")} disabled={!selectedType}
            className={`btn btn-primary btn-lg w-full justify-center ${lang === "mr" ? "mr" : ""}`}>
            {t("Review Booking →", "बुकिंग पुनरावलोकन करा →", lang)}
          </button>
        </div>
      )}

      {/* Step 4: Review */}
      {step === "review" && expert && (
        <div>
          <h3 className={`t-h4 text-[var(--text-primary)] mb-5 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
            {t("Booking summary", "बुकिंग सारांश", lang)}
          </h3>

          <div className="rounded-2xl border overflow-hidden mb-6" style={{ borderColor: "var(--border-subtle)" }}>
            <div className="p-5 border-b flex items-center gap-3" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-elevated)" }}>
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                <img src={prog.image} alt={prog.title_en} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className={`t-small font-semibold text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                  {lang === "en" ? prog.title_en : prog.title_mr}
                </p>
                <p className="t-xs text-[var(--text-muted)]">{CONSULT_TYPES.find(c => c.id === selectedType)?.en}</p>
              </div>
            </div>

            {[
              { label_en: "Expert", label_mr: "तज्ञ", val: expert.name_en },
              { label_en: "Date", label_mr: "तारीख", val: `${selectedDay} ${MONTH_NAMES[month]} ${year}` },
              { label_en: "Time", label_mr: "वेळ", val: selectedTime ?? "" },
              { label_en: "Mode", label_mr: "माध्यम", val: "Live Zoom" },
            ].map(row => (
              <div key={row.label_en} className="flex items-center gap-3 px-5 py-3 border-b last:border-0"
                style={{ borderColor: "var(--border-subtle)", background: "var(--bg-elevated)" }}>
                <span className={`t-xs text-[var(--text-muted)] w-20 ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? row.label_en : row.label_mr}</span>
                <span className="t-xs font-medium text-[var(--text-primary)]">{row.val}</span>
              </div>
            ))}

            <div className="flex items-center justify-between px-5 py-4" style={{ background: "var(--bg-muted)" }}>
              <span className={`t-small text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`}>{t("Total", "एकूण", lang)}</span>
              <span className="t-h4 text-[var(--text-primary)]" style={{ fontFamily: "var(--font-mono)" }}>₹{prog.price.toLocaleString()}</span>
            </div>
          </div>

          <button onClick={() => onConfirm([programId])}
            className={`btn btn-primary btn-xl w-full justify-center ${lang === "mr" ? "mr" : ""}`}>
            {t("Confirm & Pay →", "पुष्टी करा आणि पैसे द्या →", lang)}
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// RECORDED LIBRARY
// ═══════════════════════════════════════════════════════════════════════════
function RecordedLibrary({ lang, onConfirm }: { lang: Lang; onConfirm: (ids: string[]) => void }) {
  const [activeCat, setActiveCat] = useState("All");
  const [preview, setPreview] = useState<string | null>(null);
  const prog = programs.find(p => p.id === "recorded")!;

  const filtered = activeCat === "All" ? VIDEOS : VIDEOS.filter(v => v.cat === activeCat);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <p className={`t-label text-[var(--sage)] mb-1 ${lang === "mr" ? "mr" : ""}`}>{t("Video Library", "व्हिडिओ लायब्ररी", lang)}</p>
        <h3 className={`t-h3 text-[var(--text-primary)] mb-1 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
          {t("80+ on-demand sessions", "८०+ ऑन-डिमांड सेशन्स", lang)}
        </h3>
        <p className={`t-xs text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`}>
          {t("Lifetime access · Practice anytime · All levels", "आजीवन प्रवेश · कधीही सराव करा · सर्व स्तर", lang)}
        </p>
      </div>

      {/* Category pills */}
      <div className="h-scroll mb-5">
        {VIDEO_CATS.map(c => (
          <button key={c} onClick={() => setActiveCat(c)}
            className={`shrink-0 px-4 py-2 rounded-full t-xs font-medium transition-all border ${activeCat === c ? "bg-[var(--sage)] border-[var(--sage)] text-white" : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-default)]"}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Video grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {filtered.map(v => (
          <div key={v.id} className="rounded-2xl overflow-hidden border group cursor-pointer transition-all hover:shadow-lg"
            style={{ borderColor: "var(--border-subtle)", background: "var(--bg-elevated)" }}
            onClick={() => setPreview(v.id)}>
            <div className="relative h-36 overflow-hidden" style={{ background: "var(--bg-muted)" }}>
              <img src={v.thumb} alt={v.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-white text-lg ml-1">▶</span>
                </div>
              </div>
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.7)" }}>
                <span className="t-xs text-white" style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem" }}>{v.dur}</span>
              </div>
              <div className="absolute top-2 left-2">
                <span className="badge badge-dark">{v.cat}</span>
              </div>
            </div>
            <div className="p-4">
              <p className="t-small font-semibold text-[var(--text-primary)] mb-1" style={{ fontFamily: "var(--font-display)" }}>{v.title}</p>
              <p className="t-xs text-[var(--text-muted)]">{v.level}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Preview modal */}
      {preview && (() => {
        const v = VIDEOS.find(x => x.id === preview)!;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)" }}
            onClick={() => setPreview(null)}>
            <div className="w-full max-w-lg rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}
              style={{ background: "var(--bg-elevated)" }}>
              <div className="relative h-48" style={{ background: "var(--ink)" }}>
                <img src={v.thumb} alt={v.title} className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <span className="text-white text-2xl ml-1">▶</span>
                  </div>
                </div>
                <button onClick={() => setPreview(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.5)" }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="1.5"><path d="M2 2l8 8M10 2L2 10" strokeLinecap="round"/></svg>
                </button>
              </div>
              <div className="p-5">
                <p className="t-h4 text-[var(--text-primary)] mb-1" style={{ fontFamily: "var(--font-display)" }}>{v.title}</p>
                <p className="t-xs text-[var(--text-muted)] mb-4">{v.cat} · {v.dur} · {v.level}</p>
                <p className={`t-xs text-[var(--text-muted)] mb-4 ${lang === "mr" ? "mr" : ""}`}>
                  {t("This is a preview. Purchase the library to access all 80+ videos.", "हे एक पूर्वावलोकन आहे. सर्व ८०+ व्हिडिओ ऍक्सेस करण्यासाठी लायब्ररी खरेदी करा.", lang)}
                </p>
                <button onClick={() => { setPreview(null); onConfirm(["recorded"]); }}
                  className={`btn btn-primary w-full justify-center ${lang === "mr" ? "mr" : ""}`}>
                  {t(`Get full library · ₹${prog.price.toLocaleString()}`, `संपूर्ण लायब्ररी मिळवा · ₹${prog.price.toLocaleString()}`, lang)}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      <div className="p-4 rounded-2xl border flex items-center justify-between"
        style={{ borderColor: "var(--border-subtle)", background: "var(--bg-elevated)" }}>
        <div>
          <p className={`t-small font-semibold text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`}>
            {t("Full library access", "संपूर्ण लायब्ररी प्रवेश", lang)}
          </p>
          <p className={`t-xs text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`}>
            {t("80+ videos · Lifetime · All categories", "८०+ व्हिडिओ · आजीवन · सर्व श्रेणी", lang)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="t-h4 text-[var(--text-primary)]" style={{ fontFamily: "var(--font-mono)" }}>₹{prog.price.toLocaleString()}</span>
          <button onClick={() => onConfirm(["recorded"])} className={`btn btn-primary btn-sm ${lang === "mr" ? "mr" : ""}`}>
            {t("Get Access", "प्रवेश मिळवा", lang)}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN BOOKING ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════════════
export default function BookingFlow({ lang, programId, onConfirm, onBack }: Props) {
  const prog = programs.find(p => p.id === programId);
  const isGroup = programId === "pilates-group";
  const isRecorded = programId === "recorded";
  const isIndiv = !isGroup && !isRecorded;

  const title = isGroup ? t("Book Group Batch", "ग्रुप बॅच बुक करा", lang)
    : isRecorded ? t("Video Library", "व्हिडिओ लायब्ररी", lang)
    : t("Book Individual Session", "वैयक्तिक सेशन बुक करा", lang);

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
      {/* Header */}
      <div className="sticky top-0 z-30 px-6 py-4 flex items-center gap-4"
        style={{ background: "var(--bg-primary)", borderBottom: "1px solid var(--border-subtle)" }}>
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[var(--bg-muted)] transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
            <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div>
          <p className={`t-small font-semibold text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
            {title}
          </p>
          {prog && <p className={`t-xs text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? prog.title_en : prog.title_mr}</p>}
        </div>
        <div className="ml-auto w-7 h-7 rounded-full bg-[var(--sage)] flex items-center justify-center">
          <span className="text-white text-xs font-bold" style={{ fontFamily: "var(--font-display)" }}>V</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-8">
        {isGroup && <GroupBooking programId={programId} lang={lang} onConfirm={onConfirm} onBack={onBack} />}
        {isIndiv && <IndividualBooking programId={programId} lang={lang} onConfirm={onConfirm} onBack={onBack} />}
        {isRecorded && <RecordedLibrary lang={lang} onConfirm={onConfirm} />}
      </div>
    </div>
  );
}

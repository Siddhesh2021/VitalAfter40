import { useState, useRef, useEffect } from "react";
import { programs, professionals, t, type Lang } from "./data";

// ─── Types ────────────────────────────────────────────────────────────────
type Answers = Record<string, string | string[]>;

interface PlanItem {
  programId: string;
  freq: number; // sessions / week
  format: "group" | "individual";
  mode: "live" | "recorded";
}

interface Props {
  lang: Lang;
  answers: Answers;
  onBuild: (plan: PlanItem[]) => void;
  onBack: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MR_DAYS = ["सोम", "मंगळ", "बुध", "गुरु", "शुक्र", "शनि", "रवि"];

function displayGoal(answers: Answers, lang: Lang) {
  const goals = (answers.goals as string[]) ?? [];
  const map: Record<string, [string, string]> = {
    strength: ["Build strength", "ताकद बांधा"],
    mobility: ["Move better", "चांगले हलवा"],
    weight: ["Lose weight", "वजन कमी करा"],
    energy: ["Improve energy", "ऊर्जा सुधारा"],
    flexibility: ["Improve flexibility", "लवचिकता सुधारा"],
    overall: ["Overall health", "एकूण आरोग्य"],
  };
  const first = goals[0];
  if (!first) return lang === "en" ? "General wellness" : "सामान्य वेलनेस";
  const entry = map[first];
  return entry ? (lang === "en" ? entry[0] : entry[1]) : first;
}

function displayActivity(answers: Answers, lang: Lang) {
  const a = answers.activity as string;
  const map: Record<string, [string, string]> = {
    sedentary: ["Sedentary", "बैठी"],
    light: ["Lightly active", "हलका सक्रिय"],
    moderate: ["Moderately active", "मध्यम सक्रिय"],
    active: ["Very active", "खूप सक्रिय"],
  };
  return map[a]?.[lang === "en" ? 0 : 1] ?? (lang === "en" ? "Not specified" : "निर्दिष्ट नाही");
}

// ─── Derive priorities from answers ──────────────────────────────────────
interface Priority { num: string; en: string; mr: string; desc_en: string; desc_mr: string; icon: string; }

function buildPriorities(answers: Answers): Priority[] {
  const goals = (answers.goals as string[]) ?? [];
  const hasPain = ["yes", "mild"].includes(answers.pain_yn as string);
  const hasWeightGoal = goals.includes("weight");
  const hasStrength = goals.includes("strength");
  const hasEnergy = goals.includes("energy");
  const hasMobility = goals.includes("mobility") || goals.includes("flexibility");
  const isLowEnergy = ["low", "vlow"].includes(answers.energy_level as string);
  const isHighStress = ["high", "vhigh"].includes(answers.stress as string);
  const hasMedical = (answers.medical as string[])?.some(m => m !== "none");

  const result: Priority[] = [];

  if (hasPain || hasMobility) {
    result.push({
      num: "01", icon: "",
      en: "Movement", mr: "हालचाल",
      desc_en: "Targeted mobility and joint health work should be your first priority.",
      desc_mr: "लक्ष्यित गतिशीलता आणि सांध्याच्या आरोग्याचे काम तुमची पहिली प्राथमिकता असावी.",
    });
  }

  if (hasStrength || hasWeightGoal) {
    result.push({
      num: String(result.length + 1).padStart(2, "0"), icon: "",
      en: "Strength", mr: "ताकद",
      desc_en: "Progressive resistance training rebuilds muscle and accelerates metabolism.",
      desc_mr: "प्रगतीशील प्रतिरोध प्रशिक्षण स्नायू पुनर्निर्माण करते आणि चयापचय वाढवते.",
    });
  }

  if (hasWeightGoal || isLowEnergy || hasMedical) {
    result.push({
      num: String(result.length + 1).padStart(2, "0"), icon: "",
      en: "Nutrition", mr: "पोषण",
      desc_en: "What you eat directly shapes your energy, hormones, and results.",
      desc_mr: "तुम्ही काय खाता ते तुमची ऊर्जा, हार्मोन्स आणि परिणामांना थेट आकार देते.",
    });
  }

  if (isHighStress || isLowEnergy || hasEnergy) {
    result.push({
      num: String(result.length + 1).padStart(2, "0"), icon: "",
      en: "Recovery", mr: "पुनर्प्राप्ती",
      desc_en: "Sleep, stress management and recovery are the multiplier behind every result.",
      desc_mr: "झोप, तणाव व्यवस्थापन आणि पुनर्प्राप्ती प्रत्येक परिणामामागील गुणक आहे.",
    });
  }

  // Always have at least 3, pad with defaults
  const defaults: Priority[] = [
    {
      num: "01", icon: "", en: "Movement", mr: "हालचाल",
      desc_en: "Building a foundation of daily movement is the single best investment at 40+.",
      desc_mr: "दैनंदिन हालचालीचा आधार तयार करणे ४०+ वर्षी सर्वोत्तम गुंतवणूक आहे.",
    },
    {
      num: "02", icon: "", en: "Strength", mr: "ताकद",
      desc_en: "Progressive resistance training rebuilds muscle and accelerates metabolism.",
      desc_mr: "प्रगतीशील प्रतिरोध प्रशिक्षण स्नायू पुनर्निर्माण करते.",
    },
    {
      num: "03", icon: "", en: "Recovery", mr: "पुनर्प्राप्ती",
      desc_en: "Sleep and stress management are the hidden multiplier behind every result.",
      desc_mr: "झोप आणि तणाव व्यवस्थापन प्रत्येक परिणामामागील छुपा गुणक आहे.",
    },
    {
      num: "04", icon: "", en: "Nutrition", mr: "पोषण",
      desc_en: "Eating for your biology — not a diet — sustains every other change.",
      desc_mr: "तुमच्या जीवशास्त्रासाठी खाणे — आहार नाही — इतर प्रत्येक बदल टिकवते.",
    },
  ];

  while (result.length < 3) {
    const next = defaults.find(d => !result.some(r => r.en === d.en));
    if (next) result.push({ ...next, num: String(result.length + 1).padStart(2, "0") });
    else break;
  }

  return result.slice(0, 4).map((p, i) => ({ ...p, num: String(i + 1).padStart(2, "0") }));
}

// ─── Derive tiered recommendations ──────────────────────────────────────
type Tier = "high" | "recommended" | "optional";

interface ProgramRec {
  programId: string;
  tier: Tier;
  defaultFreq: number;
  defaultFormat: "group" | "individual";
  defaultMode: "live" | "recorded";
  freq_label_en: string;
  freq_label_mr: string;
  expertId: string;
  note_en?: string;
  note_mr?: string;
}

function buildProgramRecs(answers: Answers): ProgramRec[] {
  const goals = (answers.goals as string[]) ?? [];
  const hasPain = ["yes", "mild"].includes(answers.pain_yn as string);
  const wantsWeight = goals.includes("weight");
  const wantsStrength = goals.includes("strength");
  const wantsMobility = goals.includes("mobility") || goals.includes("flexibility");
  const isLowEnergy = ["low", "vlow"].includes(answers.energy_level as string);
  const hasHormonal = ["peri", "meno", "post"].includes(answers.hormonal as string);
  const pref = answers.session_format as string;
  const mode = answers.session_mode as string;
  const fmt = pref === "individual" ? "individual" : "group";
  const md = mode === "recorded" ? "recorded" : "live";

  const recs: ProgramRec[] = [];

  if (hasPain) {
    recs.push({
      programId: "physio", tier: "high",
      defaultFreq: 2, defaultFormat: "individual", defaultMode: "live",
      freq_label_en: "2x / week", freq_label_mr: "२ वेळा/आठवडा",
      expertId: "amit-physio",
      note_en: "Recommended before starting any exercise program.", note_mr: "कोणताही व्यायाम कार्यक्रम सुरू करण्यापूर्वी शिफारस केली.",
    });
  }

  if (wantsMobility || hasPain || goals.includes("overall")) {
    recs.push({
      programId: fmt === "individual" ? "pilates-individual" : "pilates-group",
      tier: hasPain ? "high" : "recommended",
      defaultFreq: 3, defaultFormat: fmt, defaultMode: md,
      freq_label_en: "3x / week", freq_label_mr: "३ वेळा/आठवडा",
      expertId: "priya-pilates",
    });
  }

  recs.push({
    programId: "doctor", tier: "high",
    defaultFreq: 1, defaultFormat: "individual", defaultMode: "live",
    freq_label_en: "1 consultation", freq_label_mr: "१ सल्लामसलत",
    expertId: "dr-sharma",
    note_en: "Baseline health assessment with our medical director.", note_mr: "आमच्या वैद्यकीय संचालकांसोबत बेसलाइन आरोग्य मूल्यांकन.",
  });

  if (wantsStrength) {
    recs.push({
      programId: "strength", tier: "recommended",
      defaultFreq: 2, defaultFormat: fmt, defaultMode: md,
      freq_label_en: "2x / week", freq_label_mr: "२ वेळा/आठवडा",
      expertId: "dr-sharma",
    });
  }

  if (wantsWeight || isLowEnergy || hasHormonal) {
    recs.push({
      programId: "nutrition", tier: "recommended",
      defaultFreq: 1, defaultFormat: "individual", defaultMode: "live",
      freq_label_en: "1x / week", freq_label_mr: "१ वेळा/आठवडा",
      expertId: "sneha-nutrition",
    });
  }

  if (hasHormonal) {
    recs.push({
      programId: "hormonal", tier: "optional",
      defaultFreq: 1, defaultFormat: "individual", defaultMode: "live",
      freq_label_en: "Initial + follow-ups", freq_label_mr: "प्रारंभिक + पाठपुरावा",
      expertId: "dr-sharma",
    });
  }

  recs.push({
    programId: "recorded", tier: "optional",
    defaultFreq: 3, defaultFormat: "individual", defaultMode: "recorded",
    freq_label_en: "Anytime", freq_label_mr: "कधीही",
    expertId: "priya-pilates",
    note_en: "On-demand library — great supplement to your live sessions.", note_mr: "ऑन-डिमांड लायब्ररी — तुमच्या लाइव्ह सेशन्सचे उत्तम पूरक.",
  });

  const seen = new Set<string>();
  return recs.filter(r => { if (seen.has(r.programId)) return false; seen.add(r.programId); return true; });
}

// ─── Schedule preview builder ────────────────────────────────────────────
function buildSchedule(plan: PlanItem[]): Record<number, string[]> {
  const sched: Record<number, string[]> = {};
  plan.forEach(item => {
    const prog = programs.find(p => p.id === item.programId);
    if (!prog) return;
    const tag = prog.title_en.split(" ")[0];
    let placed = 0;
    for (let d = 0; d < 7 && placed < item.freq; d++) {
      if (!sched[d]) sched[d] = [];
      if (sched[d].length < 2) {
        sched[d].push(tag);
        placed++;
        d++; // skip next day for recovery
      }
    }
  });
  return sched;
}

// ─── Plan item controls ──────────────────────────────────────────────────
function PlanItemCard({
  item, rec, lang, onRemove, onFreqChange, onFormatChange, onModeChange,
}: {
  item: PlanItem; rec: ProgramRec; lang: Lang;
  onRemove: () => void; onFreqChange: (f: number) => void;
  onFormatChange: (f: "group" | "individual") => void;
  onModeChange: (m: "live" | "recorded") => void;
}) {
  const prog = programs.find(p => p.id === item.programId)!;
  const expert = professionals.find(p => p.id === rec.expertId);
  const isConsult = item.freq === 1 && (rec.programId === "doctor" || rec.programId === "nutrition");

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-elevated)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0" style={{ background: "var(--bg-muted)" }}>
          <img src={prog.image} alt={prog.title_en} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`t-small font-semibold text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
            {lang === "en" ? prog.title_en : prog.title_mr}
          </p>
          {expert && (
            <p className="t-xs text-[var(--text-muted)]">{expert.name_en}</p>
          )}
        </div>
        <button onClick={onRemove} className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--bg-muted)]"
          title="Remove">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
            <path d="M2 2l10 10M12 2L2 12" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Controls */}
      <div className="p-4 space-y-3">
        {/* Frequency */}
        {!isConsult && (
          <div className="flex items-center justify-between">
            <span className={`t-xs text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`}>
              {t("Sessions / week", "सेशन्स / आठवडा", lang)}
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(f => (
                <button key={f} onClick={() => onFreqChange(f)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${item.freq === f ? "bg-[var(--sage)] text-white" : "bg-[var(--bg-muted)] text-[var(--text-muted)] hover:bg-[var(--border-subtle)]"}`}
                  style={{ fontFamily: "var(--font-mono)" }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Format */}
        {rec.programId !== "doctor" && rec.programId !== "nutrition" && rec.programId !== "physio" && rec.programId !== "hormonal" && (
          <div className="flex items-center justify-between">
            <span className={`t-xs text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`}>
              {t("Format", "स्वरूप", lang)}
            </span>
            <div className="flex gap-1">
              {(["group", "individual"] as const).map(f => (
                <button key={f} onClick={() => onFormatChange(f)}
                  className={`px-3 py-1 rounded-lg t-xs font-medium transition-all capitalize ${item.format === f ? "bg-[var(--sage)] text-white" : "bg-[var(--bg-muted)] text-[var(--text-muted)]"}`}>
                  {lang === "en" ? f : f === "group" ? "ग्रुप" : "वैयक्तिक"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mode */}
        {rec.programId !== "recorded" && rec.programId !== "doctor" && rec.programId !== "physio" && rec.programId !== "hormonal" && rec.programId !== "nutrition" && (
          <div className="flex items-center justify-between">
            <span className={`t-xs text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`}>
              {t("Mode", "माध्यम", lang)}
            </span>
            <div className="flex gap-1">
              {(["live", "recorded"] as const).map(m => (
                <button key={m} onClick={() => onModeChange(m)}
                  className={`px-3 py-1 rounded-lg t-xs font-medium transition-all capitalize ${item.mode === m ? "bg-[var(--sage)] text-white" : "bg-[var(--bg-muted)] text-[var(--text-muted)]"}`}>
                  {lang === "en" ? m : m === "live" ? "लाइव्ह" : "रेकॉर्डेड"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "var(--border-subtle)" }}>
          <span className={`t-xs text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`}>{t("Price", "किंमत", lang)}</span>
          <span className="t-small font-semibold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-mono)" }}>
            ₹{prog.price.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Summary panel (desktop right / mobile bottom) ───────────────────────
function SummaryPanel({ plan, recs, lang, onBuild, compact = false }: {
  plan: PlanItem[]; recs: ProgramRec[]; lang: Lang; onBuild: () => void; compact?: boolean;
}) {
  const total = plan.reduce((sum, item) => {
    const prog = programs.find(p => p.id === item.programId);
    return sum + (prog?.price ?? 0);
  }, 0);

  const schedule = buildSchedule(plan);
  const totalSessions = plan.reduce((s, i) => s + i.freq, 0);

  if (compact) {
    // Mobile sticky bottom
    return (
      <div className="fixed bottom-0 left-0 right-0 z-30 px-4 py-4"
        style={{ background: "var(--bg-elevated)", borderTop: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-xl)" }}>
        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="t-xs text-[var(--text-muted)]">
              {plan.length} {t("program", "प्रोग्राम", lang)}{plan.length !== 1 ? "s" : ""} · {totalSessions} {t("sessions/wk", "सेशन्स/आठवडा", lang)}
            </p>
            <p className="font-semibold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-mono)", fontSize: "1.125rem" }}>
              ₹{total.toLocaleString()}
            </p>
          </div>
          <button onClick={onBuild} disabled={plan.length === 0} className={`btn btn-primary btn-lg shrink-0 ${lang === "mr" ? "mr" : ""}`}>
            {t("Build My Plan", "माझी योजना बनवा", lang)}
          </button>
        </div>
      </div>
    );
  }

  // Desktop sticky panel
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-elevated)" }}>
      <div className="p-5 border-b" style={{ borderColor: "var(--border-subtle)" }}>
        <p className={`t-label text-[var(--text-muted)] mb-1 ${lang === "mr" ? "mr" : ""}`}>{t("Your Plan", "तुमची योजना", lang)}</p>
        <p className="t-h4 text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
          {plan.length} {t("program", "प्रोग्राम", lang)}{plan.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Schedule */}
      {plan.length > 0 && (
        <div className="p-5 border-b" style={{ borderColor: "var(--border-subtle)" }}>
          <p className={`t-label text-[var(--text-muted)] mb-3 ${lang === "mr" ? "mr" : ""}`}>{t("Weekly Schedule", "साप्ताहिक वेळापत्रक", lang)}</p>
          <div className="grid grid-cols-7 gap-1">
            {DAYS.map((d, i) => {
              const items = schedule[i] ?? [];
              return (
                <div key={d} className="text-center">
                  <p className="t-xs text-[var(--text-muted)] mb-1" style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem" }}>
                    {lang === "en" ? d.slice(0,2) : MR_DAYS[i].slice(0,2)}
                  </p>
                  <div className="space-y-0.5">
                    {items.slice(0, 2).map((tag, j) => (
                      <div key={j} className="rounded h-4 flex items-center justify-center"
                        style={{ background: "var(--sage-pale)", fontSize: "0.45rem", color: "var(--sage)", fontWeight: 700, letterSpacing: 0 }}>
                        {tag.slice(0, 3).toUpperCase()}
                      </div>
                    ))}
                    {items.length === 0 && (
                      <div className="rounded h-4" style={{ background: "var(--bg-muted)" }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Programs list */}
      {plan.length > 0 && (
        <div className="p-5 border-b" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="space-y-2">
            {plan.map(item => {
              const prog = programs.find(p => p.id === item.programId);
              if (!prog) return null;
              return (
                <div key={item.programId} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--sage)" }} />
                    <span className={`t-xs text-[var(--text-primary)] truncate ${lang === "mr" ? "mr" : ""}`}>
                      {lang === "en" ? prog.title_en : prog.title_mr}
                    </span>
                  </div>
                  <span className="t-xs text-[var(--text-muted)] shrink-0 ml-2" style={{ fontFamily: "var(--font-mono)" }}>
                    ₹{prog.price.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Experts */}
      {plan.length > 0 && (() => {
        const expertIds = [...new Set(recs.filter(r => plan.some(p => p.programId === r.programId)).map(r => r.expertId))];
        const experts = expertIds.map(id => professionals.find(p => p.id === id)).filter(Boolean);
        return experts.length > 0 ? (
          <div className="p-5 border-b" style={{ borderColor: "var(--border-subtle)" }}>
            <p className={`t-label text-[var(--text-muted)] mb-3 ${lang === "mr" ? "mr" : ""}`}>{t("Your Experts", "तुमचे तज्ञ", lang)}</p>
            <div className="flex -space-x-2">
              {experts.map(exp => exp && (
                <div key={exp.id} className="w-8 h-8 rounded-full border-2 overflow-hidden shrink-0"
                  style={{ borderColor: "var(--bg-elevated)" }}>
                  <img src={exp.image} alt={exp.name_en} className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 t-xs text-[var(--text-muted)]"
                style={{ borderColor: "var(--bg-elevated)", background: "var(--bg-muted)", fontFamily: "var(--font-mono)" }}>
                +{experts.length}
              </div>
            </div>
          </div>
        ) : null;
      })()}

      {/* Total */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className={`t-small text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`}>{t("Total", "एकूण", lang)}</span>
          <span className="t-h4 text-[var(--text-primary)]" style={{ fontFamily: "var(--font-mono)" }}>
            ₹{total.toLocaleString()}
          </span>
        </div>
        <button
          onClick={onBuild}
          disabled={plan.length === 0}
          className={`btn btn-primary w-full justify-center btn-lg ${lang === "mr" ? "mr" : ""}`}>
          {t("Build My Plan", "माझी योजना बनवा", lang)}
        </button>
        <p className={`t-xs text-center text-[var(--text-muted)] mt-2 ${lang === "mr" ? "mr" : ""}`}>
          {t("No payment now. Confirm after consultation.", "आत्ता पेमेंट नाही. सल्लामसलतीनंतर पुष्टी करा.", lang)}
        </p>
      </div>
    </div>
  );
}

// ─── Tier label ───────────────────────────────────────────────────────────
function TierHeader({ tier, lang }: { tier: Tier; lang: Lang }) {
  const cfg = {
    high: { en: "High Priority", mr: "उच्च प्राधान्य", color: "var(--error)", icon: "●" },
    recommended: { en: "Recommended", mr: "शिफारस केलेले", color: "var(--sage)", icon: "◆" },
    optional: { en: "Optional", mr: "ऐच्छिक", color: "var(--stone)", icon: "○" },
  }[tier];

  return (
    <div className="flex items-center gap-3 mb-4">
      <span style={{ color: cfg.color, fontSize: "0.5rem" }}>{cfg.icon}</span>
      <p className={`t-label ${lang === "mr" ? "mr" : ""}`} style={{ color: cfg.color }}>
        {lang === "en" ? cfg.en : cfg.mr}
      </p>
      <div className="flex-1 h-px" style={{ background: "var(--border-subtle)" }} />
    </div>
  );
}

// ─── Program recommendation card ─────────────────────────────────────────
function RecCard({ rec, plan, lang, onAdd, onRemove }: {
  rec: ProgramRec; plan: PlanItem[]; lang: Lang; onAdd: () => void; onRemove: () => void;
}) {
  const prog = programs.find(p => p.id === rec.programId)!;
  const expert = professionals.find(p => p.id === rec.expertId);
  const isAdded = plan.some(p => p.programId === rec.programId);

  const details = [
    { value: rec.freq_label_en, value_mr: rec.freq_label_mr },
    ...(rec.defaultFormat !== undefined ? [{ value: rec.defaultFormat === "group" ? "Group" : "Individual", value_mr: rec.defaultFormat === "group" ? "ग्रुप" : "वैयक्तिक" }] : []),
    ...(rec.programId !== "recorded" ? [{ value: rec.defaultMode === "live" ? "Live Zoom" : "Recorded", value_mr: rec.defaultMode === "live" ? "लाइव्ह झूम" : "रेकॉर्डेड" }] : []),
  ];

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all duration-200 ${isAdded ? "ring-2 ring-[var(--sage)] ring-offset-0" : ""}`}
      style={{ borderColor: isAdded ? "var(--sage)" : "var(--border-subtle)", background: "var(--bg-elevated)" }}>

      {/* Image header */}
      <div className="relative h-36 overflow-hidden" style={{ background: "var(--bg-muted)" }}>
        <img src={prog.image} alt={prog.title_en} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-4">
          <p className={`t-small font-semibold text-white ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
            {lang === "en" ? prog.title_en : prog.title_mr}
          </p>
        </div>
        {rec.tier === "high" && (
          <div className="absolute top-3 left-3">
            <span className="badge badge-error t-xs">Priority</span>
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Detail chips */}
        <div className="flex flex-wrap gap-2 mb-3">
          {details.map(d => (
            <span key={d.value} className={`px-2 py-1 rounded-lg t-xs text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`}
              style={{ background: "var(--bg-muted)" }}>
              {lang === "en" ? d.value : d.value_mr}
            </span>
          ))}
        </div>

        {/* Expert */}
        {expert && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
              <img src={expert.image} alt={expert.name_en} className="w-full h-full object-cover" />
            </div>
            <span className="t-xs text-[var(--text-muted)]">{expert.name_en}</span>
          </div>
        )}

        {/* Note */}
        {rec.note_en && (
          <p className={`t-xs text-[var(--text-muted)] mb-3 ${lang === "mr" ? "mr" : ""}`}>
            {lang === "en" ? rec.note_en : rec.note_mr}
          </p>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <span className="t-small font-semibold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-mono)" }}>
            ₹{prog.price.toLocaleString()}
          </span>
          <button
            onClick={isAdded ? onRemove : onAdd}
            className={`btn btn-sm ${isAdded ? "btn-outline" : "btn-primary"} ${lang === "mr" ? "mr" : ""}`}>
            {isAdded
              ? <><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 6h8"/></svg>{t("Remove", "काढा", lang)}</>
              : <><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2v8M2 6h8"/></svg>{t("Add", "जोडा", lang)}</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN RESULTS PAGE
// ═══════════════════════════════════════════════════════════════════════════
export default function ResultsPage({ lang, answers, onBuild, onBack }: Props) {
  const name = (answers.name as string) || "";
  const age = answers.age as string;
  const recs = buildProgramRecs(answers);
  const priorities = buildPriorities(answers);

  // Initialize plan with tier:"high" items auto-added
  const [plan, setPlan] = useState<PlanItem[]>(() =>
    recs.filter(r => r.tier === "high").map(r => ({
      programId: r.programId,
      freq: r.defaultFreq,
      format: r.defaultFormat,
      mode: r.defaultMode,
    }))
  );

  const [showPlanBuilder, setShowPlanBuilder] = useState(false);
  const builderRef = useRef<HTMLDivElement>(null);

  // Scroll to builder section
  const scrollToBuilder = () => {
    builderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const addProgram = (rec: ProgramRec) => {
    setPlan(prev => [...prev, {
      programId: rec.programId,
      freq: rec.defaultFreq,
      format: rec.defaultFormat,
      mode: rec.defaultMode,
    }]);
  };

  const removeProgram = (programId: string) => {
    setPlan(prev => prev.filter(p => p.programId !== programId));
  };

  const updateItem = (programId: string, updates: Partial<PlanItem>) => {
    setPlan(prev => prev.map(p => p.programId === programId ? { ...p, ...updates } : p));
  };

  const tiers: Tier[] = ["high", "recommended", "optional"];

  // Stagger animation on enter
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", fontFamily: "var(--font-body)" }}>

      {/* ══ HEADER ══════════════════════════════════════════════════════ */}
      <div style={{ background: "var(--ink)", paddingBottom: "5rem" }}>
        {/* Nav bar */}
        <div className="flex items-center justify-between px-6 pt-6 pb-0 max-w-6xl mx-auto">
          <button onClick={onBack} className="flex items-center gap-2 t-xs text-white/40 hover:text-white/70 transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 2L4 7l5 5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t("Back to Assessment", "मूल्यांकनाकडे परत", lang)}
          </button>
          <div className="w-7 h-7 rounded-full bg-[var(--sage)] flex items-center justify-center">
            <span className="text-white text-xs font-bold" style={{ fontFamily: "var(--font-display)" }}>V</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pt-12">
          {/* Eyebrow */}
          <p className={`t-label text-[var(--sage-light)] mb-5 anim-fade-in ${lang === "mr" ? "mr" : ""}`}>
            {name
              ? t(`Prepared for ${name}`, `${name} साठी तयार`, lang)
              : t("Your personalised results", "तुमचे वैयक्तिकृत परिणाम", lang)
            }
          </p>

          {/* Main headline */}
          <h1 className={`text-white mb-8 anim-fade-up delay-100 ${lang === "mr" ? "mr" : ""}`}
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.08, letterSpacing: "-0.02em", maxWidth: 640 }}>
            {t("Your personalised 40+ wellness plan", "तुमची वैयक्तिकृत ४०+ वेलनेस योजना", lang)}
          </h1>

          {/* Data chips */}
          <div className="flex flex-wrap gap-2.5 anim-fade-up delay-200">
            {[
              age ? { en: `Age ${age}`, mr: `वय ${age}` } : null,
              { en: displayGoal(answers, "en"), mr: displayGoal(answers, "mr") },
              { en: displayActivity(answers, "en"), mr: displayActivity(answers, "mr") },
              plan.length > 0 ? { en: `${plan.length} programs recommended`, mr: `${plan.length} प्रोग्राम्स शिफारस केलेले` } : null,
            ].filter(Boolean).map((chip) => chip && (
              <div key={chip.en} className={`px-3 py-1.5 rounded-full ${lang === "mr" ? "mr" : ""}`}
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <span className="t-xs text-white/60">{lang === "en" ? chip.en : chip.mr}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ CONTENT ═════════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-6 pb-40" style={{ marginTop: "-3.5rem" }}>
        <div className="lg:grid lg:grid-cols-[1fr_320px] gap-10 items-start">

          {/* ── Main column ── */}
          <div>

            {/* ── PRIORITIES ────────────────────────────────────────── */}
            <section className="mb-14 anim-fade-up delay-200">
              <div className="flex items-end gap-4 mb-8">
                <div>
                  <p className={`t-label text-[var(--text-muted)] mb-1 ${lang === "mr" ? "mr" : ""}`}>{t("Where to focus", "कुठे लक्ष केंद्रित करावे", lang)}</p>
                  <h2 className={`t-h2 text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                    {t("Your priorities", "तुमच्या प्राधान्यक्रम", lang)}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5 rounded-2xl overflow-hidden border" style={{ borderColor: "var(--border-subtle)" }}>
                {priorities.map((p, i) => (
                  <div key={p.num} className="p-6 relative group transition-colors"
                    style={{
                      background: i === 0 ? "var(--ink)" : "var(--bg-elevated)",
                      borderRight: i % 2 === 0 ? "1px solid var(--border-subtle)" : "none",
                      borderBottom: i < priorities.length - 2 ? "1px solid var(--border-subtle)" : "none",
                    }}>
                    <div className="flex items-start justify-between mb-3">
                      {/* Editorial number */}
                      <span className={`font-bold leading-none select-none ${i === 0 ? "text-[var(--sage)]" : "text-[var(--border-default)]"}`}
                        style={{ fontFamily: "var(--font-display)", fontSize: "clamp(4rem, 8vw, 6rem)", letterSpacing: "-0.05em", lineHeight: 0.85 }}>
                        {p.num}
                      </span>
                      <div className="w-8 h-0.5 rounded-full" style={{ background: i === 0 ? "var(--sage)" : "var(--border-default)", marginTop: "1rem" }}/>
                    </div>
                    <p className={`t-h4 mb-1 ${i === 0 ? "text-white" : "text-[var(--text-primary)]"} ${lang === "mr" ? "mr" : ""}`}
                      style={{ fontFamily: "var(--font-display)" }}>
                      {lang === "en" ? p.en : p.mr}
                    </p>
                    <p className={`t-xs ${i === 0 ? "text-white/50" : "text-[var(--text-muted)]"} ${lang === "mr" ? "mr" : ""}`}>
                      {lang === "en" ? p.desc_en : p.desc_mr}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── RECOMMENDATIONS ───────────────────────────────────── */}
            <section className="mb-14">
              <p className={`t-label text-[var(--text-muted)] mb-1 ${lang === "mr" ? "mr" : ""}`}>{t("Curated for you", "तुमच्यासाठी क्युरेट केलेले", lang)}</p>
              <h2 className={`t-h2 text-[var(--text-primary)] mb-2 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                {t("Program recommendations", "प्रोग्राम शिफारशी", lang)}
              </h2>
              <p className={`t-small text-[var(--text-muted)] mb-8 max-w-lg ${lang === "mr" ? "mr" : ""}`}>
                {t(
                  "These are suggestions, not diagnoses. Add or remove programs to build a plan that fits your life.",
                  "या सूचना आहेत, निदान नाही. तुमच्या जीवनाला अनुकूल योजना तयार करण्यासाठी प्रोग्राम्स जोडा किंवा काढा.",
                  lang
                )}
              </p>

              {tiers.map(tier => {
                const tierRecs = recs.filter(r => r.tier === tier);
                if (tierRecs.length === 0) return null;
                return (
                  <div key={tier} className="mb-8">
                    <TierHeader tier={tier} lang={lang} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {tierRecs.map(rec => (
                        <RecCard
                          key={rec.programId}
                          rec={rec}
                          plan={plan}
                          lang={lang}
                          onAdd={() => addProgram(rec)}
                          onRemove={() => removeProgram(rec.programId)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </section>

            {/* ── PLAN BUILDER ──────────────────────────────────────── */}
            <section ref={builderRef} className="mb-14">
              <p className={`t-label text-[var(--text-muted)] mb-1 ${lang === "mr" ? "mr" : ""}`}>{t("Customise", "सानुकूलित करा", lang)}</p>
              <h2 className={`t-h2 text-[var(--text-primary)] mb-2 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                {t("Plan builder", "योजना बिल्डर", lang)}
              </h2>
              <p className={`t-small text-[var(--text-muted)] mb-8 max-w-lg ${lang === "mr" ? "mr" : ""}`}>
                {t("Adjust frequency, format, and mode for each program. Your plan, your pace.", "प्रत्येक प्रोग्रामसाठी वारंवारता, स्वरूप आणि माध्यम समायोजित करा.", lang)}
              </p>

              {plan.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed text-center"
                  style={{ borderColor: "var(--border-subtle)" }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{ background: "var(--bg-muted)" }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                      <path d="M10 4v12M4 10h12" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <p className={`t-small text-[var(--text-muted)] mb-2 ${lang === "mr" ? "mr" : ""}`}>
                    {t("No programs added yet", "अद्याप कोणतेही प्रोग्राम्स जोडलेले नाहीत", lang)}
                  </p>
                  <p className={`t-xs text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`}>
                    {t("Add programs from the recommendations above.", "वरील शिफारशींमधून प्रोग्राम्स जोडा.", lang)}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {plan.map(item => {
                    const rec = recs.find(r => r.programId === item.programId)!;
                    if (!rec) return null;
                    return (
                      <PlanItemCard
                        key={item.programId}
                        item={item}
                        rec={rec}
                        lang={lang}
                        onRemove={() => removeProgram(item.programId)}
                        onFreqChange={(f) => updateItem(item.programId, { freq: f })}
                        onFormatChange={(f) => updateItem(item.programId, { format: f })}
                        onModeChange={(m) => updateItem(item.programId, { mode: m })}
                      />
                    );
                  })}
                </div>
              )}

              {/* CTA for mobile users at the bottom of builder */}
              <div className="mt-8 lg:hidden">
                <button onClick={() => onBuild(plan)} disabled={plan.length === 0}
                  className={`btn btn-primary btn-xl w-full justify-center ${lang === "mr" ? "mr" : ""}`}>
                  {t("Build My Plan", "माझी योजना बनवा", lang)}
                </button>
              </div>
            </section>

            {/* ── DOCTOR NOTE ───────────────────────────────────────── */}
            <div className="flex items-start gap-4 p-6 rounded-2xl border mb-10"
              style={{ borderColor: "var(--sage-pale)", background: "var(--sage-ghost)" }}>
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=48&h=48&fit=crop" alt="Dr. Rahul" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className={`t-small font-semibold text-[var(--sage)] mb-1 ${lang === "mr" ? "mr" : ""}`}>
                  {t("A note from Dr. Rahul Sharma, MD", "डॉ. राहुल शर्मा, MD यांची नोंद", lang)}
                </p>
                <p className={`t-xs text-[var(--text-muted)] leading-relaxed ${lang === "mr" ? "mr" : ""}`}>
                  {t(
                    "These recommendations are built from your answers and reviewed against clinical best practices for your age group. Nothing here is a diagnosis. Everything can be adjusted. The most important thing is to start.",
                    "या शिफारशी तुमच्या उत्तरांमधून तयार केल्या आहेत आणि तुमच्या वयोगटासाठी क्लिनिकल सर्वोत्तम पद्धतींनुसार पुनरावलोकन केले आहेत. येथे काहीही निदान नाही. सर्व काही समायोजित केले जाऊ शकते. सर्वात महत्त्वाची गोष्ट म्हणजे सुरुवात करणे.",
                    lang
                  )}
                </p>
              </div>
            </div>

          </div>

          {/* ── Desktop sticky summary panel ── */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <SummaryPanel plan={plan} recs={recs} lang={lang} onBuild={() => onBuild(plan)} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile sticky bottom ── */}
      <div className="lg:hidden">
        <SummaryPanel plan={plan} recs={recs} lang={lang} onBuild={() => onBuild(plan)} compact />
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { programs, professionals, t, type Lang } from "./data";

interface Props {
  lang: Lang;
  onBook: (programId: string) => void;
  onAssessment: () => void;
  onBack: () => void;
}

// ─── Category config ──────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "pilates", en: "Pilates", mr: "पिलाटेस", desc_en: "Our flagship program. Clinical movement for 40+.", desc_mr: "आमचा प्रमुख कार्यक्रम. ४०+ साठी क्लिनिकल मूव्हमेंट." },
  { id: "strength", en: "Strength", mr: "ताकद", desc_en: "Progressive resistance training for muscle and metabolism.", desc_mr: "स्नायू आणि चयापचयासाठी प्रगतीशील प्रतिरोध प्रशिक्षण." },
  { id: "physio", en: "Physiotherapy", mr: "फिजिओथेरपी", desc_en: "Doctor-supervised rehab for pain and recovery.", desc_mr: "वेदना आणि पुनर्प्राप्तीसाठी डॉक्टर-देखरेख पुनर्वसन." },
  { id: "nutrition", en: "Nutrition", mr: "पोषण", desc_en: "Food as medicine. Personalised nutrition plans.", desc_mr: "अन्न औषध म्हणून. वैयक्तिकृत पोषण योजना." },
  { id: "medical", en: "Doctor", mr: "डॉक्टर", desc_en: "Internal medicine consultations focused on longevity.", desc_mr: "दीर्घायुष्यावर केंद्रित अंतर्गत औषध सल्लामसलत." },
  { id: "wellness", en: "Wellness", mr: "वेलनेस", desc_en: "Hormonal and sexual wellness. Private and confidential.", desc_mr: "हार्मोनल आणि लैंगिक वेलनेस. खाजगी आणि गोपनीय." },
  { id: "recorded", en: "Recorded", mr: "रेकॉर्डेड", desc_en: "On-demand video library. Practice on your schedule.", desc_mr: "ऑन-डिमांड व्हिडिओ लायब्ररी. तुमच्या वेळापत्रकावर सराव करा." },
];

// ─── Batch mock data ──────────────────────────────────────────────────────
const BATCHES = [
  { id: "b1", days: "Mon / Wed / Fri", time: "7:00 AM", mode: "Live Zoom", lang: "English + Marathi", seats_filled: 8, seats_total: 12, level: "Beginner", trainer_id: "priya-pilates", badge: "Popular" },
  { id: "b2", days: "Tue / Thu / Sat", time: "8:30 AM", mode: "Live Zoom", lang: "Marathi", seats_filled: 6, seats_total: 10, level: "Beginner", trainer_id: "priya-pilates", badge: "" },
  { id: "b3", days: "Mon / Wed / Fri", time: "6:30 PM", mode: "Live Zoom", lang: "English", seats_filled: 10, seats_total: 12, level: "Intermediate", trainer_id: "priya-pilates", badge: "Almost full" },
  { id: "b4", days: "Sat / Sun", time: "9:00 AM", mode: "Live Zoom", lang: "English + Marathi", seats_filled: 4, seats_total: 8, level: "All levels", trainer_id: "priya-pilates", badge: "New" },
];

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]:not(.revealed)");
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add("revealed"); io.unobserve(e.target); } }),
      { threshold: 0.06, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ─── Pilates Flagship Section ─────────────────────────────────────────────
function PilatesFlagship({ lang, onBook }: { lang: Lang; onBook: (id: string) => void }) {
  const [format, setFormat] = useState<"group" | "individual" | "recorded">("group");
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);

  const groupProg = programs.find(p => p.id === "pilates-group")!;
  const indivProg = programs.find(p => p.id === "pilates-individual")!;
  const recProg = programs.find(p => p.id === "recorded")!;

  const pilatesTrainer = professionals.find(p => p.id === "priya-pilates")!;

  return (
    <div className="rounded-3xl overflow-hidden border" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-elevated)" }}>
      {/* Hero band */}
      <div className="relative h-64 overflow-hidden" style={{ background: "var(--ink)" }}>
        <img
          src="https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=1200&h=400&fit=crop&auto=format"
          alt="Pilates"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="badge badge-sage">Flagship</span>
            <span className="badge badge-dark">Doctor Designed</span>
          </div>
          <h2 className={`text-white mb-1 ${lang === "mr" ? "mr" : ""}`}
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", letterSpacing: "-0.02em" }}>
            {t("Clinical Pilates", "क्लिनिकल पिलाटेस", lang)}
          </h2>
          <p className={`text-white/60 t-small max-w-md ${lang === "mr" ? "mr" : ""}`}>
            {t("The most effective movement practice for adults after 40. Targets joint health, core strength, and posture.", "४० नंतर प्रौढांसाठी सर्वात प्रभावी हालचाल सराव.", lang)}
          </p>
        </div>
        {/* Trainer badge */}
        <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-2 rounded-2xl"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
            <img src={pilatesTrainer.image} alt={pilatesTrainer.name_en} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="t-xs text-white font-medium">{pilatesTrainer.name_en}</p>
            <p className="text-white/50" style={{ fontSize: "0.6rem" }}>PMA Certified · 10 yrs</p>
          </div>
        </div>
      </div>

      {/* Format tabs */}
      <div className="flex border-b" style={{ borderColor: "var(--border-subtle)" }}>
        {(["group", "individual", "recorded"] as const).map(f => (
          <button key={f} onClick={() => setFormat(f)}
            className={`flex-1 py-4 t-label transition-colors capitalize ${format === f ? "text-[var(--sage)] border-b-2 border-[var(--sage)]" : "text-[var(--text-muted)]"} ${lang === "mr" ? "mr" : ""}`}>
            {f === "group" ? t("Group", "ग्रुप", lang) : f === "individual" ? t("Individual", "वैयक्तिक", lang) : t("Recorded", "रेकॉर्डेड", lang)}
          </button>
        ))}
      </div>

      {/* Group: batch list */}
      {format === "group" && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className={`t-h4 text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                {t("Choose a batch", "बॅच निवडा", lang)}
              </p>
              <p className={`t-xs text-[var(--text-muted)] mt-0.5 ${lang === "mr" ? "mr" : ""}`}>
                {t("8-week program · 3 sessions / week", "८-आठवडे कार्यक्रम · ३ सेशन्स / आठवडा", lang)}
              </p>
            </div>
            <span className="t-h4 text-[var(--text-primary)]" style={{ fontFamily: "var(--font-mono)" }}>
              ₹{groupProg.price.toLocaleString()}
            </span>
          </div>

          <div className="space-y-3">
            {BATCHES.map(b => {
              const trainer = professionals.find(p => p.id === b.trainer_id);
              const pct = (b.seats_filled / b.seats_total) * 100;
              const isSel = selectedBatch === b.id;
              const isFull = b.seats_filled >= b.seats_total;
              return (
                <div key={b.id} onClick={() => !isFull && setSelectedBatch(b.id)}
                  className={`rounded-2xl border p-4 cursor-pointer transition-all duration-200 ${isSel ? "border-[var(--sage)] bg-[var(--sage-ghost)] ring-1 ring-[var(--sage)]" : isFull ? "opacity-50 cursor-not-allowed border-[var(--border-subtle)]" : "border-[var(--border-subtle)] hover:border-[var(--border-default)]"}`}>
                  <div className="flex items-start gap-3">
                    {/* Radio */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 transition-all ${isSel ? "border-[var(--sage)] bg-[var(--sage)]" : "border-[var(--border-default)]"}`}>
                      {isSel && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="t-small font-semibold text-[var(--text-primary)]"
                          style={{ fontFamily: "var(--font-mono)" }}>
                          {b.days}
                        </span>
                        <span className="t-small font-semibold text-[var(--sage)]"
                          style={{ fontFamily: "var(--font-mono)" }}>
                          {b.time}
                        </span>
                        {b.badge && (
                          <span className={`badge ${b.badge === "Almost full" ? "badge-warn" : b.badge === "New" ? "badge-sage" : "badge-dark"}`}>
                            {b.badge}
                          </span>
                        )}
                        {isFull && <span className="badge badge-stone">Full</span>}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {[b.mode, b.lang, b.level].map(val => (
                          <span key={val} className="px-2 py-1 rounded-lg t-xs text-[var(--text-muted)]"
                            style={{ background: "var(--bg-muted)" }}>
                            {val}
                          </span>
                        ))}
                      </div>

                      {/* Seats */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="h-1.5 rounded-full" style={{ background: "var(--border-subtle)" }}>
                            <div className="h-full rounded-full transition-all"
                              style={{ width: `${pct}%`, background: pct > 75 ? "var(--warning)" : "var(--sage)" }} />
                          </div>
                        </div>
                        <span className="t-xs text-[var(--text-muted)] shrink-0" style={{ fontFamily: "var(--font-mono)" }}>
                          {b.seats_filled} / {b.seats_total} {t("seats", "जागा", lang)}
                        </span>
                      </div>

                      {/* Trainer */}
                      {trainer && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-5 h-5 rounded-full overflow-hidden shrink-0">
                            <img src={trainer.image} alt={trainer.name_en} className="w-full h-full object-cover" />
                          </div>
                          <span className="t-xs text-[var(--text-muted)]">{trainer.name_en}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => onBook("pilates-group")}
            disabled={!selectedBatch}
            className={`btn btn-primary btn-lg w-full justify-center mt-6 ${lang === "mr" ? "mr" : ""}`}>
            {t("Book Selected Batch", "निवडलेला बॅच बुक करा", lang)}
          </button>
        </div>
      )}

      {/* Individual: quick info */}
      {format === "individual" && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className={`t-h4 text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                {t("1-on-1 with Priya", "प्रियासोबत १-एक-१", lang)}
              </p>
              <p className={`t-xs text-[var(--text-muted)] mt-0.5 ${lang === "mr" ? "mr" : ""}`}>
                {t("60 min · Fully personalised · Live Zoom", "६० मिनिटे · पूर्णपणे वैयक्तिकृत · लाइव्ह झूम", lang)}
              </p>
            </div>
            <span className="t-h4 text-[var(--text-primary)]" style={{ fontFamily: "var(--font-mono)" }}>
              ₹{indivProg.price.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { en: "Fully tailored to you", mr: "पूर्णपणे तुमच्यासाठी" },
              { en: "Initial assessment included", mr: "प्रारंभिक मूल्यांकन समाविष्ट" },
              { en: "Flexible scheduling", mr: "लवचिक वेळापत्रक" },
              { en: "Progress tracking", mr: "प्रगती ट्रॅकिंग" },
            ].map(f => (
              <div key={f.en} className="flex items-start gap-2 p-3 rounded-xl" style={{ background: "var(--bg-muted)" }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--sage)" strokeWidth="2" className="shrink-0 mt-0.5"><path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className={`t-xs text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? f.en : f.mr}</span>
              </div>
            ))}
          </div>

          <button onClick={() => onBook("pilates-individual")} className={`btn btn-primary btn-lg w-full justify-center ${lang === "mr" ? "mr" : ""}`}>
            {t("Choose Date & Time", "तारीख आणि वेळ निवडा", lang)}
          </button>
        </div>
      )}

      {/* Recorded: preview */}
      {format === "recorded" && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className={`t-h4 text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                {t("Video library", "व्हिडिओ लायब्ररी", lang)}
              </p>
              <p className={`t-xs text-[var(--text-muted)] mt-0.5 ${lang === "mr" ? "mr" : ""}`}>
                {t("80+ videos · Lifetime access · All levels", "८०+ व्हिडिओ · आजीवन प्रवेश · सर्व स्तर", lang)}
              </p>
            </div>
            <span className="t-h4 text-[var(--text-primary)]" style={{ fontFamily: "var(--font-mono)" }}>
              ₹{recProg.price.toLocaleString()}
            </span>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mb-5">
            {["Mobility", "Back & Neck", "Strength", "Recovery", "Beginners", "Advanced"].map(c => (
              <span key={c} className="px-3 py-1.5 rounded-full t-xs font-medium text-[var(--text-muted)]"
                style={{ background: "var(--bg-muted)", border: "1px solid var(--border-subtle)" }}>
                {c}
              </span>
            ))}
          </div>

          {/* Preview thumbnails */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[
              { thumb: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=120&fit=crop", dur: "18 min", title: "Morning Mobility" },
              { thumb: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=200&h=120&fit=crop", dur: "25 min", title: "Core Foundation" },
              { thumb: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=200&h=120&fit=crop", dur: "12 min", title: "Back Relief" },
            ].map(v => (
              <div key={v.title} className="relative rounded-xl overflow-hidden group">
                <img src={v.thumb} alt={v.title} className="w-full h-20 object-cover" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <span className="text-white text-xs ml-0.5">▶</span>
                  </div>
                </div>
                <div className="absolute bottom-1 left-1 right-1">
                  <span className="t-xs text-white/80 block truncate" style={{ fontSize: "0.6rem" }}>{v.dur}</span>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => onBook("recorded")} className={`btn btn-primary btn-lg w-full justify-center ${lang === "mr" ? "mr" : ""}`}>
            {t("Browse Full Library →", "संपूर्ण लायब्ररी पाहा →", lang)}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Standard program card ────────────────────────────────────────────────
function ProgramCard({ prog, lang, onBook }: { prog: typeof programs[0]; lang: Lang; onBook: () => void }) {
  const expert = professionals.find(p => {
    if (prog.category === "pilates" || prog.id === "recorded") return p.id === "priya-pilates";
    if (prog.category === "physio") return p.id === "amit-physio";
    if (prog.category === "nutrition") return p.id === "sneha-nutrition";
    return p.id === "dr-sharma";
  });

  const chips: string[] = [];
  if (prog.duration_en) chips.push(prog.duration_en);
  if (prog.level_en) chips.push(prog.level_en);

  return (
    <div className="card group flex flex-col" data-reveal>
      <div className="relative h-48 overflow-hidden" style={{ background: "var(--bg-muted)", borderRadius: "0.75rem 0.75rem 0 0" }}>
        <img src={prog.image} alt={prog.title_en} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {prog.badge_en && (
          <span className="absolute top-3 left-3 badge badge-dark">{lang === "en" ? prog.badge_en : prog.badge_mr}</span>
        )}
        {expert && (
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full overflow-hidden border border-white/30">
              <img src={expert.image} alt={expert.name_en} className="w-full h-full object-cover" />
            </div>
            <span className="t-xs text-white/80">{expert.name_en}</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {chips.map(c => (
            <span key={c} className="px-2 py-1 rounded-lg t-xs text-[var(--text-muted)]"
              style={{ background: "var(--bg-muted)" }}>
              {c}
            </span>
          ))}
        </div>

        <h3 className={`t-h4 text-[var(--text-primary)] mb-2 flex-1 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
          {lang === "en" ? prog.title_en : prog.title_mr}
        </h3>
        <p className={`t-xs text-[var(--text-muted)] mb-4 leading-relaxed ${lang === "mr" ? "mr" : ""}`}>
          {lang === "en" ? prog.desc_en : prog.desc_mr}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <p className="t-xs text-[var(--text-muted)]">{t("from", "पासून", lang)}</p>
            <p className="text-[var(--text-primary)] font-semibold text-lg" style={{ fontFamily: "var(--font-mono)" }}>
              ₹{prog.price.toLocaleString()}
            </p>
          </div>
          <button onClick={onBook} className={`btn btn-sm btn-primary ${lang === "mr" ? "mr" : ""}`}>
            {t("Book", "बुक करा", lang)}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════
export default function ProgramsPage({ lang, onBook, onAssessment, onBack }: Props) {
  useScrollReveal();
  const [activeSection, setActiveSection] = useState("pilates");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  };

  const nonPilates = programs.filter(p => p.category !== "pilates" && p.id !== "pilates-individual" && p.id !== "pilates-group");

  const groupedByCategory: Record<string, typeof programs> = {};
  nonPilates.forEach(p => {
    const cat = p.category;
    if (!groupedByCategory[cat]) groupedByCategory[cat] = [];
    groupedByCategory[cat].push(p);
  });

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", fontFamily: "var(--font-body)" }} className="pt-[68px]">

      {/* ── Hero ── */}
      <div style={{ background: "var(--ink)" }} className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400&h=400&fit=crop&auto=format"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
          <p className={`t-label text-[var(--sage-light)] mb-4 anim-fade-in ${lang === "mr" ? "mr" : ""}`}>
            {t("All Programs", "सर्व प्रोग्राम्स", lang)}
          </p>
          <h1 className={`text-white mb-4 anim-fade-up delay-100 ${lang === "mr" ? "mr" : ""}`}
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.25rem)", letterSpacing: "-0.02em", lineHeight: 1.1, maxWidth: 560 }}>
            {t("Built for your body after 40.", "४० नंतर तुमच्या शरीरासाठी बनवलेले.", lang)}
          </h1>
          <p className={`text-white/50 t-body max-w-md mb-8 anim-fade-up delay-200 ${lang === "mr" ? "mr" : ""}`}>
            {t("Doctor-designed. Expert-led. Every program is built around where you are today.", "डॉक्टर-डिझाइन. तज्ञ-नेतृत्व. प्रत्येक प्रोग्राम तुम्ही आज कुठे आहात त्यावर आधारित.", lang)}
          </p>
          <button onClick={onAssessment} className={`btn btn-white btn-lg anim-fade-up delay-300 ${lang === "mr" ? "mr" : ""}`}>
            {t("Take Free Assessment First →", "प्रथम मोफत मूल्यांकन घ्या →", lang)}
          </button>
        </div>
      </div>

      {/* ── Category nav ── */}
      <div className="sticky top-[68px] z-20 bg-[var(--bg-primary)] border-b" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-scroll py-0 flex gap-0">
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => scrollTo(c.id)}
                className={`shrink-0 flex items-center gap-2 px-4 py-4 border-b-2 t-label transition-all ${activeSection === c.id ? "border-[var(--sage)] text-[var(--sage)]" : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"} ${lang === "mr" ? "mr" : ""}`}>
                <span>{lang === "en" ? c.en : c.mr}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-20">

        {/* ── PILATES FLAGSHIP ── */}
        <section ref={el => { sectionRefs.current["pilates"] = el; }} data-reveal>
          <div className="flex items-end gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="badge badge-sage">Flagship</span>
              </div>
              <h2 className={`t-h2 text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                {t("Pilates", "पिलाटेस", lang)}
              </h2>
              <p className={`t-small text-[var(--text-muted)] max-w-lg mt-1 ${lang === "mr" ? "mr" : ""}`}>
                {t("Our flagship program. Clinical movement therapy for joint health, core strength, and posture — designed for the 40+ body.", "आमचा प्रमुख कार्यक्रम. ४०+ शरीरासाठी.", lang)}
              </p>
            </div>
          </div>
          <PilatesFlagship lang={lang} onBook={onBook} />
        </section>

        {/* ── OTHER CATEGORIES ── */}
        {CATEGORIES.filter(c => c.id !== "pilates").map(cat => {
          const catProgs = programs.filter(p => {
            if (cat.id === "recorded") return p.category === "recorded" || p.id === "recorded";
            if (cat.id === "wellness") return p.category === "wellness";
            if (cat.id === "physio") return p.category === "physio";
            if (cat.id === "nutrition") return p.category === "nutrition";
            if (cat.id === "medical") return p.category === "medical";
            if (cat.id === "strength") return p.category === "strength";
            return p.category === cat.id;
          });

          if (catProgs.length === 0) return null;

          return (
            <section key={cat.id} ref={el => { sectionRefs.current[cat.id] = el; }}>
              <div className="flex items-end gap-3 mb-6">
                <div>
                  <h2 className={`t-h2 text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                    {lang === "en" ? cat.en : cat.mr}
                  </h2>
                  <p className={`t-small text-[var(--text-muted)] mt-0.5 ${lang === "mr" ? "mr" : ""}`}>
                    {lang === "en" ? cat.desc_en : cat.desc_mr}
                  </p>
                </div>
              </div>

              {cat.id === "wellness" && (
                <div className="p-4 rounded-2xl border mb-4 flex items-center gap-3"
                  style={{ borderColor: "var(--sage-pale)", background: "var(--sage-ghost)" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--sage)" strokeWidth="1.5" className="shrink-0"><rect x="3" y="7" width="10" height="8" rx="1.5"/><path d="M5 7V5a3 3 0 116 0v2"/></svg>
                  <p className={`t-xs text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`}>
                    {t("All wellness consultations are private, confidential, and never shared with third parties.", "सर्व वेलनेस सल्लामसलत खाजगी, गोपनीय आहेत आणि कधीही तृतीय पक्षांसोबत सामायिक केल्या जात नाहीत.", lang)}
                  </p>
                </div>
              )}

              <div className={`grid gap-5 ${catProgs.length === 1 ? "grid-cols-1 max-w-sm" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
                {catProgs.map(p => (
                  <ProgramCard key={p.id} prog={p} lang={lang} onBook={() => onBook(p.id)} />
                ))}
              </div>
            </section>
          );
        })}

        {/* ── CTA band ── */}
        <div className="rounded-3xl overflow-hidden relative" data-reveal>
          <img
            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&h=300&fit=crop&auto=format"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          <div className="relative p-12 text-center" style={{ background: "var(--ink)" }}>
            <p className={`t-label text-[var(--sage-light)] mb-3 ${lang === "mr" ? "mr" : ""}`}>
              {t("Not sure where to start?", "कुठे सुरू करायचे ते माहीत नाही?", lang)}
            </p>
            <h3 className={`text-white mb-4 ${lang === "mr" ? "mr" : ""}`}
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
              {t("Take our free health assessment.", "आमचे मोफत आरोग्य मूल्यांकन घ्या.", lang)}
            </h3>
            <p className={`text-white/50 t-small mb-6 ${lang === "mr" ? "mr" : ""}`}>
              {t("A 5-minute quiz. A personalised plan. Reviewed by our doctor.", "५ मिनिटांची प्रश्नावली. वैयक्तिकृत योजना. डॉक्टरांनी पुनरावलोकन केली.", lang)}
            </p>
            <button onClick={onAssessment} className={`btn btn-white btn-lg ${lang === "mr" ? "mr" : ""}`}>
              {t("Start Free Assessment →", "मोफत मूल्यांकन सुरू करा →", lang)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

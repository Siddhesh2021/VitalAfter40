import { useState, useEffect } from "react";
import { Lang, t, assessmentQuestions, programs } from "./data";

interface Props {
  lang: Lang;
  setLang: (l: Lang) => void;
  onBack: () => void;
  onComplete: (cart: string[]) => void;
}

type Answers = Record<string, string | string[]>;

function isConditionMet(q: any, answers: Answers): boolean {
  if (!q.condition) return true;
  const { id, value, includesAny } = q.condition;
  if (value) return answers[id] === value;
  if (includesAny) {
    const ans = answers[id];
    if (Array.isArray(ans)) return includesAny.some((v: string) => ans.includes(v));
    return includesAny.includes(ans);
  }
  return true;
}

type Phase = "intro" | "questions" | "processing" | "results" | "plan";

export default function AssessmentFlow({ lang, setLang, onBack, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<Answers>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [processingStep, setProcessingStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<string[]>([]);

  const visibleQuestions = assessmentQuestions.filter((q) => isConditionMet(q, answers));
  const current = visibleQuestions[currentIdx];
  const progress = ((currentIdx) / visibleQuestions.length) * 100;

  const handleAnswer = (qId: string, value: string, isMulti = false) => {
    if (isMulti) {
      const prev = (answers[qId] as string[]) ?? [];
      const next = prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value];
      setAnswers({ ...answers, [qId]: next });
    } else {
      setAnswers({ ...answers, [qId]: value });
    }
  };

  const handleNext = () => {
    if (currentIdx < visibleQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setPhase("processing");
      simulateProcessing();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
    else setPhase("intro");
  };

  const simulateProcessing = () => {
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setProcessingStep(step);
      if (step >= 5) {
        clearInterval(interval);
        setTimeout(() => setPhase("results"), 600);
      }
    }, 700);
  };

  const getRecommendations = () => {
    const goals = (answers.goals as string[]) ?? [];
    const hasPain = answers.pain_yn === "yes";
    const recs = [];

    if (goals.includes("flexibility") || goals.includes("posture") || goals.includes("fit40") || hasPain) {
      recs.push({ id: "pilates-group", priority_en: "High Priority", priority_mr: "उच्च प्राधान्य", reason_en: "Based on your mobility and posture goals", reason_mr: "तुमच्या गतिशीलता आणि पवित्रा उद्दिष्टांवर आधारित" });
    }
    if (goals.includes("muscle") || goals.includes("weight")) {
      recs.push({ id: "strength", priority_en: "High Priority", priority_mr: "उच्च प्राधान्य", reason_en: "Based on your strength and weight goals", reason_mr: "तुमच्या ताकद आणि वजन उद्दिष्टांवर आधारित" });
    }
    if (goals.includes("nutrition") || goals.includes("weight")) {
      recs.push({ id: "nutrition", priority_en: "Recommended", priority_mr: "शिफारस केलेले", reason_en: "Supports your weight and energy goals", reason_mr: "तुमच्या वजन आणि ऊर्जा उद्दिष्टांना समर्थन देते" });
    }
    if (hasPain) {
      recs.push({ id: "physio", priority_en: "Recommended", priority_mr: "शिफारस केलेले", reason_en: "May help address the pain you mentioned", reason_mr: "तुम्ही उल्लेख केलेल्या वेदनांना मदत करू शकते" });
    }
    if (goals.includes("hormonal") || answers.hormonal_interest === "yes") {
      recs.push({ id: "hormonal", priority_en: "Consider", priority_mr: "विचार करा", reason_en: "Based on your interest in hormonal wellness", reason_mr: "हार्मोनल वेलनेसमधील तुमच्या स्वारस्यावर आधारित" });
    }
    recs.push({ id: "doctor", priority_en: "Consider", priority_mr: "विचार करा", reason_en: "A consultation helps build a complete picture", reason_mr: "सल्लामसलत संपूर्ण चित्र तयार करण्यास मदत करते" });

    if (recs.length === 0) {
      recs.push({ id: "pilates-group", priority_en: "Recommended", priority_mr: "शिफारस केलेले", reason_en: "A great starting point for overall wellness", reason_mr: "एकूण वेलनेससाठी एक उत्तम प्रारंभ बिंदू" });
    }
    return recs;
  };

  const togglePlan = (id: string) => {
    setSelectedPlan((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const totalPrice = selectedPlan.reduce((sum, id) => {
    const p = programs.find((pr) => pr.id === id);
    return sum + (p?.price ?? 0);
  }, 0);

  if (phase === "intro") return <AssessmentIntro lang={lang} setLang={setLang} onBack={onBack} onStart={() => setPhase("questions")} />;
  if (phase === "processing") return <ProcessingScreen lang={lang} step={processingStep} />;
  if (phase === "results") return (
    <ResultsScreen lang={lang} answers={answers} recs={getRecommendations()}
      onBuildPlan={() => { setSelectedPlan(getRecommendations().map((r) => r.id)); setPhase("plan"); }} />
  );
  if (phase === "plan") return (
    <BuildPlan lang={lang} recs={getRecommendations()} selected={selectedPlan} toggle={togglePlan}
      total={totalPrice} onCheckout={() => onComplete(selectedPlan)} onBack={() => setPhase("results")} />
  );

  if (!current) return null;

  const canNext = (() => {
    if (!current.required) return true;
    const ans = answers[current.id];
    if (current.type === "multiselect") return Array.isArray(ans) && ans.length > 0;
    return !!ans;
  })();

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col" style={{ fontFamily: "var(--font-body)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-white border-b border-[#1c1c1c]/8">
        <button onClick={handlePrev} className="flex items-center gap-2 text-sm text-[#1c1c1c]/60 hover:text-[#1c1c1c] transition-colors">
          ← {t("Back", "मागे", lang)}
        </button>
        <div className="flex flex-col items-center gap-1 flex-1 mx-4">
          <div className="w-full max-w-xs bg-[#d4dbc9] rounded-full h-1.5">
            <div className="bg-[#6b7c5c] h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs text-[#1c1c1c]/40" style={{ fontFamily: "var(--font-mono)" }}>{Math.round(progress)}% {t("complete", "पूर्ण", lang)}</span>
        </div>
        <button onClick={onBack} className="text-sm text-[#1c1c1c]/40 hover:text-[#1c1c1c] transition-colors">
          {t("Exit", "बाहेर", lang)}
        </button>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl animate-fade-in-up" key={currentIdx}>
          {/* Section label */}
          <p className="text-[#6b7c5c] text-xs tracking-widest uppercase mb-6 text-center" style={{ fontFamily: "var(--font-mono)" }}>
            {t(`Section ${current.section} — `, `विभाग ${current.section} — `, lang)}
            {t(current.section_en, current.section_mr, lang)}
          </p>

          <h2 className="text-2xl sm:text-3xl font-semibold text-[#1c1c1c] mb-8 text-center leading-snug" style={{ fontFamily: "var(--font-display)", ...(lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}) }}>
            {t(current.q_en, current.q_mr, lang)}
          </h2>

          {/* Text / Number input */}
          {(current.type === "text" || current.type === "number") && (
            <input
              type={current.type === "number" ? "number" : "text"}
              placeholder={t((current as any).placeholder_en ?? "", (current as any).placeholder_mr ?? "", lang)}
              value={(answers[current.id] as string) ?? ""}
              onChange={(e) => setAnswers({ ...answers, [current.id]: e.target.value })}
              className="w-full border-2 border-[#1c1c1c]/15 rounded-2xl px-5 py-4 text-lg outline-none focus:border-[#6b7c5c] transition-all bg-white text-[#1c1c1c]"
              style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}
            />
          )}

          {/* Single choice */}
          {current.type === "choice" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(current as any).options?.map((opt: any) => {
                const selected = answers[current.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => { handleAnswer(current.id, opt.id); setTimeout(handleNext, 220); }}
                    className={`answer-card flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${selected ? "border-[#6b7c5c] bg-[#6b7c5c]/8" : "border-[#1c1c1c]/12 bg-white hover:border-[#6b7c5c]/40"}`}
                  >
                    <span className="text-2xl flex-shrink-0">{opt.icon}</span>
                    <span className="font-medium text-[#1c1c1c]" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>
                      {t(opt.label_en, opt.label_mr, lang)}
                    </span>
                    {selected && <span className="ml-auto text-[#6b7c5c]">✓</span>}
                  </button>
                );
              })}
            </div>
          )}

          {/* Multi select */}
          {current.type === "multiselect" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(current as any).options?.map((opt: any) => {
                const selected = ((answers[current.id] as string[]) ?? []).includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleAnswer(current.id, opt.id, true)}
                    className={`answer-card flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${selected ? "border-[#6b7c5c] bg-[#6b7c5c]/8" : "border-[#1c1c1c]/12 bg-white hover:border-[#6b7c5c]/40"}`}
                  >
                    <span className="text-2xl flex-shrink-0">{opt.icon}</span>
                    <span className="font-medium text-[#1c1c1c] flex-1" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>
                      {t(opt.label_en, opt.label_mr, lang)}
                    </span>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${selected ? "bg-[#6b7c5c] border-[#6b7c5c]" : "border-[#1c1c1c]/20"}`}>
                      {selected && <span className="text-white text-xs">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Next button for text/multiselect */}
          {(current.type !== "choice") && (
            <button
              onClick={handleNext}
              disabled={!canNext}
              className={`mt-8 w-full py-4 rounded-full font-semibold text-base transition-all ${canNext ? "bg-[#6b7c5c] hover:bg-[#5a6b4b] text-white" : "bg-[#d4dbc9] text-[#1c1c1c]/40 cursor-not-allowed"}`}
            >
              {currentIdx < visibleQuestions.length - 1 ? t("Continue →", "पुढे →", lang) : t("See My Results →", "माझे निकाल पाहा →", lang)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function AssessmentIntro({ lang, setLang, onBack, onStart }: { lang: Lang; setLang: (l: Lang) => void; onBack: () => void; onStart: () => void }) {
  return (
    <div className="min-h-screen bg-[#1c1c1c] flex flex-col" style={{ fontFamily: "var(--font-body)" }}>
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <button onClick={onBack} className="text-white/50 hover:text-white text-sm flex items-center gap-1 transition-colors">
          ← {t("Back to site", "साइटवर परत", lang)}
        </button>
        <button onClick={() => setLang(lang === "en" ? "mr" : "en")} className="text-xs border border-white/20 rounded-full px-3 py-1.5 text-white/60 hover:text-white hover:border-white/40 transition-all" style={{ fontFamily: "var(--font-mono)" }}>
          {lang === "en" ? "मराठी" : "EN"}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-16 h-16 bg-[#6b7c5c] rounded-full flex items-center justify-center mb-8">
          <span className="text-3xl">🩺</span>
        </div>
        <p className="text-[#8fa07a] text-sm tracking-widest uppercase mb-4" style={{ fontFamily: "var(--font-mono)" }}>
          {t("Health Assessment", "आरोग्य मूल्यांकन", lang)}
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold text-white mb-6 max-w-xl" style={{ fontFamily: "var(--font-display)" }}>
          {t("Let's understand your body and goals.", "चला तुमचे शरीर आणि उद्दिष्टे समजून घेऊ.", lang)}
        </h1>
        <p className="text-white/60 text-lg mb-12 max-w-md" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>
          {t("Answer a few questions and we'll build a personalised wellness plan. This is not a medical diagnosis.", "काही प्रश्नांची उत्तरे द्या आणि आम्ही वैयक्तिकृत वेलनेस योजना तयार करू. हे वैद्यकीय निदान नाही.", lang)}
        </p>

        <div className="grid grid-cols-3 gap-6 mb-12 max-w-sm w-full">
          {[
            { icon: "⏱", l_en: "3–5 min", l_mr: "३–५ मिनिट" },
            { icon: "🔒", l_en: "Private", l_mr: "खाजगी" },
            { icon: "🎯", l_en: "Personalised", l_mr: "वैयक्तिकृत" },
          ].map((f) => (
            <div key={f.l_en} className="flex flex-col items-center gap-2 text-white/60">
              <span className="text-2xl">{f.icon}</span>
              <span className="text-xs" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{t(f.l_en, f.l_mr, lang)}</span>
            </div>
          ))}
        </div>

        <button onClick={onStart} className="bg-[#6b7c5c] hover:bg-[#5a6b4b] text-white font-semibold px-10 py-4 rounded-full text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
          {t("Begin Assessment →", "मूल्यांकन सुरू करा →", lang)}
        </button>

        <p className="text-white/30 text-xs mt-6 max-w-sm" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>
          {t("This assessment does not provide medical diagnoses. Always consult a qualified doctor for medical advice.", "हे मूल्यांकन वैद्यकीय निदान प्रदान करत नाही. वैद्यकीय सल्ल्यासाठी नेहमी पात्र डॉक्टरांशी सल्लामसलत करा.", lang)}
        </p>
      </div>
    </div>
  );
}

function ProcessingScreen({ lang, step }: { lang: Lang; step: number }) {
  const steps = [
    { l_en: "Reviewing your goals", l_mr: "तुमची उद्दिष्टे तपासत आहे" },
    { l_en: "Understanding your lifestyle", l_mr: "तुमची जीवनशैली समजून घेत आहे" },
    { l_en: "Mapping your fitness needs", l_mr: "तुमच्या फिटनेस गरजा मॅप करत आहे" },
    { l_en: "Matching you with the right experts", l_mr: "तुम्हाला योग्य तज्ञांशी जोडत आहे" },
    { l_en: "Building your recommendations", l_mr: "तुमच्या शिफारसी तयार करत आहे" },
  ];

  return (
    <div className="min-h-screen bg-[#1c1c1c] flex flex-col items-center justify-center px-4" style={{ fontFamily: "var(--font-body)" }}>
      <div className="w-16 h-16 border-4 border-[#6b7c5c]/30 border-t-[#6b7c5c] rounded-full animate-spin-slow mb-10" />
      <h2 className="text-3xl font-semibold text-white mb-3 text-center" style={{ fontFamily: "var(--font-display)" }}>
        {t("Building your personalised wellness plan...", "तुमची वैयक्तिकृत वेलनेस योजना तयार करत आहे...", lang)}
      </h2>
      <p className="text-white/50 mb-12 text-center" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>
        {t("This will just take a moment.", "हे फक्त एक क्षण लागेल.", lang)}
      </p>
      <div className="space-y-4 w-full max-w-sm">
        {steps.map((s, i) => (
          <div key={i} className={`flex items-center gap-3 transition-all duration-500 ${i < step ? "opacity-100" : "opacity-20"}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${i < step ? "bg-[#6b7c5c]" : "border-2 border-white/20"}`}>
              {i < step && <span className="text-white text-xs">✓</span>}
            </div>
            <span className={`text-sm ${i < step ? "text-white" : "text-white/40"}`} style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>
              {t(s.l_en, s.l_mr, lang)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultsScreen({ lang, answers, recs, onBuildPlan }: { lang: Lang; answers: Answers; recs: any[]; onBuildPlan: () => void }) {
  const name = (answers.name as string) || t("there", "मित्र", lang);

  return (
    <div className="min-h-screen bg-[#faf8f5]" style={{ fontFamily: "var(--font-body)" }}>
      {/* Header */}
      <div className="bg-[#6b7c5c] px-4 sm:px-6 py-10 text-center">
        <p className="text-[#8fa07a] text-xs tracking-widest uppercase mb-3" style={{ fontFamily: "var(--font-mono)" }}>
          {t("Your Results", "तुमचे निकाल", lang)}
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold text-white mb-3" style={{ fontFamily: "var(--font-display)" }}>
          {t(`Hi ${name}! Here's your personalised 40+ wellness plan.`, `नमस्ते ${name}! येथे तुमची वैयक्तिकृत ४०+ वेलनेस योजना आहे.`, lang)}
        </h1>
        <p className="text-white/75 text-sm" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>
          {t("Based on your answers, here's where we'd recommend starting.", "तुमच्या उत्तरांवर आधारित, येथे आम्ही सुरुवात करण्याची शिफारस करतो.", lang)}
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Medical disclaimer */}
        <div className="bg-[#ede9e2] border border-[#d4dbc9] rounded-2xl p-4 mb-8 flex gap-3">
          <span className="text-lg">ℹ️</span>
          <p className="text-[#1c1c1c]/60 text-xs leading-relaxed" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>
            {t("These are personalised suggestions based on your answers — not medical diagnoses. Please consult a doctor for medical advice.", "या तुमच्या उत्तरांवर आधारित वैयक्तिकृत सूचना आहेत — वैद्यकीय निदान नाही. वैद्यकीय सल्ल्यासाठी डॉक्टरांशी सल्लामसलत करा.", lang)}
          </p>
        </div>

        {/* Recommendation cards */}
        <div className="space-y-4 mb-10">
          {recs.map((rec, i) => {
            const prog = programs.find((p) => p.id === rec.id);
            if (!prog) return null;
            const priorityColor = rec.priority_en === "High Priority" ? "bg-[#c4622d]/10 text-[#c4622d] border-[#c4622d]/20" : rec.priority_en === "Recommended" ? "bg-[#6b7c5c]/10 text-[#6b7c5c] border-[#6b7c5c]/20" : "bg-[#1c1c1c]/5 text-[#1c1c1c]/60 border-[#1c1c1c]/10";
            return (
              <div key={rec.id} className="bg-white border border-[#1c1c1c]/8 rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s`, opacity: 0, animation: `fadeInUp 0.5s ease ${i * 0.1}s forwards` }}>
                <div className="flex gap-4 p-5">
                  <div className="w-16 h-16 rounded-xl bg-[#d4dbc9] flex-shrink-0 overflow-hidden">
                    <img src={prog.image} alt={prog.title_en} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-[#1c1c1c]" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>
                        {t(prog.title_en, prog.title_mr, lang)}
                      </h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${priorityColor}`} style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>
                        {t(rec.priority_en, rec.priority_mr, lang)}
                      </span>
                    </div>
                    <p className="text-[#1c1c1c]/50 text-xs mb-2 leading-relaxed" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>
                      {t(rec.reason_en, rec.reason_mr, lang)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#1c1c1c]/40 text-xs" style={{ fontFamily: "var(--font-mono)" }}>{t(prog.duration_en, prog.duration_mr, lang)}</span>
                      <span className="text-[#6b7c5c] font-semibold text-sm" style={{ fontFamily: "var(--font-mono)" }}>₹{prog.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={onBuildPlan} className="w-full bg-[#6b7c5c] hover:bg-[#5a6b4b] text-white font-semibold py-4 rounded-full text-base transition-all shadow-md">
          {t("Build My Plan →", "माझी योजना तयार करा →", lang)}
        </button>
        <p className="text-center text-[#1c1c1c]/40 text-xs mt-4" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>
          {t("Select the programs you'd like to start with", "तुम्हाला कोणते प्रोग्राम्स सुरू करायचे आहेत ते निवडा", lang)}
        </p>
      </div>
    </div>
  );
}

function BuildPlan({ lang, recs, selected, toggle, total, onCheckout, onBack }: {
  lang: Lang; recs: any[]; selected: string[]; toggle: (id: string) => void;
  total: number; onCheckout: () => void; onBack: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#faf8f5]" style={{ fontFamily: "var(--font-body)" }}>
      <div className="bg-white border-b border-[#1c1c1c]/8 px-4 sm:px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="text-[#1c1c1c]/50 hover:text-[#1c1c1c] text-sm transition-colors">← {t("Back", "मागे", lang)}</button>
        <h2 className="font-semibold text-[#1c1c1c]" style={{ fontFamily: "var(--font-display)" }}>
          {t("Build Your Plan", "तुमची योजना तयार करा", lang)}
        </h2>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <p className="text-[#1c1c1c]/60 mb-8 text-sm" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>
          {t("Select the programs you'd like to start with. You can always add more later.", "तुम्हाला कोणते प्रोग्राम्स सुरू करायचे आहेत ते निवडा. तुम्ही नंतर कधीही अधिक जोडू शकता.", lang)}
        </p>

        <div className="space-y-3 mb-8">
          {recs.map((rec) => {
            const prog = programs.find((p) => p.id === rec.id);
            if (!prog) return null;
            const isSelected = selected.includes(rec.id);
            return (
              <button key={rec.id} onClick={() => toggle(rec.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${isSelected ? "border-[#6b7c5c] bg-[#6b7c5c]/5" : "border-[#1c1c1c]/10 bg-white hover:border-[#6b7c5c]/30"}`}>
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-[#6b7c5c] border-[#6b7c5c]" : "border-[#1c1c1c]/20"}`}>
                  {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                </div>
                <span className="text-2xl">{prog.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1c1c1c] text-sm" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{t(prog.title_en, prog.title_mr, lang)}</p>
                  <p className="text-[#1c1c1c]/50 text-xs" style={{ fontFamily: "var(--font-mono)" }}>{t(prog.duration_en, prog.duration_mr, lang)}</p>
                </div>
                <span className="text-[#1c1c1c] font-semibold text-sm flex-shrink-0" style={{ fontFamily: "var(--font-mono)" }}>₹{prog.price.toLocaleString()}</span>
              </button>
            );
          })}
        </div>

        {/* Total & CTA */}
        <div className="bg-white border border-[#1c1c1c]/8 rounded-2xl p-5">
          <div className="flex justify-between mb-4">
            <span className="text-[#1c1c1c]/60" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{t("Selected programs", "निवडलेले प्रोग्राम्स", lang)}: {selected.length}</span>
            <div className="text-right">
              <p className="text-[#1c1c1c]/40 text-xs" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{t("Total", "एकूण", lang)}</p>
              <p className="font-bold text-[#1c1c1c] text-xl" style={{ fontFamily: "var(--font-mono)" }}>₹{total.toLocaleString()}</p>
            </div>
          </div>
          <button
            onClick={onCheckout}
            disabled={selected.length === 0}
            className={`w-full py-4 rounded-full font-semibold text-base transition-all ${selected.length > 0 ? "bg-[#6b7c5c] hover:bg-[#5a6b4b] text-white" : "bg-[#d4dbc9] text-[#1c1c1c]/40 cursor-not-allowed"}`}
          >
            {t("Continue to Checkout →", "चेकआउटवर जा →", lang)}
          </button>
        </div>
      </div>
    </div>
  );
}

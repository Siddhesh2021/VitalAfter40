import { useState, useEffect, useRef } from "react";
import { Lang, t, assessmentQuestions, programs } from "./data";

interface Props {
  lang: Lang;
  setLang: (l: Lang) => void;
  onBack: () => void;
  onComplete: (cart: string[]) => void;
}

type Answers = Record<string, string | string[]>;
type Phase = "intro" | "questions" | "processing" | "results" | "plan";

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

// ─── Main orchestrator ─────────────────────────────────────────────────
export default function AssessmentFlow({ lang, setLang, onBack, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<Answers>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
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
    setDirection("forward");
    if (currentIdx < visibleQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setPhase("processing");
      simulateProcessing();
    }
  };

  const handlePrev = () => {
    setDirection("back");
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
    else setPhase("intro");
  };

  const simulateProcessing = () => {
    let step = 0;
    const iv = setInterval(() => {
      step++;
      setProcessingStep(step);
      if (step >= 5) {
        clearInterval(iv);
        setTimeout(() => setPhase("results"), 700);
      }
    }, 900);
  };

  const getRecommendations = () => {
    const goals = (answers.goals as string[]) ?? [];
    const hasPain = answers.pain_yn === "yes";
    const recs: any[] = [];

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
    recs.push({ id: "doctor", priority_en: "Consider", priority_mr: "विचार करा", reason_en: "A consultation helps establish your baseline health markers", reason_mr: "सल्लामसलत बेसलाइन आरोग्य मार्कर स्थापित करण्यास मदत करते" });

    if (recs.length < 2) {
      recs.unshift({ id: "pilates-group", priority_en: "Recommended", priority_mr: "शिफारस केलेले", reason_en: "A great starting point for overall wellness after 40", reason_mr: "४० नंतर एकूण वेलनेससाठी एक उत्तम प्रारंभ बिंदू" });
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

  const canNext = (() => {
    if (!current) return false;
    if (!current.required) return true;
    const ans = answers[current.id];
    if (current.type === "multiselect") return Array.isArray(ans) && ans.length > 0;
    return !!ans;
  })();

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

  return (
    <QuestionScreen
      key={currentIdx}
      current={current}
      currentIdx={currentIdx}
      total={visibleQuestions.length}
      progress={progress}
      answers={answers}
      direction={direction}
      lang={lang}
      setLang={setLang}
      canNext={canNext}
      onAnswer={handleAnswer}
      onNext={handleNext}
      onPrev={handlePrev}
      onExit={onBack}
    />
  );
}

// ─── Intro screen ──────────────────────────────────────────────────────
function AssessmentIntro({ lang, setLang, onBack, onStart }: { lang: Lang; setLang: (l: Lang) => void; onBack: () => void; onStart: () => void }) {
  return (
    <div className="min-h-screen bg-[var(--ink)] flex flex-col" style={{ fontFamily: "var(--font-body)" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 sm:px-8 py-5">
        <button onClick={onBack} className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 12L6 8l4-4"/></svg>
          {t("Back", "मागे", lang)}
        </button>
        <div className="lang-toggle">
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
          <button className={`mr ${lang === "mr" ? "active" : ""}`} onClick={() => setLang("mr")}>मराठी</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-12 text-center max-w-xl mx-auto w-full">
        {/* Icon */}
        <div className="relative mb-10 anim-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-[var(--sage)] flex items-center justify-center mx-auto">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="white" strokeWidth="1.5">
              <path d="M18 4v8M18 24v8M4 18h8M24 18h8" strokeLinecap="round"/>
              <circle cx="18" cy="18" r="6"/>
            </svg>
          </div>
          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-2xl bg-[var(--sage)] opacity-20 mx-auto w-20 h-20" style={{ animation: "pulse-ring 2s ease-out infinite" }} />
        </div>

        <p className="t-label text-[var(--sage-light)] mb-4 anim-fade-in delay-100">
          {t("Health Assessment", "आरोग्य मूल्यांकन", lang)}
        </p>

        <h1 className={`t-hero text-white mb-6 anim-fade-up delay-200 ${lang === "mr" ? "mr" : ""}`}
          style={{ fontFamily: "var(--font-display)" }}>
          {t("Let's understand your body\nand goals.", "चला तुमचे शरीर आणि\nउद्दिष्टे समजून घेऊ.", lang)}
        </h1>

        <p className={`t-body text-white/50 mb-12 anim-fade-up delay-300 ${lang === "mr" ? "mr" : ""}`}>
          {t(
            "Answer a few questions and we'll build your personalised wellness plan. This is not a medical diagnosis.",
            "काही प्रश्नांची उत्तरे द्या आणि आम्ही तुमची वैयक्तिकृत वेलनेस योजना तयार करू. हे वैद्यकीय निदान नाही.",
            lang
          )}
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 anim-fade-up delay-400">
          {[
            { icon: "◷", en: "3–5 minutes", mr: "३–५ मिनिटे" },
            { icon: "◈", en: "Completely private", mr: "पूर्णपणे खाजगी" },
            { icon: "◎", en: "Personalised plan", mr: "वैयक्तिकृत योजना" },
            { icon: "✦", en: "Doctor-designed", mr: "डॉक्टर-डिझाइन" },
          ].map(f => (
            <span key={f.en} className={`flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/10 text-white/50 text-sm ${lang === "mr" ? "mr" : ""}`}>
              <span className="text-[var(--sage-light)]">{f.icon}</span>
              {lang === "en" ? f.en : f.mr}
            </span>
          ))}
        </div>

        <button onClick={onStart} className="btn btn-lg btn-primary anim-fade-up delay-500">
          <span className={lang === "mr" ? "mr" : ""}>{t("Begin Assessment", "मूल्यांकन सुरू करा", lang)}</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 4l4 4-4 4" strokeLinecap="round"/></svg>
        </button>

        <p className={`t-xs text-white/20 mt-8 max-w-sm anim-fade-in delay-600 ${lang === "mr" ? "mr" : ""}`}>
          {t(
            "This assessment does not provide medical diagnoses. Always consult a qualified doctor for medical advice.",
            "हे मूल्यांकन वैद्यकीय निदान प्रदान करत नाही. वैद्यकीय सल्ल्यासाठी नेहमी पात्र डॉक्टरांशी सल्लामसलत करा.",
            lang
          )}
        </p>
      </div>
    </div>
  );
}

// ─── Question screen with slide animation ─────────────────────────────
function QuestionScreen({ current, currentIdx, total, progress, answers, direction, lang, setLang, canNext, onAnswer, onNext, onPrev, onExit }: {
  current: any; currentIdx: number; total: number; progress: number; answers: Answers; direction: "forward" | "back";
  lang: Lang; setLang: (l: Lang) => void; canNext: boolean;
  onAnswer: (id: string, val: string, multi?: boolean) => void;
  onNext: () => void; onPrev: () => void; onExit: () => void;
}) {
  const slideClass = direction === "forward" ? "anim-fade-up" : "anim-fade-in";

  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col" style={{ fontFamily: "var(--font-body)" }}>
      {/* Header / Progress bar */}
      <div className="bg-white border-b border-[var(--ink-10)] px-5 sm:px-8 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button onClick={onPrev} className="flex items-center gap-1.5 text-[var(--ink-40)] hover:text-[var(--ink-80)] transition-colors text-sm shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 12L6 8l4-4" strokeLinecap="round"/></svg>
            <span className="hidden sm:inline">{t("Back", "मागे", lang)}</span>
          </button>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className={`t-label text-[var(--ink-40)] ${lang === "mr" ? "mr" : ""}`}>
                {t(current.section_en, current.section_mr, lang)}
              </span>
              <span className="t-label text-[var(--sage-mid)]" style={{ fontFamily: "var(--font-mono)" }}>
                {Math.round(progress)}%
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <button onClick={onExit} className="t-xs text-[var(--ink-20)] hover:text-[var(--ink-60)] transition-colors shrink-0">
            {t("Exit", "बाहेर", lang)}
          </button>
        </div>
      </div>

      {/* Question body */}
      <div className="flex-1 flex items-start justify-center px-5 py-12 overflow-y-auto">
        <div className={`w-full max-w-2xl ${slideClass}`}>
          {/* Section + counter */}
          <div className="flex items-center gap-3 mb-6">
            <span className="t-label text-[var(--sage-mid)]" style={{ fontFamily: "var(--font-mono)" }}>
              {String(currentIdx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>

          {/* Question */}
          <h2 className={`t-h1 text-[var(--ink-80)] mb-10 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
            {t(current.q_en, current.q_mr, lang)}
          </h2>

          {/* Text / Number */}
          {(current.type === "text" || current.type === "number") && (
            <div className="space-y-4">
              <input
                type={current.type === "number" ? "number" : "text"}
                placeholder={t((current as any).placeholder_en ?? "", (current as any).placeholder_mr ?? "", lang)}
                value={(answers[current.id] as string) ?? ""}
                onChange={e => onAnswer(current.id, e.target.value)}
                className={`field text-xl py-5 ${lang === "mr" ? "mr" : ""}`}
                autoFocus
              />
              <button onClick={onNext} disabled={!canNext} className={`btn btn-lg w-full justify-center ${canNext ? "btn-primary" : "opacity-40 cursor-not-allowed bg-[var(--sage)] text-white"}`}>
                <span className={lang === "mr" ? "mr" : ""}>{t("Continue", "पुढे", lang)}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 4l4 4-4 4" strokeLinecap="round"/></svg>
              </button>
            </div>
          )}

          {/* Single choice */}
          {current.type === "choice" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(current as any).options?.map((opt: any, i: number) => {
                const isSelected = answers[current.id] === opt.id;
                return (
                  <button key={opt.id} onClick={() => { onAnswer(current.id, opt.id); setTimeout(onNext, 280); }}
                    className={`answer-tile ${isSelected ? "selected" : ""}`}
                    style={{ animationDelay: `${i * 60}ms` }}>
                    {/* Icon circle */}
                    <span className="w-10 h-10 rounded-full bg-[var(--paper)] flex items-center justify-center text-lg shrink-0">
                      {opt.icon}
                    </span>
                    <span className={`flex-1 font-medium text-[var(--ink-80)] ${lang === "mr" ? "mr" : ""}`}>
                      {t(opt.label_en, opt.label_mr, lang)}
                    </span>
                    {/* Selection indicator */}
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? "bg-[var(--sage)] border-[var(--sage)]" : "border-[var(--ink-20)]"}`}>
                      {isSelected && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2">
                          <path d="M2 5l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Multi select */}
          {current.type === "multiselect" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {(current as any).options?.map((opt: any, i: number) => {
                  const isSelected = ((answers[current.id] as string[]) ?? []).includes(opt.id);
                  return (
                    <button key={opt.id} onClick={() => onAnswer(current.id, opt.id, true)}
                      className={`answer-tile ${isSelected ? "selected" : ""}`}>
                      <span className="w-10 h-10 rounded-full bg-[var(--paper)] flex items-center justify-center text-lg shrink-0">
                        {opt.icon}
                      </span>
                      <span className={`flex-1 font-medium text-[var(--ink-80)] text-left ${lang === "mr" ? "mr" : ""}`}>
                        {t(opt.label_en, opt.label_mr, lang)}
                      </span>
                      <span className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? "bg-[var(--sage)] border-[var(--sage)]" : "border-[var(--ink-20)]"}`}>
                        {isSelected && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2.5">
                            <path d="M2 5l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
              <button onClick={onNext} disabled={!canNext}
                className={`btn btn-lg w-full justify-center ${canNext ? "btn-primary" : "opacity-40 cursor-not-allowed bg-[var(--sage)] text-white"}`}>
                <span className={lang === "mr" ? "mr" : ""}>{t("Continue", "पुढे", lang)}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 4l4 4-4 4" strokeLinecap="round"/></svg>
              </button>
              <p className={`t-xs text-[var(--ink-40)] text-center mt-3 ${lang === "mr" ? "mr" : ""}`}>
                {t("Select all that apply", "सर्व लागू असलेल्या निवडा", lang)}
              </p>
            </>
          )}

          {/* Privacy note */}
          <p className={`t-xs text-[var(--ink-20)] text-center mt-8 flex items-center justify-center gap-1.5 ${lang === "mr" ? "mr" : ""}`}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="8" height="6" rx="1"/><path d="M4 5V4a2 2 0 014 0v1"/></svg>
            {t("Your responses are private and used only to personalise your plan.", "तुमच्या उत्तरे खाजगी आहेत.", lang)}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Processing screen ─────────────────────────────────────────────────
function ProcessingScreen({ lang, step }: { lang: Lang; step: number }) {
  const steps = [
    { l_en: "Reviewing your goals", l_mr: "तुमची उद्दिष्टे तपासत आहे" },
    { l_en: "Understanding your lifestyle", l_mr: "तुमची जीवनशैली समजून घेत आहे" },
    { l_en: "Mapping your fitness needs", l_mr: "तुमच्या फिटनेस गरजा मॅप करत आहे" },
    { l_en: "Matching you with the right experts", l_mr: "तुम्हाला योग्य तज्ञांशी जोडत आहे" },
    { l_en: "Building your recommendations", l_mr: "तुमच्या शिफारसी तयार करत आहे" },
  ];

  return (
    <div className="min-h-screen bg-[var(--ink)] flex flex-col items-center justify-center px-5 py-12" style={{ fontFamily: "var(--font-body)" }}>
      {/* Animated orb */}
      <div className="relative mb-12">
        <div className="w-24 h-24 rounded-full bg-[var(--sage)]/20 border-2 border-[var(--sage)]/30 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[var(--sage)]/40 border border-[var(--sage)] flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
          </div>
        </div>
        {/* Orbit rings */}
        <div className="absolute inset-0 rounded-full border border-[var(--sage)]/15 scale-150" style={{ animation: "pulse-ring 2.5s ease-out infinite" }} />
        <div className="absolute inset-0 rounded-full border border-[var(--sage)]/10 scale-200" style={{ animation: "pulse-ring 2.5s ease-out 0.8s infinite" }} />
      </div>

      <h2 className={`t-h2 text-white text-center mb-3 anim-fade-in ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
        {t("Building your personalised\nwellness plan…", "तुमची वैयक्तिकृत\nवेलनेस योजना तयार करत आहे…", lang)}
      </h2>
      <p className={`t-small text-white/40 mb-14 anim-fade-in delay-200 ${lang === "mr" ? "mr" : ""}`}>
        {t("This will just take a moment.", "हे फक्त एक क्षण लागेल.", lang)}
      </p>

      {/* Segmented steps */}
      <div className="w-full max-w-sm space-y-3">
        {steps.map((s, i) => (
          <div key={i} className={`transition-all duration-700 ${i < step ? "opacity-100" : "opacity-20"}`}>
            <div className="flex items-center gap-3 mb-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${i < step ? "bg-[var(--sage)]" : "border border-white/20"}`}>
                {i < step && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2">
                    <path d="M2.5 6l2.5 2.5 4.5-4.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              <span className={`t-small ${i < step ? "text-white" : "text-white/30"} ${lang === "mr" ? "mr" : ""}`}>
                {t(s.l_en, s.l_mr, lang)}
              </span>
            </div>
            {/* Individual step progress bar */}
            <div className="ml-9 h-px bg-white/10 overflow-hidden rounded-full">
              {i < step && (
                <div className="h-full bg-[var(--sage-mid)] rounded-full" style={{ width: "100%", animation: "progress-fill 0.6s ease forwards" }} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Results screen ────────────────────────────────────────────────────
function ResultsScreen({ lang, answers, recs, onBuildPlan }: { lang: Lang; answers: Answers; recs: any[]; onBuildPlan: () => void }) {
  const name = (answers.name as string) || "";
  const priorityMeta: Record<string, { label_en: string; label_mr: string; color: string; dot: string }> = {
    "High Priority":  { label_en: "High Priority",  label_mr: "उच्च प्राधान्य",   color: "text-[var(--warning)] bg-[#fdf0e0] border-[#f0d8a8]", dot: "bg-[var(--warning)]" },
    "Recommended":    { label_en: "Recommended",    label_mr: "शिफारस केलेले",   color: "text-[var(--sage)] bg-[var(--sage-ghost)] border-[var(--sage-pale)]", dot: "bg-[var(--sage)]" },
    "Consider":       { label_en: "Consider",       label_mr: "विचार करा",      color: "text-[var(--ink-60)] bg-[var(--paper)] border-[var(--ink-10)]", dot: "bg-[var(--ink-40)]" },
  };

  return (
    <div className="min-h-screen bg-[var(--cream)]" style={{ fontFamily: "var(--font-body)" }}>
      {/* Results header */}
      <div className="bg-[var(--ink)] px-5 sm:px-8 py-16 text-center">
        <p className="t-label text-[var(--sage-light)] mb-4 anim-fade-in">
          {t("Your personalised 40+ wellness plan", "तुमची वैयक्तिकृत ४०+ वेलनेस योजना", lang)}
        </p>
        <h1 className={`t-h1 text-white mb-3 anim-fade-up delay-100 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
          {name
            ? t(`Hi ${name}. Here's where to start.`, `नमस्ते ${name}. येथून सुरुवात करा.`, lang)
            : t("Here's where we'd recommend starting.", "येथे सुरुवात करण्याची शिफारस आहे.", lang)
          }
        </h1>
        <p className={`t-body text-white/50 max-w-md mx-auto anim-fade-up delay-200 ${lang === "mr" ? "mr" : ""}`}>
          {t("Based on your answers, we've identified your priority areas.", "तुमच्या उत्तरांवर आधारित, आम्ही तुमचे प्राधान्य क्षेत्र ओळखले आहेत.", lang)}
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-12">
        {/* Disclaimer */}
        <div className="flex gap-3 bg-[var(--paper)] border border-[var(--ink-10)] rounded-xl px-4 py-3 mb-8">
          <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--ink-40)" strokeWidth="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5.5v.5"/></svg>
          <p className={`t-xs text-[var(--ink-40)] leading-relaxed ${lang === "mr" ? "mr" : ""}`}>
            {t(
              "These are personalised suggestions — not medical diagnoses. Consult a doctor for medical advice.",
              "या वैयक्तिकृत सूचना आहेत — वैद्यकीय निदान नाही. वैद्यकीय सल्ल्यासाठी डॉक्टरांशी सल्लामसलत करा.",
              lang
            )}
          </p>
        </div>

        {/* Recommendation cards */}
        <div className="space-y-4 mb-10">
          {recs.map((rec, i) => {
            const prog = programs.find((p) => p.id === rec.id);
            if (!prog) return null;
            const meta = priorityMeta[rec.priority_en] ?? priorityMeta["Consider"];
            return (
              <div key={rec.id} className="bg-[var(--warm-white)] border border-[var(--ink-10)] rounded-2xl overflow-hidden"
                style={{ animation: `fade-up 0.5s var(--ease-out-expo) ${i * 80}ms both` }}>
                <div className="flex gap-0">
                  {/* Left image strip */}
                  <div className="w-24 h-24 sm:w-28 shrink-0">
                    <img src={prog.image} alt={prog.title_en} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 p-4 min-w-0">
                    <div className="flex items-start gap-2 mb-1.5">
                      <h3 className={`font-semibold text-[var(--ink-80)] text-sm flex-1 min-w-0 ${lang === "mr" ? "mr" : ""}`}>
                        {t(prog.title_en, prog.title_mr, lang)}
                      </h3>
                      <span className={`badge border shrink-0 ${meta.color} ${lang === "mr" ? "mr" : ""}`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${meta.dot}`} />
                        {t(rec.priority_en, rec.priority_mr, lang)}
                      </span>
                    </div>
                    <p className={`t-xs text-[var(--ink-40)] mb-2 leading-relaxed ${lang === "mr" ? "mr" : ""}`}>
                      {t(rec.reason_en, rec.reason_mr, lang)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`t-xs text-[var(--ink-40)] ${lang === "mr" ? "mr" : ""}`}>
                        {t(prog.duration_en, prog.duration_mr, lang)}
                      </span>
                      <span className="font-semibold text-[var(--ink-80)] text-sm" style={{ fontFamily: "var(--font-display)" }}>
                        ₹{prog.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={onBuildPlan} className="btn btn-lg btn-primary w-full justify-center">
          <span className={lang === "mr" ? "mr" : ""}>{t("Build My Plan →", "माझी योजना तयार करा →", lang)}</span>
        </button>
        <p className={`t-xs text-[var(--ink-40)] text-center mt-3 ${lang === "mr" ? "mr" : ""}`}>
          {t("Choose the programs you'd like to enrol in", "तुम्हाला कोणते प्रोग्राम्स निवडायचे आहेत ते निवडा", lang)}
        </p>
      </div>
    </div>
  );
}

// ─── Build Plan screen ─────────────────────────────────────────────────
function BuildPlan({ lang, recs, selected, toggle, total, onCheckout, onBack }: {
  lang: Lang; recs: any[]; selected: string[]; toggle: (id: string) => void;
  total: number; onCheckout: () => void; onBack: () => void;
}) {
  return (
    <div className="min-h-screen bg-[var(--cream)] pb-32" style={{ fontFamily: "var(--font-body)" }}>
      {/* Header */}
      <div className="bg-white border-b border-[var(--ink-10)] px-5 sm:px-8 py-4 sticky top-0 z-10 flex items-center gap-4">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[var(--ink-40)] hover:text-[var(--ink-80)] transition-colors text-sm">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 12L6 8l4-4" strokeLinecap="round"/></svg>
          {t("Back", "मागे", lang)}
        </button>
        <h2 className={`font-semibold text-[var(--ink-80)] ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>
          {t("Build Your Plan", "तुमची योजना तयार करा", lang)}
        </h2>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-10">
        <p className={`t-body text-[var(--ink-40)] mb-8 ${lang === "mr" ? "mr" : ""}`}>
          {t("Select the programs you'd like to start with. You can always add more later.", "तुम्हाला कोणते प्रोग्राम्स सुरू करायचे ते निवडा. नंतर कधीही अधिक जोडू शकता.", lang)}
        </p>

        <div className="space-y-3 mb-8">
          {recs.map((rec, i) => {
            const prog = programs.find((p) => p.id === rec.id);
            if (!prog) return null;
            const isSelected = selected.includes(rec.id);
            return (
              <button key={rec.id} onClick={() => toggle(rec.id)}
                className={`w-full flex items-center gap-4 p-4 sm:p-5 rounded-2xl border-2 text-left transition-all ${isSelected ? "border-[var(--sage)] bg-[var(--sage-ghost)]" : "border-[var(--ink-10)] bg-[var(--warm-white)] hover:border-[var(--sage-pale)]"}`}
                style={{ animation: `fade-up 0.4s var(--ease-out-expo) ${i * 60}ms both` }}>
                {/* Check */}
                <span className={`w-6 h-6 rounded border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? "bg-[var(--sage)] border-[var(--sage)]" : "border-[var(--ink-20)]"}`}>
                  {isSelected && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5">
                      <path d="M2.5 6l2.5 2.5 4.5-4.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                <span className="w-10 h-10 rounded-xl bg-[var(--paper)] flex items-center justify-center text-xl shrink-0 overflow-hidden">
                  <img src={prog.image} alt="" className="w-full h-full object-cover" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-[var(--ink-80)] text-sm ${lang === "mr" ? "mr" : ""}`}>
                    {t(prog.title_en, prog.title_mr, lang)}
                  </p>
                  <p className={`t-xs text-[var(--ink-40)] mt-0.5 ${lang === "mr" ? "mr" : ""}`}>
                    {t(prog.duration_en, prog.duration_mr, lang)} · {t(rec.priority_en, rec.priority_mr, lang)}
                  </p>
                </div>
                <span className="font-semibold text-[var(--ink-80)] shrink-0" style={{ fontFamily: "var(--font-display)" }}>
                  ₹{prog.price.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sticky bottom summary */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--ink-10)] px-5 py-4 z-20">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className={`t-xs text-[var(--ink-40)] ${lang === "mr" ? "mr" : ""}`}>
                {selected.length} {t("program(s) selected", "प्रोग्राम निवडले", lang)}
              </p>
              <p className="font-semibold text-xl text-[var(--ink-80)]" style={{ fontFamily: "var(--font-display)" }}>
                ₹{total.toLocaleString()}
              </p>
            </div>
            <button onClick={onCheckout} disabled={selected.length === 0}
              className={`btn btn-primary ${selected.length === 0 ? "opacity-40 cursor-not-allowed" : ""}`}>
              <span className={lang === "mr" ? "mr" : ""}>{t("Continue to Checkout →", "चेकआउटवर जा →", lang)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

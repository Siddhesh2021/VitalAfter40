import { useState, useEffect, useRef, useCallback } from "react";
import { Lang, t, programs } from "./data";

interface Props {
  lang: Lang;
  setLang: (l: Lang) => void;
  onBack: () => void;
  onComplete: (cart: string[], answers?: Answers) => void;
}

type Answers = Record<string, string | string[]>;
type Phase = "intro" | "questions" | "processing" | "results" | "plan";
type TransitionDir = "fwd" | "bwd";

// ─── Question definitions ──────────────────────────────────────────────────
interface Option { val: string; en: string; mr: string; icon?: string; }
interface Question {
  id: string;
  type: "choice" | "multiselect" | "text" | "phone" | "number";
  section_en: string;
  section_mr: string;
  en: string;
  mr: string;
  subtitle_en?: string;
  subtitle_mr?: string;
  placeholder_en?: string;
  placeholder_mr?: string;
  unit?: string;
  options?: Option[];
  condition?: { id: string; includesAny: string[] };
  required?: boolean;
  columns?: 1 | 2 | 3;
}

const QUESTIONS: Question[] = [
  /* ── About you ── */
  {
    id: "name", type: "text", required: true,
    section_en: "Let's start", section_mr: "सुरुवात करूया",
    en: "What should we call you?", mr: "आम्ही तुम्हाला काय म्हणावे?",
    subtitle_en: "Just your first name is fine.", subtitle_mr: "फक्त तुमचे नाव ठीक आहे.",
    placeholder_en: "Your first name", placeholder_mr: "तुमचे नाव",
  },
  {
    id: "phone", type: "phone", required: true,
    section_en: "Contact", section_mr: "संपर्क",
    en: "Your mobile number?", mr: "तुमचा मोबाइल नंबर?",
    subtitle_en: "We'll send your plan here. No spam, ever.", subtitle_mr: "आम्ही तुमची योजना येथे पाठवू. कधीही स्पॅम नाही.",
    placeholder_en: "+91 98765 43210", placeholder_mr: "+91 98765 43210",
  },
  {
    id: "age", type: "number", required: true,
    section_en: "About you", section_mr: "तुमच्याबद्दल",
    en: "How old are you?", mr: "तुमचे वय किती आहे?",
    subtitle_en: "Our programs are designed specifically for your age group.", subtitle_mr: "आमचे प्रोग्राम्स तुमच्या वयोगटासाठी विशेषतः डिझाइन केलेले आहेत.",
    placeholder_en: "e.g. 48", placeholder_mr: "उदा. ४८", unit: "yrs",
  },
  {
    id: "gender", type: "choice", required: true, columns: 1,
    section_en: "About you", section_mr: "तुमच्याबद्दल",
    en: "Which best describes you?", mr: "तुम्हाला कोणते सर्वोत्तम वर्णन करते?",
    options: [
      { val: "female", en: "Female", mr: "महिला" },
      { val: "male", en: "Male", mr: "पुरुष" },
      { val: "other", en: "Prefer not to say", mr: "सांगणे पसंत नाही" },
    ],
  },

  /* ── Goals ── */
  {
    id: "goals", type: "multiselect", required: true, columns: 2,
    section_en: "Your goals", section_mr: "तुमची उद्दिष्टे",
    en: "What would you most like to improve?", mr: "तुम्हाला सर्वात जास्त काय सुधारायचे आहे?",
    subtitle_en: "Select everything that matters to you.", subtitle_mr: "तुमच्यासाठी महत्त्वाचे ते सर्व निवडा.",
    options: [
      { val: "strength", en: "Build strength", mr: "ताकद बांधा" },
      { val: "mobility", en: "Move better", mr: "चांगले हलवा" },
      { val: "weight", en: "Lose weight", mr: "वजन कमी करा" },
      { val: "energy", en: "Improve energy", mr: "ऊर्जा सुधारा" },
      { val: "flexibility", en: "Improve flexibility", mr: "लवचिकता सुधारा" },
      { val: "overall", en: "Overall health", mr: "एकूण आरोग्य" },
    ],
  },

  /* ── Physical ── */
  {
    id: "height", type: "number", required: true,
    section_en: "Physical profile", section_mr: "शारीरिक प्रोफाइल",
    en: "What is your height?", mr: "तुमची उंची किती आहे?",
    placeholder_en: "e.g. 162", placeholder_mr: "उदा. १६२", unit: "cm",
  },
  {
    id: "weight", type: "number", required: true,
    section_en: "Physical profile", section_mr: "शारीरिक प्रोफाइल",
    en: "And your current weight?", mr: "आणि तुमचे सध्याचे वजन?",
    placeholder_en: "e.g. 70", placeholder_mr: "उदा. ७०", unit: "kg",
  },

  /* ── Lifestyle ── */
  {
    id: "activity", type: "choice", required: true, columns: 1,
    section_en: "Lifestyle", section_mr: "जीवनशैली",
    en: "How active are you right now?", mr: "तुम्ही सध्या किती सक्रिय आहात?",
    options: [
      { val: "sedentary", en: "Sedentary — desk job, very little movement", mr: "बैठी जीवनशैली — खूप कमी हालचाल" },
      { val: "light", en: "Lightly active — 1–2 days/week", mr: "हलका सक्रिय — आठवड्यातून १–२ दिवस" },
      { val: "moderate", en: "Moderately active — 3–4 days/week", mr: "मध्यम सक्रिय — आठवड्यातून ३–४ दिवस" },
      { val: "active", en: "Very active — 5+ days/week", mr: "खूप सक्रिय — आठवड्यातून ५+ दिवस" },
    ],
  },
  {
    id: "fitness_exp", type: "choice", required: true, columns: 1,
    section_en: "Lifestyle", section_mr: "जीवनशैली",
    en: "What's your fitness experience so far?", mr: "तुमचा आतापर्यंतचा फिटनेस अनुभव काय आहे?",
    options: [
      { val: "none", en: "No prior experience", mr: "पूर्वी कोणताही अनुभव नाही" },
      { val: "beginner", en: "Tried a few things, didn't stick", mr: "काही गोष्टी केल्या, टिकलो नाही" },
      { val: "intermediate", en: "Regular for 1–2 years", mr: "१–२ वर्षे नियमित" },
      { val: "experienced", en: "Consistent 3+ years", mr: "३+ वर्षे सातत्यपूर्ण" },
    ],
  },

  /* ── Health ── */
  {
    id: "pain_yn", type: "choice", required: true, columns: 1,
    section_en: "Your health", section_mr: "तुमचे आरोग्य",
    en: "Any joint pain or mobility issues?", mr: "कोणताही सांधेदुखी किंवा गतिशीलतेच्या समस्या?",
    options: [
      { val: "yes", en: "Yes — it limits me sometimes", mr: "होय — हे कधी कधी मला मर्यादित करते" },
      { val: "mild", en: "Occasional mild discomfort", mr: "अधून मधून सौम्य अस्वस्थता" },
      { val: "no", en: "No pain or issues", mr: "कोणतीही वेदना किंवा समस्या नाही" },
    ],
  },
  {
    id: "pain_area", type: "multiselect", columns: 2,
    condition: { id: "pain_yn", includesAny: ["yes", "mild"] },
    section_en: "Your health", section_mr: "तुमचे आरोग्य",
    en: "Which areas bother you?", mr: "कोणते क्षेत्र तुम्हाला त्रास देतात?",
    subtitle_en: "Select all that apply.", subtitle_mr: "सर्व लागू होणारे निवडा.",
    options: [
      { val: "knee", en: "Knees", mr: "गुडघे" },
      { val: "back", en: "Lower back", mr: "पाठीचा खालचा भाग" },
      { val: "shoulder", en: "Shoulders", mr: "खांदे" },
      { val: "hip", en: "Hips", mr: "नितंब" },
      { val: "neck", en: "Neck", mr: "मान" },
    ],
  },
  {
    id: "energy_level", type: "choice", required: true, columns: 1,
    section_en: "Your health", section_mr: "तुमचे आरोग्य",
    en: "How would you describe your energy levels?", mr: "तुम्ही तुमच्या ऊर्जा पातळीचे वर्णन कसे कराल?",
    options: [
      { val: "high", en: "High — energetic most of the day", mr: "उच्च — दिवसभर ऊर्जावान" },
      { val: "moderate", en: "Moderate — afternoon dips", mr: "मध्यम — दुपारी घसरण" },
      { val: "low", en: "Low — always tired", mr: "कमी — नेहमी थकलेलो" },
      { val: "vlow", en: "Very low — exhausted by midday", mr: "खूप कमी — दुपारपर्यंत थकलेलो" },
    ],
  },
  {
    id: "sleep", type: "choice", required: true, columns: 1,
    section_en: "Your health", section_mr: "तुमचे आरोग्य",
    en: "How do you sleep?", mr: "तुम्ही कसे झोपता?",
    options: [
      { val: "well", en: "7–8 hours, wake up refreshed", mr: "७–८ तास, ताजेतवाने उठतो" },
      { val: "ok", en: "6–7 hours, feel okay", mr: "६–७ तास, ठीक वाटते" },
      { val: "poor", en: "Under 6 hours or poor quality", mr: "६ तासांपेक्षा कमी किंवा खराब गुणवत्ता" },
      { val: "issues", en: "Sleep issues / insomnia", mr: "झोपेच्या समस्या / निद्रानाश" },
    ],
  },
  {
    id: "stress", type: "choice", required: true, columns: 1,
    section_en: "Your health", section_mr: "तुमचे आरोग्य",
    en: "How's your daily stress?", mr: "तुमचा दैनंदिन तणाव कसा आहे?",
    options: [
      { val: "low", en: "Low — I feel balanced", mr: "कमी — मला संतुलित वाटते" },
      { val: "moderate", en: "Moderate — manageable", mr: "मध्यम — व्यवस्थापित करण्यायोग्य" },
      { val: "high", en: "High — it affects my day", mr: "उच्च — हे माझ्या दिवसावर परिणाम करते" },
      { val: "vhigh", en: "Very high — chronic stress", mr: "खूप उच्च — तीव्र तणाव" },
    ],
  },

  /* ── Medical ── */
  {
    id: "medical", type: "multiselect", columns: 1,
    section_en: "Medical", section_mr: "वैद्यकीय",
    en: "Any diagnosed conditions?", mr: "कोणत्या निदान झालेल्या अवस्था?",
    subtitle_en: "Your data is encrypted and private. This helps us keep you safe.", subtitle_mr: "तुमचा डेटा एन्क्रिप्टेड आणि खाजगी आहे. हे तुम्हाला सुरक्षित ठेवण्यास मदत करते.",
    options: [
      { val: "diabetes", en: "Diabetes / pre-diabetes", mr: "मधुमेह / प्री-डायबिटीज" },
      { val: "thyroid", en: "Thyroid condition", mr: "थायरॉईड अवस्था" },
      { val: "bp", en: "High / low blood pressure", mr: "उच्च / कमी रक्तदाब" },
      { val: "heart", en: "Heart condition", mr: "हृदय अवस्था" },
      { val: "osteo", en: "Osteoporosis / low bone density", mr: "ऑस्टिओपोरोसिस / कमी हाडांची घनता" },
      { val: "none", en: "None of the above", mr: "वरीलपैकी काहीही नाही" },
    ],
  },

  /* ── Hormonal — female conditional ── */
  {
    id: "hormonal", type: "choice", columns: 1,
    condition: { id: "gender", includesAny: ["female"] },
    section_en: "Hormonal health", section_mr: "हार्मोनल आरोग्य",
    en: "Are you experiencing any hormonal changes?", mr: "तुम्हाला कोणत्याही हार्मोनल बदलांचा अनुभव येत आहे का?",
    subtitle_en: "This helps us recommend the right support.", subtitle_mr: "हे आम्हाला योग्य समर्थन शिफारस करण्यास मदत करते.",
    options: [
      { val: "peri", en: "Perimenopause", mr: "पेरिमेनोपॉज" },
      { val: "meno", en: "Menopause", mr: "रजोनिवृत्ती" },
      { val: "post", en: "Post-menopause", mr: "पोस्ट-मेनोपॉज" },
      { val: "regular", en: "Regular cycles, no concerns", mr: "नियमित चक्र, कोणत्याही चिंता नाहीत" },
      { val: "prefer_not", en: "Prefer not to say", mr: "सांगणे पसंत नाही" },
    ],
  },

  /* ── Preferences ── */
  {
    id: "session_format", type: "choice", required: true, columns: 1,
    section_en: "Your preferences", section_mr: "तुमच्या प्राधान्यक्रम",
    en: "Group or individual sessions?", mr: "ग्रुप किंवा वैयक्तिक सेशन्स?",
    options: [
      { val: "group", en: "Group — I enjoy community", mr: "ग्रुप — मला समुदाय आवडतो", icon: "◎" },
      { val: "individual", en: "Individual — more personalised", mr: "वैयक्तिक — अधिक वैयक्तिकृत", icon: "◉" },
      { val: "both", en: "Open to both", mr: "दोन्हींसाठी खुला", icon: "✦" },
    ],
  },
  {
    id: "session_mode", type: "choice", required: true, columns: 1,
    section_en: "Your preferences", section_mr: "तुमच्या प्राधान्यक्रम",
    en: "Live Zoom or recorded sessions?", mr: "लाइव्ह झूम किंवा रेकॉर्ड केलेले सेशन्स?",
    options: [
      { val: "live", en: "Live Zoom — I like accountability", mr: "लाइव्ह झूम — मला जबाबदारी आवडते", icon: "◱" },
      { val: "recorded", en: "Recorded — my schedule varies", mr: "रेकॉर्ड केलेले — माझे वेळापत्रक बदलते", icon: "▶" },
      { val: "both", en: "Mix of both", mr: "दोन्हींचे मिश्रण", icon: "⊕" },
    ],
  },
  {
    id: "preferred_time", type: "choice", required: true, columns: 2,
    section_en: "Your preferences", section_mr: "तुमच्या प्राधान्यक्रम",
    en: "When do you prefer to exercise?", mr: "तुम्ही व्यायाम केव्हा पसंत करता?",
    options: [
      { val: "early_morning", en: "Early morning", mr: "पहाटे" },
      { val: "morning", en: "Morning", mr: "सकाळ" },
      { val: "evening", en: "Evening", mr: "संध्याकाळ" },
      { val: "flexible", en: "Flexible", mr: "लवचिक" },
    ],
  },
];

// ─── Condition logic ────────────────────────────────────────────────────────
function isConditionMet(q: Question, answers: Answers): boolean {
  if (!q.condition) return true;
  const { id, includesAny } = q.condition;
  const ans = answers[id];
  if (Array.isArray(ans)) return includesAny.some(v => ans.includes(v));
  return includesAny.includes(ans as string);
}

// ─── Recommendation engine ──────────────────────────────────────────────────
function buildRecommendations(answers: Answers) {
  const goals = (answers.goals as string[]) ?? [];
  const hasPain = answers.pain_yn === "yes" || answers.pain_yn === "mild";
  const isLowEnergy = answers.energy_level === "low" || answers.energy_level === "vlow";
  const wantsWeight = goals.includes("weight");
  const wantsStrength = goals.includes("strength");
  const wantsMobility = goals.includes("mobility") || goals.includes("flexibility");
  const hasHormonal = ["peri","meno","post"].includes(answers.hormonal as string);

  const recs: { id: string; match: number; priority_en: string; priority_mr: string; reason_en: string; reason_mr: string }[] = [];

  // Pilates scoring
  const pilatesScore = (wantsMobility ? 40 : 0) + (hasPain ? 30 : 0) + (goals.includes("overall") ? 20 : 0) + 10;
  if (pilatesScore > 20) {
    recs.push({
      id: answers.session_format === "individual" ? "pilates-individual" : "pilates-group",
      match: Math.min(pilatesScore, 98),
      priority_en: pilatesScore > 60 ? "Best match" : "Recommended",
      priority_mr: pilatesScore > 60 ? "सर्वोत्तम जुळणी" : "शिफारस केलेले",
      reason_en: hasPain ? "Clinical Pilates directly addresses your joint pain and mobility concerns." : "Pilates is the most effective entry point for overall 40+ wellness.",
      reason_mr: hasPain ? "क्लिनिकल पिलाटेस तुमच्या सांधेदुखी आणि गतिशीलतेच्या समस्यांना थेट संबोधित करते." : "पिलाटेस ४०+ वेलनेससाठी सर्वात प्रभावी प्रारंभ बिंदू आहे.",
    });
  }

  // Physio scoring
  if (hasPain) {
    recs.push({
      id: "physio",
      match: 92,
      priority_en: "High priority",
      priority_mr: "उच्च प्राधान्य",
      reason_en: "The pain areas you mentioned suggest physiotherapy should come first, before strength work.",
      reason_mr: "तुम्ही उल्लेख केलेल्या वेदना क्षेत्रांनी सूचित केले की ताकद काम करण्यापूर्वी फिजिओथेरपी प्रथम यावी.",
    });
  }

  // Strength
  if (wantsStrength || wantsWeight) {
    recs.push({
      id: "strength",
      match: 88,
      priority_en: "Recommended",
      priority_mr: "शिफारस केलेले",
      reason_en: "Strength training is the most powerful intervention for metabolism and longevity after 40.",
      reason_mr: "स्ट्रेंथ ट्रेनिंग ४० नंतर चयापचय आणि दीर्घायुष्यासाठी सर्वात शक्तिशाली हस्तक्षेप आहे.",
    });
  }

  // Nutrition
  if (wantsWeight || isLowEnergy || hasHormonal) {
    recs.push({
      id: "nutrition",
      match: 85,
      priority_en: "Recommended",
      priority_mr: "शिफारस केलेले",
      reason_en: isLowEnergy ? "Nutrition directly affects your energy — this will amplify every other program." : "A nutrition plan aligned with your hormones will accelerate your results significantly.",
      reason_mr: isLowEnergy ? "पोषण तुमच्या ऊर्जेवर थेट परिणाम करते — हे प्रत्येक इतर प्रोग्रामला वाढवेल." : "तुमच्या हार्मोन्सशी संरेखित पोषण योजना तुमचे परिणाम लक्षणीयरीत्या वाढवेल.",
    });
  }

  // Doctor
  recs.push({
    id: "doctor",
    match: 78,
    priority_en: "Consider",
    priority_mr: "विचार करा",
    reason_en: "A baseline health assessment with our medical director helps personalise every recommendation.",
    reason_mr: "आमच्या वैद्यकीय संचालकांसोबत बेसलाइन आरोग्य मूल्यांकन प्रत्येक शिफारस वैयक्तिकृत करण्यास मदत करते.",
  });

  // Deduplicate and sort by match
  const seen = new Set<string>();
  return recs.filter(r => { if (seen.has(r.id)) return false; seen.add(r.id); return true; })
    .sort((a, b) => b.match - a.match)
    .slice(0, 4);
}

// ─── Processing steps ───────────────────────────────────────────────────────
const PROCESSING_STEPS = [
  { en: "Understanding your goals", mr: "तुमची उद्दिष्टे समजून घेत आहे" },
  { en: "Reviewing your lifestyle", mr: "तुमची जीवनशैली तपासत आहे" },
  { en: "Mapping your priorities", mr: "तुमच्या प्राधान्यक्रमांचा नकाशा तयार करत आहे" },
  { en: "Matching your experts", mr: "तुमचे तज्ञ जुळवत आहे" },
  { en: "Finding the right programs", mr: "योग्य प्रोग्राम्स शोधत आहे" },
  { en: "Building your personalised plan", mr: "तुमची वैयक्तिकृत योजना तयार करत आहे" },
];

// ═══════════════════════════════════════════════════════════════════════════
// ENTRY SCREEN
// ═══════════════════════════════════════════════════════════════════════════
function EntryScreen({ lang, onStart, onBack }: { lang: Lang; onStart: () => void; onBack: () => void }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--ink)" }}>
      {/* Close button */}
      <div className="absolute top-6 right-6">
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{ background: "rgba(255,255,255,0.08)" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5">
            <path d="M2 2l10 10M12 2L2 12" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400&h=900&fit=crop&auto=format"
          alt=""
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 60% 40%, rgba(74,103,65,0.2) 0%, transparent 60%)" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        {/* Logo mark */}
        <div className="w-12 h-12 rounded-full bg-[var(--sage)] flex items-center justify-center mb-8 anim-scale-in">
          <span className="text-white text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>V</span>
        </div>

        <p className={`t-label text-[var(--sage-light)] mb-6 anim-fade-in delay-100 ${lang === "mr" ? "mr" : ""}`}>
          {t("Health Assessment", "आरोग्य मूल्यांकन", lang)}
        </p>

        <h1 className={`text-white mb-5 anim-fade-up delay-200 ${lang === "mr" ? "mr" : ""}`}
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.08, letterSpacing: "-0.02em", maxWidth: 600 }}>
          {lang === "en" ? (
            <>Let's understand<br />where you are <em className="italic" style={{ color: "var(--sage-light)" }}>today.</em></>
          ) : (
            <>आज तुम्ही <em style={{ color: "var(--sage-light)", fontStyle: "normal" }}>कुठे आहात</em><br />ते समजून घेऊया.</>
          )}
        </h1>

        <p className={`t-body-lg mb-12 max-w-md anim-fade-up delay-300 ${lang === "mr" ? "mr" : ""}`} style={{ color: "rgba(255,255,255,0.5)" }}>
          {t(
            "A few questions will help us build a wellness plan designed around you.",
            "काही प्रश्न आम्हाला तुमच्यासाठी डिझाइन केलेली वेलनेस योजना तयार करण्यास मदत करतील.",
            lang
          )}
        </p>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 anim-fade-in delay-400">
          {[
            { svg: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"><circle cx="7" cy="7" r="5.5"/><path d="M7 4v3.5l2 1.5" strokeLinecap="round"/></svg>, en: "~5 minutes", mr: "~५ मिनिटे" },
            { svg: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"><rect x="2" y="6" width="10" height="7" rx="1.5"/><path d="M4.5 6V4a2.5 2.5 0 015 0v2" strokeLinecap="round"/></svg>, en: "Private & secure", mr: "खाजगी आणि सुरक्षित" },
            { svg: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"><circle cx="7" cy="7" r="5.5"/><path d="M4.5 7l2 2 3-3" strokeLinecap="round" strokeLinejoin="round"/></svg>, en: "Personalised to you", mr: "तुमच्यासाठी वैयक्तिकृत" },
            { svg: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"><path d="M7 1.5L2 4v4c0 2.76 2.24 4.5 5 5 2.76-.5 5-2.24 5-5V4L7 1.5z"/><path d="M5 7l1.5 1.5 2.5-3" strokeLinecap="round" strokeLinejoin="round"/></svg>, en: "Doctor-reviewed", mr: "डॉक्टरांनी पुनरावलोकन केले" },
          ].map(b => (
            <div key={b.en} className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {b.svg}
              <span className={`t-small ${lang === "mr" ? "mr" : ""}`} style={{ color: "rgba(255,255,255,0.6)" }}>
                {lang === "en" ? b.en : b.mr}
              </span>
            </div>
          ))}
        </div>

        <button onClick={onStart} className={`btn btn-primary btn-xl anim-fade-up delay-500 ${lang === "mr" ? "mr" : ""}`}>
          {t("Start Assessment", "मूल्यांकन सुरू करा", lang)}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="1.5">
            <path d="M3 9h12M10 5l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <p className={`t-xs mt-4 anim-fade-in delay-600 ${lang === "mr" ? "mr" : ""}`} style={{ color: "rgba(255,255,255,0.25)" }}>
          {t("No credit card required. Free personalised plan.", "कोणतेही क्रेडिट कार्ड आवश्यक नाही. मोफत वैयक्तिकृत योजना.", lang)}
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// QUESTION SCREEN
// ═══════════════════════════════════════════════════════════════════════════
interface QScreenProps {
  question: Question;
  answers: Answers;
  onAnswer: (id: string, val: string, multi?: boolean) => void;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
  qIdx: number;
  total: number;
  pct: number;
  lang: Lang;
  canNext: boolean;
  dir: TransitionDir;
  animating: boolean;
}

function QuestionScreen({ question: q, answers, onAnswer, onNext, onPrev, onExit, qIdx, total, pct, lang, canNext, dir, animating }: QScreenProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const ans = answers[q.id];
  const isMulti = q.type === "multiselect";
  const isText = q.type === "text" || q.type === "phone" || q.type === "number";

  useEffect(() => {
    if (isText && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [q.id, isText]);

  const enterClass = dir === "fwd" ? "anim-enter-fwd" : "anim-enter-bwd";
  const exitClass = dir === "fwd" ? "anim-exit-fwd" : "anim-exit-bwd";

  const isSelected = (val: string) => {
    if (isMulti) return Array.isArray(ans) && (ans as string[]).includes(val);
    return ans === val;
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-primary)", fontFamily: "var(--font-body)" }}>

      {/* ── Top bar ── */}
      <div className="sticky top-0 z-30 px-5 sm:px-8 py-4 flex items-center gap-4"
        style={{ background: "var(--bg-primary)", borderBottom: "1px solid var(--border-subtle)" }}>
        {/* Back */}
        <button onClick={onPrev} className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--bg-muted)]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
            <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Counter */}
        <span className="t-label text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)", minWidth: 56 }}>
          {String(qIdx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>

        {/* Progress */}
        <div className="flex-1 relative">
          <div className="h-1 rounded-full" style={{ background: "var(--border-subtle)" }}>
            <div className="h-full rounded-full bg-[var(--sage)] transition-all duration-500 ease-out"
              style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Pct */}
        <span className="t-label text-[var(--sage)]" style={{ fontFamily: "var(--font-mono)", minWidth: 36, textAlign: "right" }}>
          {Math.round(pct)}%
        </span>

        {/* Exit */}
        <button onClick={onExit} className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--bg-muted)]">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
            <path d="M2 2l10 10M12 2L2 12" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* ── Question content ── */}
      <div className={`flex-1 flex flex-col ${animating ? exitClass : enterClass}`}
        style={{ maxWidth: 680, margin: "0 auto", width: "100%", padding: "3rem 1.5rem 6rem" }}>

        {/* Section label */}
        <p className={`t-label text-[var(--sage)] mb-6 ${lang === "mr" ? "mr" : ""}`}>
          {lang === "en" ? q.section_en : q.section_mr}
        </p>

        {/* Question text */}
        <h2 className={`text-[var(--text-primary)] mb-3 ${lang === "mr" ? "mr" : ""}`}
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", lineHeight: 1.15, letterSpacing: "-0.015em" }}>
          {lang === "en" ? q.en : q.mr}
        </h2>

        {/* Subtitle */}
        {(q.subtitle_en || q.subtitle_mr) && (
          <p className={`t-body text-[var(--text-muted)] mb-8 ${lang === "mr" ? "mr" : ""}`}>
            {lang === "en" ? q.subtitle_en : q.subtitle_mr}
          </p>
        )}

        {!q.subtitle_en && <div className="mb-8" />}

        {/* ── Text input ── */}
        {isText && (
          <div className="space-y-4">
            <div className="relative">
              <input
                ref={inputRef}
                type={q.type === "phone" ? "tel" : q.type === "number" ? "number" : "text"}
                value={(ans as string) ?? ""}
                onChange={e => onAnswer(q.id, e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && canNext) onNext(); }}
                placeholder={lang === "en" ? q.placeholder_en : q.placeholder_mr}
                className={`w-full text-2xl font-light border-0 border-b-2 bg-transparent outline-none transition-colors pb-3 ${lang === "mr" ? "mr" : ""}`}
                style={{
                  fontFamily: q.id === "name" ? "var(--font-display)" : "var(--font-body)",
                  fontSize: "clamp(1.5rem, 4vw, 2rem)",
                  letterSpacing: "-0.02em",
                  borderBottomColor: ans ? "var(--sage)" : "var(--border-default)",
                  color: "var(--text-primary)",
                  paddingRight: q.unit ? "3rem" : undefined,
                }}
              />
              {q.unit && (
                <span className="absolute right-0 bottom-3 t-label text-[var(--text-muted)]">{q.unit}</span>
              )}
            </div>
            {q.id === "phone" && (
              <p className="t-xs text-[var(--text-muted)] flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                  <path d="M6 1a4 4 0 100 8A4 4 0 006 1zM6 5v2M6 3.5h.01"/>
                </svg>
                {t("We'll send your personalised plan here. No spam, ever.", "आम्ही तुमची योजना येथे पाठवू. कधीही स्पॅम नाही.", lang)}
              </p>
            )}
            {q.id === "medical" && (
              <p className="t-xs text-[var(--text-muted)] flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--success)" strokeWidth="1.5">
                  <rect x="1.5" y="1.5" width="9" height="9" rx="1"/><path d="M4 6l1.5 1.5L8 4" strokeLinecap="round"/>
                </svg>
                {t("End-to-end encrypted. Seen only by your care team.", "एंड-टू-एंड एन्क्रिप्टेड. फक्त तुमच्या काळजी टीमला दिसते.", lang)}
              </p>
            )}
          </div>
        )}

        {/* ── Choice tiles ── */}
        {(q.type === "choice" || q.type === "multiselect") && q.options && (
          <div className={`grid gap-3 ${q.columns === 2 ? "grid-cols-2" : q.columns === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1"}`}>
            {q.options.map((opt, i) => {
              const selected = isSelected(opt.val);
              return (
                <button
                  key={opt.val}
                  onClick={() => onAnswer(q.id, opt.val, isMulti)}
                  className={`answer-tile group ${selected ? "selected" : ""}`}
                  style={{
                    animationDelay: `${i * 40}ms`,
                    minHeight: q.columns === 1 ? 64 : 72,
                    position: "relative",
                  }}
                >
                  {/* Icon (if present) */}
                  {opt.icon && (
                    <span className="text-xl shrink-0">{opt.icon}</span>
                  )}

                  {/* Label */}
                  <span className={`flex-1 text-left t-small font-medium text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`}
                    style={{ lineHeight: 1.4 }}>
                    {lang === "en" ? opt.en : opt.mr}
                  </span>

                  {/* Check indicator */}
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    selected
                      ? isMulti ? "bg-[var(--sage)] border-[var(--sage)]" : "bg-[var(--sage)] border-[var(--sage)]"
                      : "border-[var(--border-default)]"
                  }`}
                    style={isMulti ? { borderRadius: 4 } : {}}>
                    {selected && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2"
                        style={{ animation: "tick-in 0.2s var(--ease-spring) both" }}>
                        <path d="M2 5l2.5 2.5 3.5-4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Medical privacy note ── */}
        {q.id === "medical" && (
          <p className="t-xs text-[var(--text-muted)] mt-4 flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--success)" strokeWidth="1.5">
              <path d="M6 1L7.5 4.5l3.5.5-2.5 2.5.5 3.5L6 9.5l-3 2 .5-3.5L1 5.5l3.5-.5L6 1z"/>
            </svg>
            {t("Your medical data is encrypted and never shared with third parties.", "तुमचा वैद्यकीय डेटा एन्क्रिप्टेड आहे आणि तृतीय पक्षांसह कधीही सामायिक केला जात नाही.", lang)}
          </p>
        )}
      </div>

      {/* ── Sticky bottom CTA ── */}
      {(isText || isMulti) && (
        <div className="fixed bottom-0 left-0 right-0 z-30 px-5 py-4 flex justify-end gap-3"
          style={{ background: "var(--bg-primary)", borderTop: "1px solid var(--border-subtle)" }}>
          {isMulti && (
            <span className={`t-xs text-[var(--text-muted)] self-center mr-auto ${lang === "mr" ? "mr" : ""}`}>
              {Array.isArray(ans) ? `${(ans as string[]).length} ${t("selected","निवडले",lang)}` : t("Select all that apply","सर्व लागू होणारे निवडा",lang)}
            </span>
          )}
          <button
            onClick={onNext}
            disabled={!canNext}
            className={`btn btn-primary ${lang === "mr" ? "mr" : ""}`}
          >
            {t("Continue", "पुढे", lang)}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.5">
              <path d="M2 7h10M8 3l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PROCESSING SCREEN
// ═══════════════════════════════════════════════════════════════════════════
function ProcessingScreen({ lang, step }: { lang: Lang; step: number }) {
  const pct = Math.round((step / PROCESSING_STEPS.length) * 100);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "var(--ink)" }}>

      {/* Animated orb */}
      <div className="relative mb-12" style={{ width: 120, height: 120 }}>
        <svg width="120" height="120" viewBox="0 0 120 120" className="ring-progress absolute inset-0">
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
          <circle cx="60" cy="60" r="50" fill="none" stroke="var(--sage)" strokeWidth="3"
            strokeDasharray={`${pct * 3.14} 314`} strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.8s var(--ease-out-expo)" }} />
        </svg>
        {/* Pulse rings */}
        <div className="absolute inset-0 rounded-full border border-[var(--sage)]/20"
          style={{ animation: "pulse-ring 2s ease-out infinite" }} />
        <div className="absolute inset-0 rounded-full border border-[var(--sage)]/10"
          style={{ animation: "pulse-ring 2s ease-out infinite", animationDelay: "0.6s" }} />
        {/* Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-[var(--sage)] flex items-center justify-center">
            <span className="text-white text-base font-bold" style={{ fontFamily: "var(--font-display)" }}>V</span>
          </div>
        </div>
      </div>

      <h2 className={`text-white mb-3 ${lang === "mr" ? "mr" : ""}`}
        style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 4vw, 2rem)", letterSpacing: "-0.02em" }}>
        {t("Building your personalised wellness plan…", "तुमची वैयक्तिकृत वेलनेस योजना तयार करत आहे…", lang)}
      </h2>
      <p className={`text-white/40 t-small mb-12 ${lang === "mr" ? "mr" : ""}`}>
        {t("This takes about 10 seconds.", "यास सुमारे १० सेकंद लागतात.", lang)}
      </p>

      {/* Step checklist */}
      <div className="space-y-3 text-left w-full" style={{ maxWidth: 360 }}>
        {PROCESSING_STEPS.map((s, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <div key={s.en}
              className="flex items-center gap-3 transition-all duration-300"
              style={{ opacity: done || current ? 1 : 0.25 }}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                done ? "bg-[var(--sage)]" : current ? "border border-[var(--sage)]" : "border border-white/20"
              }`}>
                {done ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2"
                    style={{ animation: "tick-in 0.3s var(--ease-spring) both" }}>
                    <path d="M2 5l2.5 2.5 3.5-4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : current ? (
                  <svg className="spin" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="var(--sage)" strokeWidth="2">
                    <circle cx="5" cy="5" r="3.5" strokeDasharray="14 5"/>
                  </svg>
                ) : null}
              </span>
              <span className={`t-small ${done ? "text-white/60" : current ? "text-white font-medium" : "text-white/25"} ${lang === "mr" ? "mr" : ""}`}>
                {lang === "en" ? s.en : s.mr}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// RESULTS SCREEN
// ═══════════════════════════════════════════════════════════════════════════
function ResultsScreen({ lang, answers, onPlan, onBack }: { lang: Lang; answers: Answers; onPlan: (cart: string[]) => void; onBack: () => void }) {
  const name = (answers.name as string) || "";
  const recs = buildRecommendations(answers);
  const [selected, setSelected] = useState<string[]>([recs[0]?.id].filter(Boolean));

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const totalPrice = selected.reduce((sum, id) => {
    const p = programs.find(pr => pr.id === id);
    return sum + (p?.price ?? 0);
  }, 0);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)", fontFamily: "var(--font-body)" }}>

      {/* Results hero */}
      <div style={{ background: "var(--ink)", paddingBottom: "4rem" }}>
        <div className="max-w-2xl mx-auto px-6 pt-16 pb-0 text-center">
          {/* Success mark */}
          <div className="w-16 h-16 rounded-full bg-[var(--sage)] flex items-center justify-center mx-auto mb-6 anim-scale-in"
            style={{ boxShadow: "0 0 0 8px rgba(74,103,65,0.15), 0 0 0 16px rgba(74,103,65,0.07)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M4 12l5 5 11-11" strokeLinecap="round" strokeLinejoin="round"
                style={{ animation: "tick-in 0.4s var(--ease-spring) 0.3s both" }} />
            </svg>
          </div>

          <h1 className={`text-white mb-3 anim-fade-up delay-200 ${lang === "mr" ? "mr" : ""}`}
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", letterSpacing: "-0.02em" }}>
            {name
              ? t(`Your plan is ready, ${name}.`, `${name}, तुमची योजना तयार आहे.`, lang)
              : t("Your personalised plan is ready.", "तुमची वैयक्तिकृत योजना तयार आहे.", lang)
            }
          </h1>

          <p className={`t-body text-white/50 mb-0 anim-fade-up delay-300 ${lang === "mr" ? "mr" : ""}`}>
            {t(
              "Based on your answers, here's what our doctors recommend for your goals.",
              "तुमच्या उत्तरांवर आधारित, आमचे डॉक्टर तुमच्या उद्दिष्टांसाठी हे शिफारस करतात.",
              lang
            )}
          </p>
        </div>
      </div>

      {/* Plan content */}
      <div className="max-w-2xl mx-auto px-6 pb-32" style={{ marginTop: "-2rem" }}>

        {/* Primary recommendation — big */}
        {recs[0] && (() => {
          const prog = programs.find(p => p.id === recs[0].id);
          const rec = recs[0];
          if (!prog) return null;
          return (
            <div
              onClick={() => toggle(rec.id)}
              className={`relative overflow-hidden rounded-2xl mb-4 cursor-pointer transition-all duration-300 anim-scale-in delay-300 ${
                selected.includes(rec.id) ? "ring-2 ring-[var(--sage)] ring-offset-2" : ""
              }`}
              style={{ boxShadow: "var(--shadow-xl)" }}
            >
              <div style={{ height: 220, background: "var(--bg-muted)" }}>
                <img src={prog.image} alt={prog.title_en} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="badge badge-recommended">★ Best match</span>
                <span className="badge" style={{ background: `rgba(74,103,65,0.9)`, color: "#fff", fontFamily: "var(--font-mono)" }}>
                  {rec.match}% match
                </span>
              </div>
              {/* Selection indicator */}
              <div className={`absolute top-4 right-4 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                selected.includes(rec.id) ? "bg-[var(--sage)] border-[var(--sage)]" : "border-white/40 bg-black/30"
              }`}>
                {selected.includes(rec.id) && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2">
                    <path d="M2.5 6l2.5 2.5 4.5-4.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className={`t-label text-white/50 mb-1 ${lang === "mr" ? "mr" : ""}`}>
                  {t(rec.priority_en, rec.priority_mr, lang)}
                </p>
                <h3 className={`t-h4 text-white mb-1 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                  {lang === "en" ? prog.title_en : prog.title_mr}
                </h3>
                <p className={`t-xs text-white/60 ${lang === "mr" ? "mr" : ""}`}>
                  {lang === "en" ? rec.reason_en : rec.reason_mr}
                </p>
              </div>
            </div>
          );
        })()}

        {/* Secondary recommendations */}
        <div className="space-y-3 mb-6">
          {recs.slice(1).map((rec, i) => {
            const prog = programs.find(p => p.id === rec.id);
            if (!prog) return null;
            const isSel = selected.includes(rec.id);
            return (
              <div
                key={rec.id}
                onClick={() => toggle(rec.id)}
                className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 anim-fade-up ${
                  isSel ? "border-[var(--sage)] bg-[var(--sage-ghost)]" : "border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:border-[var(--border-default)]"
                }`}
                style={{ animationDelay: `${(i + 4) * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0" style={{ background: "var(--bg-muted)" }}>
                  <img src={prog.image} alt={prog.title_en} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`t-small font-semibold text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                      {lang === "en" ? prog.title_en : prog.title_mr}
                    </p>
                    <span className="badge badge-warm">{rec.match}%</span>
                  </div>
                  <p className={`t-xs text-[var(--text-muted)] truncate ${lang === "mr" ? "mr" : ""}`}>
                    {lang === "en" ? rec.reason_en : rec.reason_mr}
                  </p>
                </div>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                  isSel ? "bg-[var(--sage)] border-[var(--sage)]" : "border-[var(--border-default)]"
                }`} style={{ borderRadius: 4 }}>
                  {isSel && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2">
                      <path d="M2 5l2.5 2.5 3.5-4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Doctor note */}
        <div className="p-5 rounded-2xl border flex items-start gap-4 mb-8"
          style={{ borderColor: "var(--sage-pale)", background: "var(--sage-ghost)" }}>
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
            <img src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=40&h=40&fit=crop" alt="Dr. Anjali" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className={`t-small font-semibold text-[var(--sage)] mb-0.5 ${lang === "mr" ? "mr" : ""}`}>Dr. Anjali Sharma, MD</p>
            <p className={`t-xs text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`}>
              {t(
                "These recommendations are built from your answers and reviewed against clinical guidelines for your age group. You can adjust or remove any program.",
                "या शिफारशी तुमच्या उत्तरांमधून तयार केल्या आहेत आणि तुमच्या वयोगटासाठी क्लिनिकल मार्गदर्शक तत्त्वांनुसार पुनरावलोकन केले आहेत.",
                lang
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Sticky bottom — total + CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-30 px-5 py-4"
        style={{ background: "var(--bg-elevated)", borderTop: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-xl)" }}>
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="t-xs text-[var(--text-muted)]">
              {selected.length} {t("program", "प्रोग्राम", lang)}{selected.length !== 1 ? "s" : ""} {t("selected","निवडले",lang)}
            </p>
            {totalPrice > 0 && (
              <p className="t-h4 text-[var(--text-primary)]" style={{ fontFamily: "var(--font-mono)" }}>
                ₹{totalPrice.toLocaleString()}
              </p>
            )}
          </div>
          <button
            onClick={() => onPlan(selected)}
            disabled={selected.length === 0}
            className={`btn btn-primary btn-lg ${lang === "mr" ? "mr" : ""}`}
          >
            {t("See My Plan →", "माझी योजना पाहा →", lang)}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════════════
export default function AssessmentFlow({ lang, setLang, onBack, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<Answers>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [dir, setDir] = useState<TransitionDir>("fwd");
  const [animating, setAnimating] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const visibleQuestions = QUESTIONS.filter(q => isConditionMet(q, answers));
  const current = visibleQuestions[currentIdx];
  const total = visibleQuestions.length;
  const pct = total > 0 ? ((currentIdx) / total) * 100 : 0;

  const ans = current ? answers[current.id] : undefined;
  const canNext = current ? (() => {
    if (!current.required) return true;
    if (current.type === "multiselect") return Array.isArray(ans) && (ans as string[]).length > 0;
    return !!(ans as string)?.trim?.();
  })() : false;

  // ── Transition helper ──
  const transition = useCallback((newIdx: number, newDir: TransitionDir) => {
    setDir(newDir);
    setAnimating(true);
    setTimeout(() => {
      setCurrentIdx(newIdx);
      setAnimating(false);
    }, 220);
  }, []);

  const handleNext = useCallback(() => {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    if (currentIdx < visibleQuestions.length - 1) {
      transition(currentIdx + 1, "fwd");
    } else {
      setPhase("processing");
      let step = 0;
      const iv = setInterval(() => {
        step++;
        setProcessingStep(step);
        if (step >= PROCESSING_STEPS.length) {
          clearInterval(iv);
          setTimeout(() => setPhase("results"), 600);
        }
      }, 950);
    }
  }, [currentIdx, visibleQuestions.length, transition]);

  const handlePrev = useCallback(() => {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    if (currentIdx > 0) {
      transition(currentIdx - 1, "bwd");
    } else {
      setPhase("intro");
    }
  }, [currentIdx, transition]);

  const handleAnswer = useCallback((id: string, value: string, isMulti = false) => {
    if (isMulti) {
      const prev = (answers[id] as string[]) ?? [];
      const next = prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value];
      setAnswers(a => ({ ...a, [id]: next }));
    } else {
      setAnswers(a => ({ ...a, [id]: value }));
      // Auto-advance single-choice after short delay
      if (!isMulti && current?.type === "choice") {
        autoAdvanceTimer.current = setTimeout(handleNext, 380);
      }
    }
  }, [answers, current?.type, handleNext]);

  // Cleanup auto-advance on unmount / question change
  useEffect(() => {
    return () => { if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current); };
  }, [currentIdx]);

  if (phase === "intro") {
    return <EntryScreen lang={lang} onStart={() => setPhase("questions")} onBack={onBack} />;
  }

  if (phase === "questions" && current) {
    return (
      <QuestionScreen
        question={current}
        answers={answers}
        onAnswer={handleAnswer}
        onNext={handleNext}
        onPrev={handlePrev}
        onExit={onBack}
        qIdx={currentIdx}
        total={total}
        pct={pct}
        lang={lang}
        canNext={canNext}
        dir={dir}
        animating={animating}
      />
    );
  }

  if (phase === "processing") {
    return <ProcessingScreen lang={lang} step={processingStep} />;
  }

  if (phase === "results") {
    return (
      <ResultsScreen
        lang={lang}
        answers={answers}
        onPlan={(cart) => onComplete(cart, answers)}
        onBack={onBack}
      />
    );
  }

  return null;
}

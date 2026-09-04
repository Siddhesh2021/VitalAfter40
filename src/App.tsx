import { useState, useEffect, useRef, useCallback } from "react";
import { programs, professionals, testimonials, t, type Lang } from "./data";
import AssessmentFlow from "./Assessment";
import CheckoutFlow from "./Checkout";
import type { OrderData } from "./Checkout";
import PWADashboard from "./PWA";
import AdminDashboard from "./Admin";
import DesignSystem from "./DesignSystem";
import HomePageNew from "./Home";
import ResultsPage from "./Results";
import ProgramsPageNew from "./Programs";
import BookingFlow from "./Booking";
import SuccessPage from "./Success";

type Page = "home" | "assessment" | "results" | "programs" | "booking" | "professionals" | "checkout" | "success" | "pwa" | "login" | "admin" | "design-system";
type Answers = Record<string, string | string[]>;

// ─── Scroll reveal hook ────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const observe = () => {
      const els = document.querySelectorAll("[data-reveal]:not(.revealed)");
      const io = new IntersectionObserver(
        (entries) => entries.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add("revealed"); io.unobserve(e.target); } }),
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      els.forEach(el => io.observe(el));
      return io;
    };
    const io = observe();
    return () => io.disconnect();
  }, []);
}

// ─── Language toggle ───────────────────────────────────────────────────
function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="lang-toggle">
      <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
      <button className={`mr ${lang === "mr" ? "active" : ""}`} onClick={() => setLang("mr")}>मराठी</button>
    </div>
  );
}

// ─── Nav ───────────────────────────────────────────────────────────────
function Nav({ page, setPage, lang, setLang }: { page: Page; setPage: (p: Page) => void; lang: Lang; setLang: (l: Lang) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isHero = page === "home";

  useEffect(() => {
    setScrolled(window.scrollY > 60);
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [page]);

  const navBg = isHero && !scrolled
    ? "bg-transparent"
    : "bg-[var(--cream)]/95 backdrop-blur-md border-b border-[var(--ink-10)]";

  const textColor = isHero && !scrolled ? "text-white" : "text-[var(--ink-80)]";
  const logoColor = isHero && !scrolled ? "text-white" : "text-[var(--ink-80)]";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-[68px]">
        {/* Logo */}
        <button onClick={() => { setPage("home"); setMenuOpen(false); }} className={`flex items-center gap-2.5 ${logoColor}`}>
          <span className="w-8 h-8 rounded-full bg-[var(--sage)] flex items-center justify-center text-white text-sm font-semibold shrink-0">V</span>
          <span className="font-display text-xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>VitalAfter40</span>
        </button>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-7">
          {[
            { label_en: "Programs", label_mr: "प्रोग्राम्स", page: "programs" as Page },
            { label_en: "Our Team", label_mr: "आमची टीम", page: "professionals" as Page },
          ].map(l => (
            <button key={l.page} onClick={() => setPage(l.page)}
              className={`nav-link ${textColor} ${lang === "mr" ? "mr" : ""}`}>
              {lang === "en" ? l.label_en : l.label_mr}
            </button>
          ))}
          <LangToggle lang={lang} setLang={setLang} />
          <button onClick={() => setPage("login")} className={`nav-link ${textColor} ${lang === "mr" ? "mr" : ""}`}>
            {t("Login", "लॉगिन", lang)}
          </button>
          <button onClick={() => setPage("assessment")} className="btn btn-sm btn-primary">
            <span className={lang === "mr" ? "mr" : ""}>{t("Start Assessment", "मूल्यांकन सुरू करा", lang)}</span>
          </button>
        </div>

        {/* Mobile */}
        <div className="lg:hidden flex items-center gap-3">
          <LangToggle lang={lang} setLang={setLang} />
          <button onClick={() => setMenuOpen(!menuOpen)} className={`flex flex-col gap-1.5 p-1 ${textColor}`} aria-label="Menu">
            <span className={`block h-px w-5 bg-current transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-px w-5 bg-current transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-px w-5 bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[var(--cream)] border-t border-[var(--ink-10)] px-5 py-6 flex flex-col gap-1 anim-slide-up">
          {[
            { label_en: "Programs", label_mr: "प्रोग्राम्स", page: "programs" as Page },
            { label_en: "Our Team", label_mr: "आमची टीम", page: "professionals" as Page },
            { label_en: "Login", label_mr: "लॉगिन", page: "login" as Page },
          ].map(l => (
            <button key={l.page} onClick={() => { setPage(l.page); setMenuOpen(false); }}
              className={`text-left py-3 border-b border-[var(--ink-10)] text-[var(--ink-60)] font-medium ${lang === "mr" ? "mr" : ""}`}>
              {lang === "en" ? l.label_en : l.label_mr}
            </button>
          ))}
          <button onClick={() => { setPage("assessment"); setMenuOpen(false); }} className="btn btn-primary mt-3 w-full justify-center">
            <span className={lang === "mr" ? "mr" : ""}>{t("Start Assessment", "मूल्यांकन सुरू करा", lang)}</span>
          </button>
        </div>
      )}
    </nav>
  );
}

// ─── HOME PAGE ─────────────────────────────────────────────────────────
function HomePage({ setPage, lang }: { setPage: (p: Page) => void; lang: Lang }) {
  useScrollReveal();
  const [activeJourney, setActiveJourney] = useState(0);

  const journey = [
    {
      num: "01", en: "Discover", mr: "शोधा",
      head_en: "Understand where you are today.",
      head_mr: "आज तुम्ही कुठे आहात ते समजून घ्या.",
      body_en: "Your health changes after 40. Your approach should too. We start by understanding your body, your history, and what matters to you.",
      body_mr: "४० नंतर तुमचे आरोग्य बदलते. तुमचा दृष्टीकोन देखील बदलायला हवा. आम्ही तुमचे शरीर समजून घेऊन सुरुवात करतो.",
      img: "https://images.unsplash.com/photo-1658314755811-73c806249f31?w=700&h=500&fit=crop&auto=format",
    },
    {
      num: "02", en: "Assess", mr: "मूल्यांकन",
      head_en: "A clinical lens on your goals.",
      head_mr: "तुमच्या उद्दिष्टांवर क्लिनिकल दृष्टी.",
      body_en: "Our doctor-designed assessment goes deeper than a fitness quiz. It maps your goals, movement, energy, and health to build a complete picture.",
      body_mr: "आमचे डॉक्टर-डिझाइन केलेले मूल्यांकन फिटनेस क्विझपेक्षा खोलवर जाते.",
      img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=700&h=500&fit=crop&auto=format",
    },
    {
      num: "03", en: "Personalize", mr: "वैयक्तिकृत",
      head_en: "A plan shaped around you.",
      head_mr: "तुमच्याभोवती आकारलेली योजना.",
      body_en: "No generic programs. Your results drive your recommendations — the right services, the right professionals, at the right intensity for where you are now.",
      body_mr: "कोणतेही सामान्य प्रोग्राम नाहीत. तुमचे परिणाम तुमच्या शिफारसी तयार करतात.",
      img: "https://images.unsplash.com/photo-1658314755561-389d5660ee54?w=700&h=500&fit=crop&auto=format",
    },
    {
      num: "04", en: "Transform", mr: "परिवर्तन",
      head_en: "Progress, not perfection.",
      head_mr: "परिपूर्णता नाही, प्रगती.",
      body_en: "With consistent expert guidance, your body responds. Stronger movement. Better energy. A version of you that's genuinely healthier than last year.",
      body_mr: "सातत्यपूर्ण तज्ञ मार्गदर्शनाने, तुमचे शरीर प्रतिसाद देते.",
      img: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=700&h=500&fit=crop&auto=format",
    },
  ];

  const services = [
    { id: "pilates-group", featured: true, icon: "◯", en: "Pilates", mr: "पिलाटेस", sub_en: "Group · Individual · Recorded", sub_mr: "ग्रुप · वैयक्तिक · रेकॉर्डेड", img: "https://images.unsplash.com/photo-1679688301686-b164852aed9b?w=900&h=600&fit=crop&auto=format" },
    { id: "strength", featured: false, icon: "↑", en: "Strength", mr: "ताकद", sub_en: "Progressive muscle & bone health", sub_mr: "प्रगतीशील स्नायू आणि हाड", img: "https://images.unsplash.com/photo-1692372372810-c848c9cca1c5?w=600&h=400&fit=crop&auto=format" },
    { id: "physio", featured: false, icon: "✦", en: "Physiotherapy", mr: "फिजिओथेरपी", sub_en: "Pain · recovery · movement", sub_mr: "वेदना · पुनर्प्राप्ती · हालचाल", img: "https://images.unsplash.com/photo-1658314755561-389d5660ee54?w=600&h=400&fit=crop&auto=format" },
    { id: "nutrition", featured: false, icon: "◆", en: "Nutrition", mr: "पोषण", sub_en: "Food as medicine for 40+", sub_mr: "४०+ साठी औषध म्हणून अन्न", img: "https://images.unsplash.com/photo-1621886178958-be42369fc9e7?w=600&h=400&fit=crop&auto=format" },
    { id: "doctor", featured: false, icon: "⊕", en: "Doctor-led Care", mr: "डॉक्टर नेतृत्व", sub_en: "Internal medicine & longevity", sub_mr: "अंतर्गत औषध आणि दीर्घायुष्य", img: "https://images.unsplash.com/photo-1658314755811-73c806249f31?w=600&h=400&fit=crop&auto=format" },
    { id: "hormonal", featured: false, icon: "◉", en: "Hormonal Wellness", mr: "हार्मोनल वेलनेस", sub_en: "Evidence-based hormonal health", sub_mr: "पुरावा-आधारित हार्मोनल आरोग्य", img: "https://images.unsplash.com/photo-1574310094148-ca48ab86734c?w=600&h=400&fit=crop&auto=format" },
    { id: "recorded", featured: false, icon: "▷", en: "On-demand Content", mr: "ऑन-डिमांड सामग्री", sub_en: "Video library · anytime access", sub_mr: "व्हिडिओ लायब्ररी · कधीही प्रवेश", img: "https://images.unsplash.com/photo-1763403921315-f2ef8697199f?w=600&h=400&fit=crop&auto=format" },
    { id: "sexual-w", featured: false, icon: "♡", en: "Men's & Women's Wellness", mr: "पुरुष आणि महिला वेलनेस", sub_en: "Discreet, expert-led programs", sub_mr: "विवेकी, तज्ञ-नेतृत्व प्रोग्राम्स", img: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=600&h=400&fit=crop&auto=format" },
  ];

  const featured = services[0];
  const rest = services.slice(1);

  return (
    <div className="page-enter">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-end pb-20 md:pb-0 md:items-center overflow-hidden bg-[var(--ink)]">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1658314755811-73c806249f31?w=1600&h=1000&fit=crop&auto=format"
            alt=""
            className="w-full h-full object-cover opacity-25 scale-105"
            style={{ transform: "scale(1.05)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--ink)] via-[var(--ink)]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/80 via-transparent to-[var(--ink)]/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-32 md:py-0 grid md:grid-cols-2 gap-12 items-center w-full">
          {/* Copy */}
          <div>
            <span className="t-label text-[var(--sage-light)] anim-fade-in">
              {t("Doctor-led · 40+ Wellness", "डॉक्टर नेतृत्व · ४०+ वेलनेस", lang)}
            </span>

            <h1 className={`t-hero text-white mt-5 mb-6 anim-fade-up delay-200 ${lang === "mr" ? "mr" : ""}`}
              style={{ fontFamily: "var(--font-display)" }}>
              {lang === "en" ? (
                <>Your best years<br />aren't behind you.<br />
                  <em className="text-[var(--sage-light)] not-italic">They're stronger ahead.</em>
                </>
              ) : (
                <>तुमची सर्वोत्तम वर्षे<br />मागे नाहीत.<br />
                  <em className="text-[var(--sage-light)] not-italic">ती पुढे मजबूत आहेत.</em>
                </>
              )}
            </h1>

            <p className={`t-body-lg text-white/60 max-w-md mb-10 anim-fade-up delay-300 ${lang === "mr" ? "mr" : ""}`}>
              {t(
                "Doctor-led health, fitness and wellness programs designed around your body, your goals and your life after 40.",
                "तुमचे शरीर, तुमची उद्दिष्टे आणि ४० नंतरच्या जीवनाभोवती डॉक्टर-नेतृत्व कार्यक्रम.",
                lang
              )}
            </p>

            <div className="flex flex-wrap gap-3 anim-fade-up delay-400">
              <button onClick={() => setPage("assessment")} className="btn btn-lg btn-primary">
                <span className={lang === "mr" ? "mr" : ""}>{t("Take Your Health Assessment", "आरोग्य मूल्यांकन करा", lang)}</span>
                <span className="text-white/60">→</span>
              </button>
              <button onClick={() => setPage("programs")} className="btn btn-lg btn-outline border-white/25 text-white hover:bg-white/10 hover:border-white/50">
                <span className={lang === "mr" ? "mr" : ""}>{t("Explore Programs", "प्रोग्राम्स पाहा", lang)}</span>
              </button>
            </div>

            {/* Inline trust signals */}
            <div className="flex items-center gap-6 mt-12 anim-fade-in delay-600">
              {[
                { val: "2,400+", label_en: "Patients helped", label_mr: "रुग्णांना मदत" },
                { val: "4.9★", label_en: "Patient rating", label_mr: "रुग्ण रेटिंग" },
                { val: "18 yrs", label_en: "Clinical experience", label_mr: "क्लिनिकल अनुभव" },
              ].map(s => (
                <div key={s.val}>
                  <p className="font-display text-xl text-white font-light" style={{ fontFamily: "var(--font-display)" }}>{s.val}</p>
                  <p className={`t-xs text-white/40 mt-0.5 ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? s.label_en : s.label_mr}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor float card */}
          <div className="hidden md:flex justify-end anim-fade-up delay-500">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=440&h=560&fit=crop&auto=format"
                alt="Dr. Rahul Sharma"
                className="w-72 h-96 object-cover rounded-2xl"
              />
              {/* Floating credential card */}
              <div className="float-card absolute -bottom-5 -left-10 w-56">
                <p className="t-label text-[var(--sage-mid)] mb-1">{t("Founder & Chief Doctor", "संस्थापक डॉक्टर", lang)}</p>
                <p className="font-medium text-[var(--ink-80)] text-sm" style={{ fontFamily: "var(--font-display)" }}>
                  {t("Dr. Rahul Sharma", "डॉ. राहुल शर्मा", lang)}
                </p>
                <p className="t-xs text-[var(--ink-40)] mt-0.5">MD · Internal Medicine · 18 yrs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 anim-fade-in delay-700">
          <span className="t-xs text-white tracking-widest uppercase">Scroll</span>
          <span className="block w-px h-8 bg-white" style={{ animation: "fade-up 1.5s ease infinite alternate" }} />
        </div>
      </section>

      {/* ── Assessment Teaser ─────────────────────────────────────── */}
      <section className="py-20 bg-[var(--sage)]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div data-reveal>
            <p className="t-label text-[var(--sage-pale)] mb-3">{t("Not sure where to start?", "कुठून सुरुवात करायची माहीत नाही?", lang)}</p>
            <h2 className={`t-h2 text-white ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
              {t("Take our 3-minute\nhealth assessment.", "आमचे ३-मिनिटांचे\nआरोग्य मूल्यांकन करा.", lang)}
            </h2>
            <div className="flex gap-6 mt-5">
              {[
                { en: "3–5 min", mr: "३-५ मिनिटे" },
                { en: "Private", mr: "खाजगी" },
                { en: "Personalised", mr: "वैयक्तिकृत" },
              ].map(i => (
                <div key={i.en} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0"/>
                  <span className={`t-small text-white/70 ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? i.en : i.mr}</span>
                </div>
              ))}
            </div>
          </div>
          <div data-reveal data-reveal-delay="2" className="shrink-0">
            <button onClick={() => setPage("assessment")} className="btn btn-lg btn-white">
              <span className={lang === "mr" ? "mr" : ""}>{t("Start Free Assessment →", "मोफत मूल्यांकन सुरू करा →", lang)}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Services: Asymmetric grid ─────────────────────────────── */}
      <section className="py-24 bg-[var(--cream)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-14" data-reveal>
            <p className="t-label text-[var(--sage-mid)] mb-3">{t("One platform", "एक प्लॅटफॉर्म", lang)}</p>
            <h2 className={`t-h1 text-[var(--ink-80)] max-w-lg ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
              {t("Your complete wellness ecosystem.", "तुमची संपूर्ण वेलनेस परिसंस्था.", lang)}
            </h2>
          </div>

          {/* Featured: Pilates */}
          <div className="grid lg:grid-cols-2 gap-5 mb-5">
            <button onClick={() => setPage("programs")} data-reveal className="group relative rounded-2xl overflow-hidden h-72 md:h-96 text-left">
              <img src={featured.img} alt={featured.en} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <p className="t-label text-white/60 mb-2">{featured.icon} {t("Featured", "वैशिष्ट्यीकृत", lang)}</p>
                <h3 className={`font-display text-4xl text-white font-light ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                  {lang === "en" ? featured.en : featured.mr}
                </h3>
                <p className={`t-small text-white/60 mt-1 ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? featured.sub_en : featured.sub_mr}</p>
                <span className="inline-flex items-center gap-1.5 text-[var(--sage-light)] t-small mt-3 group-hover:gap-3 transition-all">
                  {t("Explore", "पाहा", lang)} →
                </span>
              </div>
            </button>

            {/* 3-column for rest (desktop) / 2 cols (mobile) */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
              {rest.slice(0, 4).map((s, i) => (
                <button key={s.id} onClick={() => setPage("programs")} data-reveal data-reveal-delay={`${i + 1}`}
                  className="group relative rounded-xl overflow-hidden h-36 sm:h-44 text-left">
                  <img src={s.img} alt={s.en} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white/50 text-sm mb-0.5">{s.icon}</p>
                    <p className={`font-medium text-white text-sm ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                      {lang === "en" ? s.en : s.mr}
                    </p>
                    <p className={`text-white/50 text-xs mt-0.5 ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? s.sub_en : s.sub_mr}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom row: remaining 4 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {rest.slice(4).map((s, i) => (
              <button key={s.id} onClick={() => setPage("programs")} data-reveal data-reveal-delay={`${i + 1}`}
                className="group relative rounded-xl overflow-hidden h-32 text-left">
                <img src={s.img} alt={s.en} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white/50 text-xs mb-0.5">{s.icon}</p>
                  <p className={`text-white text-sm font-medium leading-tight ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? s.en : s.mr}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Doctor Section ────────────────────────────────────────── */}
      <section className="bg-[var(--ink)] overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-24 grid lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <div className="relative order-2 lg:order-1" data-reveal="left">
            <img
              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=700&h=850&fit=crop&auto=format"
              alt="Dr. Rahul Sharma"
              className="w-full max-w-md mx-auto lg:mx-0 rounded-2xl object-cover h-[500px] lg:h-[620px]"
            />
            {/* Floating stats */}
            <div className="float-card absolute top-6 -right-4 lg:-right-10 w-48">
              <p className="t-stat text-[var(--sage-mid)]">18</p>
              <p className={`t-xs text-[var(--ink-40)] mt-1 ${lang === "mr" ? "mr" : ""}`}>{t("years of practice", "वर्षांचा अनुभव", lang)}</p>
            </div>
            <div className="float-card absolute bottom-10 -right-4 lg:-right-10 w-52">
              <p className="t-stat text-[var(--sage-mid)]">2,400+</p>
              <p className={`t-xs text-[var(--ink-40)] mt-1 ${lang === "mr" ? "mr" : ""}`}>{t("patients served", "रुग्णांना सेवा", lang)}</p>
            </div>
          </div>

          {/* Copy side */}
          <div className="order-1 lg:order-2" data-reveal="right">
            <p className="t-label text-[var(--sage-light)] mb-5">{t("The face of VitalAfter40", "VitalAfter40 चा चेहरा", lang)}</p>
            <h2 className={`t-h1 text-white mb-6 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
              {lang === "en" ? (
                <>Led by a doctor.<br />Built around you.</>
              ) : (
                <>डॉक्टरांद्वारे नेतृत्व.<br />तुमच्याभोवती बांधलेले.</>
              )}
            </h2>
            <p className={`t-body-lg text-white/55 mb-8 max-w-md ${lang === "mr" ? "mr" : ""}`}>
              {t(
                "Dr. Rahul Sharma believes the 40s are the most important decade to invest in your health. Combining 18 years of clinical practice with a genuine understanding of what it means to age well — every program here carries his medical authority.",
                "डॉ. राहुल शर्मा यांचा विश्वास आहे की ४०चे दशक तुमच्या आरोग्यात गुंतवणूक करण्यासाठी सर्वात महत्त्वाचे दशक आहे.",
                lang
              )}
            </p>

            {/* Specializations */}
            <div className="flex flex-wrap gap-2 mb-8">
              {[
                { en: "Healthy Ageing", mr: "निरोगी वृद्धत्व" },
                { en: "Hormonal Wellness", mr: "हार्मोनल वेलनेस" },
                { en: "Longevity Medicine", mr: "दीर्घायुष्य चिकित्सा" },
                { en: "Internal Medicine", mr: "अंतर्गत औषध" },
              ].map(s => (
                <span key={s.en} className={`badge badge-sage ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? s.en : s.mr}</span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setPage("professionals")} className="btn btn-outline border-white/20 text-white hover:bg-white/8 hover:border-white/40">
                <span className={lang === "mr" ? "mr" : ""}>{t("Meet the full team →", "पूर्ण टीम पाहा →", lang)}</span>
              </button>
              <button onClick={() => setPage("assessment")} className="btn btn-primary">
                <span className={lang === "mr" ? "mr" : ""}>{t("Start with an assessment", "मूल्यांकनाने सुरुवात करा", lang)}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Journey: Scroll narrative ─────────────────────────────── */}
      <section className="py-24 bg-[var(--paper)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-14" data-reveal>
            <p className="t-label text-[var(--sage-mid)] mb-3">{t("The journey", "प्रवास", lang)}</p>
            <h2 className={`t-h1 text-[var(--ink-80)] max-w-md ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
              {t("From discovery to transformation.", "शोधापासून परिवर्तनापर्यंत.", lang)}
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Step selector */}
            <div className="space-y-1">
              {journey.map((j, i) => (
                <button key={j.num} onClick={() => setActiveJourney(i)}
                  className={`w-full text-left p-5 rounded-xl transition-all duration-300 border ${activeJourney === i ? "bg-[var(--warm-white)] border-[var(--ink-10)] shadow-sm" : "border-transparent hover:bg-white/60"}`}>
                  <div className="flex items-start gap-4">
                    <span className="t-label text-[var(--sage-mid)] mt-1 shrink-0">{j.num}</span>
                    <div>
                      <h3 className={`font-semibold text-[var(--ink-80)] text-base mb-1 ${lang === "mr" ? "mr" : ""}`}
                        style={activeJourney === i ? { fontFamily: "var(--font-display)", fontSize: "1.2rem" } : {}}>
                        {lang === "en" ? j.en : j.mr}
                      </h3>
                      {activeJourney === i && (
                        <p className={`t-small text-[var(--ink-40)] mt-2 ${lang === "mr" ? "mr" : ""}`}>
                          {lang === "en" ? j.body_en : j.body_mr}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Progress bar for active */}
                  {activeJourney === i && (
                    <div className="mt-4 ml-10 h-0.5 bg-[var(--ink-10)] rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--sage)] rounded-full" style={{ width: "100%", animation: "progress-fill 4s linear forwards" }} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Image panel */}
            <div className="relative lg:sticky lg:top-28 h-72 lg:h-[420px] rounded-2xl overflow-hidden" data-reveal="right">
              {journey.map((j, i) => (
                <img key={j.num} src={j.img} alt={j.en}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${activeJourney === i ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className={`font-display text-white text-2xl ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                  {lang === "en" ? journey[activeJourney].head_en : journey[activeJourney].head_mr}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Programs preview ──────────────────────────────────────── */}
      <section className="py-24 bg-[var(--cream)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-end justify-between mb-12" data-reveal>
            <div>
              <p className="t-label text-[var(--sage-mid)] mb-3">{t("Programs", "प्रोग्राम्स", lang)}</p>
              <h2 className={`t-h1 text-[var(--ink-80)] ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                {t("Built for your body\nafter 40.", "४० नंतर\nतुमच्या शरीरासाठी.", lang)}
              </h2>
            </div>
            <button onClick={() => setPage("programs")} className="hidden sm:flex btn btn-outline btn-sm text-[var(--ink-60)]">
              {t("View all →", "सर्व पाहा →", lang)}
            </button>
          </div>

          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="h-scroll md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-5">
            {programs.slice(0, 4).map((p, i) => (
              <div key={p.id} data-reveal data-reveal-delay={`${i + 1}`}
                className="card shrink-0 w-72 md:w-auto">
                <div className="card-img h-44">
                  <img src={p.image} alt={p.title_en} />
                </div>
                <div className="p-5">
                  <p className="t-label text-[var(--sage-mid)] mb-2">{p.category}</p>
                  <h3 className={`t-h3 text-[var(--ink-80)] mb-1 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                    {lang === "en" ? p.title_en : p.title_mr}
                  </h3>
                  <p className={`t-small text-[var(--ink-40)] mb-4 line-clamp-2 ${lang === "mr" ? "mr" : ""}`}>
                    {lang === "en" ? p.desc_en : p.desc_mr}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-[var(--ink-80)] font-semibold text-xl" style={{ fontFamily: "var(--font-display)" }}>₹{p.price.toLocaleString()}</p>
                    <button onClick={() => setPage("programs")} className="btn btn-sm btn-primary">
                      <span className={lang === "mr" ? "mr" : ""}>{t("Enrol", "प्रवेश घ्या", lang)}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="sm:hidden text-center mt-6">
            <button onClick={() => setPage("programs")} className="btn btn-outline">
              <span className={lang === "mr" ? "mr" : ""}>{t("View all programs →", "सर्व प्रोग्राम्स पाहा →", lang)}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────── */}
      <section className="py-24 bg-[var(--ink)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-14" data-reveal>
            <p className="t-label text-[var(--sage-light)] mb-3">{t("Real results", "खरे परिणाम", lang)}</p>
            <h2 className={`t-h1 text-white max-w-sm ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
              {t("People who chose to invest in themselves.", "स्वतःमध्ये गुंतवणूक करण्याचे निवडलेले.", lang)}
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {testimonials.map((tm, i) => (
              <div key={i} data-reveal data-reveal-delay={`${i + 1}`}
                className="border border-white/8 rounded-2xl p-7 hover:border-white/15 transition-colors">
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(tm.rating)].map((_, j) => (
                    <svg key={j} width="14" height="14" viewBox="0 0 14 14" fill="#b8965a"><path d="M7 1l1.8 3.6 4 .6-2.9 2.8.7 4L7 10.1 3.4 12l.7-4L1.2 5.2l4-.6z"/></svg>
                  ))}
                </div>
                <blockquote className={`text-white/70 text-sm leading-relaxed mb-6 ${lang === "mr" ? "mr" : ""}`}>
                  "{lang === "en" ? tm.quote_en : tm.quote_mr}"
                </blockquote>
                <div className="border-t border-white/8 pt-4">
                  <p className="text-white font-medium text-sm">{lang === "en" ? tm.name_en : tm.name_mr}</p>
                  <p className={`t-xs text-white/35 mt-0.5 ${lang === "mr" ? "mr" : ""}`}>
                    {t("Age", "वय", lang)} {tm.age} · {lang === "en" ? tm.city_en : tm.city_mr} · {lang === "en" ? tm.program_en : tm.program_mr}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────── */}
      <section className="py-28 bg-[var(--sage)]">
        <div className="max-w-2xl mx-auto px-5 text-center" data-reveal>
          <h2 className={`t-h1 text-white mb-5 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
            {t("Your health changes after 40.\nYour approach should too.", "४० नंतर तुमचे आरोग्य बदलते.\nतुमचा दृष्टीकोन देखील बदलायला हवा.", lang)}
          </h2>
          <p className={`t-body-lg text-white/65 mb-10 ${lang === "mr" ? "mr" : ""}`}>
            {t("Start with a free assessment. No commitment. Built for where you are today.", "मोफत मूल्यांकनाने सुरुवात करा. कोणतीही वचनबद्धता नाही.", lang)}
          </p>
          <button onClick={() => setPage("assessment")} className="btn btn-lg btn-white">
            <span className={lang === "mr" ? "mr" : ""}>{t("Take Your Health Assessment →", "आरोग्य मूल्यांकन करा →", lang)}</span>
          </button>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="bg-[var(--ink-80)] py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 sm:col-span-1">
            <p className="font-display text-white text-xl mb-3" style={{ fontFamily: "var(--font-display)" }}>VitalAfter40</p>
            <p className={`t-small text-white/35 leading-relaxed ${lang === "mr" ? "mr" : ""}`}>
              {t("Doctor-led health for life after 40.", "४० नंतरच्या जीवनासाठी डॉक्टर-नेतृत्व आरोग्य.", lang)}
            </p>
          </div>
          {[
            { head_en: "Programs", head_mr: "प्रोग्राम्स", items: ["Pilates", "Strength", "Nutrition", "Physiotherapy"] },
            { head_en: "Company", head_mr: "कंपनी", items: ["About", "Team", "Blog", "Contact"] },
            { head_en: "Legal", head_mr: "कायदेशीर", items: ["Privacy", "Terms", "Medical Disclaimer"] },
          ].map(col => (
            <div key={col.head_en}>
              <p className={`t-label text-white/30 mb-4 ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? col.head_en : col.head_mr}</p>
              <ul className="space-y-2.5">
                {col.items.map(item => (
                  <li key={item}><button className="t-small text-white/45 hover:text-white/70 transition-colors">{item}</button></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 border-t border-white/8 pt-8 flex flex-col sm:flex-row justify-between gap-3">
          <p className="t-xs text-white/25">© 2024 VitalAfter40. {t("All rights reserved.", "सर्व हक्क राखीव.", lang)}</p>
          <p className={`t-xs text-white/25 ${lang === "mr" ? "mr" : ""}`}>{t("Not a substitute for medical advice.", "वैद्यकीय सल्ल्याचा पर्याय नाही.", lang)}</p>
        </div>
      </footer>
    </div>
  );
}

// ─── PROGRAMS PAGE ─────────────────────────────────────────────────────
function ProgramsPage({ setPage, lang }: { setPage: (p: Page) => void; lang: Lang }) {
  useScrollReveal();
  const [filter, setFilter] = useState("all");
  const cats = [
    { id: "all", en: "All", mr: "सर्व" },
    { id: "pilates", en: "Pilates", mr: "पिलाटेस" },
    { id: "strength", en: "Strength", mr: "ताकद" },
    { id: "nutrition", en: "Nutrition", mr: "पोषण" },
    { id: "physio", en: "Physiotherapy", mr: "फिजिओथेरपी" },
    { id: "medical", en: "Medical", mr: "वैद्यकीय" },
    { id: "wellness", en: "Wellness", mr: "वेलनेस" },
  ];
  const filtered = filter === "all" ? programs : programs.filter(p => p.category === filter);

  return (
    <div className="pt-[68px] page-enter">
      {/* Header */}
      <div className="bg-[var(--ink)] py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <p className="t-label text-[var(--sage-light)] mb-4">{t("All Programs", "सर्व प्रोग्राम्स", lang)}</p>
          <h1 className={`t-hero text-white max-w-2xl ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
            {t("Built for your body after 40.", "४० नंतर तुमच्या शरीरासाठी.", lang)}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
        {/* Filter tabs */}
        <div className="h-scroll mb-10">
          {cats.map(c => (
            <button key={c.id} onClick={() => setFilter(c.id)}
              className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${filter === c.id ? "bg-[var(--ink-80)] text-white border-[var(--ink-80)]" : "border-[var(--ink-10)] text-[var(--ink-60)] hover:border-[var(--ink-40)]"} ${lang === "mr" ? "mr" : ""}`}>
              {lang === "en" ? c.en : c.mr}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((p, i) => (
            <div key={p.id} data-reveal data-reveal-delay={`${(i % 4) + 1}`} className="card">
              <div className="card-img h-44 relative">
                <img src={p.image} alt={p.title_en} />
                {p.badge_en && (
                  <span className="absolute top-3 left-3 badge badge-dark">{lang === "en" ? p.badge_en : p.badge_mr}</span>
                )}
              </div>
              <div className="p-5">
                <p className="t-label text-[var(--sage-mid)] mb-2">{p.category}</p>
                <h3 className={`t-h3 text-[var(--ink-80)] mb-2 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                  {lang === "en" ? p.title_en : p.title_mr}
                </h3>
                <p className={`t-small text-[var(--ink-40)] mb-4 line-clamp-2 ${lang === "mr" ? "mr" : ""}`}>
                  {lang === "en" ? p.desc_en : p.desc_mr}
                </p>
                <p className={`t-xs text-[var(--ink-40)] mb-4 ${lang === "mr" ? "mr" : ""}`}>
                  {lang === "en" ? p.duration_en : p.duration_mr} · {lang === "en" ? p.level_en : p.level_mr}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-[var(--ink-80)] font-semibold text-xl" style={{ fontFamily: "var(--font-display)" }}>₹{p.price.toLocaleString()}</p>
                  <button onClick={() => setPage("assessment")} className="btn btn-sm btn-primary">
                    <span className={lang === "mr" ? "mr" : ""}>{t("Enrol", "प्रवेश घ्या", lang)}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PROFESSIONALS PAGE ────────────────────────────────────────────────
function ProfessionalsPage({ setPage, lang }: { setPage: (p: Page) => void; lang: Lang }) {
  useScrollReveal();
  return (
    <div className="pt-[68px] page-enter">
      <div className="bg-[var(--ink)] py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <p className="t-label text-[var(--sage-light)] mb-4">{t("The Team", "टीम", lang)}</p>
          <h1 className={`t-hero text-white max-w-xl ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
            {t("Doctors, coaches & experts.", "डॉक्टर, कोच आणि तज्ञ.", lang)}
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 space-y-6">
        {professionals.map((pro, i) => (
          <div key={pro.id} data-reveal className={`card overflow-visible ${pro.isFounder ? "ring-1 ring-[var(--sage-pale)]" : ""}`}>
            <div className={`flex flex-col ${pro.isFounder ? "md:flex-row" : "sm:flex-row"}`}>
              <div className={`relative shrink-0 ${pro.isFounder ? "md:w-72 h-64 md:h-auto" : "sm:w-52 h-52"}`}>
                <img src={pro.image} alt={pro.name_en} className="w-full h-full object-cover" />
                {pro.isFounder && (
                  <div className="absolute bottom-3 left-3 badge badge-dark text-xs px-3 py-1">
                    {t("Founder", "संस्थापक", lang)}
                  </div>
                )}
              </div>
              <div className="p-7 flex-1">
                <p className="t-label text-[var(--sage-mid)] mb-2">{lang === "en" ? pro.role_en : pro.role_mr}</p>
                <h2 className={`t-h2 text-[var(--ink-80)] mb-1 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                  {lang === "en" ? pro.name_en : pro.name_mr}
                </h2>
                <p className="t-small text-[var(--ink-40)] mb-4">{lang === "en" ? pro.qual_en : pro.qual_mr}</p>
                <p className={`t-body text-[var(--ink-60)] mb-5 max-w-xl ${lang === "mr" ? "mr" : ""}`}>
                  {lang === "en" ? pro.bio_en : pro.bio_mr}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(lang === "en" ? pro.spec_en : pro.spec_mr).map(s => (
                    <span key={s} className={`badge badge-sage ${lang === "mr" ? "mr" : ""}`}>{s}</span>
                  ))}
                </div>
                <button onClick={() => setPage("assessment")} className="btn btn-sm btn-primary mt-5">
                  <span className={lang === "mr" ? "mr" : ""}>{t("Book a session →", "सेशन बुक करा →", lang)}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── LOGIN PAGE ────────────────────────────────────────────────────────
function LoginPage({ setPage, lang }: { setPage: (p: Page) => void; lang: Lang }) {
  const [form, setForm] = useState({ credential: "", password: "" });

  return (
    <div className="pt-[68px] min-h-screen bg-[var(--cream)] flex items-center justify-center px-5 page-enter">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <span className="w-12 h-12 rounded-full bg-[var(--sage)] text-white font-semibold text-lg flex items-center justify-center mx-auto mb-4">V</span>
          <h1 className="font-display text-3xl text-[var(--ink-80)]" style={{ fontFamily: "var(--font-display)" }}>VitalAfter40</h1>
          <p className={`t-small text-[var(--ink-40)] mt-1 ${lang === "mr" ? "mr" : ""}`}>{t("Welcome back", "पुन्हा स्वागत", lang)}</p>
        </div>

        <div className="card p-7 space-y-4">
          <div>
            <label className={`t-xs text-[var(--ink-40)] block mb-1.5 ${lang === "mr" ? "mr" : ""}`}>{t("Phone or Email", "फोन किंवा ईमेल", lang)}</label>
            <input className="field" value={form.credential} onChange={e => setForm({ ...form, credential: e.target.value })}
              placeholder={t("your@email.com", "your@email.com", lang)} />
          </div>
          <div>
            <label className={`t-xs text-[var(--ink-40)] block mb-1.5 ${lang === "mr" ? "mr" : ""}`}>{t("Password", "पासवर्ड", lang)}</label>
            <input type="password" className="field" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <button onClick={() => setPage("pwa")} className="btn btn-primary w-full justify-center">
            <span className={lang === "mr" ? "mr" : ""}>{t("Login →", "लॉगिन →", lang)}</span>
          </button>
          <p className={`text-center t-small text-[var(--ink-40)] ${lang === "mr" ? "mr" : ""}`}>
            {t("No account?", "खाते नाही?", lang)}{" "}
            <button onClick={() => setPage("assessment")} className="text-[var(--sage)] hover:underline">
              {t("Start assessment", "मूल्यांकन सुरू करा", lang)}
            </button>
          </p>
        </div>
        <p className="text-center mt-6">
          <button onClick={() => setPage("admin")} className="t-xs text-[var(--ink-20)] hover:text-[var(--ink-40)] transition-colors">
            {t("Admin access →", "अॅडमिन प्रवेश →", lang)}
          </button>
        </p>
      </div>
    </div>
  );
}

// ─── ROOT ──────────────────────────────────────────────────────────────
// ─── Page transition wrapper ───────────────────────────────────────────
function PageShell({ pageKey, children }: { pageKey: string; children: React.ReactNode }) {
  const [animKey, setAnimKey] = useState(pageKey);
  const [visible, setVisible] = useState(true);
  const prevKey = useRef(pageKey);

  useEffect(() => {
    if (pageKey !== prevKey.current) {
      setVisible(false);
      const t = setTimeout(() => {
        prevKey.current = pageKey;
        setAnimKey(pageKey);
        setVisible(true);
      }, 180);
      return () => clearTimeout(t);
    }
  }, [pageKey]);

  return (
    <div
      key={animKey}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(6px)",
        transition: visible
          ? "opacity 0.42s cubic-bezier(0.16,1,0.3,1), transform 0.42s cubic-bezier(0.16,1,0.3,1)"
          : "opacity 0.18s ease, transform 0.18s ease",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [lang, setLang] = useState<Lang>("en");
  const [cart, setCart] = useState<string[]>([]);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Answers>({});
  const [bookingProgramId, setBookingProgramId] = useState("pilates-group");
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const prevPage = useRef<Page>("home");

  const navigate = useCallback((p: Page) => {
    prevPage.current = page;
    setPage(p);
    if (p !== "admin" && p !== "pwa") window.scrollTo({ top: 0, behavior: "instant" });
  }, [page]);

  const isFullscreen = page === "admin" || page === "pwa" || page === "design-system" || page === "assessment" || page === "results" || page === "booking" || page === "success";

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      {!isFullscreen && <Nav page={page} setPage={navigate} lang={lang} setLang={setLang} />}

      <PageShell pageKey={page}>
        {page === "home" && <HomePageNew setPage={navigate} lang={lang} setLang={setLang} />}
        {page === "programs" && (
          <ProgramsPageNew
            lang={lang}
            onBook={(programId) => { setBookingProgramId(programId); navigate("booking"); }}
            onAssessment={() => navigate("assessment")}
            onBack={() => navigate("home")}
          />
        )}
        {page === "booking" && (
          <BookingFlow
            lang={lang}
            programId={bookingProgramId}
            onConfirm={(ids) => { setCart(ids); navigate("checkout"); }}
            onBack={() => navigate("programs")}
          />
        )}
        {page === "professionals" && <ProfessionalsPage setPage={navigate} lang={lang} />}
        {page === "login" && <LoginPage setPage={navigate} lang={lang} />}
        {page === "assessment" && (
          <AssessmentFlow
            lang={lang}
            setLang={setLang}
            onBack={() => navigate("home")}
            onComplete={(selectedCart, answers) => {
              setCart(selectedCart);
              if (answers) setAssessmentAnswers(answers);
              navigate("results");
            }}
          />
        )}
        {page === "results" && (
          <ResultsPage
            lang={lang}
            answers={assessmentAnswers}
            onBuild={(plan) => {
              setCart(plan.map(p => p.programId));
              navigate("checkout");
            }}
            onBack={() => navigate("assessment")}
          />
        )}
        {page === "checkout" && (
          <CheckoutFlow
            lang={lang}
            setLang={setLang}
            cart={cart}
            onBack={() => navigate(prevPage.current === "booking" ? "booking" : "results")}
            onSuccess={(data) => { setOrderData(data); navigate("success"); }}
          />
        )}
        {page === "success" && orderData && (
          <SuccessPage
            lang={lang}
            order={orderData}
            onDashboard={() => navigate("pwa")}
          />
        )}
        {page === "pwa" && (
          <PWADashboard
            lang={lang}
            setLang={setLang}
            onBack={() => navigate("home")}
          />
        )}
        {page === "admin" && (
          <AdminDashboard
            lang={lang}
            setLang={setLang}
            onBack={() => navigate("home")}
          />
        )}
        {page === "design-system" && <DesignSystem />}
      </PageShell>
    </div>
  );
}

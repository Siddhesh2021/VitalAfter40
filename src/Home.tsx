import { useState, useEffect, useRef } from "react";
import { t, type Lang, programs, professionals, testimonials } from "./data";

// ─── Types ─────────────────────────────────────────────────────────────────
type Page = "home" | "assessment" | "programs" | "professionals" | "checkout" | "pwa" | "login" | "admin" | "design-system";

interface HomeProps {
  setPage: (p: Page) => void;
  lang: Lang;
}

// ─── Scroll reveal ──────────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]:not(.revealed)");
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { (e.target as HTMLElement).classList.add("revealed"); io.unobserve(e.target); }
      }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ─── Parallax hook ──────────────────────────────────────────────────────────
function useParallax(factor = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      if (ref.current) {
        const y = window.scrollY * factor;
        ref.current.style.transform = `translateY(${y}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [factor]);
  return ref;
}

// ═══════════════════════════════════════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════════════════════════════════════
function HeroSection({ setPage, lang }: HomeProps) {
  const parallaxRef = useParallax(0.25);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[var(--ink)]">
      {/* Background image with parallax */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div ref={parallaxRef} className="absolute inset-[-15%] w-[130%] h-[130%]">
          <img
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1800&h=1200&fit=crop&auto=format"
            alt=""
            className="w-full h-full object-cover"
            style={{ opacity: 0.3 }}
          />
        </div>
        {/* Gradient vignettes */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--ink)] via-[var(--ink)]/75 to-[var(--ink)]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/90 via-transparent to-[var(--ink)]/50" />
        {/* Warm grain overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 xl:px-16 w-full pt-32 pb-24 lg:pt-[88px]">
        <div className="max-w-3xl">

          {/* Overline */}
          <div className="flex items-center gap-3 mb-8 anim-fade-in">
            <div className="w-6 h-px bg-[var(--sage-light)]" />
            <span className={`t-label text-[var(--sage-light)] ${lang === "mr" ? "mr" : ""}`}>
              {t("Doctor-led · 40+ Health & Wellness", "डॉक्टर नेतृत्व · ४०+ आरोग्य आणि वेलनेस", lang)}
            </span>
          </div>

          {/* Headline */}
          <h1 className={`t-display text-white mb-8 anim-fade-up delay-100 text-balance ${lang === "mr" ? "mr" : ""}`}>
            {lang === "en" ? (
              <>
                Your best years<br />
                aren't behind you.<br />
                <em className="italic" style={{ color: "var(--sage-light)", fontStyle: "italic" }}>
                  They're stronger ahead.
                </em>
              </>
            ) : (
              <>
                तुमची सर्वोत्कृष्ट<br />
                वर्षे मागे नाहीत.<br />
                <em style={{ color: "var(--sage-light)", fontStyle: "normal" }}>
                  ती पुढे आणखी बलवान आहेत.
                </em>
              </>
            )}
          </h1>

          {/* Subhead */}
          <p className={`t-body-lg text-white/60 max-w-xl mb-12 anim-fade-up delay-200 ${lang === "mr" ? "mr" : ""}`}>
            {t(
              "Doctor-led health, fitness and wellness programs designed around your body, your goals and your life after 40.",
              "तुमचे शरीर, तुमची उद्दिष्टे आणि ४० नंतरच्या तुमच्या जीवनासाठी डॉक्टर-नेतृत्वाखाली डिझाइन केलेले आरोग्य कार्यक्रम."
              , lang
            )}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 anim-fade-up delay-300">
            <button
              onClick={() => setPage("assessment")}
              className={`btn btn-primary btn-lg ${lang === "mr" ? "mr" : ""}`}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="1.5">
                <path d="M9 1.5C4.86 1.5 1.5 4.86 1.5 9S4.86 16.5 9 16.5 16.5 13.14 16.5 9"/>
                <path d="M12 6l4.5-4.5M13.5 1.5H16.5v3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t("Take Your Health Assessment", "तुमचे आरोग्य मूल्यांकन घ्या", lang)}
            </button>
            <button
              onClick={() => setPage("programs")}
              className="btn btn-lg"
              style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.75)", background: "transparent" }}
            >
              {t("Explore Programs", "प्रोग्राम्स पाहा", lang)}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 anim-fade-in delay-700">
          <span className="t-caption text-white/30" style={{ fontFamily: "var(--font-mono)" }}>scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TRUST BAR
// ═══════════════════════════════════════════════════════════════════════════
function TrustSection({ lang }: { lang: Lang }) {
  useScrollReveal();

  return (
    <section style={{ background: "var(--ink-80)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 xl:px-16 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-0 items-center" data-reveal>
          {[
            { num: "12+", en: "Doctor-led specialties", mr: "डॉक्टर-नेतृत्व स्पेशालिटी" },
            { num: "1,200+", en: "Members over 40", mr: "४०+ वयाचे सदस्य" },
            { num: "100%", en: "Personalised plans", mr: "वैयक्तिक योजना" },
            { num: "Live", en: "Zoom · Every week", mr: "झूम · दर आठवडा" },
            { num: "₹0", en: "Hidden charges", mr: "छुपे शुल्क" },
          ].map((item, i) => (
            <div key={item.num} className={`flex items-center gap-0 ${i < 4 ? "md:border-r md:border-white/10" : ""}`}>
              <div className="flex-1 md:text-center px-0 md:px-4">
                <p className="text-2xl font-light text-white mb-0.5" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}>
                  {item.num}
                </p>
                <p className={`t-xs text-white/40 ${lang === "mr" ? "mr" : ""}`}>
                  {lang === "en" ? item.en : item.mr}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// METHOD — sticky scroll storytelling
// ═══════════════════════════════════════════════════════════════════════════
const METHOD_STEPS = [
  {
    num: "01",
    en_title: "Discover",
    mr_title: "शोधा",
    en_sub: "Understand your baseline",
    mr_sub: "तुमची बेसलाइन समजून घ्या",
    en_desc: "Every journey begins with honest self-awareness. We ask about your lifestyle, health history, goals and what's held you back — not to judge, but to understand.",
    mr_desc: "प्रत्येक प्रवास प्रामाणिक आत्म-जागरूकतेने सुरू होतो. आम्ही तुमची जीवनशैली, आरोग्य इतिहास आणि उद्दिष्टे विचारतो — मूल्यांकन करायला नाही, समजून घ्यायला.",
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&h=1100&fit=crop&auto=format",
  },
  {
    num: "02",
    en_title: "Assess",
    mr_title: "मूल्यांकन करा",
    en_sub: "Clinical + holistic evaluation",
    mr_sub: "क्लिनिकल + समग्र मूल्यांकन",
    en_desc: "Our adaptive assessment combines clinical markers with lifestyle factors. It takes 8 minutes and adapts to your answers — no two assessments are the same.",
    mr_desc: "आमचे अनुकूलनशील मूल्यांकन क्लिनिकल मार्कर आणि जीवनशैली घटकांना एकत्र करते. हे ८ मिनिटे घेते आणि तुमच्या उत्तरांनुसार बदलते.",
    img: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=900&h=1100&fit=crop&auto=format",
  },
  {
    num: "03",
    en_title: "Personalise",
    mr_title: "वैयक्तिकरण करा",
    en_sub: "A plan built around you",
    mr_sub: "तुमच्यासाठी बनवलेली योजना",
    en_desc: "Based on your results, our recommendation engine — reviewed by doctors — builds a personalised program stack. Not a template. A plan made for your body.",
    mr_desc: "तुमच्या निकालांनुसार, डॉक्टरांनी पुनरावलोकन केलेले आमचे शिफारस इंजिन वैयक्तिकृत प्रोग्राम स्टॅक तयार करते.",
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&h=1100&fit=crop&auto=format",
  },
  {
    num: "04",
    en_title: "Transform",
    mr_title: "रूपांतर करा",
    en_sub: "Live, guided, measurable",
    mr_sub: "लाइव्ह, मार्गदर्शित, मोजण्यायोग्य",
    en_desc: "Live Zoom sessions with expert coaches. Recorded content for your own pace. Weekly check-ins with your doctor. Real progress, tracked and celebrated.",
    mr_desc: "तज्ञ प्रशिक्षकांसोबत लाइव्ह झूम सेशन. तुमच्या गतीनुसार रेकॉर्ड केलेली सामग्री. डॉक्टरांसोबत साप्ताहिक तपासणी.",
    img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&h=1100&fit=crop&auto=format",
  },
];

function MethodSection({ lang }: { lang: Lang }) {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const idx = stepRefs.current.indexOf(e.target as HTMLDivElement);
            if (idx >= 0) setActiveStep(idx);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );
    stepRefs.current.forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const step = METHOD_STEPS[activeStep];

  return (
    <section style={{ background: "var(--bg-primary)", borderBottom: "1px solid var(--border-subtle)" }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 xl:px-16 py-24">

        {/* Section header */}
        <div className="mb-16">
          <p className={`t-label text-[var(--text-muted)] mb-3 ${lang === "mr" ? "mr" : ""}`}>{t("The VitalAfter40 Method", "VitalAfter40 पद्धत", lang)}</p>
          <h2 className={`t-h1 text-[var(--text-primary)] max-w-md ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
            {t("How your transformation works.", "तुमचे रूपांतर कसे कार्य करते.", lang)}
          </h2>
        </div>

        <div className="flex gap-16 lg:gap-24">
          {/* Left — sticky */}
          <div className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-28">
              {/* Step number */}
              <p className="text-[10rem] font-light leading-none text-[var(--border-subtle)] transition-all duration-500 select-none"
                style={{ fontFamily: "var(--font-display)", marginLeft: "-0.1em" }}>
                {step.num}
              </p>

              {/* Step title */}
              <h3 className={`t-h2 text-[var(--text-primary)] mt-2 mb-3 transition-all duration-500 ${lang === "mr" ? "mr" : ""}`}
                style={{ fontFamily: "var(--font-display)" }}>
                {lang === "en" ? step.en_title : step.mr_title}
              </h3>
              <p className={`t-label text-[var(--sage)] mb-5 transition-all duration-500 ${lang === "mr" ? "mr" : ""}`}>
                {lang === "en" ? step.en_sub : step.mr_sub}
              </p>
              <p className={`t-body text-[var(--text-muted)] mb-8 leading-relaxed transition-all duration-500 ${lang === "mr" ? "mr" : ""}`}>
                {lang === "en" ? step.en_desc : step.mr_desc}
              </p>

              {/* Step dots */}
              <div className="flex gap-3 items-center">
                {METHOD_STEPS.map((_, i) => (
                  <button key={i} onClick={() => {
                    stepRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
                    setActiveStep(i);
                  }}
                    className={`rounded-full transition-all duration-300 ${i === activeStep ? "w-8 h-2 bg-[var(--sage)]" : "w-2 h-2 bg-[var(--border-default)]"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right — scrolling steps */}
          <div className="flex-1 space-y-6">
            {METHOD_STEPS.map((s, i) => (
              <div
                key={s.num}
                ref={el => { stepRefs.current[i] = el; }}
                className="min-h-[70vh] flex flex-col justify-center"
              >
                {/* Mobile heading */}
                <div className="lg:hidden mb-6">
                  <p className={`t-label text-[var(--sage)] mb-1 ${lang === "mr" ? "mr" : ""}`}>{s.num} — {lang === "en" ? s.en_sub : s.mr_sub}</p>
                  <h3 className={`t-h2 text-[var(--text-primary)] mb-3 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                    {lang === "en" ? s.en_title : s.mr_title}
                  </h3>
                  <p className={`t-body text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? s.en_desc : s.mr_desc}</p>
                </div>

                {/* Image */}
                <div className="relative overflow-hidden rounded-2xl" style={{ height: "60vh", background: "var(--bg-muted)" }}>
                  <img src={s.img} alt={s.en_title}
                    className="w-full h-full object-cover transition-transform duration-700"
                    style={{ transform: i === activeStep ? "scale(1.02)" : "scale(1)" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <span className="t-label text-white/50 mr-3">{s.num}</span>
                    <span className={`t-h4 text-white ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                      {lang === "en" ? s.en_title : s.mr_title}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ECOSYSTEM — health services grid
// ═══════════════════════════════════════════════════════════════════════════
const SERVICES = [
  { id: "pilates", en: "Pilates", mr: "पिलाटेस", en_desc: "Core, flexibility, posture — the foundation of everything.", mr_desc: "कोर, लवचिकता, आसन — सर्व काही त्याचा आधार.", img: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800&h=1000&fit=crop&auto=format", featured: true },
  { id: "strength", en: "Strength", mr: "ताकद", en_desc: "Functional strength for longevity and daily confidence.", mr_desc: "दीर्घायुष्य आणि दैनंदिन आत्मविश्वासासाठी कार्यात्मक ताकद.", img: "https://images.unsplash.com/photo-1534438327980-b954516bad24?w=600&h=400&fit=crop&auto=format", featured: false },
  { id: "physio", en: "Physiotherapy", mr: "फिजिओथेरपी", en_desc: "Move without pain. Restore your body's natural range.", mr_desc: "वेदनाशिवाय हलवा. तुमच्या शरीराची नैसर्गिक श्रेणी पुनर्संचयित करा.", img: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop&auto=format", featured: false },
  { id: "nutrition", en: "Nutrition", mr: "पोषण", en_desc: "Food that works with your hormones, not against them.", mr_desc: "तुमच्या हार्मोन्ससाठी अन्न, त्यांच्या विरुद्ध नाही.", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop&auto=format", featured: false },
  { id: "doctor", en: "Doctor Consult", mr: "डॉक्टर सल्ला", en_desc: "Internal medicine, diagnostics, longevity medicine.", mr_desc: "अंतर्गत औषध, निदान, दीर्घायुष्य औषध.", img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&h=400&fit=crop&auto=format", featured: false },
  { id: "hormonal", en: "Hormonal Wellness", mr: "हार्मोनल वेलनेस", en_desc: "Evidence-based care for the 40+ hormonal transition.", mr_desc: "४०+ हार्मोनल संक्रमणासाठी पुरावा-आधारित काळजी.", img: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=600&h=400&fit=crop&auto=format", featured: false },
];

function EcosystemSection({ setPage, lang }: HomeProps) {
  useScrollReveal();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="py-24 px-6 sm:px-10 xl:px-16" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14" data-reveal>
          <div>
            <p className={`t-label text-[var(--text-muted)] mb-3 ${lang === "mr" ? "mr" : ""}`}>{t("Health Ecosystem", "आरोग्य परिसंस्था", lang)}</p>
            <h2 className={`t-h1 text-[var(--text-primary)] max-w-sm ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
              {t("Everything your body needs after 40.", "४० नंतर तुमच्या शरीराला हवे ते सर्व.", lang)}
            </h2>
          </div>
          <button onClick={() => setPage("programs")} className={`btn btn-outline shrink-0 ${lang === "mr" ? "mr" : ""}`}>
            {t("See all programs", "सर्व प्रोग्राम्स पाहा", lang)}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 7h10M8 3l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        {/* Grid — Pilates featured left, 7 secondary in grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-auto">

          {/* Pilates — large, spans 5 cols + 2 rows */}
          <div
            data-reveal
            onMouseEnter={() => setHovered("pilates")}
            onMouseLeave={() => setHovered(null)}
            className="md:col-span-5 md:row-span-2 relative rounded-2xl overflow-hidden cursor-pointer group"
            style={{ minHeight: 520, background: "var(--bg-muted)" }}
            onClick={() => setPage("programs")}
          >
            <img
              src={SERVICES[0].img}
              alt="Pilates"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <h3 className={`text-4xl text-white mb-2 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)", lineHeight: 1.05 }}>
                {lang === "en" ? "Pilates" : "पिलाटेस"}
              </h3>
              <p className={`t-small text-white/60 mb-4 ${lang === "mr" ? "mr" : ""}`}>
                {lang === "en" ? SERVICES[0].en_desc : SERVICES[0].mr_desc}
              </p>
              <div className="flex gap-2">
                {["Group","Individual","Live Zoom","Recorded"].map(tag => (
                  <span key={tag} className="badge badge-dark text-white/70">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Secondary services in 7-col grid on right */}
          {SERVICES.slice(1).map((s, i) => (
            <div
              key={s.id}
              data-reveal
              data-reveal-delay={String((i % 3) + 1)}
              onMouseEnter={() => setHovered(s.id)}
              onMouseLeave={() => setHovered(null)}
              className="md:col-span-7 lg:col-span-4 relative rounded-2xl overflow-hidden cursor-pointer group"
              style={{ minHeight: 200, background: "var(--bg-muted)" }}
              onClick={() => setPage("programs")}
            >
              <img
                src={s.img}
                alt={s.en}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05] opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <h4 className={`t-h4 text-white mb-1 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                  {lang === "en" ? s.en : s.mr}
                </h4>
                <p className={`t-xs text-white/50 ${lang === "mr" ? "mr" : ""}`}>
                  {lang === "en" ? s.en_desc : s.mr_desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PILATES FEATURE
// ═══════════════════════════════════════════════════════════════════════════
function PilatesSection({ setPage, lang }: HomeProps) {
  useScrollReveal();

  return (
    <section style={{ background: "var(--ink)" }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 xl:px-16 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left content */}
          <div data-reveal>
            <p className={`t-label text-[var(--sage-light)] mb-4 ${lang === "mr" ? "mr" : ""}`}>{t("Flagship Program", "प्रमुख प्रोग्राम", lang)}</p>
            <h2 className={`t-h1 text-white mb-6 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
              {lang === "en" ? (
                <>Pilates designed<br /><em className="italic" style={{ color: "var(--sage-light)" }}>for you, at 40+.</em></>
              ) : (
                <>पिलाटेस डिझाइन केले<br /><em style={{ color: "var(--sage-light)", fontStyle: "normal" }}>तुमच्यासाठी, ४०+ वयात.</em></>
              )}
            </h2>
            <p className={`t-body-lg text-white/55 mb-10 max-w-md ${lang === "mr" ? "mr" : ""}`}>
              {t(
                "Not the generic Pilates you see on YouTube. Clinical Pilates, adapted for the 40+ body — joint health, posture, bone density, core strength.",
                "YouTube वर दिसणारे सामान्य पिलाटेस नाही. क्लिनिकल पिलाटेस, ४०+ शरीरासाठी अनुकूलित — सांधे आरोग्य, आसन, हाडांची घनता, कोर ताकद.",
                lang
              )}
            </p>

            {/* Format list */}
            <div className="space-y-3 mb-10">
              {[
                { en: "Group Sessions", mr: "ग्रुप सेशन्स", en_sub: "Live Zoom · 3×/week", mr_sub: "लाइव्ह झूम · ३ वेळा/आठवडा" },
                { en: "Individual Sessions", mr: "वैयक्तिक सेशन्स", en_sub: "1-on-1 with your coach", mr_sub: "तुमच्या प्रशिक्षकासोबत" },
                { en: "Recorded Library", mr: "रेकॉर्ड लायब्ररी", en_sub: "On-demand, anytime", mr_sub: "ऑन-डिमांड, कधीही" },
              ].map(f => (
                <div key={f.en} className="flex items-center justify-between py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                  <p className={`t-small font-medium text-white ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? f.en : f.mr}</p>
                  <p className={`t-xs text-white/35 ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? f.en_sub : f.mr_sub}</p>
                </div>
              ))}
            </div>

            <button onClick={() => setPage("programs")} className={`btn btn-white btn-lg ${lang === "mr" ? "mr" : ""}`}>
              {t("Explore Pilates", "पिलाटेस एक्सप्लोर करा", lang)}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>

          {/* Right — editorial image stack */}
          <div className="relative" data-reveal data-reveal-delay="2">
            <div className="rounded-2xl overflow-hidden" style={{ height: 560 }}>
              <img
                src="https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=900&h=1100&fit=crop&auto=format"
                alt="Pilates group session"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DOCTOR SECTION
// ═══════════════════════════════════════════════════════════════════════════
function DoctorSection({ setPage, lang }: HomeProps) {
  useScrollReveal();

  return (
    <section style={{ background: "var(--cream)", borderTop: "1px solid var(--border-subtle)" }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 xl:px-16 py-24">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">

          {/* Doctor portrait — left */}
          <div className="lg:col-span-5 relative" data-reveal>
            <div className="rounded-2xl overflow-hidden" style={{ height: 600, background: "var(--bg-muted)" }}>
              <img
                src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=700&h=900&fit=crop&auto=format"
                alt="Dr. Anjali Sharma"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Doctor content — right */}
          <div className="lg:col-span-7" data-reveal data-reveal-delay="2">
            <p className={`t-label text-[var(--sage)] mb-4 ${lang === "mr" ? "mr" : ""}`}>{t("Our Founder", "आमचे संस्थापक", lang)}</p>

            <h2 className={`t-h1 text-[var(--text-primary)] mb-6 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
              {lang === "en" ? (
                <>Led by a doctor.<br /><em className="italic text-[var(--sage)]">Built around you.</em></>
              ) : (
                <>डॉक्टरांनी नेतृत्व केले.<br /><em style={{ color: "var(--sage)", fontStyle: "normal" }}>तुमच्यासाठी बनवले.</em></>
              )}
            </h2>

            <p className={`t-body-lg text-[var(--text-muted)] mb-8 ${lang === "mr" ? "mr" : ""}`}>
              {t(
                "Dr. Anjali Sharma has spent 18 years treating patients over 40 — watching them leave medicine with generic advice that doesn't work. VitalAfter40 is her answer: programs that combine clinical rigour with the warmth of a doctor who actually listens.",
                "डॉ. अंजली शर्मा यांनी ४०+ वयाच्या रुग्णांवर उपचार करण्यात १८ वर्षे घालवली — त्यांना सामान्य सल्ल्यासह वैद्यकीय सेवा सोडताना पाहिले. VitalAfter40 हे त्यांचे उत्तर आहे.",
                lang
              )}
            </p>

            {/* Credentials */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { en: "MD — Internal Medicine", mr: "MD — अंतर्गत औषध" },
                { en: "18 yrs clinical practice", mr: "१८ वर्षे क्लिनिकल प्रॅक्टिस" },
                { en: "Longevity medicine specialist", mr: "दीर्घायुष्य औषध तज्ञ" },
                { en: "Author · Speaker", mr: "लेखक · वक्ता" },
              ].map(c => (
                <div key={c.en} className="flex items-center gap-2.5">
                  <div className="w-1 h-1 rounded-full bg-[var(--sage)] shrink-0" />
                  <span className={`t-small text-[var(--text-secondary)] ${lang === "mr" ? "mr" : ""}`}>
                    {lang === "en" ? c.en : c.mr}
                  </span>
                </div>
              ))}
            </div>

            {/* Philosophy quote */}
            <blockquote className="border-l-2 border-[var(--sage)] pl-5 mb-10">
              <p className={`t-body-lg italic text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                {t(
                  "\"After 40, your body doesn't need less — it needs smarter. That's what we build here.\"",
                  "\"४० नंतर, तुमच्या शरीराला कमी नाही — अधिक हुशार गोष्टींची गरज आहे. आम्ही हेच बनवतो.\"",
                  lang
                )}
              </p>
              <p className="t-small text-[var(--text-muted)] mt-3 not-italic">— Dr. Anjali Sharma, MD</p>
            </blockquote>

            <button onClick={() => setPage("professionals")} className={`btn btn-outline ${lang === "mr" ? "mr" : ""}`}>
              {t("Meet the full team", "संपूर्ण टीम भेटा", lang)}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 7h10M8 3l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPERT TEAM
// ═══════════════════════════════════════════════════════════════════════════
const TEAM = [
  { name: "Dr. Anjali Sharma", role_en: "MD · Founder & Medical Director", role_mr: "MD · संस्थापक आणि वैद्यकीय संचालक", specialty_en: "Internal Medicine, Longevity", specialty_mr: "अंतर्गत औषध, दीर्घायुष्य", img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&h=400&fit=crop&auto=format", isFounder: true },
  { name: "Priya Nair", role_en: "Certified Pilates Instructor", role_mr: "प्रमाणित पिलाटेस प्रशिक्षक", specialty_en: "Clinical Pilates, Rehabilitation", specialty_mr: "क्लिनिकल पिलाटेस, पुनर्वसन", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop&auto=format", isFounder: false },
  { name: "Dr. Rahul Mehta", role_en: "Senior Physiotherapist", role_mr: "वरिष्ठ फिजिओथेरपिस्ट", specialty_en: "Sports rehab, Joint health", specialty_mr: "स्पोर्ट्स पुनर्वसन, सांधे आरोग्य", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop&auto=format", isFounder: false },
  { name: "Sneha Deshpande", role_en: "Nutritionist & Wellness Coach", role_mr: "पोषणतज्ञ आणि वेलनेस कोच", specialty_en: "Hormonal nutrition, Gut health", specialty_mr: "हार्मोनल पोषण, आतड्याचे आरोग्य", img: "https://images.unsplash.com/photo-1621886178958-be42369fc9e7?w=400&h=500&fit=crop&auto=format", isFounder: false },
  { name: "Amit Joshi", role_en: "Strength & Conditioning", role_mr: "स्ट्रेंथ आणि कंडिशनिंग", specialty_en: "Functional strength, Mobility", specialty_mr: "कार्यात्मक ताकद, गतिशीलता", img: "https://images.unsplash.com/photo-1534438327980-b954516bad24?w=400&h=500&fit=crop&auto=format", isFounder: false },
  { name: "Dr. Kavita Rao", role_en: "Hormonal Wellness Specialist", role_mr: "हार्मोनल वेलनेस तज्ञ", specialty_en: "MD Medicine, Women's health", specialty_mr: "MD औषध, महिला आरोग्य", img: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=400&h=500&fit=crop&auto=format", isFounder: false },
];

function TeamSection({ setPage, lang }: HomeProps) {
  useScrollReveal();

  return (
    <section className="py-24 px-6 sm:px-10 xl:px-16" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14" data-reveal>
          <div>
            <p className={`t-label text-[var(--text-muted)] mb-3 ${lang === "mr" ? "mr" : ""}`}>{t("Expert Team", "तज्ञ टीम", lang)}</p>
            <h2 className={`t-h1 text-[var(--text-primary)] max-w-sm ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
              {t("The specialists behind your care.", "तुमच्या काळजीमागील तज्ञ.", lang)}
            </h2>
          </div>
          <button onClick={() => setPage("professionals")} className={`btn btn-outline shrink-0 ${lang === "mr" ? "mr" : ""}`}>
            {t("Meet everyone", "सर्वांना भेटा", lang)}
          </button>
        </div>

        {/* Team grid — founder wide, rest portrait */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
          {TEAM.map((member, i) => (
            <div
              key={member.name}
              data-reveal
              data-reveal-delay={String((i % 4) + 1)}
              onClick={() => setPage("professionals")}
              className={`group cursor-pointer relative overflow-hidden rounded-2xl ${
                member.isFounder ? "lg:col-span-5 sm:col-span-2" : "lg:col-span-4 lg:last:col-span-4"
              }`}
              style={{ minHeight: member.isFounder ? 360 : 300, background: "var(--bg-muted)" }}
            >
              <img
                src={member.img}
                alt={member.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                style={{ objectPosition: member.isFounder ? "center 30%" : "center 20%" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              {member.isFounder && (
                <div className="absolute top-4 left-4">
                  <span className="badge badge-gold">Founder</span>
                </div>
              )}
              <div className="absolute bottom-5 left-5 right-5">
                <p className={`t-h4 text-white mb-0.5 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>{member.name}</p>
                <p className={`t-xs text-white/55 ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? member.role_en : member.role_mr}</p>
                {member.isFounder && (
                  <p className={`t-xs text-white/35 mt-1 ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? member.specialty_en : member.specialty_mr}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PERSONALIZATION / ASSESSMENT
// ═══════════════════════════════════════════════════════════════════════════
function AssessmentSection({ setPage, lang }: HomeProps) {
  useScrollReveal();
  const [demoAnswer, setDemoAnswer] = useState<number | null>(null);

  return (
    <section style={{ background: "var(--ink)", position: "relative", overflow: "hidden" }}>
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "radial-gradient(circle at 30% 50%, var(--sage) 0%, transparent 60%), radial-gradient(circle at 80% 80%, var(--gold) 0%, transparent 50%)" }} />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 xl:px-16 py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Copy */}
          <div data-reveal>
            <p className={`t-label text-[var(--sage-light)] mb-4 ${lang === "mr" ? "mr" : ""}`}>{t("Personalised Assessment", "वैयक्तिकृत मूल्यांकन", lang)}</p>
            <h2 className={`t-h1 text-white mb-6 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
              {lang === "en" ? (
                <>"Not everyone<br />needs the<br /><em className="italic" style={{ color: "var(--sage-light)" }}>same plan."</em></>
              ) : (
                <>"प्रत्येकाला<br />एकच योजना<br /><em style={{ color: "var(--sage-light)", fontStyle: "normal" }}>नको असते."</em></>
              )}
            </h2>
            <p className={`t-body-lg text-white/55 mb-8 max-w-md ${lang === "mr" ? "mr" : ""}`}>
              {t(
                "Your hormones, joints, energy, history and goals are uniquely yours. Our 8-minute assessment builds a program stack that fits exactly that.",
                "तुमचे हार्मोन्स, सांधे, ऊर्जा, इतिहास आणि उद्दिष्टे विशिष्टपणे तुमचे आहेत. आमचे ८-मिनिटांचे मूल्यांकन अगदी योग्य प्रोग्राम स्टॅक तयार करते.",
                lang
              )}
            </p>

            <button onClick={() => setPage("assessment")} className={`btn btn-primary btn-lg ${lang === "mr" ? "mr" : ""}`}>
              {t("Take Your Assessment", "तुमचे मूल्यांकन घ्या", lang)}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>

          {/* Assessment preview — interactive */}
          <div data-reveal data-reveal-delay="2">
            <div className="rounded-2xl overflow-hidden border" style={{ background: "var(--warm-white)", borderColor: "var(--border-subtle)" }}>
              {/* Assessment header */}
              <div className="px-6 py-5 border-b" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-muted)" }}>
                <div className="flex justify-between items-center mb-3">
                  <span className={`t-xs text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`}>{t("Question 3 of 13","प्रश्न ३ पैकी १३",lang)}</span>
                  <span className="t-xs text-[var(--sage)]" style={{ fontFamily: "var(--font-mono)" }}>23%</span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 13 }, (_, i) => (
                    <div key={i} className={`flex-1 h-1 rounded-full ${i < 3 ? "bg-[var(--sage)]" : "bg-[var(--border-subtle)]"}`} />
                  ))}
                </div>
              </div>

              {/* Question */}
              <div className="p-6">
                <p className={`t-label text-[var(--text-muted)] mb-3 ${lang === "mr" ? "mr" : ""}`}>{t("Section — Lifestyle","विभाग — जीवनशैली",lang)}</p>
                <h3 className={`t-h3 text-[var(--text-primary)] mb-6 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                  {t("How would you describe your current energy levels?","तुम्ही तुमच्या सध्याच्या ऊर्जा पातळीचे वर्णन कसे कराल?",lang)}
                </h3>

                <div className="space-y-2.5">
                  {[
                    t("High — I feel energetic most of the day","उच्च — मला दिवसभर ऊर्जावान वाटते",lang),
                    t("Moderate — some afternoon dips","मध्यम — दुपारी थोडी घसरण",lang),
                    t("Low — I'm always tired","कमी — मला नेहमी थकवा जाणवतो",lang),
                    t("Very low — exhausted by midday","खूप कमी — दुपारपर्यंत थकून जातो",lang),
                  ].map((opt, i) => (
                    <button
                      key={opt}
                      onClick={() => setDemoAnswer(i)}
                      className={`answer-tile w-full text-left ${demoAnswer === i ? "selected" : ""}`}
                    >
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${demoAnswer === i ? "bg-[var(--sage)] border-[var(--sage)]" : "border-[var(--border-default)]"}`}>
                        {demoAnswer === i && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2">
                            <path d="M2 5l2.5 2.5 3.5-4" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </span>
                      <span className={`t-small text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`}>{opt}</span>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-6 pt-5 border-t" style={{ borderColor: "var(--border-subtle)" }}>
                  <button className={`btn btn-ghost btn-sm text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`}>{t("← Back","← मागे",lang)}</button>
                  <button onClick={() => setPage("assessment")} className={`btn btn-primary btn-sm ${lang === "mr" ? "mr" : ""}`}>
                    {t("Continue →","पुढे →",lang)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PROGRAMS (editorial cards)
// ═══════════════════════════════════════════════════════════════════════════
const PROGRAM_DATA = [
  { title_en: "Group Pilates", title_mr: "ग्रुप पिलाटेस", cat_en: "Pilates", cat_mr: "पिलाटेस", weeks_en: "8 weeks · 3×/week", weeks_mr: "८ आठवडे · ३ वेळा/आठवडा", format_en: "Group · Live Zoom", format_mr: "ग्रुप · लाइव्ह झूम", price: "₹6,500", img: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=700&h=500&fit=crop&auto=format" },
  { title_en: "Individual Pilates", title_mr: "वैयक्तिक पिलाटेस", cat_en: "Pilates", cat_mr: "पिलाटेस", weeks_en: "8 weeks · 2×/week", weeks_mr: "८ आठवडे · २ वेळा/आठवडा", format_en: "1-on-1 · Live Zoom", format_mr: "१-ऑन-१ · लाइव्ह झूम", price: "₹11,000", img: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=700&h=500&fit=crop&auto=format" },
  { title_en: "Nutrition Coaching", title_mr: "पोषण कोचिंग", cat_en: "Nutrition", cat_mr: "पोषण", weeks_en: "8 weeks · Weekly check-in", weeks_mr: "८ आठवडे · साप्ताहिक तपासणी", format_en: "Individual · Zoom", format_mr: "वैयक्तिक · झूम", price: "₹5,800", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=700&h=500&fit=crop&auto=format" },
  { title_en: "Strength & Conditioning", title_mr: "स्ट्रेंथ आणि कंडिशनिंग", cat_en: "Strength", cat_mr: "ताकद", weeks_en: "12 weeks · 3×/week", weeks_mr: "१२ आठवडे · ३ वेळा/आठवडा", format_en: "Group · Live Zoom", format_mr: "ग्रुप · लाइव्ह झूम", price: "₹8,200", img: "https://images.unsplash.com/photo-1534438327980-b954516bad24?w=700&h=500&fit=crop&auto=format" },
  { title_en: "Physiotherapy Program", title_mr: "फिजिओथेरपी प्रोग्राम", cat_en: "Physiotherapy", cat_mr: "फिजिओथेरपी", weeks_en: "6 weeks · 2×/week", weeks_mr: "६ आठवडे · २ वेळा/आठवडा", format_en: "Individual · Zoom", format_mr: "वैयक्तिक · झूम", price: "₹9,500", img: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=700&h=500&fit=crop&auto=format" },
];

function ProgramsSection({ setPage, lang }: HomeProps) {
  useScrollReveal();

  return (
    <section className="py-24" style={{ background: "var(--paper)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="px-6 sm:px-10 xl:px-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12" data-reveal>
          <div>
            <p className={`t-label text-[var(--text-muted)] mb-3 ${lang === "mr" ? "mr" : ""}`}>{t("Popular Programs", "लोकप्रिय प्रोग्राम्स", lang)}</p>
            <h2 className={`t-h1 text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
              {t("Start anywhere. Stay always.", "कुठूनही सुरू करा. नेहमी राहा.", lang)}
            </h2>
          </div>
          <button onClick={() => setPage("programs")} className={`btn btn-outline shrink-0 ${lang === "mr" ? "mr" : ""}`}>
            {t("All programs →","सर्व प्रोग्राम्स →",lang)}
          </button>
        </div>

        {/* Horizontal scroll container */}
        <div className="h-scroll px-6 sm:px-10 xl:px-16 pb-8" style={{ gap: "1.25rem" }}>
          {PROGRAM_DATA.map((prog, i) => (
            <div
              key={prog.title_en}
              onClick={() => setPage("programs")}
              className="shrink-0 cursor-pointer group relative overflow-hidden rounded-2xl"
              style={{ width: 320, height: 420, background: "var(--bg-muted)" }}
            >
              <img
                src={prog.img}
                alt={prog.title_en}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className={`t-label text-white/50 mb-1 ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? prog.cat_en : prog.cat_mr}</p>
                <h3 className={`t-h4 text-white mb-1 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                  {lang === "en" ? prog.title_en : prog.title_mr}
                </h3>
                <p className={`t-xs text-white/50 mb-3 ${lang === "mr" ? "mr" : ""}`}>
                  {lang === "en" ? prog.weeks_en : prog.weeks_mr} · {lang === "en" ? prog.format_en : prog.format_mr}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-light text-white" style={{ fontFamily: "var(--font-display)" }}>{prog.price}</span>
                  <span className="btn btn-sm btn-white opacity-0 group-hover:opacity-100 transition-opacity">{t("Enroll","नोंदणी",lang)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TESTIMONIALS
// ═══════════════════════════════════════════════════════════════════════════
const TESTIMONIAL_DATA = [
  {
    quote_en: "After 3 months, I feel stronger than I did in my 30s. The Pilates program addressed my joint pain that I'd lived with for years. Dr. Anjali genuinely listens.",
    quote_mr: "३ महिन्यांनंतर, मला माझ्या ३०च्या दशकापेक्षा अधिक ताकदवान वाटते. पिलाटेस प्रोग्रामने माझ्या वर्षांपासूनच्या सांधेदुखीवर उपचार केले.",
    name: "Meera Joshi",
    age_en: "53 · Pune",
    age_mr: "५३ · पुणे",
    program_en: "Group Pilates + Nutrition",
    program_mr: "ग्रुप पिलाटेस + पोषण",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format",
  },
  {
    quote_en: "The assessment was eye-opening. I thought I needed cardio, but they recommended physiotherapy first. Six weeks in, I'm pain-free and sleeping better.",
    quote_mr: "मूल्यांकन डोळे उघडणारे होते. मला वाटले मला कार्डिओ हवे, पण त्यांनी प्रथम फिजिओथेरपी सुचवली. सहा आठवड्यांनंतर, मी वेदनामुक्त आणि चांगली झोपतो.",
    name: "Suresh Patil",
    age_en: "47 · Mumbai",
    age_mr: "४७ · मुंबई",
    program_en: "Physiotherapy + Strength",
    program_mr: "फिजिओथेरपी + ताकद",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format",
  },
  {
    quote_en: "Joining from Nagpur, the Zoom format is a game-changer. Priya knows every participant by name and adjusts the session for each of us in real time.",
    quote_mr: "नागपूरहून सामील होणे, झूम फॉरमॅट एक गेम-चेंजर आहे. प्रिया प्रत्येक सहभागीला नावाने ओळखते आणि प्रत्येकासाठी सेशन रिअल टाइममध्ये समायोजित करते.",
    name: "Nalini Deshpande",
    age_en: "61 · Nagpur",
    age_mr: "६१ · नागपूर",
    program_en: "Group Pilates",
    program_mr: "ग्रुप पिलाटेस",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format",
  },
];

function TestimonialsSection({ lang }: { lang: Lang }) {
  useScrollReveal();
  const [active, setActive] = useState(0);
  const testimonial = TESTIMONIAL_DATA[active];

  return (
    <section className="py-24 px-6 sm:px-10 xl:px-16" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-7xl mx-auto">

        <div className="mb-14" data-reveal>
          <p className={`t-label text-[var(--text-muted)] mb-3 ${lang === "mr" ? "mr" : ""}`}>{t("Member Stories", "सदस्य कहाण्या", lang)}</p>
          <h2 className={`t-h1 text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
            {t("Real people. Real results.", "खरे लोक. खरे परिणाम.", lang)}
          </h2>
        </div>

        <div className="max-w-3xl" data-reveal data-reveal-delay="1">
          <div className="relative mb-8">
            <div className="text-[7rem] leading-none text-[var(--sage-pale)] select-none absolute -top-6 -left-2"
              style={{ fontFamily: "var(--font-display)" }}>"</div>
            <blockquote className={`t-h3 text-[var(--text-primary)] relative z-10 ${lang === "mr" ? "mr" : ""}`}
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic", lineHeight: 1.4 }}>
              {lang === "en" ? testimonial.quote_en : testimonial.quote_mr}
            </blockquote>
          </div>

          <div className="flex items-center gap-4">
            <img src={testimonial.img} alt={testimonial.name}
              className="w-11 h-11 rounded-full object-cover" />
            <div>
              <p className="t-small font-semibold text-[var(--text-primary)]">{testimonial.name}</p>
              <p className={`t-xs text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`}>
                {lang === "en" ? testimonial.age_en : testimonial.age_mr} · {lang === "en" ? testimonial.program_en : testimonial.program_mr}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-8">
            {TESTIMONIAL_DATA.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`h-0.5 rounded-full transition-all duration-300 ${i === active ? "w-8 bg-[var(--sage)]" : "w-4 bg-[var(--border-default)]"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CTA SECTION
// ═══════════════════════════════════════════════════════════════════════════
function CTASection({ setPage, lang }: HomeProps) {
  useScrollReveal();

  return (
    <section className="relative overflow-hidden" style={{ background: "var(--ink)", minHeight: 480 }}>
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1600&h=600&fit=crop&auto=format"
          alt=""
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--ink)] via-[var(--ink)]/90 to-[var(--ink)]/70" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 xl:px-16 py-28 flex flex-col items-center text-center">
        <p className={`t-label text-[var(--sage-light)] mb-6 ${lang === "mr" ? "mr" : ""}`} data-reveal>
          {t("Begin your journey today","आज तुमचा प्रवास सुरू करा",lang)}
        </p>
        <h2 className={`t-h1 text-white mb-6 max-w-2xl ${lang === "mr" ? "mr" : ""}`}
          style={{ fontFamily: "var(--font-display)" }} data-reveal data-reveal-delay="1">
          {lang === "en" ? (
            <>"Start with understanding<br /><em className="italic" style={{ color: "var(--sage-light)" }}>your health.</em>"</>
          ) : (
            <>"तुमच्या आरोग्याला समजून<br /><em style={{ color: "var(--sage-light)", fontStyle: "normal" }}>सुरुवात करा."</em></>
          )}
        </h2>
        <p className={`t-body text-white/50 mb-10 max-w-md ${lang === "mr" ? "mr" : ""}`} data-reveal data-reveal-delay="2">
          {t("8 minutes. No commitment. A plan built around your actual body.","८ मिनिटे. कोणतीही वचनबद्धता नाही. तुमच्या शरीरावर आधारित योजना.",lang)}
        </p>
        <div className="flex flex-col sm:flex-row gap-3" data-reveal data-reveal-delay="3">
          <button onClick={() => setPage("assessment")} className={`btn btn-primary btn-xl ${lang === "mr" ? "mr" : ""}`}>
            {t("Take Your Health Assessment","तुमचे आरोग्य मूल्यांकन घ्या",lang)}
          </button>
          <button onClick={() => setPage("programs")} className="btn btn-xl"
            style={{ color: "rgba(255,255,255,0.6)", borderColor: "rgba(255,255,255,0.15)", background: "transparent" }}>
            {t("Browse programs","प्रोग्राम्स ब्राउझ करा",lang)}
          </button>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════════════════
function Footer({ setPage, lang, setLang }: HomeProps & { setLang: (l: Lang) => void }) {
  return (
    <footer style={{ background: "var(--ink-80)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 xl:px-16 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">

          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full bg-[var(--sage)] flex items-center justify-center">
                <span className="text-white text-sm font-bold">V</span>
              </div>
              <span className="text-white text-xl" style={{ fontFamily: "var(--font-display)" }}>VitalAfter40</span>
            </div>
            <p className={`t-small text-white/40 mb-6 max-w-xs ${lang === "mr" ? "mr" : ""}`}>
              {t("Doctor-led health, fitness and wellness programs designed for adults 40 and above.","डॉक्टर-नेतृत्वाखाली ४०+ वयासाठी आरोग्य, फिटनेस आणि वेलनेस प्रोग्राम्स.",lang)}
            </p>
            {/* Language toggle */}
            <div className="lang-toggle" style={{ display: "inline-flex" }}>
              <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
              <button className={`mr ${lang === "mr" ? "active" : ""}`} onClick={() => setLang("mr")}>मराठी</button>
            </div>
          </div>

          {/* Programs */}
          <div>
            <p className="t-label text-white/25 mb-4">{t("Programs","प्रोग्राम्स",lang)}</p>
            <div className="space-y-3">
              {[
                [t("Pilates","पिलाटेस",lang)],
                [t("Strength","ताकद",lang)],
                [t("Physiotherapy","फिजिओथेरपी",lang)],
                [t("Nutrition","पोषण",lang)],
                [t("Doctor Consult","डॉक्टर सल्ला",lang)],
              ].map(([label]) => (
                <button key={String(label)} onClick={() => setPage("programs")}
                  className={`block t-small text-white/50 hover:text-white transition-colors ${lang === "mr" ? "mr" : ""}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="t-label text-white/25 mb-4">{t("Company","कंपनी",lang)}</p>
            <div className="space-y-3">
              {[
                { label_en: "About", label_mr: "आमच्याबद्दल", page: "home" as Page },
                { label_en: "Our Experts", label_mr: "आमचे तज्ञ", page: "professionals" as Page },
                { label_en: "Assessment", label_mr: "मूल्यांकन", page: "assessment" as Page },
                { label_en: "Design System", label_mr: "डिझाइन सिस्टम", page: "design-system" as Page },
              ].map(item => (
                <button key={item.label_en} onClick={() => setPage(item.page)}
                  className={`block t-small text-white/50 hover:text-white transition-colors ${lang === "mr" ? "mr" : ""}`}>
                  {lang === "en" ? item.label_en : item.label_mr}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="t-label text-white/25 mb-4">{t("Contact","संपर्क",lang)}</p>
            <div className="space-y-3">
              {[
                { label: "hello@vitalafter40.com" },
                { label: "WhatsApp Support" },
                { label: "+91 98765 43210" },
              ].map(c => (
                <div key={c.label} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-white/20 shrink-0"/>
                  <span className="t-small text-white/50">{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/05">
          <p className="t-xs text-white/25" style={{ fontFamily: "var(--font-mono)" }}>
            © 2026 VitalAfter40. All rights reserved.
          </p>
          <div className="flex gap-5">
            {["Privacy Policy","Terms of Service"].map(l => (
              <button key={l} className="t-xs text-white/25 hover:text-white/60 transition-colors">{l}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════
export default function HomePage({ setPage, lang, setLang }: HomeProps & { setLang: (l: Lang) => void }) {
  return (
    <div className="page-enter">
      <HeroSection setPage={setPage} lang={lang} />
      <TrustSection lang={lang} />
      <MethodSection lang={lang} />
      <EcosystemSection setPage={setPage} lang={lang} />
      <PilatesSection setPage={setPage} lang={lang} />
      <DoctorSection setPage={setPage} lang={lang} />
      <TeamSection setPage={setPage} lang={lang} />
      <AssessmentSection setPage={setPage} lang={lang} />
      <ProgramsSection setPage={setPage} lang={lang} />
      <TestimonialsSection lang={lang} />
      <CTASection setPage={setPage} lang={lang} />
      <Footer setPage={setPage} lang={lang} setLang={setLang} />
    </div>
  );
}

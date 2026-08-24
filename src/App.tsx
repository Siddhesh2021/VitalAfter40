import { useState, useEffect } from "react";
import { programs, professionals, testimonials, assessmentQuestions, adminStats, adminUsers, whatsappTemplates, revenueData, funnelData, t, type Lang } from "./data";

type Page = "home" | "assessment" | "processing" | "results" | "programs" | "pilates" | "professionals" | "checkout" | "confirmation" | "pwa" | "admin" | "admin-users" | "admin-assessments" | "admin-programs" | "admin-cms" | "admin-analytics" | "admin-whatsapp" | "admin-translations" | "login";
type AdminTab = "dashboard" | "users" | "assessments" | "programs" | "cms" | "analytics" | "whatsapp" | "translations" | "professionals" | "payments" | "settings";

function LanguageToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <button
      onClick={() => setLang(lang === "en" ? "mr" : "en")}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-300 text-sm font-medium hover:bg-stone-100 transition-all"
    >
      <span className="text-xs">{lang === "en" ? "🇮🇳" : "🔤"}</span>
      <span>{lang === "en" ? "मराठी" : "EN"}</span>
    </button>
  );
}

function Nav({ page, setPage, lang, setLang }: { page: Page; setPage: (p: Page) => void; lang: Lang; setLang: (l: Lang) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#faf8f5]/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <button onClick={() => setPage("home")} className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-[#6b7c5c] flex items-center justify-center text-white text-sm font-bold">V</span>
          <span className="font-display text-xl font-semibold text-[#1c1c1c]">VitalAfter40</span>
        </button>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <button onClick={() => setPage("home")} className="text-stone-600 hover:text-[#6b7c5c]">{t("Programs", "प्रोग्राम्स", lang)}</button>
          <button onClick={() => setPage("professionals")} className="text-stone-600 hover:text-[#6b7c5c]">{t("Doctors & Coaches", "डॉक्टर आणि कोच", lang)}</button>
          <button onClick={() => setPage("programs")} className="text-stone-600 hover:text-[#6b7c5c]">{t("Pricing", "किंमत", lang)}</button>
          <LanguageToggle lang={lang} setLang={setLang} />
          <button onClick={() => setPage("login")} className="text-stone-600 hover:text-[#6b7c5c]">{t("Login", "लॉगिन", lang)}</button>
          <button onClick={() => setPage("assessment")} className="px-4 py-2 rounded-full bg-[#6b7c5c] text-white text-sm font-medium hover:bg-[#5a6b4b]">
            {t("Start Assessment", "मूल्यांकन सुरू करा", lang)}
          </button>
        </div>
        <div className="md:hidden flex items-center gap-3">
          <LanguageToggle lang={lang} setLang={setLang} />
          <button onClick={() => setOpen(!open)} className="p-2">
            <div className="w-5 h-0.5 bg-stone-700 mb-1" />
            <div className="w-5 h-0.5 bg-stone-700 mb-1" />
            <div className="w-5 h-0.5 bg-stone-700" />
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-[#faf8f5] border-t border-stone-200 px-4 py-4 flex flex-col gap-3">
          <button onClick={() => { setPage("home"); setOpen(false); }} className="text-left text-stone-700 py-2 border-b border-stone-100">{t("Programs", "प्रोग्राम्स", lang)}</button>
          <button onClick={() => { setPage("professionals"); setOpen(false); }} className="text-left text-stone-700 py-2 border-b border-stone-100">{t("Doctors & Coaches", "डॉक्टर आणि कोच", lang)}</button>
          <button onClick={() => { setPage("programs"); setOpen(false); }} className="text-left text-stone-700 py-2 border-b border-stone-100">{t("Pricing", "किंमत", lang)}</button>
          <button onClick={() => { setPage("login"); setOpen(false); }} className="text-left text-stone-700 py-2 border-b border-stone-100">{t("Login", "लॉगिन", lang)}</button>
          <button onClick={() => { setPage("assessment"); setOpen(false); }} className="w-full py-3 rounded-full bg-[#6b7c5c] text-white font-medium">
            {t("Start Assessment", "मूल्यांकन सुरू करा", lang)}
          </button>
        </div>
      )}
    </nav>
  );
}

function StarRating({ n }: { n: number }) {
  return <span className="text-amber-500 text-sm">{"★".repeat(n)}</span>;
}

// ─── HOME PAGE ───────────────────────────────────────────────────────────────
function HomePage({ setPage, lang }: { setPage: (p: Page) => void; lang: Lang }) {
  const steps = [
    { icon: "🔍", en: "Discover", mr: "शोधा" },
    { icon: "📋", en: "Assess", mr: "मूल्यांकन" },
    { icon: "🎯", en: "Personalize", mr: "वैयक्तिकृत" },
    { icon: "🌱", en: "Transform", mr: "परिवर्तन" },
  ];
  const services = [
    { icon: "🧘", en: "Pilates", mr: "पिलाटेस" },
    { icon: "💪", en: "Strength", mr: "ताकद" },
    { icon: "🥗", en: "Nutrition", mr: "पोषण" },
    { icon: "🦴", en: "Physiotherapy", mr: "फिजिओथेरपी" },
    { icon: "🩺", en: "Doctor-led Care", mr: "डॉक्टर नेतृत्व" },
    { icon: "⚡", en: "Hormonal Wellness", mr: "हार्मोनल वेलनेस" },
    { icon: "❤️", en: "Sexual Wellness", mr: "लैंगिक वेलनेस" },
    { icon: "🌿", en: "Healthy Ageing", mr: "निरोगी वृद्धत्व" },
  ];

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center bg-[#1c1c1c] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1658314755811-73c806249f31?w=1400&h=900&fit=crop&auto=format"
            alt="Active adults fitness"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1c1c1c] via-[#1c1c1c]/80 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <span className="inline-block px-3 py-1 rounded-full bg-[#6b7c5c]/30 text-[#8fa07a] text-xs font-mono tracking-widest uppercase mb-6">
              {t("Doctor-led · 40+ Wellness", "डॉक्टर नेतृत्व · ४०+ वेलनेस", lang)}
            </span>
            <h1 className={`font-display text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] mb-6 ${lang === "mr" ? "font-devanagari" : ""}`}>
              {lang === "en" ? (
                <>Your best years<br /><em className="text-[#8fa07a] not-italic">aren't behind you.</em><br />They're stronger ahead.</>
              ) : (
                <>तुमची सर्वोत्तम वर्षे<br /><em className="text-[#8fa07a] not-italic">मागे नाहीत.</em><br />ती पुढे मजबूत आहेत.</>
              )}
            </h1>
            <p className={`text-stone-300 text-lg mb-10 max-w-md leading-relaxed ${lang === "mr" ? "font-devanagari" : ""}`}>
              {t(
                "Doctor-led health, fitness and wellness programs designed around your body, your goals and your life after 40.",
                "तुमचे शरीर, तुमची उद्दिष्टे आणि ४० नंतरच्या तुमच्या जीवनाभोवती तयार केलेले डॉक्टर-नेतृत्व आरोग्य, फिटनेस आणि वेलनेस प्रोग्राम्स.",
                lang
              )}
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setPage("assessment")} className="px-7 py-4 bg-[#6b7c5c] text-white rounded-full font-semibold text-base hover:bg-[#5a6b4b] transition-all hover:shadow-lg hover:shadow-sage/20">
                {t("Take Your Health Assessment", "आरोग्य मूल्यांकन करा", lang)}
              </button>
              <button onClick={() => setPage("programs")} className="px-7 py-4 border border-white/30 text-white rounded-full font-medium text-base hover:bg-white/10 transition-all">
                {t("Explore Programs", "प्रोग्राम्स एक्सप्लोर करा", lang)}
              </button>
            </div>
          </div>
          {/* Doctor card */}
          <div className="hidden md:flex justify-end">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 max-w-xs">
              <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&auto=format" alt="Dr. Rahul Sharma" className="w-full h-56 object-cover rounded-2xl mb-4" />
              <div>
                <p className="text-[#8fa07a] text-xs font-mono tracking-widest uppercase mb-1">{t("Founder & Chief Doctor", "संस्थापक आणि मुख्य डॉक्टर", lang)}</p>
                <p className="font-display text-white text-xl font-semibold">{t("Dr. Rahul Sharma", "डॉ. राहुल शर्मा", lang)}</p>
                <p className="text-stone-400 text-sm mt-1">{t("MD · 18 years · Longevity Medicine", "एमडी · १८ वर्षे · दीर्घायुष्य चिकित्सा", lang)}</p>
                <div className="mt-3 flex gap-2 flex-wrap">
                  {["Healthy Ageing", "Hormonal Wellness", "Longevity"].map(s => (
                    <span key={s} className="text-xs px-2 py-0.5 bg-[#6b7c5c]/40 text-[#d4dbc9] rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Assessment teaser */}
      <section className="bg-[#6b7c5c] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className={`text-[#d4dbc9] text-sm font-mono tracking-widest uppercase mb-3 ${lang === "mr" ? "font-devanagari" : ""}`}>
            {t("Not sure where to start?", "कुठून सुरू करावे हे माहीत नाही?", lang)}
          </p>
          <h2 className={`font-display text-3xl sm:text-4xl text-white mb-4 ${lang === "mr" ? "font-devanagari" : ""}`}>
            {t("Take our 3-minute health assessment.", "आमचे ३-मिनिटांचे आरोग्य मूल्यांकन करा.", lang)}
          </h2>
          <div className="flex justify-center gap-8 mt-6 mb-8">
            {[
              { icon: "⏱", en: "3–5 minutes", mr: "३-५ मिनिटे" },
              { icon: "🔒", en: "Completely private", mr: "पूर्णपणे खाजगी" },
              { icon: "🎯", en: "Personalised plan", mr: "वैयक्तिकृत योजना" },
            ].map(item => (
              <div key={item.en} className="flex flex-col items-center gap-1">
                <span className="text-2xl">{item.icon}</span>
                <span className={`text-[#d4dbc9] text-sm ${lang === "mr" ? "font-devanagari" : ""}`}>{lang === "en" ? item.en : item.mr}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setPage("assessment")} className="px-8 py-4 bg-white text-[#1c1c1c] rounded-full font-semibold hover:bg-stone-100 transition-all">
            {t("Start Free Assessment →", "मोफत मूल्यांकन सुरू करा →", lang)}
          </button>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-20 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-[#6b7c5c] text-xs font-mono tracking-widest uppercase">{t("Everything you need", "तुम्हाला आवश्यक ते सर्व", lang)}</span>
            <h2 className={`font-display text-4xl text-[#1c1c1c] mt-2 ${lang === "mr" ? "font-devanagari" : ""}`}>
              {t("One platform. Your complete wellness journey.", "एक प्लॅटफॉर्म. तुमची संपूर्ण वेलनेस प्रवास.", lang)}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {services.map((s) => (
              <button key={s.en} onClick={() => setPage("programs")} className="group bg-white border border-stone-200 rounded-2xl p-6 text-center hover:border-[#6b7c5c] hover:shadow-md transition-all">
                <span className="text-3xl block mb-3">{s.icon}</span>
                <span className={`text-stone-800 font-medium group-hover:text-[#6b7c5c] ${lang === "mr" ? "font-devanagari text-sm" : "text-sm"}`}>
                  {lang === "en" ? s.en : s.mr}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Doctor section */}
      <section className="py-20 bg-[#1c1c1c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[#8fa07a] text-xs font-mono tracking-widest uppercase">{t("The face of VitalAfter40", "VitalAfter40 चा चेहरा", lang)}</span>
            <h2 className={`font-display text-4xl sm:text-5xl text-white mt-3 mb-6 ${lang === "mr" ? "font-devanagari" : ""}`}>
              {t("Led by a doctor. Built around you.", "डॉक्टरांद्वारे नेतृत्व. तुमच्याभोवती बांधलेले.", lang)}
            </h2>
            <p className={`text-stone-400 text-base leading-relaxed mb-6 ${lang === "mr" ? "font-devanagari" : ""}`}>
              {t(
                "Dr. Rahul Sharma believes the 40s are the most important decade to invest in your health. Every program at VitalAfter40 is designed with his clinical expertise at its core.",
                "डॉ. राहुल शर्मा यांचा विश्वास आहे की ४० चे दशक आरोग्यात गुंतवणूक करण्यासाठी सर्वात महत्त्वाचे दशक आहे. VitalAfter40 मधील प्रत्येक प्रोग्राम त्यांच्या क्लिनिकल तज्ञतेसह तयार केला आहे.",
                lang
              )}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[["18+", t("Years of practice", "वर्षांचा अनुभव", lang)], ["2,400+", t("Patients helped", "रुग्णांना मदत", lang)], ["MD", t("Internal Medicine", "अंतर्गत औषध", lang)], ["4.9★", t("Patient rating", "रुग्ण रेटिंग", lang)]].map(([stat, label]) => (
                <div key={label} className="bg-white/5 rounded-xl p-4">
                  <p className="font-display text-2xl text-[#8fa07a] font-semibold">{stat}</p>
                  <p className={`text-stone-400 text-sm mt-0.5 ${lang === "mr" ? "font-devanagari" : ""}`}>{label}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setPage("professionals")} className="px-6 py-3 border border-[#6b7c5c] text-[#8fa07a] rounded-full hover:bg-[#6b7c5c]/20 transition-all">
              {t("Meet the team →", "टीमला भेटा →", lang)}
            </button>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=700&fit=crop&auto=format" alt="Dr. Rahul Sharma" className="rounded-3xl w-full object-cover h-[480px]" />
            <div className="absolute -bottom-4 -left-4 bg-[#6b7c5c] text-white rounded-2xl px-5 py-4">
              <p className="font-display text-lg font-semibold">{t("Dr. Rahul Sharma", "डॉ. राहुल शर्मा", lang)}</p>
              <p className="text-[#d4dbc9] text-sm">{t("MD · Founder", "एमडी · संस्थापक", lang)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey steps */}
      <section className="py-20 bg-[#f5f2ed]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className={`font-display text-4xl text-[#1c1c1c] ${lang === "mr" ? "font-devanagari" : ""}`}>
              {t("Your journey to vitality", "तुमची चैतन्याकडे प्रवास", lang)}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.en} className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#6b7c5c] text-white text-2xl flex items-center justify-center mx-auto mb-3">{s.icon}</div>
                <p className="text-xs font-mono text-stone-400 mb-1">0{i + 1}</p>
                <p className={`font-display text-xl text-[#1c1c1c] ${lang === "mr" ? "font-devanagari" : ""}`}>{lang === "en" ? s.en : s.mr}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs preview */}
      <section className="py-20 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[#6b7c5c] text-xs font-mono tracking-widest uppercase">{t("Programs", "प्रोग्राम्स", lang)}</span>
              <h2 className={`font-display text-4xl text-[#1c1c1c] mt-1 ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Built for your body.", "तुमच्या शरीरासाठी बनवलेले.", lang)}</h2>
            </div>
            <button onClick={() => setPage("programs")} className="hidden sm:block text-[#6b7c5c] text-sm hover:underline">{t("View all →", "सर्व पहा →", lang)}</button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {programs.slice(0, 4).map(p => (
              <ProgramCard key={p.id} p={p} lang={lang} onSelect={() => setPage("checkout")} />
            ))}
          </div>
          <div className="text-center mt-8">
            <button onClick={() => setPage("programs")} className="px-6 py-3 border border-stone-300 text-stone-700 rounded-full hover:border-[#6b7c5c] hover:text-[#6b7c5c] transition-all">
              {t("View all programs →", "सर्व प्रोग्राम्स पहा →", lang)}
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#1c1c1c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-[#8fa07a] text-xs font-mono tracking-widest uppercase">{t("Success Stories", "यशोगाथा", lang)}</span>
            <h2 className={`font-display text-4xl text-white mt-2 ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Real people. Real results.", "खरे लोक. खरे परिणाम.", lang)}</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((tm, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <StarRating n={tm.rating} />
                <p className={`text-stone-300 mt-3 mb-4 text-sm leading-relaxed ${lang === "mr" ? "font-devanagari" : ""}`}>"{lang === "en" ? tm.quote_en : tm.quote_mr}"</p>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-white font-medium">{lang === "en" ? tm.name_en : tm.name_mr}</p>
                  <p className={`text-stone-500 text-sm ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Age", "वय", lang)} {tm.age} · {lang === "en" ? tm.city_en : tm.city_mr}</p>
                  <p className={`text-[#8fa07a] text-xs mt-1 ${lang === "mr" ? "font-devanagari" : ""}`}>{lang === "en" ? tm.program_en : tm.program_mr}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-[#6b7c5c]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className={`font-display text-4xl sm:text-5xl text-white mb-4 ${lang === "mr" ? "font-devanagari" : ""}`}>
            {t("Ready to feel like yourself again?", "पुन्हा स्वतःसारखे वाटण्यास तयार आहात?", lang)}
          </h2>
          <p className={`text-[#d4dbc9] mb-8 text-lg ${lang === "mr" ? "font-devanagari" : ""}`}>
            {t("Start with a free 5-minute health assessment. No commitment required.", "मोफत ५-मिनिटांच्या आरोग्य मूल्यांकनाने सुरुवात करा.", lang)}
          </p>
          <button onClick={() => setPage("assessment")} className="px-8 py-4 bg-white text-[#1c1c1c] rounded-full font-semibold text-lg hover:bg-stone-100 transition-all">
            {t("Take Your Health Assessment →", "आरोग्य मूल्यांकन करा →", lang)}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1c1c1c] border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid sm:grid-cols-4 gap-8">
          <div>
            <p className="font-display text-white text-xl mb-2">VitalAfter40</p>
            <p className={`text-stone-500 text-sm leading-relaxed ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Doctor-led health for life after 40.", "४० नंतरच्या जीवनासाठी डॉक्टर-नेतृत्व आरोग्य.", lang)}</p>
          </div>
          {[
            { head_en: "Programs", head_mr: "प्रोग्राम्स", items: [{ en: "Pilates", mr: "पिलाटेस" }, { en: "Strength", mr: "ताकद" }, { en: "Nutrition", mr: "पोषण" }, { en: "Physiotherapy", mr: "फिजिओथेरपी" }] },
            { head_en: "Company", head_mr: "कंपनी", items: [{ en: "About", mr: "आमच्याबद्दल" }, { en: "Professionals", mr: "तज्ञ" }, { en: "Blog", mr: "ब्लॉग" }, { en: "Contact", mr: "संपर्क" }] },
            { head_en: "Legal", head_mr: "कायदेशीर", items: [{ en: "Privacy Policy", mr: "गोपनीयता धोरण" }, { en: "Terms", mr: "अटी" }, { en: "Medical Disclaimer", mr: "वैद्यकीय अस्वीकरण" }] },
          ].map(col => (
            <div key={col.head_en}>
              <p className={`text-stone-400 text-xs font-mono tracking-widest uppercase mb-3 ${lang === "mr" ? "font-devanagari" : ""}`}>{lang === "en" ? col.head_en : col.head_mr}</p>
              <ul className="space-y-2">
                {col.items.map(i => (
                  <li key={i.en}><button className={`text-stone-500 hover:text-[#8fa07a] text-sm transition-all ${lang === "mr" ? "font-devanagari" : ""}`}>{lang === "en" ? i.en : i.mr}</button></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-stone-600 text-xs">© 2024 VitalAfter40. {t("All rights reserved.", "सर्व हक्क राखीव.", lang)}</p>
          <p className={`text-stone-600 text-xs ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Not a substitute for medical advice.", "वैद्यकीय सल्ल्याचा पर्याय नाही.", lang)}</p>
        </div>
      </footer>
    </div>
  );
}

function ProgramCard({ p, lang, onSelect }: { p: typeof programs[0]; lang: Lang; onSelect: () => void }) {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all group">
      <div className="relative h-44 bg-stone-100">
        <img src={p.image} alt={p.title_en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {p.badge_en && <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#6b7c5c] text-white text-xs rounded-full">{lang === "en" ? p.badge_en : p.badge_mr}</span>}
      </div>
      <div className="p-5">
        <p className="text-xs text-[#6b7c5c] font-mono uppercase tracking-wider mb-1">{p.category}</p>
        <h3 className={`font-display text-lg font-semibold text-[#1c1c1c] mb-1 ${lang === "mr" ? "font-devanagari" : ""}`}>{lang === "en" ? p.title_en : p.title_mr}</h3>
        <p className={`text-stone-500 text-sm mb-3 leading-relaxed line-clamp-2 ${lang === "mr" ? "font-devanagari" : ""}`}>{lang === "en" ? p.desc_en : p.desc_mr}</p>
        <div className="flex items-center gap-2 text-xs text-stone-400 mb-4">
          <span>{lang === "en" ? p.duration_en : p.duration_mr}</span>
          <span>·</span>
          <span>{lang === "en" ? p.level_en : p.level_mr}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-display text-xl font-semibold text-[#1c1c1c]">₹{p.price.toLocaleString()}</p>
          <button onClick={onSelect} className="px-4 py-2 bg-[#6b7c5c] text-white text-sm rounded-full hover:bg-[#5a6b4b] transition-all">
            {t("Enrol →", "प्रवेश घ्या →", lang)}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ASSESSMENT ───────────────────────────────────────────────────────────────
function AssessmentPage({ setPage, lang }: { setPage: (p: Page) => void; lang: Lang }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [multiSelects, setMultiSelects] = useState<Record<string, string[]>>({});

  const visible = assessmentQuestions.filter(q => {
    if (!q.condition) return true;
    const cond = q.condition as { id: string; value?: string; includesAny?: string[] };
    if (cond.value) return answers[cond.id] === cond.value;
    if (cond.includesAny) {
      const selected = (multiSelects[cond.id] || []);
      return cond.includesAny.some(v => selected.includes(v));
    }
    return true;
  });

  const q = visible[step];
  if (!q) return null;
  const progress = Math.round(((step + 1) / visible.length) * 100);

  const handleChoice = (val: string) => {
    setAnswers(prev => ({ ...prev, [q.id]: val }));
    setTimeout(() => step < visible.length - 1 ? setStep(step + 1) : setPage("processing"), 300);
  };

  const handleMulti = (val: string) => {
    setMultiSelects(prev => {
      const cur = prev[q.id] || [];
      return { ...prev, [q.id]: cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val] };
    });
  };

  const handleText = (val: string) => setAnswers(prev => ({ ...prev, [q.id]: val }));

  return (
    <div className="min-h-screen bg-[#faf8f5] pt-16 flex flex-col">
      {/* Header */}
      <div className="sticky top-16 bg-[#faf8f5]/95 backdrop-blur-sm z-40 px-4 py-3 border-b border-stone-200">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button onClick={() => step > 0 ? setStep(step - 1) : setPage("home")} className="text-stone-500 hover:text-stone-800 text-sm flex items-center gap-1">
            ← {t("Back", "मागे", lang)}
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs text-stone-400 ${lang === "mr" ? "font-devanagari" : ""}`}>
                {lang === "en" ? q.section_en : q.section_mr}
              </span>
              <span className="text-xs text-[#6b7c5c] font-mono">{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#6b7c5c] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <button onClick={() => setPage("home")} className="text-stone-400 hover:text-stone-700 text-xs">{t("Exit", "बाहेर", lang)}</button>
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-2xl animate-fade-in-up">
          <p className="text-[#6b7c5c] text-xs font-mono tracking-widest uppercase mb-2">{t("Question", "प्रश्न", lang)} {step + 1} / {visible.length}</p>
          <h2 className={`font-display text-2xl sm:text-3xl text-[#1c1c1c] mb-8 leading-snug ${lang === "mr" ? "font-devanagari" : ""}`}>
            {lang === "en" ? q.q_en : q.q_mr}
          </h2>

          {(q.type === "choice") && q.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options.map(opt => (
                <button key={opt.id} onClick={() => handleChoice(opt.id)}
                  className={`answer-card flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all
                    ${answers[q.id] === opt.id ? "border-[#6b7c5c] bg-[#6b7c5c]/10" : "border-stone-200 bg-white hover:border-[#6b7c5c]/50"}`}>
                  <span className="text-2xl">{opt.icon}</span>
                  <span className={`text-stone-800 font-medium ${lang === "mr" ? "font-devanagari" : ""}`}>{lang === "en" ? opt.label_en : opt.label_mr}</span>
                </button>
              ))}
            </div>
          )}

          {q.type === "multiselect" && q.options && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {q.options.map(opt => {
                  const selected = (multiSelects[q.id] || []).includes(opt.id);
                  return (
                    <button key={opt.id} onClick={() => handleMulti(opt.id)}
                      className={`answer-card flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all
                        ${selected ? "border-[#6b7c5c] bg-[#6b7c5c]/10" : "border-stone-200 bg-white hover:border-[#6b7c5c]/50"}`}>
                      <span className="text-2xl">{opt.icon}</span>
                      <span className={`text-stone-800 font-medium flex-1 ${lang === "mr" ? "font-devanagari" : ""}`}>{lang === "en" ? opt.label_en : opt.label_mr}</span>
                      {selected && <span className="text-[#6b7c5c] text-lg">✓</span>}
                    </button>
                  );
                })}
              </div>
              <button onClick={() => step < visible.length - 1 ? setStep(step + 1) : setPage("processing")}
                disabled={(multiSelects[q.id] || []).length === 0}
                className="w-full py-4 bg-[#6b7c5c] text-white rounded-full font-semibold disabled:opacity-40 hover:bg-[#5a6b4b] transition-all">
                {t("Continue →", "पुढे →", lang)}
              </button>
            </>
          )}

          {(q.type === "text" || q.type === "number") && (
            <div>
              <input
                type={q.type}
                placeholder={lang === "en" ? q.placeholder_en : q.placeholder_mr}
                value={(answers[q.id] as string) || ""}
                onChange={e => handleText(e.target.value)}
                className={`w-full p-5 text-xl border-2 border-stone-200 rounded-2xl bg-white focus:border-[#6b7c5c] outline-none transition-all ${lang === "mr" ? "font-devanagari" : ""}`}
              />
              <button onClick={() => step < visible.length - 1 ? setStep(step + 1) : setPage("processing")}
                disabled={!answers[q.id]}
                className="w-full mt-4 py-4 bg-[#6b7c5c] text-white rounded-full font-semibold disabled:opacity-40 hover:bg-[#5a6b4b] transition-all">
                {t("Continue →", "पुढे →", lang)}
              </button>
            </div>
          )}

          {/* Privacy note */}
          <p className={`text-center text-stone-400 text-xs mt-6 ${lang === "mr" ? "font-devanagari" : ""}`}>
            🔒 {t("Your responses are private and used only to personalise your plan.", "तुमच्या उत्तरे खाजगी आहेत आणि केवळ तुमची योजना वैयक्तिकृत करण्यासाठी वापरली जातात.", lang)}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── PROCESSING ───────────────────────────────────────────────────────────────
function ProcessingPage({ setPage, lang }: { setPage: (p: Page) => void; lang: Lang }) {
  const [activeStep, setActiveStep] = useState(0);
  const steps_en = ["Reviewing your goals", "Understanding your lifestyle", "Mapping your fitness needs", "Matching you with the right experts", "Building your recommendations"];
  const steps_mr = ["तुमच्या उद्दिष्टांचे पुनरावलोकन करणे", "तुमची जीवनशैली समजून घेणे", "तुमच्या फिटनेस गरजा मॅप करणे", "योग्य तज्ञांशी जुळवणे", "तुमच्या शिफारसी तयार करणे"];
  useEffect(() => {
    const iv = setInterval(() => setActiveStep(p => p < steps_en.length ? p + 1 : p), 1000);
    const timeout = setTimeout(() => setPage("results"), 6000);
    return () => { clearInterval(iv); clearTimeout(timeout); };
  }, []);
  return (
    <div className="min-h-screen bg-[#1c1c1c] flex items-center justify-center px-4 pt-16">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full border-4 border-[#6b7c5c] border-t-transparent animate-spin-slow mx-auto mb-8" />
        <h2 className={`font-display text-3xl text-white mb-3 ${lang === "mr" ? "font-devanagari" : ""}`}>
          {t("Building your personalised wellness plan...", "तुमची वैयक्तिकृत वेलनेस योजना तयार करत आहोत...", lang)}
        </h2>
        <div className="mt-8 space-y-3 text-left">
          {steps_en.map((s, i) => (
            <div key={s} className={`flex items-center gap-3 transition-all duration-500 ${i <= activeStep ? "opacity-100" : "opacity-20"}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${i < activeStep ? "bg-[#6b7c5c] text-white" : i === activeStep ? "border-2 border-[#6b7c5c] text-[#6b7c5c]" : "border border-stone-600"}`}>
                {i < activeStep ? "✓" : i + 1}
              </span>
              <span className={`text-stone-300 text-sm ${lang === "mr" ? "font-devanagari" : ""}`}>{lang === "en" ? s : steps_mr[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── RESULTS ─────────────────────────────────────────────────────────────────
function ResultsPage({ setPage, lang }: { setPage: (p: Page) => void; lang: Lang }) {
  const [selected, setSelected] = useState<string[]>(["pilates-group", "nutrition"]);
  const recs = [
    { id: "pilates-group", priority_en: "High Priority", priority_mr: "उच्च प्राधान्य", area_en: "Movement & Mobility", area_mr: "हालचाल आणि गतिशीलता", why_en: "Based on your activity level and posture goals, regular Pilates will significantly improve your quality of movement.", why_mr: "तुमच्या क्रियाकलाप पातळी आणि पवित्रा उद्दिष्टांवर आधारित, नियमित पिलाटेस तुमच्या हालचालींची गुणवत्ता लक्षणीयरीत्या सुधारेल.", badge: "pilates-group", color: "bg-amber-50 border-amber-200" },
    { id: "strength", priority_en: "High Priority", priority_mr: "उच्च प्राधान्य", area_en: "Strength & Bone Health", area_mr: "ताकद आणि हाडांचे आरोग्य", why_en: "Strength training after 40 is essential for maintaining muscle mass, metabolism and bone density.", why_mr: "४० नंतर ताकद प्रशिक्षण स्नायू, चयापचय आणि हाडांची घनता राखण्यासाठी आवश्यक आहे.", badge: "strength", color: "bg-blue-50 border-blue-200" },
    { id: "nutrition", priority_en: "Recommended", priority_mr: "शिफारस केलेले", area_en: "Nutrition", area_mr: "पोषण", why_en: "Optimising your nutrition may support your energy levels, weight goals and long-term health.", why_mr: "तुमचे पोषण अनुकूल केल्याने ऊर्जा पातळी, वजन उद्दिष्टे आणि दीर्घकालीन आरोग्यास मदत होऊ शकते.", badge: "nutrition", color: "bg-green-50 border-green-200" },
    { id: "doctor", priority_en: "Consider", priority_mr: "विचार करा", area_en: "Medical Wellness", area_mr: "वैद्यकीय वेलनेस", why_en: "A brief consultation with Dr. Sharma may help establish your baseline health markers for 40+.", why_mr: "डॉ. शर्मांशी संक्षिप्त सल्लामसलत तुमचे बेसलाइन आरोग्य मार्कर स्थापित करण्यात मदत करू शकते.", badge: "doctor", color: "bg-stone-50 border-stone-200" },
  ];

  const toggleSelect = (id: string) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const total = selected.reduce((sum, id) => {
    const prog = programs.find(p => p.id === id);
    return sum + (prog?.price || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-[#faf8f5] pt-16">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 bg-[#6b7c5c]/10 text-[#6b7c5c] text-xs font-mono tracking-widest rounded-full mb-4">
            {t("Your personalised 40+ wellness plan", "तुमची वैयक्तिकृत ४०+ वेलनेस योजना", lang)}
          </span>
          <h1 className={`font-display text-4xl text-[#1c1c1c] mb-2 ${lang === "mr" ? "font-devanagari" : ""}`}>
            {t("Here's where we'd recommend starting.", "येथे आम्ही सुरू करण्याची शिफारस करतो.", lang)}
          </h1>
          <p className={`text-stone-500 ${lang === "mr" ? "font-devanagari" : ""}`}>
            {t("Based on your answers, we've identified your priority areas.", "तुमच्या उत्तरांवर आधारित, आम्ही तुमचे प्राधान्य क्षेत्र ओळखले आहेत.", lang)}
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {recs.map(rec => {
            const prog = programs.find(p => p.id === rec.id);
            const isSelected = selected.includes(rec.id);
            return (
              <div key={rec.id} className={`border-2 rounded-2xl p-5 transition-all ${isSelected ? "border-[#6b7c5c] bg-white" : rec.color}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-mono font-semibold ${rec.priority_en === "High Priority" ? "text-amber-600" : rec.priority_en === "Recommended" ? "text-[#6b7c5c]" : "text-stone-500"}`}>
                        {lang === "en" ? rec.priority_en : rec.priority_mr}
                      </span>
                    </div>
                    <h3 className={`font-display text-xl font-semibold text-[#1c1c1c] ${lang === "mr" ? "font-devanagari" : ""}`}>{lang === "en" ? rec.area_en : rec.area_mr}</h3>
                    <p className={`text-stone-500 text-sm mt-1 ${lang === "mr" ? "font-devanagari" : ""}`}>{lang === "en" ? rec.why_en : rec.why_mr}</p>
                    {prog && (
                      <div className="flex items-center gap-3 mt-3">
                        <span className={`text-[#1c1c1c] font-medium ${lang === "mr" ? "font-devanagari text-sm" : "text-sm"}`}>{lang === "en" ? prog.title_en : prog.title_mr}</span>
                        <span className="text-stone-400 text-xs">·</span>
                        <span className="font-display font-semibold text-[#1c1c1c]">₹{prog.price.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <button onClick={() => toggleSelect(rec.id)} className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "bg-[#6b7c5c] border-[#6b7c5c] text-white" : "border-stone-300"}`}>
                    {isSelected ? "✓" : "+"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Build your plan sticky footer */}
        <div className="sticky bottom-4 bg-white border border-stone-200 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className={`text-stone-500 text-sm ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Your selected plan", "तुमची निवडलेली योजना", lang)}</p>
              <p className="font-display text-2xl font-semibold text-[#1c1c1c]">₹{total.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className={`text-stone-400 text-xs ${lang === "mr" ? "font-devanagari" : ""}`}>{selected.length} {t("program(s) selected", "प्रोग्राम निवडले", lang)}</p>
            </div>
          </div>
          <button onClick={() => setPage("checkout")} disabled={selected.length === 0} className="w-full py-3 bg-[#6b7c5c] text-white rounded-full font-semibold disabled:opacity-40 hover:bg-[#5a6b4b] transition-all">
            {t("Continue to Checkout →", "चेकआउटकडे जा →", lang)}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PROGRAMS PAGE ────────────────────────────────────────────────────────────
function ProgramsPage({ setPage, lang }: { setPage: (p: Page) => void; lang: Lang }) {
  const [filter, setFilter] = useState("all");
  const cats = ["all", "pilates", "strength", "nutrition", "physio", "medical", "wellness"];
  const filtered = filter === "all" ? programs : programs.filter(p => p.category === filter);
  return (
    <div className="pt-16 min-h-screen bg-[#faf8f5]">
      <div className="bg-[#1c1c1c] py-16 text-center">
        <span className="text-[#8fa07a] text-xs font-mono tracking-widest uppercase">{t("All Programs", "सर्व प्रोग्राम्स", lang)}</span>
        <h1 className={`font-display text-5xl text-white mt-2 ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Built for your body after 40.", "४० नंतर तुमच्या शरीरासाठी बनवलेले.", lang)}</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(c)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filter === c ? "bg-[#6b7c5c] text-white" : "bg-white border border-stone-200 text-stone-600 hover:border-[#6b7c5c]"}`}>
              {c === "all" ? t("All", "सर्व", lang) : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(p => <ProgramCard key={p.id} p={p} lang={lang} onSelect={() => setPage("checkout")} />)}
        </div>
      </div>
    </div>
  );
}

// ─── PROFESSIONALS ────────────────────────────────────────────────────────────
function ProfessionalsPage({ lang }: { lang: Lang }) {
  return (
    <div className="pt-16 min-h-screen bg-[#faf8f5]">
      <div className="bg-[#1c1c1c] py-16 text-center">
        <span className="text-[#8fa07a] text-xs font-mono tracking-widest uppercase">{t("The Team", "टीम", lang)}</span>
        <h1 className={`font-display text-5xl text-white mt-2 ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Doctors, coaches & experts.", "डॉक्टर, कोच आणि तज्ञ.", lang)}</h1>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 grid sm:grid-cols-2 gap-8">
        {professionals.map(pro => (
          <div key={pro.id} className={`bg-white rounded-3xl overflow-hidden border border-stone-200 ${pro.isFounder ? "sm:col-span-2" : ""}`}>
            <div className={`flex ${pro.isFounder ? "flex-col sm:flex-row" : "flex-col"} gap-0`}>
              <img src={pro.image} alt={pro.name_en} className={`object-cover ${pro.isFounder ? "sm:w-72 h-64 sm:h-auto" : "h-56"} w-full`} />
              <div className="p-7">
                <span className="text-[#6b7c5c] text-xs font-mono tracking-widest uppercase">{lang === "en" ? pro.role_en : pro.role_mr}</span>
                <h2 className={`font-display text-2xl font-semibold text-[#1c1c1c] mt-1 mb-1 ${lang === "mr" ? "font-devanagari" : ""}`}>{lang === "en" ? pro.name_en : pro.name_mr}</h2>
                <p className="text-stone-400 text-sm mb-3">{lang === "en" ? pro.qual_en : pro.qual_mr}</p>
                <p className={`text-stone-600 text-sm leading-relaxed mb-4 ${lang === "mr" ? "font-devanagari" : ""}`}>{lang === "en" ? pro.bio_en : pro.bio_mr}</p>
                <div className="flex flex-wrap gap-2">
                  {(lang === "en" ? pro.spec_en : pro.spec_mr).map(s => (
                    <span key={s} className={`text-xs px-3 py-1 bg-[#6b7c5c]/10 text-[#6b7c5c] rounded-full ${lang === "mr" ? "font-devanagari" : ""}`}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CHECKOUT ─────────────────────────────────────────────────────────────────
function CheckoutPage({ setPage, lang }: { setPage: (p: Page) => void; lang: Lang }) {
  const [step, setStep] = useState<"details" | "payment">("details");
  const cart = programs.slice(0, 2);
  const total = cart.reduce((s, p) => s + p.price, 0);

  return (
    <div className="pt-16 min-h-screen bg-[#faf8f5]">
      <div className="max-w-4xl mx-auto px-4 py-12 grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          <h1 className={`font-display text-3xl text-[#1c1c1c] mb-6 ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Checkout", "चेकआउट", lang)}</h1>
          {step === "details" ? (
            <div className="space-y-4">
              {[{ label_en: "Full Name", label_mr: "पूर्ण नाव" }, { label_en: "Email", label_mr: "ईमेल" }, { label_en: "Phone", label_mr: "फोन" }].map(f => (
                <div key={f.label_en}>
                  <label className={`text-sm text-stone-600 mb-1 block ${lang === "mr" ? "font-devanagari" : ""}`}>{lang === "en" ? f.label_en : f.label_mr}</label>
                  <input className="w-full border border-stone-200 rounded-xl px-4 py-3 bg-white focus:border-[#6b7c5c] outline-none" />
                </div>
              ))}
              <button onClick={() => setStep("payment")} className="w-full py-4 bg-[#6b7c5c] text-white rounded-full font-semibold hover:bg-[#5a6b4b] transition-all mt-2">
                {t("Continue to Payment →", "पेमेंटकडे जा →", lang)}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white border border-stone-200 rounded-2xl p-6">
                <h3 className={`font-semibold mb-4 ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Payment Details", "पेमेंट तपशील", lang)}</h3>
                <div className="flex gap-3 mb-4">
                  {["UPI", "Card", "Net Banking", "Wallet"].map(m => (
                    <button key={m} className="px-4 py-2 border border-stone-200 rounded-full text-sm hover:border-[#6b7c5c] transition-all">{m}</button>
                  ))}
                </div>
                <input placeholder="UPI ID (e.g. name@upi)" className="w-full border border-stone-200 rounded-xl px-4 py-3 bg-white focus:border-[#6b7c5c] outline-none" />
              </div>
              <div className="bg-[#6b7c5c]/10 border border-[#6b7c5c]/30 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-[#6b7c5c]">
                🔒 {t("Secured by Razorpay. 100% encrypted.", "Razorpay द्वारे सुरक्षित. १००% एन्क्रिप्टेड.", lang)}
              </div>
              <button onClick={() => setPage("confirmation")} className="w-full py-4 bg-[#6b7c5c] text-white rounded-full font-semibold hover:bg-[#5a6b4b] transition-all">
                {t(`Pay ₹${total.toLocaleString()} →`, `₹${total.toLocaleString()} द्या →`, lang)}
              </button>
            </div>
          )}
        </div>
        {/* Order summary */}
        <div className="md:col-span-2">
          <div className="bg-white border border-stone-200 rounded-2xl p-5 sticky top-24">
            <h3 className={`font-semibold mb-4 ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Order Summary", "ऑर्डर सारांश", lang)}</h3>
            {cart.map(p => (
              <div key={p.id} className="flex items-center gap-3 py-3 border-b border-stone-100">
                <span className="text-xl">{p.icon}</span>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${lang === "mr" ? "font-devanagari" : ""}`}>{lang === "en" ? p.title_en : p.title_mr}</p>
                  <p className={`text-stone-400 text-xs ${lang === "mr" ? "font-devanagari" : ""}`}>{lang === "en" ? p.duration_en : p.duration_mr}</p>
                </div>
                <p className="font-semibold">₹{p.price.toLocaleString()}</p>
              </div>
            ))}
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-stone-200">
              <p className={`font-semibold ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Total", "एकूण", lang)}</p>
              <p className="font-display text-xl font-semibold">₹{total.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CONFIRMATION ─────────────────────────────────────────────────────────────
function ConfirmationPage({ setPage, lang }: { setPage: (p: Page) => void; lang: Lang }) {
  return (
    <div className="pt-16 min-h-screen bg-[#faf8f5] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center py-16">
        <div className="w-20 h-20 rounded-full bg-[#6b7c5c] text-white text-4xl flex items-center justify-center mx-auto mb-6">✓</div>
        <h1 className={`font-display text-4xl text-[#1c1c1c] mb-3 ${lang === "mr" ? "font-devanagari" : ""}`}>{t("You're in!", "तुम्ही आत आहात!", lang)}</h1>
        <p className={`text-stone-500 mb-6 ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Your enrollment is confirmed. Welcome to VitalAfter40.", "तुमचा नोंदणी पुष्टी झाली आहे. VitalAfter40 मध्ये आपले स्वागत आहे.", lang)}</p>
        <div className="bg-white border border-stone-200 rounded-2xl p-5 mb-6 text-left">
          <p className={`font-semibold mb-3 ${lang === "mr" ? "font-devanagari" : ""}`}>{t("What happens next", "पुढे काय होते", lang)}</p>
          {[
            { icon: "📱", en: "You'll receive a WhatsApp confirmation", mr: "तुम्हाला व्हॉट्सअॅप पुष्टीकरण मिळेल" },
            { icon: "📧", en: "Check your email for program details", mr: "प्रोग्राम तपशीलांसाठी ईमेल तपासा" },
            { icon: "🧘", en: "Your coach will contact you within 24 hrs", mr: "तुमचा कोच २४ तासांत संपर्क करेल" },
          ].map(step => (
            <div key={step.en} className="flex items-center gap-3 py-2 border-b border-stone-100 last:border-0">
              <span>{step.icon}</span>
              <span className={`text-sm text-stone-600 ${lang === "mr" ? "font-devanagari" : ""}`}>{lang === "en" ? step.en : step.mr}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setPage("pwa")} className="w-full py-4 bg-[#6b7c5c] text-white rounded-full font-semibold hover:bg-[#5a6b4b] transition-all">
          {t("Go to My Dashboard →", "माझ्या डॅशबोर्डवर जा →", lang)}
        </button>
      </div>
    </div>
  );
}

// ─── PWA DASHBOARD ────────────────────────────────────────────────────────────
function PWAPage({ setPage, lang }: { setPage: (p: Page) => void; lang: Lang }) {
  const [tab, setTab] = useState<"home" | "programs" | "sessions" | "progress" | "profile">("home");
  const tabs = [
    { id: "home" as const, icon: "🏠", en: "Home", mr: "मुख्यपृष्ठ" },
    { id: "programs" as const, icon: "📋", en: "Programs", mr: "प्रोग्राम्स" },
    { id: "sessions" as const, icon: "📹", en: "Sessions", mr: "सेशन्स" },
    { id: "progress" as const, icon: "📈", en: "Progress", mr: "प्रगती" },
    { id: "profile" as const, icon: "👤", en: "Profile", mr: "प्रोफाइल" },
  ];

  return (
    <div className="pt-16 min-h-screen bg-[#f5f2ed] flex flex-col max-w-md mx-auto relative">
      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20 px-4 py-6">
        {tab === "home" && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <p className={`text-stone-400 text-sm ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Good morning,", "शुभ सकाळ,", lang)}</p>
              <h2 className={`font-display text-3xl text-[#1c1c1c] ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Meera 👋", "मीरा 👋", lang)}</h2>
            </div>
            {/* Next session */}
            <div className="bg-[#1c1c1c] rounded-2xl p-5 mb-4 text-white">
              <p className={`text-stone-400 text-xs mb-2 ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Next Session", "पुढील सेशन", lang)}</p>
              <p className={`font-display text-lg ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Group Pilates with Priya", "प्रियासह ग्रुप पिलाटेस", lang)}</p>
              <p className="text-stone-400 text-sm mt-1">Tomorrow · 7:00 AM · Zoom</p>
              <div className="flex gap-3 mt-4">
                <button className="flex-1 py-2.5 bg-[#6b7c5c] text-white rounded-full text-sm font-medium">
                  {t("Join Zoom", "झूम जॉइन करा", lang)}
                </button>
                <button className="px-4 py-2.5 border border-white/20 text-white rounded-full text-sm">
                  {t("Reschedule", "पुनर्निर्धारित करा", lang)}
                </button>
              </div>
            </div>
            {/* Progress summary */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label_en: "Sessions done", label_mr: "सेशन्स पूर्ण", val: "12", icon: "✅" },
                { label_en: "Attendance", label_mr: "उपस्थिती", val: "87%", icon: "📊" },
                { label_en: "Week streak", label_mr: "आठवडा स्ट्रीक", val: "4", icon: "🔥" },
                { label_en: "Days active", label_mr: "सक्रिय दिवस", val: "28", icon: "⚡" },
              ].map(s => (
                <div key={s.label_en} className="bg-white rounded-xl p-4">
                  <p className="text-xl mb-1">{s.icon}</p>
                  <p className="font-display text-2xl font-semibold text-[#1c1c1c]">{s.val}</p>
                  <p className={`text-stone-400 text-xs ${lang === "mr" ? "font-devanagari" : ""}`}>{lang === "en" ? s.label_en : s.label_mr}</p>
                </div>
              ))}
            </div>
            {/* Health habits */}
            <div className="bg-white rounded-2xl p-5">
              <p className={`font-semibold mb-3 ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Today's Habits", "आजच्या सवयी", lang)}</p>
              {[
                { en: "Morning walk 30 min", mr: "सकाळी चालणे ३० मिनिटे", done: true },
                { en: "Drink 8 glasses of water", mr: "८ ग्लास पाणी प्या", done: true },
                { en: "Pilates exercises", mr: "पिलाटेस व्यायाम", done: false },
                { en: "Evening stretching", mr: "संध्याकाळी स्ट्रेचिंग", done: false },
              ].map(h => (
                <div key={h.en} className="flex items-center gap-3 py-2 border-b border-stone-100 last:border-0">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${h.done ? "bg-[#6b7c5c] text-white" : "border-2 border-stone-200"}`}>{h.done ? "✓" : ""}</span>
                  <span className={`text-sm ${h.done ? "text-stone-400 line-through" : "text-stone-700"} ${lang === "mr" ? "font-devanagari" : ""}`}>{lang === "en" ? h.en : h.mr}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "progress" && (
          <div className="animate-fade-in">
            <h2 className={`font-display text-2xl text-[#1c1c1c] mb-6 ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Your Progress", "तुमची प्रगती", lang)}</h2>
            <div className="space-y-4">
              {[
                { label_en: "Mobility", label_mr: "गतिशीलता", pct: 72, color: "bg-[#6b7c5c]" },
                { label_en: "Strength", label_mr: "ताकद", pct: 55, color: "bg-blue-500" },
                { label_en: "Consistency", label_mr: "सातत्य", pct: 87, color: "bg-amber-500" },
                { label_en: "Program completion", label_mr: "प्रोग्राम पूर्णता", pct: 60, color: "bg-purple-500" },
              ].map(m => (
                <div key={m.label_en} className="bg-white rounded-xl p-4">
                  <div className="flex justify-between mb-2">
                    <span className={`text-sm font-medium ${lang === "mr" ? "font-devanagari" : ""}`}>{lang === "en" ? m.label_en : m.label_mr}</span>
                    <span className="text-sm font-mono text-stone-400">{m.pct}%</span>
                  </div>
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div className={`h-full ${m.color} rounded-full`} style={{ width: `${m.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "sessions" && (
          <div className="animate-fade-in">
            <h2 className={`font-display text-2xl text-[#1c1c1c] mb-6 ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Sessions", "सेशन्स", lang)}</h2>
            {[
              { title_en: "Group Pilates", title_mr: "ग्रुप पिलाटेस", coach: "Priya Nair", date: "Tomorrow", time: "7:00 AM", status: "upcoming" },
              { title_en: "Group Pilates", title_mr: "ग्रुप पिलाटेस", coach: "Priya Nair", date: "Aug 27", time: "7:00 AM", status: "upcoming" },
              { title_en: "Group Pilates", title_mr: "ग्रुप पिलाटेस", coach: "Priya Nair", date: "Aug 24", time: "7:00 AM", status: "attended" },
              { title_en: "Group Pilates", title_mr: "ग्रुप पिलाटेस", coach: "Priya Nair", date: "Aug 22", time: "7:00 AM", status: "missed" },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl p-4 mb-3 flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${s.status === "upcoming" ? "bg-[#6b7c5c]" : s.status === "attended" ? "bg-stone-300" : "bg-red-300"}`} />
                <div className="flex-1">
                  <p className={`font-medium text-sm ${lang === "mr" ? "font-devanagari" : ""}`}>{lang === "en" ? s.title_en : s.title_mr}</p>
                  <p className="text-stone-400 text-xs">{s.coach} · {s.date} · {s.time}</p>
                </div>
                {s.status === "upcoming" && (
                  <button className="px-3 py-1.5 bg-[#6b7c5c] text-white text-xs rounded-full">{t("Join", "जॉइन करा", lang)}</button>
                )}
                {s.status === "attended" && <span className="text-xs text-stone-400">{t("Attended", "उपस्थित", lang)}</span>}
                {s.status === "missed" && <span className="text-xs text-red-400">{t("Missed", "मिस", lang)}</span>}
              </div>
            ))}
          </div>
        )}

        {tab === "profile" && (
          <div className="animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-[#6b7c5c] text-white text-2xl flex items-center justify-center mx-auto mb-3">MJ</div>
              <p className={`font-display text-xl ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Meera Joshi", "मीरा जोशी", lang)}</p>
              <p className="text-stone-400 text-sm">meera@example.com · Age 52</p>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden border border-stone-200">
              {[
                { en: "My Programs", mr: "माझे प्रोग्राम्स", icon: "📋" },
                { en: "Health Assessment", mr: "आरोग्य मूल्यांकन", icon: "📊" },
                { en: "Booking History", mr: "बुकिंग इतिहास", icon: "📅" },
                { en: "Payments", mr: "पेमेंट", icon: "💳" },
                { en: "Notifications", mr: "सूचना", icon: "🔔" },
                { en: "Language", mr: "भाषा", icon: "🌐" },
                { en: "Logout", mr: "लॉगआउट", icon: "🚪" },
              ].map(item => (
                <button key={item.en} className={`w-full flex items-center gap-4 px-5 py-4 border-b border-stone-100 last:border-0 hover:bg-stone-50 text-left ${lang === "mr" ? "font-devanagari" : ""}`}>
                  <span>{item.icon}</span>
                  <span className="flex-1 text-stone-700 text-sm">{lang === "en" ? item.en : item.mr}</span>
                  <span className="text-stone-300">›</span>
                </button>
              ))}
            </div>
            <button onClick={() => setPage("home")} className="w-full mt-4 py-3 border border-stone-200 text-stone-600 rounded-full text-sm">
              {t("Back to Website", "वेबसाइटवर परत जा", lang)}
            </button>
          </div>
        )}

        {tab === "programs" && (
          <div className="animate-fade-in">
            <h2 className={`font-display text-2xl text-[#1c1c1c] mb-6 ${lang === "mr" ? "font-devanagari" : ""}`}>{t("My Programs", "माझे प्रोग्राम्स", lang)}</h2>
            {programs.slice(0, 2).map(p => (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-stone-200 mb-4">
                <img src={p.image} alt={p.title_en} className="w-full h-36 object-cover" />
                <div className="p-4">
                  <p className={`font-display text-lg font-semibold ${lang === "mr" ? "font-devanagari" : ""}`}>{lang === "en" ? p.title_en : p.title_mr}</p>
                  <p className={`text-stone-400 text-sm ${lang === "mr" ? "font-devanagari" : ""}`}>{lang === "en" ? p.duration_en : p.duration_mr}</p>
                  <div className="mt-3 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#6b7c5c] rounded-full" style={{ width: "60%" }} />
                  </div>
                  <p className="text-xs text-stone-400 mt-1 font-mono">60% {t("complete", "पूर्ण", lang)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-stone-200 flex">
        {tabs.map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)} className={`flex-1 flex flex-col items-center py-3 text-xs gap-1 transition-all ${tab === tb.id ? "text-[#6b7c5c]" : "text-stone-400"}`}>
            <span className="text-lg">{tb.icon}</span>
            <span className={lang === "mr" ? "font-devanagari text-[10px]" : ""}>{lang === "en" ? tb.en : tb.mr}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginPage({ setPage, lang }: { setPage: (p: Page) => void; lang: Lang }) {
  return (
    <div className="pt-16 min-h-screen bg-[#faf8f5] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display text-3xl text-[#1c1c1c] mb-1">VitalAfter40</p>
          <p className={`text-stone-400 ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Welcome back", "पुन्हा स्वागत", lang)}</p>
        </div>
        <div className="bg-white border border-stone-200 rounded-2xl p-7 space-y-4">
          <div>
            <label className={`text-sm text-stone-600 mb-1 block ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Phone or Email", "फोन किंवा ईमेल", lang)}</label>
            <input className="w-full border border-stone-200 rounded-xl px-4 py-3 focus:border-[#6b7c5c] outline-none" />
          </div>
          <div>
            <label className={`text-sm text-stone-600 mb-1 block ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Password", "पासवर्ड", lang)}</label>
            <input type="password" className="w-full border border-stone-200 rounded-xl px-4 py-3 focus:border-[#6b7c5c] outline-none" />
          </div>
          <button onClick={() => setPage("pwa")} className="w-full py-3 bg-[#6b7c5c] text-white rounded-full font-semibold hover:bg-[#5a6b4b] transition-all">
            {t("Login →", "लॉगिन →", lang)}
          </button>
          <p className={`text-center text-sm text-stone-400 ${lang === "mr" ? "font-devanagari" : ""}`}>
            {t("Don't have an account?", "खाते नाही?", lang)}{" "}
            <button onClick={() => setPage("assessment")} className="text-[#6b7c5c] hover:underline">
              {t("Start assessment", "मूल्यांकन सुरू करा", lang)}
            </button>
          </p>
        </div>
        <p className="text-center mt-4">
          <button onClick={() => setPage("admin")} className="text-xs text-stone-300 hover:text-stone-500">{t("Admin access →", "अॅडमिन प्रवेश →", lang)}</button>
        </p>
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ─────────────────────────────────────────────────────────
function AdminPage({ setPage, lang }: { setPage: (p: Page) => void; lang: Lang }) {
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems: { id: AdminTab; icon: string; label: string }[] = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "users", icon: "👥", label: "Users" },
    { id: "assessments", icon: "📋", label: "Assessments" },
    { id: "programs", icon: "🏋️", label: "Programs" },
    { id: "cms", icon: "✏️", label: "Content CMS" },
    { id: "analytics", icon: "📈", label: "Analytics" },
    { id: "whatsapp", icon: "💬", label: "WhatsApp" },
    { id: "translations", icon: "🌐", label: "Translations" },
    { id: "professionals", icon: "🩺", label: "Professionals" },
    { id: "payments", icon: "💳", label: "Payments" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  return (
    <div className="flex min-h-screen bg-stone-100 pt-0">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-56" : "w-16"} flex-shrink-0 bg-[#1c1c1c] min-h-screen flex flex-col transition-all duration-300 fixed left-0 top-0 bottom-0 z-40`}>
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <span className="w-8 h-8 rounded-full bg-[#6b7c5c] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">V</span>
          {sidebarOpen && <span className="font-display text-white text-base font-semibold">Admin</span>}
        </div>
        <nav className="flex-1 py-4">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all ${tab === item.id ? "bg-[#6b7c5c]/30 text-[#8fa07a]" : "text-stone-400 hover:text-white hover:bg-white/5"}`}>
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-white/10">
          <button onClick={() => setPage("home")} className={`flex items-center gap-3 text-stone-500 hover:text-white text-sm transition-all`}>
            <span>🏠</span>
            {sidebarOpen && <span>Back to site</span>}
          </button>
        </div>
      </div>

      {/* Main */}
      <div className={`flex-1 ${sidebarOpen ? "ml-56" : "ml-16"} transition-all duration-300`}>
        {/* Top bar */}
        <div className="bg-white border-b border-stone-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-stone-400 hover:text-stone-700">☰</button>
            <h1 className="font-semibold text-stone-800 capitalize">{navItems.find(n => n.id === tab)?.label}</h1>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle lang={lang} setLang={() => {}} />
            <span className="text-sm text-stone-400">Super Admin</span>
            <div className="w-8 h-8 rounded-full bg-[#6b7c5c] text-white text-xs flex items-center justify-center">SA</div>
          </div>
        </div>

        <div className="p-6">
          {tab === "dashboard" && <AdminDashboard lang={lang} />}
          {tab === "users" && <AdminUsers lang={lang} />}
          {tab === "assessments" && <AdminAssessments lang={lang} />}
          {tab === "programs" && <AdminPrograms lang={lang} />}
          {tab === "cms" && <AdminCMS lang={lang} />}
          {tab === "analytics" && <AdminAnalytics lang={lang} />}
          {tab === "whatsapp" && <AdminWhatsApp lang={lang} />}
          {tab === "translations" && <AdminTranslations lang={lang} />}
          {tab === "professionals" && <AdminProfessionals lang={lang} />}
          {tab === "payments" && <AdminPayments lang={lang} />}
          {tab === "settings" && <AdminSettings lang={lang} />}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color = "text-[#1c1c1c]" }: { icon: string; label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-stone-200">
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        {sub && <span className="text-xs text-[#6b7c5c] bg-[#6b7c5c]/10 px-2 py-0.5 rounded-full">{sub}</span>}
      </div>
      <p className={`font-display text-3xl font-semibold mb-1 ${color}`}>{value}</p>
      <p className="text-stone-400 text-sm">{label}</p>
    </div>
  );
}

function AdminDashboard({ lang }: { lang: Lang }) {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon="👥" label={t("Total Users", "एकूण वापरकर्ते", lang)} value={adminStats.users.toLocaleString()} sub="+12% this month" />
        <StatCard icon="🎯" label={t("New Leads", "नवीन लीड", lang)} value={adminStats.leads.toString()} sub="This week" />
        <StatCard icon="📋" label={t("Assessments", "मूल्यांकने", lang)} value={adminStats.assessments.toLocaleString()} />
        <StatCard icon="💰" label={t("Revenue", "महसूल", lang)} value={`₹${(adminStats.revenue / 100000).toFixed(1)}L`} sub="This month" color="text-[#6b7c5c]" />
        <StatCard icon="📊" label={t("Conversions", "रूपांतरणे", lang)} value={adminStats.conversions.toString()} />
        <StatCard icon="📹" label={t("Upcoming Sessions", "आगामी सेशन्स", lang)} value={adminStats.sessions.toString()} />
        <StatCard icon="💬" label={t("WhatsApp Leads", "व्हॉट्सअॅप लीड", lang)} value={adminStats.whatsapp_leads.toString()} />
        <StatCard icon="🏃" label={t("Active Programs", "सक्रिय प्रोग्राम्स", lang)} value={adminStats.programs.toString()} />
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-xl p-5 border border-stone-200 mb-4">
        <h3 className={`font-semibold mb-4 ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Revenue & Leads (Last 6 months)", "महसूल आणि लीड (मागील ६ महिने)", lang)}</h3>
        <div className="flex items-end gap-2 h-32">
          {revenueData.map(d => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-stone-400 font-mono">{(d.revenue / 1000).toFixed(0)}k</span>
              <div className="w-full rounded-t-md bg-[#6b7c5c]" style={{ height: `${(d.revenue / 200000) * 100}px` }} />
              <span className="text-xs text-stone-400">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Funnel */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <h3 className={`font-semibold mb-4 ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Conversion Funnel", "रूपांतरण फनेल", lang)}</h3>
          {funnelData.map((f, i) => (
            <div key={f.stage_en} className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span className={`text-stone-600 ${lang === "mr" ? "font-devanagari" : ""}`}>{lang === "en" ? f.stage_en : f.stage_mr}</span>
                <span className="font-mono text-stone-400">{f.value.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#6b7c5c] rounded-full" style={{ width: `${(f.value / funnelData[0].value) * 100}%`, opacity: 1 - i * 0.1 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <h3 className={`font-semibold mb-4 ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Recent Activity", "अलीकडील क्रियाकलाप", lang)}</h3>
          {[
            { text: "New assessment submitted", sub: "Prakash More · 5 min ago", icon: "📋" },
            { text: "Payment received ₹2,999", sub: "Sunita Desai · 1 hr ago", icon: "💰" },
            { text: "Session booked — Group Pilates", sub: "Anita Kumar · 2 hrs ago", icon: "📅" },
            { text: "New WhatsApp lead", sub: "+91 9876543210 · 3 hrs ago", icon: "💬" },
            { text: "Program enrolled — Strength", sub: "Rajesh Patil · 4 hrs ago", icon: "🏋️" },
          ].map((a, i) => (
            <div key={i} className="flex items-start gap-3 py-2.5 border-b border-stone-100 last:border-0">
              <span className="text-lg mt-0.5">{a.icon}</span>
              <div>
                <p className="text-sm text-stone-700">{a.text}</p>
                <p className="text-xs text-stone-400">{a.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminUsers({ lang }: { lang: Lang }) {
  const [search, setSearch] = useState("");
  const filtered = adminUsers.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div className="flex gap-3 mb-4">
        <input placeholder={t("Search users...", "वापरकर्ते शोधा...", lang)} value={search} onChange={e => setSearch(e.target.value)} className="flex-1 border border-stone-200 rounded-xl px-4 py-2 bg-white focus:border-[#6b7c5c] outline-none text-sm" />
        <button className="px-4 py-2 bg-[#6b7c5c] text-white rounded-xl text-sm">{t("Export", "निर्यात", lang)}</button>
      </div>
      <div className="bg-white rounded-xl border border-stone-200 overflow-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-200">
            <tr>
              {["Name", "Phone", "Age", "Language", "Assessment", "Program", "Subscription", "Payment", "Last Active", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-stone-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-b border-stone-100 hover:bg-stone-50">
                <td className="px-4 py-3 font-medium text-stone-800 whitespace-nowrap">{u.name}</td>
                <td className="px-4 py-3 text-stone-500 font-mono text-xs">{u.phone}</td>
                <td className="px-4 py-3 text-stone-500">{u.age}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${u.lang === "MR" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>{u.lang}</span></td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${u.assessment === "Completed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{u.assessment}</span></td>
                <td className="px-4 py-3 text-stone-500 whitespace-nowrap">{u.program}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${u.subscription === "Active" ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"}`}>{u.subscription}</span></td>
                <td className="px-4 py-3 font-mono text-stone-700">{u.payment}</td>
                <td className="px-4 py-3 text-stone-400 text-xs whitespace-nowrap">{u.last_activity}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button className="px-2 py-1 text-xs bg-stone-100 text-stone-600 rounded hover:bg-stone-200">View</button>
                    <button className="px-2 py-1 text-xs bg-[#6b7c5c]/10 text-[#6b7c5c] rounded hover:bg-[#6b7c5c]/20">WhatsApp</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminAssessments({ lang }: { lang: Lang }) {
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-1 bg-white rounded-xl border border-stone-200 overflow-auto">
        <div className="px-4 py-3 border-b border-stone-200 flex justify-between items-center">
          <p className={`font-semibold text-sm ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Questions", "प्रश्न", lang)}</p>
          <button className="text-xs px-3 py-1.5 bg-[#6b7c5c] text-white rounded-lg">{t("+ Add", "+ जोडा", lang)}</button>
        </div>
        {assessmentQuestions.map((q, i) => (
          <button key={q.id} onClick={() => { setSelected(i); setEditMode(true); }} className={`w-full text-left px-4 py-3 border-b border-stone-100 hover:bg-stone-50 ${selected === i ? "bg-[#6b7c5c]/5 border-l-2 border-l-[#6b7c5c]" : ""}`}>
            <p className={`text-xs text-stone-400 mb-0.5 ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Section", "विभाग", lang)} {q.section} · {q.type}</p>
            <p className={`text-sm text-stone-700 leading-snug ${lang === "mr" ? "font-devanagari" : ""}`}>{lang === "en" ? q.q_en : q.q_mr}</p>
          </button>
        ))}
      </div>

      <div className="md:col-span-2">
        {editMode && selected !== null ? (
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <div className="flex justify-between mb-4">
              <h3 className={`font-semibold ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Edit Question", "प्रश्न संपादित करा", lang)}</h3>
              <div className="flex gap-2">
                <button className="text-xs px-3 py-1.5 border border-stone-200 rounded-lg text-stone-500">{t("Duplicate", "डुप्लिकेट", lang)}</button>
                <button className="text-xs px-3 py-1.5 bg-[#6b7c5c] text-white rounded-lg">{t("Save", "जतन करा", lang)}</button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-stone-400 mb-1 block">Question (English)</label>
                <textarea className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:border-[#6b7c5c] outline-none resize-none" rows={2} defaultValue={assessmentQuestions[selected].q_en} />
              </div>
              <div>
                <label className="text-xs text-stone-400 mb-1 block font-devanagari">Question (मराठी)</label>
                <textarea className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm font-devanagari focus:border-[#6b7c5c] outline-none resize-none" rows={2} defaultValue={assessmentQuestions[selected].q_mr} />
              </div>
              <div>
                <label className="text-xs text-stone-400 mb-1 block">Question Type</label>
                <select className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:border-[#6b7c5c] outline-none">
                  {["choice", "multiselect", "text", "number", "slider", "yes/no"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-stone-400 mb-1 block">Section</label>
                <select className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:border-[#6b7c5c] outline-none">
                  {[1, 2, 3, 4, 5, 6, 7].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            {assessmentQuestions[selected].options && (
              <div className="mt-4">
                <label className="text-xs text-stone-400 mb-2 block">Answer Options</label>
                {assessmentQuestions[selected].options!.map(opt => (
                  <div key={opt.id} className="flex gap-2 mb-2">
                    <input className="flex-1 border border-stone-200 rounded-lg px-3 py-1.5 text-sm" defaultValue={opt.label_en} placeholder="English" />
                    <input className="flex-1 border border-stone-200 rounded-lg px-3 py-1.5 text-sm font-devanagari" defaultValue={opt.label_mr} placeholder="मराठी" />
                    <button className="text-red-400 hover:text-red-600 text-xs px-2">✕</button>
                  </div>
                ))}
                <button className="text-xs text-[#6b7c5c] hover:underline mt-1">+ Add option</button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-stone-200 p-8 text-center">
            <p className={`text-stone-400 ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Select a question to edit", "संपादित करण्यासाठी एक प्रश्न निवडा", lang)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminPrograms({ lang }: { lang: Lang }) {
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className={`font-semibold ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Programs", "प्रोग्राम्स", lang)}</h2>
        <button className="px-4 py-2 bg-[#6b7c5c] text-white rounded-xl text-sm">{t("+ New Program", "+ नवीन प्रोग्राम", lang)}</button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {programs.map(p => (
          <div key={p.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <img src={p.image} alt={p.title_en} className="w-full h-32 object-cover" />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-stone-800 text-sm">{p.title_en}</p>
                  <p className="font-devanagari text-stone-400 text-xs">{p.title_mr}</p>
                </div>
                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Active</span>
              </div>
              <p className="font-mono font-semibold text-[#1c1c1c] mb-3">₹{p.price.toLocaleString()}</p>
              <div className="flex gap-2">
                <button className="flex-1 py-1.5 text-xs border border-stone-200 rounded-lg hover:border-[#6b7c5c] text-stone-600">{t("Edit", "संपादित करा", lang)}</button>
                <button className="flex-1 py-1.5 text-xs border border-stone-200 rounded-lg text-stone-600">{t("Duplicate", "डुप्लिकेट", lang)}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminCMS({ lang }: { lang: Lang }) {
  const sections = [
    { id: "hero", name_en: "Homepage Hero", name_mr: "होमपेज हीरो" },
    { id: "doctor", name_en: "Doctor Section", name_mr: "डॉक्टर विभाग" },
    { id: "programs", name_en: "Programs Section", name_mr: "प्रोग्राम्स विभाग" },
    { id: "faqs", name_en: "FAQs", name_mr: "वारंवार विचारले जाणारे प्रश्न" },
    { id: "testimonials", name_en: "Testimonials", name_mr: "प्रशंसापत्रे" },
    { id: "banners", name_en: "Banners & CTAs", name_mr: "बॅनर आणि CTAs" },
  ];
  const [active, setActive] = useState("hero");
  return (
    <div className="grid md:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl border border-stone-200">
        {sections.map(s => (
          <button key={s.id} onClick={() => setActive(s.id)} className={`w-full text-left px-4 py-3 border-b border-stone-100 last:border-0 text-sm ${active === s.id ? "text-[#6b7c5c] font-medium" : "text-stone-600 hover:bg-stone-50"}`}>
            <span className={lang === "mr" ? "font-devanagari" : ""}>{lang === "en" ? s.name_en : s.name_mr}</span>
          </button>
        ))}
      </div>
      <div className="md:col-span-3 bg-white rounded-xl border border-stone-200 p-5">
        <div className="flex justify-between mb-5">
          <h3 className={`font-semibold ${lang === "mr" ? "font-devanagari" : ""}`}>{lang === "en" ? sections.find(s => s.id === active)?.name_en : sections.find(s => s.id === active)?.name_mr}</h3>
          <div className="flex gap-2">
            <button className="text-sm px-3 py-1.5 border border-stone-200 rounded-lg text-stone-500">{t("Save Draft", "ड्राफ्ट जतन करा", lang)}</button>
            <button className="text-sm px-3 py-1.5 bg-[#6b7c5c] text-white rounded-lg">{t("Publish", "प्रकाशित करा", lang)}</button>
          </div>
        </div>
        {active === "hero" && (
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { field: "Headline", en: "Your best years aren't behind you. They're stronger ahead.", mr: "तुमची सर्वोत्तम वर्षे मागे नाहीत." },
              { field: "Subheadline", en: "Doctor-led health, fitness and wellness programs designed around your body...", mr: "तुमचे शरीर, तुमची उद्दिष्टे..." },
              { field: "Primary CTA", en: "Take Your Health Assessment", mr: "आरोग्य मूल्यांकन करा" },
              { field: "Secondary CTA", en: "Explore Programs", mr: "प्रोग्राम्स एक्सप्लोर करा" },
            ].map(f => (
              <div key={f.field}>
                <label className="text-xs text-stone-400 mb-1 block">{f.field} (EN)</label>
                <textarea className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:border-[#6b7c5c] outline-none resize-none mb-1" rows={2} defaultValue={f.en} />
                <label className="text-xs text-stone-400 mb-1 block font-devanagari">{f.field} (मराठी)</label>
                <textarea className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm font-devanagari focus:border-[#6b7c5c] outline-none resize-none" rows={2} defaultValue={f.mr} />
              </div>
            ))}
          </div>
        )}
        {active !== "hero" && (
          <div className="text-center py-12 text-stone-400">
            <p className="text-4xl mb-3">✏️</p>
            <p className={lang === "mr" ? "font-devanagari" : ""}>{t("Select fields to edit this section", "हा विभाग संपादित करण्यासाठी फील्ड निवडा", lang)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminAnalytics({ lang }: { lang: Lang }) {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label_en: "Assessment Starts", label_mr: "मूल्यांकन सुरुवात", val: "1,847" },
          { label_en: "Completions", label_mr: "पूर्णता", val: "891 (48%)" },
          { label_en: "Abandonment", label_mr: "सोडणे", val: "956 (52%)" },
          { label_en: "Avg. completion time", label_mr: "सरासरी पूर्णता वेळ", val: "4.2 min" },
        ].map(s => (
          <div key={s.label_en} className="bg-white border border-stone-200 rounded-xl p-4">
            <p className={`text-stone-400 text-xs mb-1 ${lang === "mr" ? "font-devanagari" : ""}`}>{lang === "en" ? s.label_en : s.label_mr}</p>
            <p className="font-display text-2xl font-semibold text-[#1c1c1c]">{s.val}</p>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h3 className={`font-semibold mb-4 ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Popular Programs", "लोकप्रिय प्रोग्राम्स", lang)}</h3>
          {[["Group Pilates", 312], ["Strength Training", 198], ["Nutrition", 156], ["Doctor Consultation", 124], ["Individual Pilates", 98]].map(([name, count]) => (
            <div key={name as string} className="flex items-center gap-3 py-2">
              <span className={`text-sm flex-1 ${lang === "mr" ? "font-devanagari" : ""}`}>{name}</span>
              <div className="w-24 h-2 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#6b7c5c] rounded-full" style={{ width: `${((count as number) / 312) * 100}%` }} />
              </div>
              <span className="text-xs font-mono text-stone-400 w-8 text-right">{count}</span>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h3 className={`font-semibold mb-4 ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Language Split", "भाषा विभाजन", lang)}</h3>
          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#6b7c5c]" /><span className="text-sm">English 67%</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-400" /><span className={`text-sm ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Marathi 33%", "मराठी ३३%", lang)}</span></div>
          </div>
          <div className="h-4 rounded-full overflow-hidden bg-stone-100 flex">
            <div className="h-full bg-[#6b7c5c]" style={{ width: "67%" }} />
            <div className="h-full bg-amber-400" style={{ width: "33%" }} />
          </div>
          <div className="mt-6">
            <h4 className="text-sm font-semibold mb-3 text-stone-600">{t("Traffic Sources", "ट्रॅफिक स्रोत", lang)}</h4>
            {[["Meta Ads", 54], ["WhatsApp", 23], ["Organic", 15], ["Referral", 8]].map(([src, pct]) => (
              <div key={src as string} className="flex justify-between text-sm py-1.5 border-b border-stone-100 last:border-0">
                <span className="text-stone-600">{src}</span>
                <span className="font-mono text-stone-400">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminWhatsApp({ lang }: { lang: Lang }) {
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className={`font-semibold ${lang === "mr" ? "font-devanagari" : ""}`}>{t("WhatsApp Templates", "व्हॉट्सअॅप टेम्पलेट्स", lang)}</h2>
        <button className="px-4 py-2 bg-[#25D366] text-white rounded-xl text-sm">{t("+ New Template", "+ नवीन टेम्पलेट", lang)}</button>
      </div>
      <div className="bg-white rounded-xl border border-stone-200 overflow-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-200">
            <tr>
              {["Template", "Category", "Language", "Status", "Sent", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-stone-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {whatsappTemplates.map(t => (
              <tr key={t.id} className="border-b border-stone-100 hover:bg-stone-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-stone-800">{t.name_en}</p>
                  <p className="font-devanagari text-stone-400 text-xs">{t.name_mr}</p>
                </td>
                <td className="px-4 py-3 text-stone-500">{t.category}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">{t.lang}</span></td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 text-xs rounded-full ${t.status === "Active" ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"}`}>{t.status}</span></td>
                <td className="px-4 py-3 font-mono text-stone-500">{t.sent.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button className="px-2 py-1 text-xs bg-stone-100 text-stone-600 rounded">Edit</button>
                    <button className="px-2 py-1 text-xs bg-[#25D366]/10 text-[#25D366] rounded">Send</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminTranslations({ lang }: { lang: Lang }) {
  const keys = [
    { key: "nav.programs", en: "Programs", mr: "प्रोग्राम्स", status: "published" },
    { key: "nav.professionals", en: "Doctors & Coaches", mr: "डॉक्टर आणि कोच", status: "published" },
    { key: "hero.headline", en: "Your best years aren't behind you.", mr: "तुमची सर्वोत्तम वर्षे मागे नाहीत.", status: "published" },
    { key: "cta.assessment", en: "Take Your Health Assessment", mr: "आरोग्य मूल्यांकन करा", status: "published" },
    { key: "programs.pilates.group", en: "Group Pilates", mr: "ग्रुप पिलाटेस", status: "published" },
    { key: "programs.strength.title", en: "Strength & Muscle", mr: "", status: "missing" },
    { key: "checkout.payment.title", en: "Payment Details", mr: "", status: "missing" },
    { key: "pwa.progress.label", en: "Your Progress", mr: "तुमची प्रगती", status: "draft" },
  ];
  return (
    <div>
      <div className="flex gap-3 mb-4">
        <input placeholder={t("Search translation keys...", "अनुवाद की शोधा...", lang)} className="flex-1 border border-stone-200 rounded-xl px-4 py-2 bg-white focus:border-[#6b7c5c] outline-none text-sm" />
        <select className="border border-stone-200 rounded-xl px-3 py-2 text-sm bg-white">
          <option>All</option>
          <option>Missing Marathi</option>
          <option>Draft</option>
          <option>Published</option>
        </select>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-2 text-sm text-amber-700">
        ⚠️ {t("2 keys missing Marathi translation", "२ की मराठी अनुवाद गहाळ", lang)}
      </div>
      <div className="bg-white rounded-xl border border-stone-200 overflow-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-200">
            <tr>
              {["Key", "English", "Marathi", "Status", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-stone-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {keys.map(k => (
              <tr key={k.key} className={`border-b border-stone-100 hover:bg-stone-50 ${k.status === "missing" ? "bg-red-50/30" : ""}`}>
                <td className="px-4 py-3 font-mono text-xs text-stone-400">{k.key}</td>
                <td className="px-4 py-3 text-stone-700">{k.en}</td>
                <td className="px-4 py-3">
                  {k.mr ? <span className="font-devanagari text-stone-700">{k.mr}</span> : <span className="text-red-400 text-xs italic">Missing translation</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${k.status === "published" ? "bg-green-100 text-green-700" : k.status === "draft" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{k.status}</span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-xs px-2 py-1 bg-stone-100 rounded text-stone-600 hover:bg-stone-200">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminProfessionals({ lang }: { lang: Lang }) {
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className={`font-semibold ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Professionals", "तज्ञ", lang)}</h2>
        <button className="px-4 py-2 bg-[#6b7c5c] text-white rounded-xl text-sm">{t("+ Add Professional", "+ तज्ञ जोडा", lang)}</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {professionals.map(pro => (
          <div key={pro.id} className="bg-white rounded-xl border border-stone-200 p-5 flex gap-4">
            <img src={pro.image} alt={pro.name_en} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-stone-800">{pro.name_en}</p>
                  <p className="font-devanagari text-stone-400 text-xs">{pro.name_mr}</p>
                  <p className="text-stone-400 text-xs mt-0.5">{pro.qual_en}</p>
                </div>
                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full ml-2">Active</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="text-xs px-3 py-1.5 border border-stone-200 rounded-lg text-stone-600">{t("Edit", "संपादित", lang)}</button>
                <button className="text-xs px-3 py-1.5 border border-stone-200 rounded-lg text-stone-600">{t("Schedule", "वेळापत्रक", lang)}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminPayments({ lang }: { lang: Lang }) {
  const payments = [
    { user: "Meera Joshi", amount: 2999, program: "Group Pilates", gateway: "Razorpay", date: "Aug 24, 2024", status: "Success", txn: "pay_OAB123456" },
    { user: "Suresh Patil", amount: 3499, program: "Strength", gateway: "Razorpay", date: "Aug 23, 2024", status: "Success", txn: "pay_OAB789012" },
    { user: "Anita Kumar", amount: 999, program: "Doctor Consultation", gateway: "UPI", date: "Aug 22, 2024", status: "Failed", txn: "pay_OAB345678" },
    { user: "Prakash More", amount: 3498, program: "Doctor + Nutrition", gateway: "Razorpay", date: "Aug 21, 2024", status: "Success", txn: "pay_OAB901234" },
    { user: "Sunita Desai", amount: 5999, program: "Individual Pilates", gateway: "Card", date: "Aug 20, 2024", status: "Refunded", txn: "pay_OAB567890" },
  ];
  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[{ label: "Total Revenue", val: "₹8.47L", color: "text-[#6b7c5c]" }, { label: "Successful", val: "298", color: "text-green-600" }, { label: "Failed", val: "14", color: "text-red-500" }, { label: "Refunded", val: "8", color: "text-amber-500" }].map(s => (
          <div key={s.label} className="bg-white border border-stone-200 rounded-xl p-4">
            <p className="text-stone-400 text-xs mb-1">{s.label}</p>
            <p className={`font-display text-2xl font-semibold ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-stone-200 overflow-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-200">
            <tr>
              {["User", "Amount", "Program", "Gateway", "Date", "Status", "Transaction ID"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-stone-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map((p, i) => (
              <tr key={i} className="border-b border-stone-100 hover:bg-stone-50">
                <td className="px-4 py-3 font-medium text-stone-800">{p.user}</td>
                <td className="px-4 py-3 font-mono font-semibold text-stone-800">₹{p.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-stone-500">{p.program}</td>
                <td className="px-4 py-3 text-stone-500">{p.gateway}</td>
                <td className="px-4 py-3 text-stone-400">{p.date}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 text-xs rounded-full ${p.status === "Success" ? "bg-green-100 text-green-700" : p.status === "Failed" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{p.status}</span></td>
                <td className="px-4 py-3 font-mono text-xs text-stone-400">{p.txn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminSettings({ lang }: { lang: Lang }) {
  const roles = ["Super Admin", "Doctor", "Manager", "Coach", "Physiotherapist", "Nutritionist", "Support", "Content Manager"];
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border border-stone-200 p-5">
        <h3 className={`font-semibold mb-4 ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Roles & Permissions", "भूमिका आणि परवानग्या", lang)}</h3>
        {roles.map(role => (
          <div key={role} className="flex items-center justify-between py-3 border-b border-stone-100 last:border-0">
            <span className="text-sm text-stone-700">{role}</span>
            <div className="flex gap-2">
              <button className="text-xs px-2 py-1 bg-stone-100 rounded text-stone-600">Edit</button>
              <button className="text-xs px-2 py-1 bg-[#6b7c5c]/10 text-[#6b7c5c] rounded">Permissions</button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className="bg-white rounded-xl border border-stone-200 p-5 mb-4">
          <h3 className={`font-semibold mb-4 ${lang === "mr" ? "font-devanagari" : ""}`}>{t("General Settings", "सामान्य सेटिंग्स", lang)}</h3>
          {[
            { label: "Platform Name", val: "VitalAfter40" },
            { label: "Default Language", val: "English" },
            { label: "Currency", val: "INR (₹)" },
            { label: "WhatsApp Number", val: "+91 98765 43210" },
          ].map(s => (
            <div key={s.label} className="py-2.5 border-b border-stone-100 last:border-0">
              <p className="text-xs text-stone-400 mb-0.5">{s.label}</p>
              <input className="w-full border border-stone-200 rounded-lg px-3 py-1.5 text-sm focus:border-[#6b7c5c] outline-none" defaultValue={s.val} />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h3 className={`font-semibold mb-4 ${lang === "mr" ? "font-devanagari" : ""}`}>{t("Integrations", "एकत्रीकरण", lang)}</h3>
          {[{ name: "Razorpay", status: "Connected", icon: "💳" }, { name: "WhatsApp Business API", status: "Connected", icon: "💬" }, { name: "Meta (Facebook) Pixel", status: "Connected", icon: "📊" }, { name: "Zoom", status: "Connected", icon: "📹" }, { name: "Google Analytics", status: "Not connected", icon: "📈" }].map(i => (
            <div key={i.name} className="flex items-center justify-between py-2.5 border-b border-stone-100 last:border-0">
              <div className="flex items-center gap-2">
                <span>{i.icon}</span>
                <span className="text-sm text-stone-700">{i.name}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${i.status === "Connected" ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-400"}`}>{i.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [lang, setLang] = useState<Lang>("en");
  const isAdmin = page === "admin";
  const isPWA = page === "pwa";

  return (
    <div className="min-h-screen">
      {!isAdmin && !isPWA && <Nav page={page} setPage={setPage} lang={lang} setLang={setLang} />}
      {page === "home" && <HomePage setPage={setPage} lang={lang} />}
      {page === "assessment" && <AssessmentPage setPage={setPage} lang={lang} />}
      {page === "processing" && <ProcessingPage setPage={setPage} lang={lang} />}
      {page === "results" && <ResultsPage setPage={setPage} lang={lang} />}
      {page === "programs" && <ProgramsPage setPage={setPage} lang={lang} />}
      {page === "professionals" && <ProfessionalsPage lang={lang} />}
      {page === "checkout" && <CheckoutPage setPage={setPage} lang={lang} />}
      {page === "confirmation" && <ConfirmationPage setPage={setPage} lang={lang} />}
      {page === "pwa" && <PWAPage setPage={setPage} lang={lang} />}
      {page === "login" && <LoginPage setPage={setPage} lang={lang} />}
      {page === "admin" && <AdminPage setPage={setPage} lang={lang} />}
    </div>
  );
}

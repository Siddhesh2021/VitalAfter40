import { useState } from "react";
import { Lang, t } from "./data";

interface Props {
  lang: Lang;
  setLang: (l: Lang) => void;
  onBack: () => void;
}

type Tab = "home" | "programs" | "sessions" | "progress" | "profile";

export const habits = [
  { l_en: "Morning movement", l_mr: "सकाळची हालचाल" },
  { l_en: "Drink 8 glasses of water", l_mr: "८ ग्लास पाणी प्या" },
  { l_en: "Evening walk 20 min", l_mr: "संध्याकाळची २० मिनिट चाल" },
  { l_en: "Sleep by 10:30 PM", l_mr: "रात्री १०:३० पर्यंत झोपा" },
];

const upcomingSessions = [
  { id: 1, title_en: "Group Pilates", title_mr: "ग्रुप पिलाटेस", coach_en: "Priya Nair", coach_mr: "प्रिया नायर", date: "Mon, 26 Aug", time: "7:00 AM", type: "zoom", countdown: "2 days" },
  { id: 2, title_en: "Nutrition Check-in", title_mr: "पोषण तपासणी", coach_en: "Sneha Deshpande", coach_mr: "स्नेहा देशपांडे", date: "Wed, 28 Aug", time: "6:00 PM", type: "zoom", countdown: "4 days" },
  { id: 3, title_en: "Individual Pilates", title_mr: "वैयक्तिक पिलाटेस", coach_en: "Priya Nair", coach_mr: "प्रिया नायर", date: "Fri, 30 Aug", time: "8:00 AM", type: "zoom", countdown: "6 days" },
];

const progressData = [
  { label_en: "Sessions Completed", label_mr: "सेशन्स पूर्ण", value: 12, max: 24, unit: "" },
  { label_en: "Attendance Rate", label_mr: "उपस्थिती दर", value: 87, max: 100, unit: "%" },
  { label_en: "Weekly Streak", label_mr: "साप्ताहिक स्ट्रीक", value: 3, max: 8, unit: "wks" },
  { label_en: "Program Progress", label_mr: "प्रोग्राम प्रगती", value: 50, max: 100, unit: "%" },
];

const messages = [
  { from_en: "Priya Nair", from_mr: "प्रिया नायर", msg_en: "Great session yesterday! Focus on your breathing today.", msg_mr: "काल उत्कृष्ट सेशन! आज श्वासावर लक्ष केंद्रित करा.", time: "2h ago", unread: true },
  { from_en: "VitalAfter40 Team", from_mr: "VitalAfter40 टीम", msg_en: "Your next batch starts Monday. Zoom link is ready.", msg_mr: "तुमचा पुढचा बॅच सोमवारी सुरू होतो. झूम लिंक तयार आहे.", time: "1d ago", unread: false },
];

export default function PWADashboard({ lang, setLang, onBack }: Props) {
  const [tab, setTab] = useState<Tab>("home");
  const [habitsDone, setHabitsDone] = useState<boolean[]>([true, true, false, false]);

  const toggleHabit = (i: number) => {
    const next = [...habitsDone];
    next[i] = !next[i];
    setHabitsDone(next);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col max-w-md mx-auto relative" style={{ fontFamily: "var(--font-body)" }}>
      {/* Status bar area */}
      <div className="bg-[#1c1c1c] h-1" />

      {/* Content */}
      <div className="flex-1 overflow-auto pb-20">
        {tab === "home" && <HomeTab lang={lang} setLang={setLang} onBack={onBack} habits={habitsDone} toggleHabit={toggleHabit} />}
        {tab === "programs" && <ProgramsTab lang={lang} />}
        {tab === "sessions" && <SessionsTab lang={lang} />}
        {tab === "progress" && <ProgressTab lang={lang} />}
        {tab === "profile" && <ProfileTab lang={lang} setLang={setLang} onBack={onBack} />}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-[#1c1c1c]/8 px-2 py-2 flex z-50">
        {([
          { id: "home", icon: "🏠", l_en: "Home", l_mr: "होम" },
          { id: "programs", icon: "📋", l_en: "Programs", l_mr: "प्रोग्राम्स" },
          { id: "sessions", icon: "📅", l_en: "Sessions", l_mr: "सेशन्स" },
          { id: "progress", icon: "📈", l_en: "Progress", l_mr: "प्रगती" },
          { id: "profile", icon: "👤", l_en: "Profile", l_mr: "प्रोफाइल" },
        ] as const).map((item) => (
          <button key={item.id} onClick={() => setTab(item.id as Tab)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-1 transition-all ${tab === item.id ? "text-[#6b7c5c]" : "text-[#1c1c1c]/40"}`}>
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] font-medium" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{t(item.l_en, item.l_mr, lang)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function HomeTab({ lang, setLang, onBack, habits: habitsDone, toggleHabit }: { lang: Lang; setLang: (l: Lang) => void; onBack: () => void; habits: boolean[]; toggleHabit: (i: number) => void }) {
  const habitsCompleted = habits.filter(Boolean).length;

  return (
    <div>
      {/* Header */}
      <div className="bg-[#1c1c1c] px-4 pt-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="text-white/50 hover:text-white text-xs transition-colors" style={{ fontFamily: "var(--font-mono)" }}>
            ← {t("Exit", "बाहेर", lang)}
          </button>
          <button onClick={() => setLang(lang === "en" ? "mr" : "en")} className="text-xs border border-white/20 rounded-full px-2.5 py-1 text-white/60 hover:text-white transition-all" style={{ fontFamily: "var(--font-mono)" }}>
            {lang === "en" ? "मराठी" : "EN"}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/50 text-xs mb-1" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>
              {t("Good morning", "सुप्रभात", lang)} 🌅
            </p>
            <h2 className="text-white text-2xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>Meera!</h2>
            <p className="text-white/40 text-xs mt-0.5" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>
              {t("Monday, 26 August 2024", "सोमवार, २६ ऑगस्ट २०२४", lang)}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#6b7c5c] flex items-center justify-center">
            <span className="text-white font-semibold text-lg">M</span>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Next session card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-[#6b7c5c] px-4 py-2">
            <p className="text-white/70 text-xs" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>
              {t("Next Session", "पुढचे सेशन", lang)}
            </p>
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-[#1c1c1c]" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>
                  {t(upcomingSessions[0].title_en, upcomingSessions[0].title_mr, lang)}
                </h3>
                <p className="text-[#1c1c1c]/50 text-sm" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>
                  {t(upcomingSessions[0].coach_en, upcomingSessions[0].coach_mr, lang)}
                </p>
              </div>
              <span className="text-xs bg-[#d4dbc9] text-[#4a5c3a] px-2 py-1 rounded-full font-medium" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>
                {t("in", "मध्ये", lang)} {upcomingSessions[0].countdown}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#1c1c1c]/50 mb-4" style={{ fontFamily: "var(--font-mono)" }}>
              <span>📅 {upcomingSessions[0].date}</span>
              <span>⏰ {upcomingSessions[0].time}</span>
              <span>💻 Zoom</span>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-[#6b7c5c] hover:bg-[#5a6b4b] text-white text-sm font-semibold py-2.5 rounded-xl transition-all">
                {t("Join Zoom", "झूम जॉइन करा", lang)}
              </button>
              <button className="border border-[#1c1c1c]/15 text-[#1c1c1c]/60 text-sm px-3 py-2.5 rounded-xl hover:bg-[#f5f5f0] transition-all">
                {t("Reschedule", "पुनर्शेड्यूल", lang)}
              </button>
            </div>
          </div>
        </div>

        {/* Progress ring */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h3 className="font-semibold text-[#1c1c1c] mb-3" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{t("Your Progress", "तुमची प्रगती", lang)}</h3>
          <div className="grid grid-cols-2 gap-3">
            {progressData.slice(0, 2).map((p) => (
              <div key={p.label_en} className="bg-[#f5f5f0] rounded-xl p-3">
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-2xl font-bold text-[#1c1c1c]" style={{ fontFamily: "var(--font-mono)" }}>{p.value}</span>
                  <span className="text-[#1c1c1c]/40 text-sm mb-0.5">{p.unit || `/${p.max}`}</span>
                </div>
                <p className="text-[#1c1c1c]/50 text-xs" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{t(p.label_en, p.label_mr, lang)}</p>
                <div className="mt-2 bg-white rounded-full h-1.5">
                  <div className="bg-[#6b7c5c] h-1.5 rounded-full" style={{ width: `${(p.value / p.max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Habits */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[#1c1c1c]" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{t("Today's Habits", "आजच्या सवयी", lang)}</h3>
            <span className="text-xs text-[#6b7c5c] font-semibold" style={{ fontFamily: "var(--font-mono)" }}>{habits.filter(Boolean).length}/{habits.length}</span>
          </div>
          <div className="space-y-2">
            {habits.map((h, i) => (
              <button key={i} onClick={() => toggleHabit(i)} className="w-full flex items-center gap-3 text-left">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${habitsDone[i] ? "bg-[#6b7c5c] border-[#6b7c5c]" : "border-[#1c1c1c]/20"}`}>
                  {habitsDone[i] && <span className="text-white text-xs">✓</span>}
                </div>
                <span className={`text-sm ${habitsDone[i] ? "line-through text-[#1c1c1c]/40" : "text-[#1c1c1c]"}`} style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>
                  {t(h.l_en, h.l_mr, lang)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <h3 className="font-semibold text-[#1c1c1c] mb-3" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{t("Messages", "संदेश", lang)}</h3>
          <div className="space-y-3">
            {messages.map((m, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#d4dbc9] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#6b7c5c] text-xs font-bold">{m.from_en[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-medium text-[#1c1c1c] text-sm" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{t(m.from_en, m.from_mr, lang)}</p>
                    {m.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#6b7c5c]" />}
                    <span className="text-[#1c1c1c]/30 text-xs ml-auto" style={{ fontFamily: "var(--font-mono)" }}>{m.time}</span>
                  </div>
                  <p className="text-[#1c1c1c]/55 text-xs leading-relaxed truncate" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>
                    {t(m.msg_en, m.msg_mr, lang)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SessionsTab({ lang }: { lang: Lang }) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="px-4 pt-6 pb-4">
      <h2 className="text-xl font-semibold text-[#1c1c1c] mb-5" style={{ fontFamily: "var(--font-display)" }}>
        {t("Upcoming Sessions", "आगामी सेशन्स", lang)}
      </h2>
      <div className="space-y-3">
        {upcomingSessions.map((s) => (
          <div key={s.id} className={`bg-white rounded-2xl shadow-sm overflow-hidden transition-all ${selected === s.id ? "ring-2 ring-[#6b7c5c]" : ""}`}>
            <button className="w-full p-4 text-left" onClick={() => setSelected(selected === s.id ? null : s.id)}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-[#1c1c1c]" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{t(s.title_en, s.title_mr, lang)}</h3>
                  <p className="text-[#1c1c1c]/50 text-sm" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{t(s.coach_en, s.coach_mr, lang)}</p>
                </div>
                <span className="text-xs bg-[#d4dbc9] text-[#4a5c3a] px-2 py-1 rounded-full">{t("in", "मध्ये", lang)} {s.countdown}</span>
              </div>
              <div className="flex gap-3 text-xs text-[#1c1c1c]/40" style={{ fontFamily: "var(--font-mono)" }}>
                <span>📅 {s.date}</span>
                <span>⏰ {s.time}</span>
              </div>
            </button>
            {selected === s.id && (
              <div className="border-t border-[#1c1c1c]/8 p-4 space-y-2">
                <button className="w-full bg-[#6b7c5c] text-white font-semibold py-3 rounded-xl text-sm">
                  {t("Join Zoom", "झूम जॉइन करा", lang)}
                </button>
                <div className="flex gap-2">
                  <button className="flex-1 border border-[#1c1c1c]/15 text-[#1c1c1c]/60 text-sm py-2.5 rounded-xl hover:bg-[#f5f5f0]">
                    {t("Reschedule", "पुनर्शेड्यूल", lang)}
                  </button>
                  <button className="flex-1 border border-red-200 text-red-400 text-sm py-2.5 rounded-xl hover:bg-red-50">
                    {t("Cancel", "रद्द करा", lang)}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgramsTab({ lang }: { lang: Lang }) {
  const myPrograms = [
    { title_en: "Group Pilates — Batch A", title_mr: "ग्रुप पिलाटेस — बॅच A", progress: 50, total: 24, completed: 12, status_en: "Active", status_mr: "सक्रिय" },
    { title_en: "Nutrition Program", title_mr: "पोषण कार्यक्रम", progress: 37, total: 8, completed: 3, status_en: "Active", status_mr: "सक्रिय" },
  ];

  return (
    <div className="px-4 pt-6">
      <h2 className="text-xl font-semibold text-[#1c1c1c] mb-5" style={{ fontFamily: "var(--font-display)" }}>
        {t("My Programs", "माझे प्रोग्राम्स", lang)}
      </h2>
      <div className="space-y-4">
        {myPrograms.map((p) => (
          <div key={p.title_en} className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-[#1c1c1c]" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{t(p.title_en, p.title_mr, lang)}</h3>
              <span className="text-xs bg-[#d4dbc9] text-[#4a5c3a] px-2 py-0.5 rounded-full" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{t(p.status_en, p.status_mr, lang)}</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 bg-[#f5f5f0] rounded-full h-2">
                <div className="bg-[#6b7c5c] h-2 rounded-full" style={{ width: `${p.progress}%` }} />
              </div>
              <span className="text-xs text-[#1c1c1c]/50 flex-shrink-0" style={{ fontFamily: "var(--font-mono)" }}>{p.completed}/{p.total}</span>
            </div>
            <p className="text-[#1c1c1c]/40 text-xs" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{p.progress}% {t("complete", "पूर्ण", lang)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressTab({ lang }: { lang: Lang }) {
  return (
    <div className="px-4 pt-6">
      <h2 className="text-xl font-semibold text-[#1c1c1c] mb-5" style={{ fontFamily: "var(--font-display)" }}>
        {t("My Progress", "माझी प्रगती", lang)}
      </h2>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {progressData.map((p) => (
          <div key={p.label_en} className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-end gap-1 mb-1">
              <span className="text-3xl font-bold text-[#1c1c1c]" style={{ fontFamily: "var(--font-mono)" }}>{p.value}</span>
              <span className="text-[#1c1c1c]/40 text-sm mb-0.5">{p.unit}</span>
            </div>
            <p className="text-[#1c1c1c]/50 text-xs mb-2" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{t(p.label_en, p.label_mr, lang)}</p>
            <div className="bg-[#f5f5f0] rounded-full h-1.5">
              <div className="bg-[#6b7c5c] h-1.5 rounded-full transition-all" style={{ width: `${(p.value / p.max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Weight trend placeholder */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
        <h3 className="font-semibold text-[#1c1c1c] mb-3" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{t("Weight Trend", "वजन ट्रेंड", lang)}</h3>
        <div className="flex items-end gap-1.5 h-20">
          {[68, 67.5, 67.2, 67.0, 66.8, 66.5, 66.3].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-[#6b7c5c] rounded-t" style={{ height: `${((v - 65) / 5) * 100}%` }} />
              <span className="text-[8px] text-[#1c1c1c]/30">{["W1","W2","W3","W4","W5","W6","W7"][i]}</span>
            </div>
          ))}
        </div>
        <p className="text-[#6b7c5c] text-xs font-semibold mt-2" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>
          ↓ 1.7kg {t("in 7 weeks", "७ आठवड्यांत", lang)} 🎉
        </p>
      </div>
    </div>
  );
}

function ProfileTab({ lang, setLang, onBack }: { lang: Lang; setLang: (l: Lang) => void; onBack: () => void }) {
  return (
    <div className="px-4 pt-6">
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-[#6b7c5c] flex items-center justify-center mb-3">
          <span className="text-white text-3xl font-semibold">M</span>
        </div>
        <h2 className="font-semibold text-[#1c1c1c] text-xl" style={{ fontFamily: "var(--font-display)" }}>Meera Joshi</h2>
        <p className="text-[#1c1c1c]/50 text-sm" style={{ fontFamily: "var(--font-mono)" }}>Member since June 2024</p>
        <div className="flex gap-3 mt-3">
          <span className="bg-[#d4dbc9] text-[#4a5c3a] text-xs px-3 py-1 rounded-full">Group Pilates</span>
          <span className="bg-[#d4dbc9] text-[#4a5c3a] text-xs px-3 py-1 rounded-full">Nutrition</span>
        </div>
      </div>

      <div className="space-y-2">
        {[
          { icon: "👤", l_en: "Personal Details", l_mr: "वैयक्तिक तपशील" },
          { icon: "📋", l_en: "Health Assessment", l_mr: "आरोग्य मूल्यांकन" },
          { icon: "💳", l_en: "Billing & Payments", l_mr: "बिलिंग आणि पेमेंट" },
          { icon: "🔔", l_en: "Notifications", l_mr: "सूचना" },
          { icon: "🌐", l_en: "Language", l_mr: "भाषा" },
          { icon: "🔒", l_en: "Privacy & Security", l_mr: "गोपनीयता आणि सुरक्षा" },
        ].map((item) => (
          <button key={item.l_en} className="w-full flex items-center gap-3 bg-white rounded-2xl p-4 text-left hover:bg-[#f5f5f0] transition-all">
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium text-[#1c1c1c]" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{t(item.l_en, item.l_mr, lang)}</span>
            <span className="ml-auto text-[#1c1c1c]/30">›</span>
          </button>
        ))}

        <button onClick={() => setLang(lang === "en" ? "mr" : "en")} className="w-full flex items-center gap-3 bg-[#d4dbc9] rounded-2xl p-4 text-left hover:bg-[#c8d0bd] transition-all">
          <span className="text-xl">🌐</span>
          <span className="font-medium text-[#4a5c3a]">{lang === "en" ? "मराठीत बदला" : "Switch to English"}</span>
          <span className="ml-auto text-[#4a5c3a]/50">›</span>
        </button>

        <button onClick={onBack} className="w-full flex items-center gap-3 bg-white rounded-2xl p-4 text-left hover:bg-red-50 transition-all mt-4">
          <span className="text-xl">🚪</span>
          <span className="font-medium text-red-400">{t("Sign Out", "साइन आउट", lang)}</span>
        </button>
      </div>
    </div>
  );
}


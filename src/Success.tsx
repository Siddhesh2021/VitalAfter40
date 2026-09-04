import { useEffect, useState } from "react";
import { professionals, t, type Lang } from "./data";
import type { OrderData } from "./Checkout";

interface Props {
  lang: Lang;
  order: OrderData;
  onDashboard: () => void;
}

const NEXT_STEPS = [
  {
    step: 1,
    en: "WhatsApp confirmation sent",
    mr: "व्हॉट्सअॅप पुष्टी पाठवली",
    desc_en: "Check your WhatsApp for booking details and your expert's contact.",
    desc_mr: "बुकिंग तपशील आणि तुमच्या तज्ञाच्या संपर्कासाठी व्हॉट्सअॅप तपासा.",
    done: true,
  },
  {
    step: 2,
    en: "Email receipt sent",
    mr: "ईमेल पावती पाठवली",
    desc_en: "Your receipt and program access details are in your inbox.",
    desc_mr: "तुमची पावती आणि प्रोग्राम प्रवेश तपशील तुमच्या इनबॉक्समध्ये आहेत.",
    done: true,
  },
  {
    step: 3,
    en: "Expert will contact you",
    mr: "तज्ञ तुमच्याशी संपर्क करतील",
    desc_en: "Your expert will reach out within 24 hours to schedule your first session.",
    desc_mr: "तुमचा तज्ञ तुमचा पहिला सेशन शेड्युल करण्यासाठी २४ तासांत संपर्क करेल.",
    done: false,
  },
  {
    step: 4,
    en: "Download the app",
    mr: "अॅप डाउनलोड करा",
    desc_en: "Track progress, join sessions, and message your expert — all in one place.",
    desc_mr: "प्रगती ट्रॅक करा, सेशन्समध्ये सामील व्हा, आणि तुमच्या तज्ञाला मेसेज करा.",
    done: false,
  },
];

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {Array.from({ length: 28 }).map((_, i) => {
        const colors = ["var(--sage)", "var(--gold)", "var(--sage-light)", "#fff", "var(--sage-pale)"];
        const color = colors[i % colors.length];
        const left = `${(i * 37 + 5) % 100}%`;
        const delay = `${(i * 0.12) % 2}s`;
        const dur = `${1.8 + (i % 3) * 0.4}s`;
        const size = 6 + (i % 3) * 3;
        return (
          <div key={i} style={{
            position: "absolute",
            top: "-10px",
            left,
            width: size,
            height: size,
            background: color,
            borderRadius: i % 3 === 0 ? "50%" : 2,
            animation: `confetti-fall ${dur} ${delay} ease-in forwards`,
            transform: `rotate(${i * 45}deg)`,
          }} />
        );
      })}
    </div>
  );
}

export default function SuccessPage({ lang, order, onDashboard }: Props) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [stepsVisible, setStepsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const t1 = setTimeout(() => setShowConfetti(false), 3500);
    const t2 = setTimeout(() => setStepsVisible(true), 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const firstItem = order.items[0];
  const expert = professionals.find(p => {
    if (!firstItem) return false;
    if (firstItem.category === "pilates") return p.id === "priya-pilates";
    if (firstItem.category === "physio") return p.id === "amit-physio";
    if (firstItem.category === "nutrition") return p.id === "sneha-nutrition";
    return p.id === "dr-sharma";
  });

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
      {showConfetti && <Confetti />}

      {/* Hero */}
      <div style={{ background: "var(--ink)", paddingBottom: "5rem" }}>
        <div className="max-w-2xl mx-auto px-6 pt-16 text-center">
          {/* Success ring */}
          <div className="relative mx-auto mb-8 anim-scale-in" style={{ width: 88, height: 88 }}>
            <div className="w-full h-full rounded-full bg-[var(--sage)] flex items-center justify-center"
              style={{ boxShadow: "0 0 0 12px rgba(74,103,65,0.15), 0 0 0 24px rgba(74,103,65,0.07)" }}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M7 18l7 7 15-15" strokeLinecap="round" strokeLinejoin="round"
                  style={{ animation: "tick-in 0.5s var(--ease-spring) 0.4s both", strokeDasharray: 44, strokeDashoffset: 44 }} />
              </svg>
            </div>
            <div className="absolute inset-0 rounded-full border border-[var(--sage)]/30"
              style={{ animation: "pulse-ring 2.5s ease-out infinite" }} />
          </div>

          <p className={`t-label text-[var(--sage-light)] mb-4 anim-fade-in delay-200 ${lang === "mr" ? "mr" : ""}`}>
            {t("Payment confirmed", "पेमेंट पुष्टी झाले", lang)}
          </p>

          <h1 className={`text-white mb-4 anim-fade-up delay-300 ${lang === "mr" ? "mr" : ""}`}
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3rem)", letterSpacing: "-0.02em", lineHeight: 1.08 }}>
            {order.name
              ? t(`You're officially on your way, ${order.name.split(" ")[0]}.`, `${order.name.split(" ")[0]}, तुम्ही अधिकृतपणे मार्गावर आहात.`, lang)
              : t("You're officially on your way.", "तुम्ही अधिकृतपणे मार्गावर आहात.", lang)
            }
          </h1>

          <p className={`text-white/50 t-body anim-fade-up delay-400 ${lang === "mr" ? "mr" : ""}`}>
            {t(
              "Your wellness journey starts now. Everything is confirmed.",
              "तुमचा वेलनेस प्रवास आता सुरू होतो. सर्व काही पुष्टी झाले आहे.",
              lang
            )}
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-20" style={{ marginTop: "-3rem" }}>

        {/* First program card */}
        {firstItem && (
          <div className="rounded-2xl overflow-hidden border mb-6 anim-scale-in delay-300"
            style={{ borderColor: "var(--border-subtle)", background: "var(--bg-elevated)", boxShadow: "var(--shadow-xl)" }}>
            <div className="relative h-40" style={{ background: "var(--bg-muted)" }}>
              <img src={firstItem.image} alt={firstItem.title_en} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-5">
                <p className={`t-label text-white/60 mb-0.5 ${lang === "mr" ? "mr" : ""}`}>{t("Your first program", "तुमचा पहिला प्रोग्राम", lang)}</p>
                <p className={`text-white font-semibold ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem" }}>
                  {lang === "en" ? firstItem.title_en : firstItem.title_mr}
                </p>
              </div>
            </div>

            {expert && (
              <div className="flex items-center gap-4 p-5 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                  <img src={expert.image} alt={expert.name_en} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className={`t-small font-semibold text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                    {lang === "en" ? expert.name_en : expert.name_mr}
                  </p>
                  <p className={`t-xs text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? expert.role_en : expert.role_mr}</p>
                </div>
                <div className="ml-auto">
                  <span className="badge badge-sage">{t("Your expert", "तुमचा तज्ञ", lang)}</span>
                </div>
              </div>
            )}

            {/* First session info */}
            <div className="grid grid-cols-3 divide-x" style={{ borderColor: "var(--border-subtle)" }}>
              {[
                { label_en: "First session", label_mr: "पहिला सेशन", val: t("Within 48 hrs", "४८ तासांत", lang) },
                { label_en: "Mode", label_mr: "माध्यम", val: "Live Zoom" },
                { label_en: "Duration", label_mr: "कालावधी", val: lang === "en" ? firstItem.duration_en : firstItem.duration_mr },
              ].map(stat => (
                <div key={stat.label_en} className="p-4 text-center" style={{ borderColor: "var(--border-subtle)" }}>
                  <p className={`t-xs text-[var(--text-muted)] mb-1 ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? stat.label_en : stat.label_mr}</p>
                  <p className={`t-xs font-semibold text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`}>{stat.val}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All programs summary */}
        {order.items.length > 1 && (
          <div className="p-5 rounded-2xl border mb-6 anim-fade-up delay-400" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-elevated)" }}>
            <p className={`t-label text-[var(--text-muted)] mb-3 ${lang === "mr" ? "mr" : ""}`}>{t("All enrolled programs", "सर्व नोंदणीकृत प्रोग्राम्स", lang)}</p>
            <div className="space-y-2">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor: "var(--border-subtle)" }}>
                  <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0" style={{ background: "var(--bg-muted)" }}>
                    <img src={item.image} alt={item.title_en} className="w-full h-full object-cover" />
                  </div>
                  <span className={`t-xs text-[var(--text-primary)] flex-1 ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? item.title_en : item.title_mr}</span>
                  <span className="t-xs text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>₹{item.price.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2">
                <span className={`t-xs font-semibold text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`}>{t("Total paid", "एकूण भरले", lang)}</span>
                <span className="t-xs font-semibold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-mono)" }}>₹{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Next steps */}
        <div className={`mb-8 transition-all duration-700 ${stepsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <p className={`t-h4 text-[var(--text-primary)] mb-4 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
            {t("What happens next", "पुढे काय होते", lang)}
          </p>

          <div className="space-y-3">
            {NEXT_STEPS.map((s, i) => (
              <div key={s.en}
                className="flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300"
                style={{
                  borderColor: s.done ? "var(--sage-pale)" : "var(--border-subtle)",
                  background: s.done ? "var(--sage-ghost)" : "var(--bg-elevated)",
                  transitionDelay: `${i * 120}ms`,
                }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: s.done ? "var(--sage-pale)" : "var(--bg-muted)" }}>
                  {s.done
                    ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--sage)" strokeWidth="2"><path d="M3 7l3 3 5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    : <span className="t-xs font-bold text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>{s.step}</span>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`t-small font-semibold text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`}>
                      {lang === "en" ? s.en : s.mr}
                    </p>
                    {s.done && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--success)" strokeWidth="2">
                        <path d="M3 7l3 3 5-5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <p className={`t-xs text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`}>
                    {lang === "en" ? s.desc_en : s.desc_mr}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp CTA */}
        <a
          href={`https://wa.me/919876543210?text=${encodeURIComponent("Hi, I just enrolled in VitalAfter40!")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl mb-4 font-medium t-small transition-all hover:opacity-90"
          style={{ background: "#25d366", color: "white" }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
            <path d="M10 1.5C5.3 1.5 1.5 5.3 1.5 10c0 1.5.4 2.9 1.1 4.1L1.5 18.5l4.6-1.1c1.1.6 2.5.9 3.9.9 4.7 0 8.5-3.8 8.5-8.5S14.7 1.5 10 1.5zm0 15.6c-1.3 0-2.6-.4-3.7-1l-.3-.2-2.7.7.7-2.6-.2-.3c-.7-1.1-1.1-2.4-1.1-3.7 0-3.9 3.2-7 7.1-7s7.1 3.1 7.1 7-3.2 7-7 7zm3.9-5.2c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.5.1-.1.2-.5.7-.6.8-.1.1-.2.1-.4 0-.2-.1-.9-.3-1.7-1-.6-.6-1.1-1.2-1.2-1.4-.1-.2 0-.3.1-.4l.3-.4c.1-.1.1-.2.2-.3 0-.1 0-.2-.1-.3-.1-.1-.5-1.2-.7-1.6-.2-.4-.3-.4-.5-.4h-.4c-.1 0-.4 0-.6.2-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.5.5.2 1 .4 1.3.5.6.2 1.1.2 1.5.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1z"/>
          </svg>
          {t("Open WhatsApp confirmation", "व्हॉट्सअॅप पुष्टी उघडा", lang)}
        </a>

        {/* Dashboard CTA */}
        <button onClick={onDashboard}
          className={`btn btn-primary btn-xl w-full justify-center ${lang === "mr" ? "mr" : ""}`}>
          {t("Go to My Dashboard →", "माझ्या डॅशबोर्डवर जा →", lang)}
        </button>

        <p className={`t-xs text-center text-[var(--text-muted)] mt-3 ${lang === "mr" ? "mr" : ""}`}>
          {t("Questions? Reply to your WhatsApp confirmation or email us at hello@vitalafter40.com", "प्रश्न? तुमच्या व्हॉट्सअॅप पुष्टीला उत्तर द्या.", lang)}
        </p>
      </div>
    </div>
  );
}

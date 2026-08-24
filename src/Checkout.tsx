import { useState } from "react";
import { Lang, t, programs } from "./data";

interface Props {
  lang: Lang;
  setLang: (l: Lang) => void;
  cart: string[];
  onBack: () => void;
  onHome: () => void;
}

type Step = "details" | "payment" | "confirmation";
type PayMethod = "upi" | "card" | "netbanking";

export default function CheckoutFlow({ lang, setLang, cart, onBack, onHome }: Props) {
  const [step, setStep] = useState<Step>("details");
  const [form, setForm] = useState({ name: "", email: "", phone: "", pincode: "" });
  const [payMethod, setPayMethod] = useState<PayMethod>("upi");
  const [upiId, setUpiId] = useState("");
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cartItems = (cart.length > 0 ? cart : ["pilates-group", "nutrition"])
    .map(id => programs.find(p => p.id === id))
    .filter(Boolean) as typeof programs;

  const subtotal = cartItems.reduce((s, p) => s + p.price, 0);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = t("Required", "आवश्यक", lang);
    if (!form.email.trim() || !form.email.includes("@")) errs.email = t("Valid email required", "वैध ईमेल आवश्यक", lang);
    if (!form.phone.trim() || form.phone.length < 10) errs.phone = t("Valid phone required", "वैध फोन आवश्यक", lang);
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setStep("confirmation"); }, 2200);
  };

  if (step === "confirmation") return <Confirmation lang={lang} cartItems={cartItems} total={total} onHome={onHome} name={form.name} />;

  const stepNum = step === "details" ? 1 : 2;

  return (
    <div className="min-h-screen bg-[var(--cream)]" style={{ fontFamily: "var(--font-body)" }}>
      {/* Header */}
      <div className="bg-white border-b border-[var(--ink-10)] px-5 sm:px-8 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button onClick={onBack} className="flex items-center gap-1.5 text-[var(--ink-40)] hover:text-[var(--ink-80)] transition-colors text-sm shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 12L6 8l4-4" strokeLinecap="round"/></svg>
            {t("Back", "मागे", lang)}
          </button>

          {/* Step indicator */}
          <div className="flex items-center gap-2 flex-1 justify-center">
            {[
              { n: 1, label_en: "Your details", label_mr: "तुमचे तपशील" },
              { n: 2, label_en: "Payment", label_mr: "पेमेंट" },
            ].map((s, i) => (
              <div key={s.n} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 ${stepNum >= s.n ? "text-[var(--ink-80)]" : "text-[var(--ink-20)]"}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${stepNum > s.n ? "bg-[var(--sage)] text-white" : stepNum === s.n ? "bg-[var(--ink-80)] text-white" : "border border-[var(--ink-10)]"}`}>
                    {stepNum > s.n ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2"><path d="M2.5 6l2.5 2.5 4.5-4.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    ) : s.n}
                  </span>
                  <span className={`t-xs hidden sm:inline ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? s.label_en : s.label_mr}</span>
                </div>
                {i === 0 && <span className="w-8 h-px bg-[var(--ink-10)]" />}
              </div>
            ))}
          </div>

          <span className="t-xs text-[var(--ink-40)] shrink-0">VitalAfter40</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 grid lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3 page-enter">
          {step === "details" && (
            <div>
              <h2 className={`t-h2 text-[var(--ink-80)] mb-8 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                {t("Your details", "तुमचे तपशील", lang)}
              </h2>
              <div className="space-y-5">
                {[
                  { key: "name", label_en: "Full name", label_mr: "पूर्ण नाव", type: "text", placeholder: "Meera Joshi" },
                  { key: "email", label_en: "Email address", label_mr: "ईमेल पत्ता", type: "email", placeholder: "meera@example.com" },
                  { key: "phone", label_en: "Phone number", label_mr: "फोन नंबर", type: "tel", placeholder: "+91 98765 43210" },
                ].map(f => (
                  <div key={f.key}>
                    <label className={`t-xs text-[var(--ink-60)] block mb-1.5 ${lang === "mr" ? "mr" : ""}`}>
                      {lang === "en" ? f.label_en : f.label_mr}
                    </label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={(form as any)[f.key]}
                      onChange={e => { setForm({ ...form, [f.key]: e.target.value }); setErrors({ ...errors, [f.key]: "" }); }}
                      className={`field ${errors[f.key] ? "border-[var(--error)]" : ""}`}
                    />
                    {errors[f.key] && <p className="t-xs text-[var(--error)] mt-1">{errors[f.key]}</p>}
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <button onClick={() => { if (validate()) setStep("payment"); }} className="btn btn-lg btn-primary w-full justify-center">
                  <span className={lang === "mr" ? "mr" : ""}>{t("Continue to payment →", "पेमेंटवर जा →", lang)}</span>
                </button>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="anim-fade-up">
              <h2 className={`t-h2 text-[var(--ink-80)] mb-8 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                {t("Payment", "पेमेंट", lang)}
              </h2>

              {/* Payment method tabs */}
              <div className="flex gap-2 mb-6 p-1 bg-[var(--paper)] rounded-xl w-fit">
                {([
                  { id: "upi" as PayMethod, label: "UPI" },
                  { id: "card" as PayMethod, label_en: "Card", label_mr: "कार्ड" },
                  { id: "netbanking" as PayMethod, label_en: "Net Banking", label_mr: "नेट बँकिंग" },
                ] as { id: PayMethod; label?: string; label_en?: string; label_mr?: string }[]).map(m => (
                  <button key={m.id} onClick={() => setPayMethod(m.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${payMethod === m.id ? "bg-white shadow-sm text-[var(--ink-80)]" : "text-[var(--ink-40)] hover:text-[var(--ink-60)]"} ${lang === "mr" ? "mr" : ""}`}>
                    {m.label ?? (lang === "en" ? m.label_en : m.label_mr)}
                  </button>
                ))}
              </div>

              {payMethod === "upi" && (
                <div className="space-y-4">
                  <div>
                    <label className={`t-xs text-[var(--ink-60)] block mb-1.5 ${lang === "mr" ? "mr" : ""}`}>{t("UPI ID", "UPI आयडी", lang)}</label>
                    <input className="field" placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />
                    <p className={`t-xs text-[var(--ink-40)] mt-1.5 ${lang === "mr" ? "mr" : ""}`}>{t("e.g. name@okaxis, name@paytm, name@ybl", "उदा. name@okaxis", lang)}</p>
                  </div>
                  <div className="bg-[var(--sage-ghost)] border border-[var(--sage-pale)] rounded-xl px-4 py-3 flex items-center gap-2.5">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--sage)" strokeWidth="1.5"><path d="M8 2a6 6 0 100 12A6 6 0 008 2zm0 4v2.5l1.5 1.5"/></svg>
                    <p className={`t-xs text-[var(--sage)] ${lang === "mr" ? "mr" : ""}`}>{t("You'll receive a payment request on your UPI app.", "तुम्हाला तुमच्या UPI अॅपवर पेमेंट विनंती मिळेल.", lang)}</p>
                  </div>
                </div>
              )}

              {payMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <label className="t-xs text-[var(--ink-60)] block mb-1.5">{t("Card number", "कार्ड नंबर", lang)}</label>
                    <input className="field" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="t-xs text-[var(--ink-60)] block mb-1.5">{t("Expiry", "एक्सपायरी", lang)}</label>
                      <input className="field" placeholder="MM / YY" />
                    </div>
                    <div>
                      <label className="t-xs text-[var(--ink-60)] block mb-1.5">CVV</label>
                      <input className="field" placeholder="•••" type="password" />
                    </div>
                  </div>
                  <div>
                    <label className="t-xs text-[var(--ink-60)] block mb-1.5">{t("Name on card", "कार्डवरील नाव", lang)}</label>
                    <input className="field" placeholder="MEERA JOSHI" />
                  </div>
                </div>
              )}

              {payMethod === "netbanking" && (
                <div className="grid grid-cols-2 gap-3">
                  {["HDFC Bank", "SBI", "ICICI Bank", "Axis Bank", "Kotak", "Other"].map(bank => (
                    <button key={bank} className="border border-[var(--ink-10)] rounded-xl p-3 text-sm text-left hover:border-[var(--sage-pale)] transition-colors">
                      {bank}
                    </button>
                  ))}
                </div>
              )}

              {/* Security badge */}
              <div className="mt-6 flex items-center gap-2.5 text-[var(--ink-40)]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2l5 2v4.5C13 11.5 10.5 14 8 15 5.5 14 3 11.5 3 8.5V4l5-2z"/></svg>
                <p className={`t-xs ${lang === "mr" ? "mr" : ""}`}>{t("Secured by Razorpay · 256-bit SSL · PCI DSS compliant", "Razorpay द्वारे सुरक्षित · 256-bit SSL", lang)}</p>
              </div>

              <button onClick={handlePay} disabled={processing}
                className={`btn btn-lg btn-primary w-full justify-center mt-8 ${processing ? "opacity-70 cursor-not-allowed" : ""}`}>
                {processing ? (
                  <span className="flex items-center gap-2">
                    <svg className="spin" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="2"><path d="M9 2a7 7 0 100 14A7 7 0 009 2z" opacity="0.3"/><path d="M9 2a7 7 0 017 7" strokeLinecap="round"/></svg>
                    {t("Processing…", "प्रक्रिया करत आहे…", lang)}
                  </span>
                ) : (
                  <span className={lang === "mr" ? "mr" : ""}>{t(`Pay ₹${total.toLocaleString()} →`, `₹${total.toLocaleString()} द्या →`, lang)}</span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-[var(--ink-10)] rounded-2xl p-6 sticky top-24">
            <h3 className={`font-semibold text-[var(--ink-80)] mb-5 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem" }}>
              {t("Order summary", "ऑर्डर सारांश", lang)}
            </h3>

            <div className="space-y-4 mb-5">
              {cartItems.map(p => (
                <div key={p.id} className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-[var(--paper)] shrink-0">
                    <img src={p.image} alt={p.title_en} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`t-small font-medium text-[var(--ink-80)] ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? p.title_en : p.title_mr}</p>
                    <p className={`t-xs text-[var(--ink-40)] ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? p.duration_en : p.duration_mr}</p>
                  </div>
                  <p className="t-small font-semibold text-[var(--ink-80)] shrink-0" style={{ fontFamily: "var(--font-display)" }}>₹{p.price.toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--ink-10)] pt-4 space-y-2">
              <div className="flex justify-between text-sm text-[var(--ink-60)]">
                <span className={lang === "mr" ? "mr" : ""}>{t("Subtotal", "उपएकूण", lang)}</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-[var(--ink-60)]">
                <span>{t("GST (18%)", "GST (18%)", lang)}</span>
                <span>₹{gst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold text-[var(--ink-80)] pt-2 border-t border-[var(--ink-10)]">
                <span className={lang === "mr" ? "mr" : ""}>{t("Total", "एकूण", lang)}</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Trust markers */}
            <div className="mt-5 space-y-2">
              {[
                { icon: "✓", en: "Cancel anytime", mr: "कधीही रद्द करा" },
                { icon: "✓", en: "WhatsApp support included", mr: "व्हॉट्सअॅप सपोर्ट समाविष्ट" },
                { icon: "✓", en: "Start within 24 hrs", mr: "२४ तासांत सुरुवात" },
              ].map(m => (
                <p key={m.en} className={`t-xs text-[var(--ink-40)] flex items-center gap-2 ${lang === "mr" ? "mr" : ""}`}>
                  <span className="text-[var(--sage)] font-bold">{m.icon}</span>
                  {lang === "en" ? m.en : m.mr}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Confirmation ──────────────────────────────────────────────────────
function Confirmation({ lang, cartItems, total, onHome, name }: { lang: Lang; cartItems: typeof programs; total: number; onHome: () => void; name: string }) {
  return (
    <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center px-5 page-enter" style={{ fontFamily: "var(--font-body)" }}>
      <div className="w-full max-w-md text-center py-12">
        {/* Success ring */}
        <div className="relative w-20 h-20 mx-auto mb-8">
          <div className="w-20 h-20 rounded-full bg-[var(--sage)] flex items-center justify-center mx-auto">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M7 16l5 5 13-13" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="absolute inset-0 rounded-full bg-[var(--sage)] opacity-15" style={{ animation: "pulse-ring 2s ease-out infinite" }} />
        </div>

        <p className="t-label text-[var(--sage-mid)] mb-3">{t("Enrollment confirmed", "नोंदणी पुष्टी झाली", lang)}</p>
        <h1 className={`t-h1 text-[var(--ink-80)] mb-3 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
          {name ? t(`Welcome, ${name}!`, `स्वागत, ${name}!`, lang) : t("You're in!", "तुम्ही आत आहात!", lang)}
        </h1>
        <p className={`t-body text-[var(--ink-40)] mb-8 ${lang === "mr" ? "mr" : ""}`}>
          {t("Your enrollment is confirmed. Welcome to VitalAfter40.", "तुमची नोंदणी पुष्टी झाली. VitalAfter40 मध्ये आपले स्वागत आहे.", lang)}
        </p>

        {/* Receipt */}
        <div className="bg-white border border-[var(--ink-10)] rounded-2xl p-5 mb-6 text-left">
          <p className={`font-semibold text-[var(--ink-80)] mb-4 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
            {t("Your programs", "तुमचे प्रोग्राम्स", lang)}
          </p>
          {cartItems.map(p => (
            <div key={p.id} className="flex items-center gap-3 py-2.5 border-b border-[var(--ink-10)] last:border-0">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-[var(--paper)] shrink-0">
                <img src={p.image} alt="" className="w-full h-full object-cover" />
              </div>
              <span className={`t-small text-[var(--ink-60)] flex-1 ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? p.title_en : p.title_mr}</span>
              <span className="t-small font-medium text-[var(--ink-80)]" style={{ fontFamily: "var(--font-display)" }}>₹{p.price.toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between pt-3 mt-1">
            <span className={`t-small font-semibold text-[var(--ink-80)] ${lang === "mr" ? "mr" : ""}`}>{t("Total paid", "एकूण भरले", lang)}</span>
            <span className="font-semibold text-[var(--ink-80)]" style={{ fontFamily: "var(--font-display)" }}>₹{total.toLocaleString()}</span>
          </div>
        </div>

        {/* Next steps */}
        <div className="bg-[var(--sage-ghost)] border border-[var(--sage-pale)] rounded-2xl p-5 mb-6 text-left">
          <p className={`t-small font-semibold text-[var(--ink-80)] mb-3 ${lang === "mr" ? "mr" : ""}`}>{t("What happens next", "पुढे काय होते", lang)}</p>
          {[
            { icon: "💬", en: "WhatsApp confirmation sent to your number", mr: "तुमच्या नंबरवर व्हॉट्सअॅप पुष्टी पाठवली" },
            { icon: "📧", en: "Check email for program access details", mr: "प्रोग्राम प्रवेश तपशीलांसाठी ईमेल तपासा" },
            { icon: "🤝", en: "Your coach will contact you within 24 hrs", mr: "तुमचा कोच २४ तासांत संपर्क करेल" },
          ].map(step => (
            <div key={step.en} className="flex items-start gap-3 py-2 border-b border-[var(--sage-pale)] last:border-0">
              <span className="text-lg shrink-0">{step.icon}</span>
              <p className={`t-small text-[var(--ink-60)] ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? step.en : step.mr}</p>
            </div>
          ))}
        </div>

        <button onClick={onHome} className="btn btn-lg btn-primary w-full justify-center">
          <span className={lang === "mr" ? "mr" : ""}>{t("Go to My Dashboard →", "माझ्या डॅशबोर्डवर जा →", lang)}</span>
        </button>
      </div>
    </div>
  );
}

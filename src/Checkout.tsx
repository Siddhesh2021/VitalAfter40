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

export default function CheckoutFlow({ lang, setLang, cart, onBack, onHome }: Props) {
  const [step, setStep] = useState<Step>("details");
  const [form, setForm] = useState({ name: "", email: "", phone: "", pincode: "" });
  const [payMethod, setPayMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [processing, setProcessing] = useState(false);

  const cartItems = cart.map((id) => programs.find((p) => p.id === id)).filter(Boolean) as typeof programs;
  const subtotal = cartItems.reduce((s, p) => s + p.price, 0);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setStep("confirmation"); }, 2000);
  };

  if (step === "confirmation") return <Confirmation lang={lang} cartItems={cartItems} total={total} onHome={onHome} />;

  return (
    <div className="min-h-screen bg-[#faf8f5]" style={{ fontFamily: "var(--font-body)" }}>
      {/* Header */}
      <div className="bg-white border-b border-[#1c1c1c]/8 px-4 sm:px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="text-[#1c1c1c]/50 hover:text-[#1c1c1c] text-sm transition-colors">
          ← {t("Back", "मागे", lang)}
        </button>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-6 h-6 bg-[#6b7c5c] rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">V</span>
          </div>
          <span className="font-semibold text-[#1c1c1c]" style={{ fontFamily: "var(--font-display)" }}>VitalAfter40</span>
        </div>
        <button onClick={() => setLang(lang === "en" ? "mr" : "en")} className="text-xs border border-[#1c1c1c]/20 rounded-full px-3 py-1.5 hover:border-[#6b7c5c] transition-all" style={{ fontFamily: "var(--font-mono)" }}>
          {lang === "en" ? "मराठी" : "EN"}
        </button>
      </div>

      {/* Progress */}
      <div className="bg-white border-b border-[#1c1c1c]/6 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2 text-sm">
          {[{ id: "details", l_en: "Your Details", l_mr: "तुमचे तपशील" }, { id: "payment", l_en: "Payment", l_mr: "पेमेंट" }].map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              {i > 0 && <div className="w-8 h-px bg-[#1c1c1c]/15" />}
              <div className={`flex items-center gap-2 ${step === s.id ? "text-[#6b7c5c]" : "text-[#1c1c1c]/40"}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step === s.id ? "bg-[#6b7c5c] text-white" : "border border-current"}`}>
                  {i + 1}
                </div>
                <span className="font-medium" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{t(s.l_en, s.l_mr, lang)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 grid lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3 space-y-6">
          {step === "details" && (
            <div className="bg-white rounded-2xl border border-[#1c1c1c]/8 p-6">
              <h2 className="font-semibold text-[#1c1c1c] text-lg mb-5" style={{ fontFamily: "var(--font-display)" }}>
                {t("Your Details", "तुमचे तपशील", lang)}
              </h2>
              <div className="space-y-4">
                {[
                  { key: "name", l_en: "Full Name", l_mr: "पूर्ण नाव", ph_en: "Meera Joshi", ph_mr: "मीरा जोशी" },
                  { key: "email", l_en: "Email Address", l_mr: "ईमेल पत्ता", ph_en: "you@example.com", ph_mr: "you@example.com" },
                  { key: "phone", l_en: "Phone Number", l_mr: "फोन नंबर", ph_en: "+91 99999 99999", ph_mr: "+91 99999 99999" },
                  { key: "pincode", l_en: "Pincode (for GST)", l_mr: "पिनकोड (GST साठी)", ph_en: "411001", ph_mr: "411001" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-[#1c1c1c]/70 mb-1.5" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>
                      {t(f.l_en, f.l_mr, lang)}
                    </label>
                    <input
                      value={form[f.key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={t(f.ph_en, f.ph_mr, lang)}
                      className="w-full border-2 border-[#1c1c1c]/12 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#6b7c5c] transition-all bg-white"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={() => setStep("payment")}
                disabled={!form.name || !form.phone}
                className={`mt-6 w-full py-4 rounded-full font-semibold text-base transition-all ${form.name && form.phone ? "bg-[#6b7c5c] hover:bg-[#5a6b4b] text-white" : "bg-[#d4dbc9] text-[#1c1c1c]/40 cursor-not-allowed"}`}
              >
                {t("Continue to Payment →", "पेमेंटवर जा →", lang)}
              </button>
            </div>
          )}

          {step === "payment" && (
            <div className="bg-white rounded-2xl border border-[#1c1c1c]/8 p-6">
              <h2 className="font-semibold text-[#1c1c1c] text-lg mb-5" style={{ fontFamily: "var(--font-display)" }}>
                {t("Payment", "पेमेंट", lang)}
              </h2>

              {/* Payment methods */}
              <div className="flex gap-3 mb-6">
                {[
                  { id: "upi", label: "UPI", icon: "📱" },
                  { id: "card", label: t("Card", "कार्ड", lang), icon: "💳" },
                  { id: "netbanking", label: t("Net Banking", "नेट बँकिंग", lang), icon: "🏦" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPayMethod(m.id as any)}
                    className={`flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${payMethod === m.id ? "border-[#6b7c5c] bg-[#6b7c5c]/5" : "border-[#1c1c1c]/12 hover:border-[#6b7c5c]/40"}`}
                  >
                    <span className="text-2xl">{m.icon}</span>
                    <span className="text-xs font-medium text-[#1c1c1c]">{m.label}</span>
                  </button>
                ))}
              </div>

              {payMethod === "upi" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1c1c1c]/70 mb-1.5">UPI ID</label>
                    <input placeholder="yourname@upi" className="w-full border-2 border-[#1c1c1c]/12 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#6b7c5c] transition-all" style={{ fontFamily: "var(--font-mono)" }} />
                  </div>
                  <p className="text-[#1c1c1c]/40 text-xs" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>
                    {t("Supports PhonePe, GPay, Paytm, BHIM and all UPI apps.", "PhonePe, GPay, Paytm, BHIM आणि सर्व UPI अॅप्स समर्थित.", lang)}
                  </p>
                </div>
              )}

              {payMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1c1c1c]/70 mb-1.5">{t("Card Number", "कार्ड नंबर", lang)}</label>
                    <input placeholder="1234 5678 9012 3456" className="w-full border-2 border-[#1c1c1c]/12 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#6b7c5c] transition-all" style={{ fontFamily: "var(--font-mono)" }} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-[#1c1c1c]/70 mb-1.5">{t("Expiry", "एक्सपायरी", lang)}</label>
                      <input placeholder="MM / YY" className="w-full border-2 border-[#1c1c1c]/12 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#6b7c5c] transition-all" style={{ fontFamily: "var(--font-mono)" }} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1c1c1c]/70 mb-1.5">CVV</label>
                      <input placeholder="•••" type="password" className="w-full border-2 border-[#1c1c1c]/12 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#6b7c5c] transition-all" style={{ fontFamily: "var(--font-mono)" }} />
                    </div>
                  </div>
                </div>
              )}

              {payMethod === "netbanking" && (
                <div className="grid grid-cols-3 gap-2">
                  {["SBI", "HDFC", "ICICI", "Axis", "Kotak", "Other"].map((b) => (
                    <button key={b} className="border border-[#1c1c1c]/12 rounded-xl p-3 text-sm font-medium text-[#1c1c1c]/70 hover:border-[#6b7c5c] hover:text-[#6b7c5c] transition-all">
                      {b}
                    </button>
                  ))}
                </div>
              )}

              {/* Trust signals */}
              <div className="flex gap-4 mt-5 text-xs text-[#1c1c1c]/40 border-t border-[#1c1c1c]/6 pt-4">
                {["🔒 256-bit SSL", "✓ Razorpay Secured", "📋 GST Invoice"].map((s) => (
                  <span key={s} style={{ fontFamily: "var(--font-mono)" }}>{s}</span>
                ))}
              </div>

              <button
                onClick={handlePay}
                disabled={processing}
                className="mt-6 w-full bg-[#6b7c5c] hover:bg-[#5a6b4b] disabled:bg-[#d4dbc9] text-white font-semibold py-4 rounded-full text-base transition-all flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t("Processing...", "प्रक्रिया करत आहे...", lang)}
                  </>
                ) : (
                  <>🔒 {t(`Pay ₹${total.toLocaleString()}`, `₹${total.toLocaleString()} भरा`, lang)}</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-[#1c1c1c]/8 p-5 sticky top-20">
            <h3 className="font-semibold text-[#1c1c1c] mb-4" style={{ fontFamily: "var(--font-display)" }}>
              {t("Order Summary", "ऑर्डर सारांश", lang)}
            </h3>
            <div className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1c1c1c] leading-tight" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>
                      {t(item.title_en, item.title_mr, lang)}
                    </p>
                    <p className="text-xs text-[#1c1c1c]/40" style={{ fontFamily: "var(--font-mono)" }}>{t(item.duration_en, item.duration_mr, lang)}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#1c1c1c] flex-shrink-0" style={{ fontFamily: "var(--font-mono)" }}>₹{item.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#1c1c1c]/8 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-[#1c1c1c]/60">
                <span>{t("Subtotal", "उपएकूण", lang)}</span>
                <span style={{ fontFamily: "var(--font-mono)" }}>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#1c1c1c]/60">
                <span>GST (18%)</span>
                <span style={{ fontFamily: "var(--font-mono)" }}>₹{gst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-[#1c1c1c] text-base pt-2 border-t border-[#1c1c1c]/8">
                <span>{t("Total", "एकूण", lang)}</span>
                <span style={{ fontFamily: "var(--font-mono)" }}>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4 bg-[#d4dbc9]/40 rounded-xl p-3 text-xs text-[#1c1c1c]/60" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>
              {t("Secure checkout. GST invoice will be emailed automatically.", "सुरक्षित चेकआउट. GST चलन आपोआप ईमेल केले जाईल.", lang)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Confirmation({ lang, cartItems, total, onHome }: { lang: Lang; cartItems: typeof programs; total: number; onHome: () => void }) {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center px-4 py-16" style={{ fontFamily: "var(--font-body)" }}>
      <div className="w-20 h-20 bg-[#6b7c5c] rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">✓</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-semibold text-[#1c1c1c] mb-3 text-center" style={{ fontFamily: "var(--font-display)" }}>
        {t("You're all set!", "तुम्ही तयार आहात!", lang)}
      </h1>
      <p className="text-[#1c1c1c]/60 text-lg mb-2 text-center" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>
        {t("Payment confirmed. Welcome to VitalAfter40.", "पेमेंट पुष्टी झाले. VitalAfter40 मध्ये आपले स्वागत आहे.", lang)}
      </p>
      <p className="text-[#1c1c1c]/40 text-sm mb-8 text-center" style={{ fontFamily: "var(--font-mono)" }}>
        Transaction ID: TXN{Math.random().toString(36).slice(2, 10).toUpperCase()}
      </p>

      <div className="bg-white border border-[#1c1c1c]/8 rounded-2xl p-6 w-full max-w-sm mb-8">
        <h3 className="font-semibold text-[#1c1c1c] mb-4" style={{ fontFamily: "var(--font-display)" }}>
          {t("Your Programs", "तुमचे प्रोग्राम्स", lang)}
        </h3>
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#d4dbc9] flex items-center justify-center">
                <span className="text-sm">{item.icon}</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-[#1c1c1c] text-sm" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>
                  {t(item.title_en, item.title_mr, lang)}
                </p>
                <p className="text-[#1c1c1c]/40 text-xs" style={{ fontFamily: "var(--font-mono)" }}>{t(item.duration_en, item.duration_mr, lang)}</p>
              </div>
              <span className="text-[#6b7c5c] text-xs font-bold">✓</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[#1c1c1c]/8 mt-4 pt-4 flex justify-between font-bold">
          <span>{t("Total paid", "एकूण भरले", lang)}</span>
          <span style={{ fontFamily: "var(--font-mono)" }}>₹{total.toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-3 w-full max-w-sm mb-6">
        {[
          { icon: "📧", l_en: "GST invoice sent to your email", l_mr: "GST चलन तुमच्या ईमेलवर पाठवले" },
          { icon: "💬", l_en: "WhatsApp welcome message sent", l_mr: "WhatsApp स्वागत संदेश पाठवला" },
          { icon: "📅", l_en: "Your schedule will be shared within 24 hours", l_mr: "तुमचे वेळापत्रक २४ तासांत शेअर केले जाईल" },
        ].map((item) => (
          <div key={item.l_en} className="flex items-center gap-3 text-sm text-[#1c1c1c]/60">
            <span className="text-lg">{item.icon}</span>
            <span style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{t(item.l_en, item.l_mr, lang)}</span>
          </div>
        ))}
      </div>

      <button onClick={onHome} className="bg-[#6b7c5c] hover:bg-[#5a6b4b] text-white font-semibold px-8 py-4 rounded-full text-base transition-all">
        {t("Go to My Dashboard →", "माझ्या डॅशबोर्डवर जा →", lang)}
      </button>
    </div>
  );
}

import { useState } from "react";
import { programs, professionals, t, type Lang } from "./data";

interface Props {
  lang: Lang;
  setLang: (l: Lang) => void;
  cart: string[];
  onBack: () => void;
  onSuccess: (orderData: OrderData) => void;
}

export interface OrderData {
  items: typeof programs;
  total: number;
  name: string;
  phone: string;
  email: string;
}

type Step = "plan" | "payment" | "processing";
type PayMethod = "upi" | "card" | "netbanking";

const NETBANKING_BANKS = ["SBI", "HDFC", "ICICI", "Axis", "Kotak", "Yes Bank", "PNB"];

function validate(form: Record<string, string>) {
  const errs: Record<string, string> = {};
  if (!form.name.trim()) errs.name = "Name is required";
  if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ""))) errs.phone = "Enter a valid 10-digit number";
  if (!form.email.includes("@")) errs.email = "Enter a valid email";
  return errs;
}

export default function CheckoutFlow({ lang, cart, onBack, onSuccess }: Props) {
  const [step, setStep] = useState<Step>("plan");
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [payMethod, setPayMethod] = useState<PayMethod>("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  const cartItems = (cart.length > 0 ? cart : ["pilates-group"])
    .map(id => programs.find(p => p.id === id))
    .filter(Boolean) as typeof programs;

  const subtotal = cartItems.reduce((s, p) => s + p.price, 0);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const setField = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: "" }));
  };

  const handleProceedToPayment = () => {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setStep("payment");
  };

  const handlePay = () => {
    if (!agreeTerms) return;
    setProcessing(true);
    setStep("processing");
    let s = 0;
    const iv = setInterval(() => {
      s++;
      setProcessingStep(s);
      if (s >= 3) {
        clearInterval(iv);
        setTimeout(() => {
          onSuccess({ items: cartItems, total, name: form.name, phone: form.phone, email: form.email });
        }, 600);
      }
    }, 900);
  };

  const canPay = agreeTerms && (
    (payMethod === "upi" && upiId.includes("@")) ||
    (payMethod === "card" && cardNum.replace(/\s/g, "").length === 16 && cardExp && cardCvv.length >= 3 && cardName) ||
    (payMethod === "netbanking" && selectedBank)
  );

  // ── Processing overlay ──
  if (step === "processing") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "var(--ink)" }}>
        <div className="relative mb-10" style={{ width: 100, height: 100 }}>
          <svg width="100" height="100" viewBox="0 0 100 100" className="ring-progress absolute inset-0">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--sage)" strokeWidth="3"
              strokeDasharray={`${(processingStep / 3) * 264} 264`} strokeLinecap="round"
              style={{ transition: "stroke-dasharray 0.8s var(--ease-out-expo)" }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-[var(--sage)] flex items-center justify-center">
              <span className="text-white text-base font-bold" style={{ fontFamily: "var(--font-display)" }}>V</span>
            </div>
          </div>
        </div>
        <h2 className="text-white mb-2" style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", letterSpacing: "-0.02em" }}>
          {t("Confirming your payment…", "तुमचे पेमेंट पुष्टी करत आहे…", lang)}
        </h2>
        <p className="text-white/40 t-small">{t("Please don't close this window.", "हे विंडो बंद करू नका.", lang)}</p>
        <div className="mt-8 space-y-3">
          {[
            t("Verifying payment", "पेमेंट सत्यापित करत आहे", lang),
            t("Securing your spot", "तुमची जागा सुरक्षित करत आहे", lang),
            t("Sending confirmation", "पुष्टीकरण पाठवत आहे", lang),
          ].map((s, i) => (
            <div key={s} className="flex items-center gap-3 transition-all" style={{ opacity: i <= processingStep - 1 ? 1 : 0.25 }}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${i < processingStep ? "bg-[var(--sage)]" : "border border-white/20"}`}>
                {i < processingStep && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2">
                    <path d="M2 5l2.5 2.5 3.5-4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className="t-xs text-white/60">{s}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
      {/* Header */}
      <div className="sticky top-0 z-30 px-6 py-4 flex items-center gap-4"
        style={{ background: "var(--bg-primary)", borderBottom: "1px solid var(--border-subtle)" }}>
        <button onClick={step === "payment" ? () => setStep("plan") : onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[var(--bg-muted)] transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
            <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Steps */}
        <div className="flex items-center gap-2 flex-1">
          {[{ id: "plan", en: "Review plan", mr: "योजना पुनरावलोकन" }, { id: "payment", en: "Payment", mr: "पेमेंट" }].map((s, i) => {
            const isActive = step === s.id;
            const isDone = step === "payment" && s.id === "plan";
            return (
              <div key={s.id} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center t-xs font-semibold transition-all ${isDone ? "bg-[var(--sage)] text-white" : isActive ? "bg-[var(--ink)] text-white" : "bg-[var(--bg-muted)] text-[var(--text-muted)]"}`}
                  style={{ fontFamily: "var(--font-mono)" }}>
                  {isDone ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2">
                      <path d="M2 5l2.5 2.5 3.5-4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : i + 1}
                </div>
                <span className={`t-xs hidden sm:block ${isActive ? "text-[var(--text-primary)] font-medium" : "text-[var(--text-muted)]"} ${lang === "mr" ? "mr" : ""}`}>
                  {lang === "en" ? s.en : s.mr}
                </span>
                {i === 0 && <div className="w-8 h-px" style={{ background: "var(--border-subtle)" }} />}
              </div>
            );
          })}
        </div>

        <div className="w-7 h-7 rounded-full bg-[var(--sage)] flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold" style={{ fontFamily: "var(--font-display)" }}>V</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="lg:grid lg:grid-cols-[1fr_340px] gap-12 items-start">

          {/* ── Main column ── */}
          <div>
            {step === "plan" && (
              <div>
                <h2 className={`t-h2 text-[var(--text-primary)] mb-6 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                  {t("Review your plan", "तुमची योजना पुनरावलोकन करा", lang)}
                </h2>

                {/* Programs */}
                <div className="space-y-3 mb-8">
                  {cartItems.map(prog => {
                    const expert = professionals.find(p => {
                      if (prog.category === "pilates") return p.id === "priya-pilates";
                      if (prog.category === "physio") return p.id === "amit-physio";
                      if (prog.category === "nutrition") return p.id === "sneha-nutrition";
                      return p.id === "dr-sharma";
                    });

                    return (
                      <div key={prog.id} className="flex items-start gap-4 p-4 rounded-2xl border" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-elevated)" }}>
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0" style={{ background: "var(--bg-muted)" }}>
                          <img src={prog.image} alt={prog.title_en} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`t-small font-semibold text-[var(--text-primary)] mb-0.5 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                            {lang === "en" ? prog.title_en : prog.title_mr}
                          </p>
                          <p className={`t-xs text-[var(--text-muted)] mb-2 ${lang === "mr" ? "mr" : ""}`}>
                            {lang === "en" ? prog.duration_en : prog.duration_mr} · {lang === "en" ? prog.level_en : prog.level_mr}
                          </p>
                          {expert && (
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full overflow-hidden shrink-0">
                                <img src={expert.image} alt={expert.name_en} className="w-full h-full object-cover" />
                              </div>
                              <span className="t-xs text-[var(--text-muted)]">{expert.name_en}</span>
                            </div>
                          )}
                        </div>
                        <p className="t-small font-semibold text-[var(--text-primary)] shrink-0" style={{ fontFamily: "var(--font-mono)" }}>
                          ₹{prog.price.toLocaleString()}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Contact details form */}
                <h3 className={`t-h4 text-[var(--text-primary)] mb-4 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                  {t("Your details", "तुमचे तपशील", lang)}
                </h3>

                <div className="space-y-4 mb-8">
                  {[
                    { key: "name", label_en: "Full name", label_mr: "पूर्ण नाव", type: "text", placeholder: "Meera Joshi" },
                    { key: "phone", label_en: "Mobile number", label_mr: "मोबाइल नंबर", type: "tel", placeholder: "+91 98765 43210" },
                    { key: "email", label_en: "Email", label_mr: "ईमेल", type: "email", placeholder: "meera@email.com" },
                  ].map(f => (
                    <div key={f.key}>
                      <label className={`t-label text-[var(--text-muted)] block mb-1.5 ${lang === "mr" ? "mr" : ""}`}>
                        {lang === "en" ? f.label_en : f.label_mr}
                      </label>
                      <input
                        type={f.type}
                        value={form[f.key as keyof typeof form]}
                        onChange={e => setField(f.key, e.target.value)}
                        placeholder={f.placeholder}
                        className={`field ${errors[f.key] ? "field-error" : ""}`}
                      />
                      {errors[f.key] && <p className="t-xs text-[var(--error)] mt-1">{errors[f.key]}</p>}
                    </div>
                  ))}
                </div>

                <button onClick={handleProceedToPayment}
                  className={`btn btn-primary btn-xl w-full justify-center ${lang === "mr" ? "mr" : ""}`}>
                  {t("Proceed to Payment →", "पेमेंटकडे जा →", lang)}
                </button>
              </div>
            )}

            {step === "payment" && (
              <div>
                <h2 className={`t-h2 text-[var(--text-primary)] mb-6 ${lang === "mr" ? "mr" : ""}`} style={{ fontFamily: "var(--font-display)" }}>
                  {t("Complete payment", "पेमेंट पूर्ण करा", lang)}
                </h2>

                {/* Payment method tabs */}
                <div className="flex gap-2 mb-6 p-1 rounded-xl border" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-muted)" }}>
                  {(["upi", "card", "netbanking"] as const).map(m => (
                    <button key={m} onClick={() => setPayMethod(m)}
                      className={`flex-1 py-2.5 rounded-lg t-label transition-all capitalize ${payMethod === m ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm" : "text-[var(--text-muted)]"} ${lang === "mr" ? "mr" : ""}`}>
                      {m === "upi" ? "UPI" : m === "card" ? t("Card", "कार्ड", lang) : t("Netbanking", "नेटबँकिंग", lang)}
                    </button>
                  ))}
                </div>

                {/* UPI */}
                {payMethod === "upi" && (
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-center gap-6 mb-4">
                      {["gpay", "phonepe", "paytm"].map(app => (
                        <div key={app} className="flex flex-col items-center gap-1">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                            style={{ background: app === "gpay" ? "#1a73e8" : app === "phonepe" ? "#5f259f" : "#002970" }}>
                            {app === "gpay" ? "G" : app === "phonepe" ? "Pe" : "P"}
                          </div>
                          <span className="t-xs text-[var(--text-muted)] capitalize">{app}</span>
                        </div>
                      ))}
                    </div>
                    <label className={`t-label text-[var(--text-muted)] block mb-1.5 ${lang === "mr" ? "mr" : ""}`}>
                      {t("UPI ID", "UPI आयडी", lang)}
                    </label>
                    <input type="text" value={upiId} onChange={e => setUpiId(e.target.value)}
                      placeholder="name@upi" className="field" />
                    <p className="t-xs text-[var(--text-muted)] flex items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--success)" strokeWidth="1.5"><path d="M6 1a4.5 4.5 0 100 9A4.5 4.5 0 006 1zM6 4.5v3M6 3h.01"/></svg>
                      {t("You'll receive a payment request on your UPI app.", "तुम्हाला तुमच्या UPI अॅपवर पेमेंट विनंती मिळेल.", lang)}
                    </p>
                  </div>
                )}

                {/* Card */}
                {payMethod === "card" && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="t-label text-[var(--text-muted)] block mb-1.5">{t("Card number", "कार्ड नंबर", lang)}</label>
                      <input type="text" value={cardNum} maxLength={19}
                        onChange={e => setCardNum(e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim())}
                        placeholder="1234 5678 9012 3456" className="field" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="t-label text-[var(--text-muted)] block mb-1.5">{t("Expiry", "समाप्ती", lang)}</label>
                        <input type="text" value={cardExp} maxLength={5}
                          onChange={e => { const v = e.target.value.replace(/\D/g,""); setCardExp(v.length > 2 ? `${v.slice(0,2)}/${v.slice(2)}` : v); }}
                          placeholder="MM/YY" className="field" style={{ fontFamily: "var(--font-mono)" }} />
                      </div>
                      <div>
                        <label className="t-label text-[var(--text-muted)] block mb-1.5">CVV</label>
                        <input type="password" value={cardCvv} maxLength={4}
                          onChange={e => setCardCvv(e.target.value.replace(/\D/g,""))}
                          placeholder="•••" className="field" style={{ fontFamily: "var(--font-mono)" }} />
                      </div>
                    </div>
                    <div>
                      <label className="t-label text-[var(--text-muted)] block mb-1.5">{t("Name on card", "कार्डवर नाव", lang)}</label>
                      <input type="text" value={cardName} onChange={e => setCardName(e.target.value)}
                        placeholder="MEERA JOSHI" className="field" style={{ textTransform: "uppercase" }} />
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-muted)]">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--success)" strokeWidth="1.5">
                        <rect x="1" y="3" width="12" height="8" rx="1.5"/><path d="M1 6h12"/>
                      </svg>
                      <span className="t-xs">{t("256-bit SSL encrypted", "२५६-बिट SSL एनक्रिप्टेड", lang)}</span>
                    </div>
                  </div>
                )}

                {/* Netbanking */}
                {payMethod === "netbanking" && (
                  <div className="mb-6">
                    <p className={`t-label text-[var(--text-muted)] mb-3 ${lang === "mr" ? "mr" : ""}`}>{t("Select bank", "बँक निवडा", lang)}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                      {NETBANKING_BANKS.map(b => (
                        <button key={b} onClick={() => setSelectedBank(b)}
                          className={`py-3 rounded-xl border t-small font-medium transition-all ${selectedBank === b ? "border-[var(--sage)] bg-[var(--sage-ghost)] text-[var(--sage)]" : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-default)]"}`}>
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Terms */}
                <div className="flex items-start gap-3 mb-6 p-4 rounded-xl" style={{ background: "var(--bg-muted)" }}>
                  <button onClick={() => setAgreeTerms(a => !a)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${agreeTerms ? "bg-[var(--sage)] border-[var(--sage)]" : "border-[var(--border-default)]"}`}
                    style={{ borderRadius: 4 }}>
                    {agreeTerms && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2">
                        <path d="M2 5l2.5 2.5 3.5-4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                  <p className={`t-xs text-[var(--text-muted)] leading-relaxed ${lang === "mr" ? "mr" : ""}`}>
                    {t("I agree to the ", "मी ", lang)}
                    <span className="text-[var(--sage)] cursor-pointer hover:underline">{t("Terms of Service", "सेवा अटी", lang)}</span>
                    {t(" and ", " आणि ", lang)}
                    <span className="text-[var(--sage)] cursor-pointer hover:underline">{t("Privacy Policy", "गोपनीयता धोरण", lang)}</span>
                    {t(". I understand that payments are secure and non-refundable after program commencement.", " याला सहमत आहे.", lang)}
                  </p>
                </div>

                {/* Pay CTA */}
                <button onClick={handlePay} disabled={!canPay}
                  className={`btn btn-primary btn-xl w-full justify-center ${lang === "mr" ? "mr" : ""}`}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5">
                    <rect x="1" y="4" width="14" height="9" rx="1.5"/><path d="M1 7h14"/>
                  </svg>
                  {t(`Complete Payment · ₹${total.toLocaleString()}`, `पेमेंट पूर्ण करा · ₹${total.toLocaleString()}`, lang)}
                </button>

                <p className={`t-xs text-center text-[var(--text-muted)] mt-3 ${lang === "mr" ? "mr" : ""}`}>
                  {t("Secured by Razorpay · 256-bit SSL", "Razorpay द्वारे सुरक्षित · 256-bit SSL", lang)}
                </p>
              </div>
            )}
          </div>

          {/* ── Order summary panel ── */}
          <div className="lg:block">
            <div className="sticky top-24 rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-elevated)" }}>
              <div className="p-5 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                <p className={`t-label text-[var(--text-muted)] mb-1 ${lang === "mr" ? "mr" : ""}`}>{t("Order summary", "ऑर्डर सारांश", lang)}</p>
                <p className="t-h4 text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  {cartItems.length} {t("program", "प्रोग्राम", lang)}{cartItems.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Items */}
              <div className="p-5 border-b space-y-3" style={{ borderColor: "var(--border-subtle)" }}>
                {cartItems.map(prog => (
                  <div key={prog.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0" style={{ background: "var(--bg-muted)" }}>
                      <img src={prog.image} alt={prog.title_en} className="w-full h-full object-cover" />
                    </div>
                    <p className={`t-xs text-[var(--text-primary)] flex-1 min-w-0 ${lang === "mr" ? "mr" : ""}`}>
                      {lang === "en" ? prog.title_en : prog.title_mr}
                    </p>
                    <p className="t-xs font-medium text-[var(--text-primary)] shrink-0" style={{ fontFamily: "var(--font-mono)" }}>
                      ₹{prog.price.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price breakdown */}
              <div className="p-5 border-b space-y-2" style={{ borderColor: "var(--border-subtle)" }}>
                <div className="flex justify-between">
                  <span className={`t-xs text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`}>{t("Subtotal", "उपएकूण", lang)}</span>
                  <span className="t-xs text-[var(--text-primary)]" style={{ fontFamily: "var(--font-mono)" }}>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`t-xs text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`}>{t("GST (18%)", "जीएसटी (१८%)", lang)}</span>
                  <span className="t-xs text-[var(--text-muted)]" style={{ fontFamily: "var(--font-mono)" }}>₹{gst.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-5 flex justify-between">
                <span className={`t-small font-semibold text-[var(--text-primary)] ${lang === "mr" ? "mr" : ""}`}>{t("Total", "एकूण", lang)}</span>
                <span className="t-h4 text-[var(--text-primary)]" style={{ fontFamily: "var(--font-mono)" }}>₹{total.toLocaleString()}</span>
              </div>

              {/* Trust badges */}
              <div className="px-5 pb-5 space-y-2">
                {[
                  { en: "256-bit SSL encryption", mr: "२५६-बिट SSL एनक्रिप्शन" },
                  { en: "Razorpay secured", mr: "Razorpay सुरक्षित" },
                  { en: "WhatsApp confirmation", mr: "व्हॉट्सअॅप पुष्टीकरण" },
                ].map(b => (
                  <div key={b.en} className="flex items-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--sage)" strokeWidth="1.75" className="shrink-0"><path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span className={`t-xs text-[var(--text-muted)] ${lang === "mr" ? "mr" : ""}`}>{lang === "en" ? b.en : b.mr}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

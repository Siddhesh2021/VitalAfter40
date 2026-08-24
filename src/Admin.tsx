import { useState } from "react";
import { Lang, t, adminStats, adminUsers, revenueData, funnelData, whatsappTemplates, assessmentQuestions, programs, professionals } from "./data";

interface Props { lang: Lang; setLang: (l: Lang) => void; onBack: () => void; }

type AdminSection =
  | "overview" | "leads" | "users" | "assessments" | "recommendations"
  | "programs" | "batches" | "sessions" | "professionals" | "payments"
  | "whatsapp" | "analytics" | "translations" | "settings" | "assessment-cms";

const navItems: { id: AdminSection; icon: string; l_en: string; l_mr: string }[] = [
  { id: "overview", icon: "📊", l_en: "Dashboard", l_mr: "डॅशबोर्ड" },
  { id: "leads", icon: "🎯", l_en: "Leads", l_mr: "लीड्स" },
  { id: "users", icon: "👥", l_en: "Users", l_mr: "वापरकर्ते" },
  { id: "assessments", icon: "📋", l_en: "Assessments", l_mr: "मूल्यांकने" },
  { id: "recommendations", icon: "🔬", l_en: "Recommendation Engine", l_mr: "शिफारस इंजिन" },
  { id: "programs", icon: "📚", l_en: "Programs CMS", l_mr: "प्रोग्राम्स CMS" },
  { id: "assessment-cms", icon: "❓", l_en: "Assessment CMS", l_mr: "मूल्यांकन CMS" },
  { id: "batches", icon: "🗓", l_en: "Batches & Schedule", l_mr: "बॅच आणि वेळापत्रक" },
  { id: "professionals", icon: "👨‍⚕️", l_en: "Professionals", l_mr: "व्यावसायिक" },
  { id: "payments", icon: "💳", l_en: "Payments", l_mr: "पेमेंट" },
  { id: "whatsapp", icon: "💬", l_en: "WhatsApp CRM", l_mr: "WhatsApp CRM" },
  { id: "analytics", icon: "📈", l_en: "Analytics", l_mr: "विश्लेषण" },
  { id: "translations", icon: "🌐", l_en: "Translations", l_mr: "भाषांतरे" },
  { id: "settings", icon: "⚙️", l_en: "Settings", l_mr: "सेटिंग्ज" },
];

export default function AdminDashboard({ lang, setLang, onBack }: Props) {
  const [section, setSection] = useState<AdminSection>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex" style={{ fontFamily: "var(--font-body)" }}>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-60 bg-[#1c1c1c] flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#6b7c5c] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">V</span>
            </div>
            <span className="font-semibold text-white text-base" style={{ fontFamily: "var(--font-display)" }}>Admin</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/50 hover:text-white text-xl">×</button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-0.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setSection(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-all ${section === item.id ? "bg-[#6b7c5c] text-white font-medium" : "text-white/60 hover:bg-white/8 hover:text-white"}`}
              style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {t(item.l_en, item.l_mr, lang)}
            </button>
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-white/10">
          <button onClick={onBack} className="w-full text-white/40 hover:text-white text-xs py-2 text-center transition-colors" style={{ fontFamily: "var(--font-mono)" }}>
            ← {t("Back to site", "साइटवर परत", lang)}
          </button>
        </div>
      </aside>

      {/* Sidebar overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <div className="bg-white border-b border-[#1c1c1c]/8 px-4 sm:px-6 h-14 flex items-center gap-4 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded-lg hover:bg-[#f5f5f0]">
            <div className="space-y-1"><div className="w-5 h-0.5 bg-[#1c1c1c]" /><div className="w-5 h-0.5 bg-[#1c1c1c]" /><div className="w-5 h-0.5 bg-[#1c1c1c]" /></div>
          </button>
          <h1 className="font-semibold text-[#1c1c1c] flex-1" style={{ fontFamily: "var(--font-display)" }}>
            {t(navItems.find((n) => n.id === section)?.l_en ?? "", navItems.find((n) => n.id === section)?.l_mr ?? "", lang)}
          </h1>
          <button onClick={() => setLang(lang === "en" ? "mr" : "en")} className="text-xs border border-[#1c1c1c]/20 rounded-full px-3 py-1.5 hover:border-[#6b7c5c] transition-all" style={{ fontFamily: "var(--font-mono)" }}>
            {lang === "en" ? "मराठी" : "EN"}
          </button>
          <div className="w-8 h-8 rounded-full bg-[#6b7c5c] flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-auto">
          {section === "overview" && <OverviewSection lang={lang} />}
          {section === "users" && <UsersSection lang={lang} />}
          {section === "leads" && <LeadsSection lang={lang} />}
          {section === "assessments" && <AssessmentsSection lang={lang} />}
          {section === "recommendations" && <RecommendationEngine lang={lang} />}
          {section === "programs" && <ProgramsCMS lang={lang} />}
          {section === "assessment-cms" && <AssessmentCMS lang={lang} />}
          {section === "batches" && <BatchesSection lang={lang} />}
          {section === "professionals" && <ProfessionalsSection lang={lang} />}
          {section === "payments" && <PaymentsSection lang={lang} />}
          {section === "whatsapp" && <WhatsAppSection lang={lang} />}
          {section === "analytics" && <AnalyticsSection lang={lang} />}
          {section === "translations" && <TranslationsSection lang={lang} />}
          {section === "settings" && <SettingsSection lang={lang} />}
        </div>
      </main>
    </div>
  );
}

/* ── STAT CARD ─────────────────────────────────────────── */
function StatCard({ icon, label, value, sub, color = "#6b7c5c" }: { icon: string; label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#1c1c1c]/6">
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs font-mono text-[#1c1c1c]/30">↑ 12%</span>
      </div>
      <p className="text-3xl font-bold text-[#1c1c1c] mb-1" style={{ fontFamily: "var(--font-mono)", color }}>{value}</p>
      <p className="text-[#1c1c1c]/60 text-sm font-medium">{label}</p>
      {sub && <p className="text-[#1c1c1c]/35 text-xs mt-0.5">{sub}</p>}
    </div>
  );
}

/* ── OVERVIEW ──────────────────────────────────────────── */
function OverviewSection({ lang }: { lang: Lang }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon="👥" label={t("Total Users", "एकूण वापरकर्ते", lang)} value={adminStats.users.toLocaleString()} sub={t("All time", "सर्व वेळ", lang)} />
        <StatCard icon="🎯" label={t("New Leads", "नवीन लीड्स", lang)} value={adminStats.leads} sub={t("This month", "या महिन्यात", lang)} color="#c4622d" />
        <StatCard icon="📋" label={t("Assessments", "मूल्यांकने", lang)} value={adminStats.assessments} sub={t("Completed", "पूर्ण", lang)} />
        <StatCard icon="💰" label={t("Revenue", "महसूल", lang)} value={`₹${(adminStats.revenue / 100000).toFixed(1)}L`} sub={t("This month", "या महिन्यात", lang)} color="#4a5c3a" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon="🔄" label={t("Conversions", "रूपांतरणे", lang)} value={adminStats.conversions} />
        <StatCard icon="📅" label={t("Upcoming Sessions", "आगामी सेशन्स", lang)} value={adminStats.sessions} />
        <StatCard icon="📚" label={t("Active Programs", "सक्रिय प्रोग्राम्स", lang)} value={adminStats.programs} />
        <StatCard icon="💬" label={t("WhatsApp Leads", "WhatsApp लीड्स", lang)} value={adminStats.whatsapp_leads} />
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-2xl p-5 border border-[#1c1c1c]/6">
        <h3 className="font-semibold text-[#1c1c1c] mb-4" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{t("Revenue & Leads — Last 6 Months", "महसूल आणि लीड्स — गेल्या ६ महिन्यांत", lang)}</h3>
        <div className="flex items-end gap-3 h-40">
          {revenueData.map((d, i) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col gap-0.5">
                <div className="w-full bg-[#6b7c5c] rounded-t transition-all" style={{ height: `${(d.revenue / 200000) * 120}px` }} title={`₹${d.revenue.toLocaleString()}`} />
                <div className="w-full bg-[#d4dbc9] rounded-none" style={{ height: `${(d.leads / 150) * 40}px` }} title={`${d.leads} leads`} />
              </div>
              <span className="text-[10px] text-[#1c1c1c]/40 font-mono">{d.month}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-2 text-xs text-[#1c1c1c]/50">
          <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-[#6b7c5c] rounded-sm inline-block" /> {t("Revenue", "महसूल", lang)}</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-[#d4dbc9] rounded-sm inline-block" /> {t("Leads", "लीड्स", lang)}</span>
        </div>
      </div>

      {/* Conversion funnel */}
      <div className="bg-white rounded-2xl p-5 border border-[#1c1c1c]/6">
        <h3 className="font-semibold text-[#1c1c1c] mb-4" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{t("Conversion Funnel", "रूपांतरण फनेल", lang)}</h3>
        <div className="space-y-2">
          {funnelData.map((f, i) => (
            <div key={f.stage_en} className="flex items-center gap-3">
              <span className="text-xs text-[#1c1c1c]/50 w-32 flex-shrink-0" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{t(f.stage_en, f.stage_mr, lang)}</span>
              <div className="flex-1 bg-[#f5f5f0] rounded-full h-6 overflow-hidden">
                <div className="bg-[#6b7c5c] h-full rounded-full flex items-center px-2 transition-all" style={{ width: `${(f.value / funnelData[0].value) * 100}%`, opacity: 1 - i * 0.1 }}>
                  <span className="text-white text-xs font-mono">{f.value.toLocaleString()}</span>
                </div>
              </div>
              <span className="text-xs text-[#1c1c1c]/40 w-14 text-right font-mono">{Math.round((f.value / funnelData[0].value) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-2xl p-5 border border-[#1c1c1c]/6">
        <h3 className="font-semibold text-[#1c1c1c] mb-4" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{t("Recent Activity", "अलीकडील क्रियाकलाप", lang)}</h3>
        <div className="space-y-3">
          {[
            { icon: "✅", msg_en: "Meera Joshi completed her assessment", msg_mr: "मीरा जोशीने तिचे मूल्यांकन पूर्ण केले", time: "2m ago" },
            { icon: "💳", msg_en: "New payment ₹2,999 from Suresh Patil", msg_mr: "सुरेश पाटीलकडून ₹२,९९९ नवीन पेमेंट", time: "15m ago" },
            { icon: "📋", msg_en: "Prakash More started health assessment", msg_mr: "प्रकाश मोरेने आरोग्य मूल्यांकन सुरू केले", time: "1h ago" },
            { icon: "🎯", msg_en: "New WhatsApp lead: Anita Kumar", msg_mr: "नवीन WhatsApp लीड: अनिता कुमार", time: "2h ago" },
            { icon: "📅", msg_en: "Group Pilates Batch A — 3 seats remaining", msg_mr: "ग्रुप पिलाटेस बॅच A — ३ जागा शिल्लक", time: "3h ago" },
          ].map((a, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <span className="text-base">{a.icon}</span>
              <p className="flex-1 text-[#1c1c1c]/70" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{t(a.msg_en, a.msg_mr, lang)}</p>
              <span className="text-[#1c1c1c]/30 text-xs flex-shrink-0" style={{ fontFamily: "var(--font-mono)" }}>{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── USERS ─────────────────────────────────────────────── */
function UsersSection({ lang }: { lang: Lang }) {
  const [search, setSearch] = useState("");
  const filtered = adminUsers.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.phone.includes(search));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("Search users...", "वापरकर्ते शोधा...", lang)} className="flex-1 border border-[#1c1c1c]/15 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#6b7c5c] bg-white" />
        <button className="bg-[#6b7c5c] text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-[#5a6b4b] transition-all">
          + {t("Add User", "वापरकर्ता जोडा", lang)}
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-[#1c1c1c]/6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f5f5f0] text-[#1c1c1c]/60">
              <tr>
                {["Name", "Phone", "Age", "Lang", "Assessment", "Program", "Subscription", "Payment", "Last Active", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-xs whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1c1c]/5">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-[#f5f5f0] transition-colors">
                  <td className="px-4 py-3 font-medium text-[#1c1c1c] whitespace-nowrap">{u.name}</td>
                  <td className="px-4 py-3 text-[#1c1c1c]/60 font-mono text-xs">{u.phone}</td>
                  <td className="px-4 py-3 text-[#1c1c1c]/60">{u.age}</td>
                  <td className="px-4 py-3"><span className="bg-[#d4dbc9] text-[#4a5c3a] text-xs px-2 py-0.5 rounded-full">{u.lang}</span></td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${u.assessment === "Completed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{u.assessment}</span>
                  </td>
                  <td className="px-4 py-3 text-[#1c1c1c]/60 text-xs whitespace-nowrap">{u.program}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${u.subscription === "Active" ? "bg-green-100 text-green-700" : "bg-[#f5f5f0] text-[#1c1c1c]/40"}`}>{u.subscription}</span></td>
                  <td className="px-4 py-3 text-[#1c1c1c] font-mono text-xs">{u.payment}</td>
                  <td className="px-4 py-3 text-[#1c1c1c]/40 text-xs font-mono whitespace-nowrap">{u.last_activity}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {["View", "Edit", "WA"].map((a) => (
                        <button key={a} className="text-xs border border-[#1c1c1c]/15 rounded-lg px-2 py-1 hover:bg-[#f5f5f0] text-[#1c1c1c]/60 transition-all">{a}</button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── LEADS ─────────────────────────────────────────────── */
function LeadsSection({ lang }: { lang: Lang }) {
  const leads = [
    { name: "Rohit Sharma", phone: "9800123456", source: "Meta Ad", goal: "Weight loss", lang: "EN", status: "New", time: "5m ago" },
    { name: "Kavita Pawar", phone: "9700234567", source: "WhatsApp", goal: "Pilates", lang: "MR", status: "Contacted", time: "2h ago" },
    { name: "Santosh Kulkarni", phone: "9600345678", source: "Instagram", goal: "Back pain", lang: "MR", status: "Assessment done", time: "1d ago" },
    { name: "Deepa Joshi", phone: "9500456789", source: "Organic", goal: "Hormonal wellness", lang: "EN", status: "Follow-up", time: "2d ago" },
  ];
  const statusColor: Record<string, string> = { "New": "bg-blue-100 text-blue-700", "Contacted": "bg-amber-100 text-amber-700", "Assessment done": "bg-green-100 text-green-700", "Follow-up": "bg-purple-100 text-purple-700" };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label_en: "Total Leads", label_mr: "एकूण लीड्स", v: 247, color: "#6b7c5c" },
          { label_en: "New Today", label_mr: "आज नवीन", v: 18, color: "#c4622d" },
          { label_en: "Contacted", label_mr: "संपर्क केले", v: 142, color: "#1c1c1c" },
          { label_en: "Converted", label_mr: "रूपांतरित", v: 63, color: "#4a5c3a" },
        ].map((s) => (
          <div key={s.label_en} className="bg-white rounded-2xl p-4 border border-[#1c1c1c]/6">
            <p className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-mono)", color: s.color }}>{s.v}</p>
            <p className="text-[#1c1c1c]/60 text-xs" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{t(s.label_en, s.label_mr, lang)}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-[#1c1c1c]/6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f5f5f0] text-[#1c1c1c]/60">
              <tr>{["Name", "Phone", "Source", "Goal", "Lang", "Status", "Time", "Actions"].map((h) => <th key={h} className="text-left px-4 py-3 font-medium text-xs">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-[#1c1c1c]/5">
              {leads.map((l, i) => (
                <tr key={i} className="hover:bg-[#f5f5f0] transition-colors">
                  <td className="px-4 py-3 font-medium text-[#1c1c1c]">{l.name}</td>
                  <td className="px-4 py-3 text-[#1c1c1c]/60 font-mono text-xs">{l.phone}</td>
                  <td className="px-4 py-3 text-xs"><span className="bg-[#f5f5f0] px-2 py-0.5 rounded-full">{l.source}</span></td>
                  <td className="px-4 py-3 text-[#1c1c1c]/60 text-xs">{l.goal}</td>
                  <td className="px-4 py-3"><span className="bg-[#d4dbc9] text-[#4a5c3a] text-xs px-2 py-0.5 rounded-full">{l.lang}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[l.status]}`}>{l.status}</span></td>
                  <td className="px-4 py-3 text-[#1c1c1c]/40 text-xs font-mono">{l.time}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {["View", "WA", "Assign"].map((a) => <button key={a} className="text-xs border border-[#1c1c1c]/15 rounded-lg px-2 py-1 hover:bg-[#f5f5f0] text-[#1c1c1c]/60">{a}</button>)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── ASSESSMENTS ───────────────────────────────────────── */
function AssessmentsSection({ lang }: { lang: Lang }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[{ l_en: "Completed", l_mr: "पूर्ण", v: 891, c: "bg-green-100 text-green-700" }, { l_en: "In Progress", l_mr: "प्रगतीत", v: 134, c: "bg-amber-100 text-amber-700" }, { l_en: "Abandoned", l_mr: "सोडलेले", v: 259, c: "bg-red-100 text-red-700" }].map((s) => (
          <div key={s.l_en} className="bg-white rounded-2xl p-4 border border-[#1c1c1c]/6 text-center">
            <p className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-mono)" }}>{s.v}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${s.c}`} style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{t(s.l_en, s.l_mr, lang)}</span>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-[#1c1c1c]/6 overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1c1c1c]/6 flex items-center justify-between">
          <h3 className="font-semibold text-[#1c1c1c]">{t("Recent Assessment Submissions", "अलीकडील मूल्यांकन सादरीकरणे", lang)}</h3>
        </div>
        <div className="divide-y divide-[#1c1c1c]/5">
          {adminUsers.slice(0, 4).map((u) => (
            <div key={u.id} className="flex items-center gap-4 px-5 py-3">
              <div className="w-8 h-8 rounded-full bg-[#d4dbc9] flex items-center justify-center flex-shrink-0">
                <span className="text-[#4a5c3a] font-bold text-xs">{u.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#1c1c1c] text-sm">{u.name}</p>
                <p className="text-[#1c1c1c]/40 text-xs" style={{ fontFamily: "var(--font-mono)" }}>{u.last_activity}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${u.assessment === "Completed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{u.assessment}</span>
              <div className="flex gap-1">
                {["View", "Edit rec."].map((a) => <button key={a} className="text-xs border border-[#1c1c1c]/15 rounded-lg px-2 py-1 hover:bg-[#f5f5f0] text-[#1c1c1c]/60">{a}</button>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── RECOMMENDATION ENGINE ─────────────────────────────── */
function RecommendationEngine({ lang }: { lang: Lang }) {
  const [rules] = useState([
    { id: 1, conditions: [{ field: "Age", op: ">", val: "40" }, { field: "Goal", op: "=", val: "Mobility" }, { field: "Pain", op: "=", val: "Yes" }], outcomes: [{ service: "Physiotherapy", priority: "High" }, { service: "Individual Pilates", priority: "High" }], active: true },
    { id: 2, conditions: [{ field: "Goal", op: "includes", val: "Muscle" }], outcomes: [{ service: "Strength Training", priority: "High" }, { service: "Nutrition", priority: "Recommended" }], active: true },
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[#1c1c1c]/60 text-sm" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>
          {t("Define rules that map assessment answers to program recommendations.", "मूल्यांकन उत्तरे प्रोग्राम शिफारसींमध्ये मॅप करण्यासाठी नियम परिभाषित करा.", lang)}
        </p>
        <button className="bg-[#6b7c5c] text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-[#5a6b4b] transition-all">
          + {t("Add Rule", "नियम जोडा", lang)}
        </button>
      </div>
      {rules.map((rule) => (
        <div key={rule.id} className="bg-white rounded-2xl border border-[#1c1c1c]/6 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-[#1c1c1c] text-sm" style={{ fontFamily: "var(--font-mono)" }}>Rule #{rule.id}</span>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${rule.active ? "bg-green-100 text-green-700" : "bg-[#f5f5f0] text-[#1c1c1c]/40"}`}>{rule.active ? "Active" : "Inactive"}</span>
              <button className="text-xs border border-[#1c1c1c]/15 rounded-lg px-3 py-1 hover:bg-[#f5f5f0] text-[#1c1c1c]/60">Edit</button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-[#1c1c1c]/40 uppercase tracking-wide mb-2">IF</p>
              <div className="space-y-1.5">
                {rule.conditions.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 bg-[#f5f5f0] rounded-lg px-3 py-2 text-sm">
                    {i > 0 && <span className="text-[#6b7c5c] font-semibold text-xs">AND</span>}
                    <span className="font-medium text-[#1c1c1c]">{c.field}</span>
                    <span className="text-[#1c1c1c]/40">{c.op}</span>
                    <span className="text-[#6b7c5c] font-medium">{c.val}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1c1c1c]/40 uppercase tracking-wide mb-2">THEN RECOMMEND</p>
              <div className="space-y-1.5">
                {rule.outcomes.map((o, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#d4dbc9]/40 rounded-lg px-3 py-2 text-sm">
                    <span className="font-medium text-[#1c1c1c]">{o.service}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${o.priority === "High" ? "bg-[#c4622d]/15 text-[#c4622d]" : "bg-[#6b7c5c]/15 text-[#6b7c5c]"}`}>{o.priority}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── PROGRAMS CMS ──────────────────────────────────────── */
function ProgramsCMS({ lang }: { lang: Lang }) {
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[#1c1c1c]/60 text-sm">{t("Manage all programs. All fields support English + Marathi.", "सर्व प्रोग्राम्स व्यवस्थापित करा. सर्व फील्ड इंग्रजी + मराठी समर्थन करतात.", lang)}</p>
        <button className="bg-[#6b7c5c] text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-[#5a6b4b] transition-all">
          + {t("New Program", "नवीन प्रोग्राम", lang)}
        </button>
      </div>
      <div className="space-y-3">
        {programs.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-[#1c1c1c]/6 overflow-hidden">
            <div className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-xl bg-[#d4dbc9] overflow-hidden flex-shrink-0">
                <img src={p.image} alt={p.title_en} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-[#1c1c1c] text-sm">{p.title_en}</p>
                  <span className="text-[#1c1c1c]/40 text-xs">/</span>
                  <p className="text-[#1c1c1c]/60 text-xs" style={{ fontFamily: "var(--font-devanagari)" }}>{p.title_mr}</p>
                </div>
                <div className="flex gap-3 text-xs text-[#1c1c1c]/40" style={{ fontFamily: "var(--font-mono)" }}>
                  <span>₹{p.price.toLocaleString()}</span>
                  <span>·</span>
                  <span>{p.category}</span>
                  <span>·</span>
                  <span>{p.duration_en}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(editing === p.id ? null : p.id)} className="text-xs border border-[#1c1c1c]/15 rounded-lg px-3 py-1.5 hover:bg-[#f5f5f0] text-[#1c1c1c]/60">
                  {editing === p.id ? t("Close", "बंद करा", lang) : t("Edit", "संपादित करा", lang)}
                </button>
                <button className="text-xs border border-[#1c1c1c]/15 rounded-lg px-3 py-1.5 hover:bg-[#f5f5f0] text-[#1c1c1c]/60">...</button>
              </div>
            </div>
            {editing === p.id && (
              <div className="border-t border-[#1c1c1c]/6 p-4 bg-[#f5f5f0]">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: "Title (EN)", value: p.title_en },
                    { label: "Title (MR)", value: p.title_mr },
                    { label: "Price (₹)", value: String(p.price) },
                    { label: "Duration (EN)", value: p.duration_en },
                    { label: "Level (EN)", value: p.level_en },
                    { label: "Category", value: p.category },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="block text-xs font-medium text-[#1c1c1c]/60 mb-1">{field.label}</label>
                      <input defaultValue={field.value} className="w-full border border-[#1c1c1c]/15 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-[#6b7c5c]" />
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-medium text-[#1c1c1c]/60 mb-1">Description (EN)</label>
                  <textarea defaultValue={p.desc_en} rows={2} className="w-full border border-[#1c1c1c]/15 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-[#6b7c5c] resize-none" />
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-medium text-[#1c1c1c]/60 mb-1">Description (MR)</label>
                  <textarea defaultValue={p.desc_mr} rows={2} className="w-full border border-[#1c1c1c]/15 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-[#6b7c5c] resize-none" style={{ fontFamily: "var(--font-devanagari)" }} />
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="bg-[#6b7c5c] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#5a6b4b] transition-all">Save & Publish</button>
                  <button className="border border-[#1c1c1c]/15 text-[#1c1c1c]/60 text-sm px-4 py-2 rounded-lg hover:bg-white transition-all">Save Draft</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── ASSESSMENT CMS ────────────────────────────────────── */
function AssessmentCMS({ lang }: { lang: Lang }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[#1c1c1c]/60 text-sm">{t("Manage assessment questions, answer options, and conditional logic.", "मूल्यांकन प्रश्न, उत्तर पर्याय आणि सशर्त तर्क व्यवस्थापित करा.", lang)}</p>
        <button className="bg-[#6b7c5c] text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-[#5a6b4b] transition-all">
          + {t("New Question", "नवीन प्रश्न", lang)}
        </button>
      </div>
      <div className="space-y-2">
        {assessmentQuestions.map((q, i) => (
          <div key={q.id} className="bg-white rounded-xl border border-[#1c1c1c]/6 p-4 flex items-start gap-3">
            <div className="w-6 h-6 rounded bg-[#d4dbc9] flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[#4a5c3a] text-xs font-bold">{i + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#1c1c1c] text-sm mb-0.5">{q.q_en}</p>
              <p className="text-[#1c1c1c]/50 text-xs mb-1" style={{ fontFamily: "var(--font-devanagari)" }}>{q.q_mr}</p>
              <div className="flex gap-2 flex-wrap">
                <span className="bg-[#f5f5f0] text-[#1c1c1c]/50 text-xs px-2 py-0.5 rounded-full" style={{ fontFamily: "var(--font-mono)" }}>{q.type}</span>
                <span className="bg-[#d4dbc9] text-[#4a5c3a] text-xs px-2 py-0.5 rounded-full">§{q.section}</span>
                {q.required && <span className="bg-[#c4622d]/10 text-[#c4622d] text-xs px-2 py-0.5 rounded-full">Required</span>}
                {(q as any).condition && <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">Conditional</span>}
              </div>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button className="text-xs border border-[#1c1c1c]/15 rounded-lg px-2 py-1 hover:bg-[#f5f5f0] text-[#1c1c1c]/60">Edit</button>
              <button className="text-xs border border-[#1c1c1c]/15 rounded-lg px-2 py-1 hover:bg-[#f5f5f0] text-[#1c1c1c]/60">⋮</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── BATCHES ───────────────────────────────────────────── */
function BatchesSection({ lang }: { lang: Lang }) {
  const batches = [
    { id: 1, name_en: "Group Pilates — Batch A", name_mr: "ग्रुप पिलाटेस — बॅच A", coach: "Priya Nair", days: "Mon · Wed · Fri", time: "7:00 AM", capacity: 12, enrolled: 9, start: "2 Sep 2024", status: "Open" },
    { id: 2, name_en: "Group Pilates — Batch B", name_mr: "ग्रुप पिलाटेस — बॅच B", coach: "Priya Nair", days: "Tue · Thu · Sat", time: "6:30 PM", capacity: 12, enrolled: 12, start: "2 Sep 2024", status: "Full" },
    { id: 3, name_en: "Strength Batch — Morning", name_mr: "ताकद बॅच — सकाळ", coach: "Gym Trainer", days: "Mon · Wed · Fri", time: "6:00 AM", capacity: 8, enrolled: 5, start: "9 Sep 2024", status: "Open" },
  ];

  return (
    <div className="space-y-4">
      <button className="bg-[#6b7c5c] text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-[#5a6b4b] transition-all">
        + {t("New Batch", "नवीन बॅच", lang)}
      </button>
      {batches.map((b) => (
        <div key={b.id} className="bg-white rounded-2xl border border-[#1c1c1c]/6 p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-[#1c1c1c]">{t(b.name_en, b.name_mr, lang)}</h3>
              <p className="text-[#1c1c1c]/50 text-sm">{b.coach}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${b.status === "Open" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{b.status}</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs text-[#1c1c1c]/60 mb-3">
            <div><span className="text-[#1c1c1c]/30 block mb-0.5">Days</span>{b.days}</div>
            <div><span className="text-[#1c1c1c]/30 block mb-0.5">Time</span>{b.time}</div>
            <div><span className="text-[#1c1c1c]/30 block mb-0.5">Starts</span>{b.start}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-[#f5f5f0] rounded-full h-2">
              <div className="bg-[#6b7c5c] h-2 rounded-full" style={{ width: `${(b.enrolled / b.capacity) * 100}%` }} />
            </div>
            <span className="text-xs font-mono text-[#1c1c1c]/50">{b.enrolled}/{b.capacity} seats</span>
            <button className="text-xs border border-[#1c1c1c]/15 rounded-lg px-3 py-1 hover:bg-[#f5f5f0] text-[#1c1c1c]/60">Edit</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── PROFESSIONALS ─────────────────────────────────────── */
function ProfessionalsSection({ lang }: { lang: Lang }) {
  return (
    <div className="space-y-4">
      <button className="bg-[#6b7c5c] text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-[#5a6b4b] transition-all">
        + {t("Add Professional", "व्यावसायिक जोडा", lang)}
      </button>
      <div className="grid sm:grid-cols-2 gap-4">
        {professionals.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-[#1c1c1c]/6 p-4 flex gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#d4dbc9] overflow-hidden flex-shrink-0">
              <img src={p.image} alt={p.name_en} className="w-full h-full object-cover object-top" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#1c1c1c] text-sm">{t(p.name_en, p.name_mr, lang)}</p>
              <p className="text-[#6b7c5c] text-xs font-medium mb-1" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{t(p.role_en, p.role_mr, lang)}</p>
              <p className="text-[#1c1c1c]/40 text-xs" style={{ fontFamily: "var(--font-mono)" }}>{t(p.qual_en, p.qual_mr, lang)}</p>
              <div className="flex gap-2 mt-2">
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Active</span>
                <button className="text-xs border border-[#1c1c1c]/15 rounded-lg px-2 py-0.5 text-[#1c1c1c]/60 hover:bg-[#f5f5f0]">Edit</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── PAYMENTS ──────────────────────────────────────────── */
function PaymentsSection({ lang }: { lang: Lang }) {
  const payments = [
    { id: "TXN001", user: "Meera Joshi", program: "Group Pilates", amount: 2999, status: "Success", gateway: "Razorpay", date: "24 Aug 2024" },
    { id: "TXN002", user: "Suresh Patil", program: "Strength Training", amount: 3499, status: "Success", gateway: "Razorpay", date: "23 Aug 2024" },
    { id: "TXN003", user: "Kavita Singh", program: "Nutrition", amount: 2499, status: "Failed", gateway: "Razorpay", date: "22 Aug 2024" },
    { id: "TXN004", user: "Raju Desai", program: "Doctor Consultation", amount: 999, status: "Pending", gateway: "UPI", date: "21 Aug 2024" },
    { id: "TXN005", user: "Sunita More", program: "Individual Pilates", amount: 5999, status: "Refunded", gateway: "Razorpay", date: "20 Aug 2024" },
  ];
  const statusColor: Record<string, string> = { Success: "bg-green-100 text-green-700", Failed: "bg-red-100 text-red-700", Pending: "bg-amber-100 text-amber-700", Refunded: "bg-blue-100 text-blue-700" };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[{ l_en: "Total Revenue", l_mr: "एकूण महसूल", v: "₹8.47L", c: "#4a5c3a" }, { l_en: "Successful", l_mr: "यशस्वी", v: 312, c: "#6b7c5c" }, { l_en: "Failed", l_mr: "अयशस्वी", v: 23, c: "#c4622d" }, { l_en: "Pending", l_mr: "प्रलंबित", v: 8, c: "#1c1c1c" }].map((s) => (
          <div key={s.l_en} className="bg-white rounded-2xl p-4 border border-[#1c1c1c]/6">
            <p className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-mono)", color: s.c }}>{s.v}</p>
            <p className="text-[#1c1c1c]/60 text-xs" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{t(s.l_en, s.l_mr, lang)}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-[#1c1c1c]/6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f5f5f0] text-[#1c1c1c]/60">
              <tr>{["Transaction ID", "User", "Program", "Amount", "Status", "Gateway", "Date"].map((h) => <th key={h} className="text-left px-4 py-3 font-medium text-xs whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-[#1c1c1c]/5">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-[#f5f5f0] transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-[#1c1c1c]/60">{p.id}</td>
                  <td className="px-4 py-3 font-medium text-[#1c1c1c] whitespace-nowrap">{p.user}</td>
                  <td className="px-4 py-3 text-[#1c1c1c]/60 text-xs whitespace-nowrap">{p.program}</td>
                  <td className="px-4 py-3 font-mono font-semibold text-[#1c1c1c]">₹{p.amount.toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[p.status]}`}>{p.status}</span></td>
                  <td className="px-4 py-3 text-[#1c1c1c]/50 text-xs">{p.gateway}</td>
                  <td className="px-4 py-3 text-[#1c1c1c]/40 text-xs font-mono whitespace-nowrap">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── WHATSAPP ──────────────────────────────────────────── */
function WhatsAppSection({ lang }: { lang: Lang }) {
  const [editing, setEditing] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[#1c1c1c]/60 text-sm">{t("Manage WhatsApp message templates for all communication states.", "सर्व संप्रेषण स्थितींसाठी WhatsApp संदेश टेम्प्लेट व्यवस्थापित करा.", lang)}</p>
        <button className="bg-[#25D366] text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-[#20bf5c] transition-all">
          + {t("New Template", "नवीन टेम्प्लेट", lang)}
        </button>
      </div>
      <div className="space-y-3">
        {whatsappTemplates.map((tpl) => (
          <div key={tpl.id} className="bg-white rounded-2xl border border-[#1c1c1c]/6 overflow-hidden">
            <div className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">💬</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-[#1c1c1c] text-sm">{t(tpl.name_en, tpl.name_mr, lang)}</p>
                  <span className="text-[#1c1c1c]/30 text-xs">/</span>
                  <p className="text-[#1c1c1c]/50 text-xs" style={{ fontFamily: "var(--font-devanagari)" }}>{tpl.name_mr}</p>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className={`px-2 py-0.5 rounded-full ${tpl.status === "Active" ? "bg-green-100 text-green-700" : "bg-[#f5f5f0] text-[#1c1c1c]/50"}`}>{tpl.status}</span>
                  <span className="bg-[#d4dbc9] text-[#4a5c3a] px-2 py-0.5 rounded-full">{tpl.lang}</span>
                  <span className="text-[#1c1c1c]/30 font-mono">Sent: {tpl.sent.toLocaleString()}</span>
                </div>
              </div>
              <button onClick={() => setEditing(editing === tpl.id ? null : tpl.id)} className="text-xs border border-[#1c1c1c]/15 rounded-lg px-3 py-1.5 hover:bg-[#f5f5f0] text-[#1c1c1c]/60">
                {editing === tpl.id ? "Close" : "Edit"}
              </button>
            </div>
            {editing === tpl.id && (
              <div className="border-t border-[#1c1c1c]/6 p-4 bg-[#f5f5f0] space-y-3">
                <div>
                  <label className="block text-xs font-medium text-[#1c1c1c]/60 mb-1">Template Body (English)</label>
                  <textarea rows={3} defaultValue={`Hi {{name}}, ${tpl.name_en}. Visit vitalafter40.com`} className="w-full border border-[#1c1c1c]/15 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-[#6b7c5c] resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1c1c1c]/60 mb-1" style={{ fontFamily: "var(--font-devanagari)" }}>Template Body (मराठी)</label>
                  <textarea rows={3} defaultValue={`नमस्ते {{name}}, ${tpl.name_mr}. vitalafter40.com ला भेट द्या`} className="w-full border border-[#1c1c1c]/15 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-[#6b7c5c] resize-none" style={{ fontFamily: "var(--font-devanagari)" }} />
                </div>
                <div className="flex gap-2">
                  <button className="bg-[#25D366] text-white text-sm font-medium px-4 py-2 rounded-lg">Save & Submit for Approval</button>
                  <button className="border border-[#1c1c1c]/15 text-sm px-4 py-2 rounded-lg text-[#1c1c1c]/60">Save Draft</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── ANALYTICS ─────────────────────────────────────────── */
function AnalyticsSection({ lang }: { lang: Lang }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { l_en: "Website Visits", l_mr: "वेबसाइट भेटी", v: "12,840", delta: "+18%" },
          { l_en: "Assessment Starts", l_mr: "मूल्यांकन सुरुवात", v: "1,284", delta: "+24%" },
          { l_en: "Completion Rate", l_mr: "पूर्णता दर", v: "69%", delta: "+5%" },
          { l_en: "Abandonment Rate", l_mr: "सोडण्याचा दर", v: "31%", delta: "-5%" },
          { l_en: "Meta Source Leads", l_mr: "Meta स्त्रोत लीड्स", v: 683, delta: "+31%" },
          { l_en: "WhatsApp Source", l_mr: "WhatsApp स्त्रोत", v: 183, delta: "+12%" },
        ].map((s) => (
          <div key={s.l_en} className="bg-white rounded-2xl p-4 border border-[#1c1c1c]/6">
            <p className="text-2xl font-bold text-[#1c1c1c] mb-1" style={{ fontFamily: "var(--font-mono)" }}>{s.v}</p>
            <p className="text-[#1c1c1c]/60 text-xs mb-1" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{t(s.l_en, s.l_mr, lang)}</p>
            <span className={`text-xs font-mono ${s.delta.startsWith("+") ? "text-green-600" : "text-red-500"}`}>{s.delta}</span>
          </div>
        ))}
      </div>

      {/* Language split */}
      <div className="bg-white rounded-2xl p-5 border border-[#1c1c1c]/6">
        <h3 className="font-semibold text-[#1c1c1c] mb-4">{t("English vs Marathi Usage", "इंग्रजी विरुद्ध मराठी वापर", lang)}</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#1c1c1c]/60 w-8">EN</span>
          <div className="flex-1 h-6 bg-[#f5f5f0] rounded-full overflow-hidden flex">
            <div className="bg-[#6b7c5c] h-full flex items-center justify-end pr-2" style={{ width: "63%" }}>
              <span className="text-white text-xs font-mono">63%</span>
            </div>
            <div className="bg-[#d4dbc9] h-full flex items-center justify-start pl-2" style={{ width: "37%" }}>
              <span className="text-[#4a5c3a] text-xs font-mono">37%</span>
            </div>
          </div>
          <span className="text-sm text-[#1c1c1c]/60 w-8">MR</span>
        </div>
        <div className="flex gap-4 mt-3 text-xs text-[#1c1c1c]/50">
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#6b7c5c] rounded-sm" /> English: 809 users</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#d4dbc9] rounded-sm" /> Marathi: 475 users</span>
        </div>
      </div>

      {/* Popular programs */}
      <div className="bg-white rounded-2xl p-5 border border-[#1c1c1c]/6">
        <h3 className="font-semibold text-[#1c1c1c] mb-4">{t("Popular Programs", "लोकप्रिय प्रोग्राम्स", lang)}</h3>
        <div className="space-y-3">
          {[
            { name: "Group Pilates", pct: 38, count: 312 },
            { name: "Strength Training", pct: 22, count: 187 },
            { name: "Nutrition", pct: 18, count: 149 },
            { name: "Doctor Consultation", pct: 12, count: 98 },
            { name: "Individual Pilates", pct: 10, count: 84 },
          ].map((p) => (
            <div key={p.name} className="flex items-center gap-3">
              <span className="text-xs text-[#1c1c1c]/60 w-36 flex-shrink-0">{p.name}</span>
              <div className="flex-1 bg-[#f5f5f0] rounded-full h-4 overflow-hidden">
                <div className="bg-[#6b7c5c] h-full rounded-full" style={{ width: `${p.pct}%` }} />
              </div>
              <span className="text-xs text-[#1c1c1c]/40 w-16 text-right font-mono">{p.count} users</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── TRANSLATIONS ──────────────────────────────────────── */
function TranslationsSection({ lang }: { lang: Lang }) {
  const items = [
    { key: "hero.headline", en: "Your best years aren't behind you.", mr: "तुमची सर्वोत्तम वर्षे मागे नाहीत.", missing: false },
    { key: "hero.subtext", en: "Doctor-led health, fitness and wellness programs...", mr: "", missing: true },
    { key: "nav.programs", en: "Programs", mr: "प्रोग्राम्स", missing: false },
    { key: "cta.assessment", en: "Take Your Health Assessment", mr: "तुमचे आरोग्य मूल्यांकन घ्या", missing: false },
    { key: "footer.disclaimer", en: "Medical Disclaimer: This platform does not provide...", mr: "", missing: true },
    { key: "assessment.intro", en: "Let's understand your body and goals.", mr: "चला तुमचे शरीर आणि उद्दिष्टे समजून घेऊ.", missing: false },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full font-medium">⚠️ 2 missing Marathi translations</span>
        </div>
        <button className="bg-[#6b7c5c] text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-[#5a6b4b] transition-all">{t("Export", "निर्यात करा", lang)}</button>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.key} className={`bg-white rounded-2xl border ${item.missing ? "border-red-200" : "border-[#1c1c1c]/6"} p-4`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-[#1c1c1c]/40 bg-[#f5f5f0] px-2 py-0.5 rounded">{item.key}</span>
              {item.missing && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">⚠️ Missing Marathi</span>}
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#1c1c1c]/40 mb-1">English</label>
                <input defaultValue={item.en} className="w-full border border-[#1c1c1c]/12 rounded-lg px-3 py-2 text-sm bg-[#f5f5f0] outline-none focus:border-[#6b7c5c] focus:bg-white" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#1c1c1c]/40 mb-1" style={{ fontFamily: "var(--font-devanagari)" }}>मराठी</label>
                <input defaultValue={item.mr} placeholder="Translation missing..." className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6b7c5c] ${item.missing ? "border-red-200 bg-red-50 placeholder:text-red-300" : "border-[#1c1c1c]/12 bg-[#f5f5f0] focus:bg-white"}`} style={{ fontFamily: "var(--font-devanagari)" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── SETTINGS ──────────────────────────────────────────── */
function SettingsSection({ lang }: { lang: Lang }) {
  const roles = ["Super Admin", "Doctor", "Manager", "Coach", "Physiotherapist", "Nutritionist", "Support", "Content Manager"];
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-[#1c1c1c]/6 p-5">
        <h3 className="font-semibold text-[#1c1c1c] mb-4">{t("Roles & Permissions", "भूमिका आणि परवानग्या", lang)}</h3>
        <div className="space-y-2">
          {roles.map((role) => (
            <div key={role} className="flex items-center justify-between py-2 border-b border-[#1c1c1c]/5 last:border-0">
              <span className="text-sm font-medium text-[#1c1c1c]">{role}</span>
              <div className="flex gap-2">
                <button className="text-xs border border-[#1c1c1c]/15 rounded-lg px-3 py-1 hover:bg-[#f5f5f0] text-[#1c1c1c]/60">Edit permissions</button>
                <button className="text-xs border border-[#1c1c1c]/15 rounded-lg px-3 py-1 hover:bg-[#f5f5f0] text-[#1c1c1c]/60">Manage users</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-[#1c1c1c]/6 p-5">
        <h3 className="font-semibold text-[#1c1c1c] mb-4">{t("Platform Settings", "प्लॅटफॉर्म सेटिंग्ज", lang)}</h3>
        <div className="space-y-4">
          {[
            { l_en: "Enable Meta Pixel Tracking", l_mr: "Meta Pixel ट्रॅकिंग सक्षम करा", on: true },
            { l_en: "WhatsApp Auto-messages", l_mr: "WhatsApp स्वयं-संदेश", on: true },
            { l_en: "Email Notifications", l_mr: "ईमेल सूचना", on: false },
            { l_en: "Show Marathi by default for Maharashtra users", l_mr: "महाराष्ट्र वापरकर्त्यांसाठी मराठी डिफॉल्ट दाखवा", on: true },
          ].map((s) => (
            <div key={s.l_en} className="flex items-center justify-between">
              <span className="text-sm text-[#1c1c1c]/80" style={lang === "mr" ? { fontFamily: "var(--font-devanagari)" } : {}}>{t(s.l_en, s.l_mr, lang)}</span>
              <div className={`w-10 h-6 rounded-full transition-all cursor-pointer ${s.on ? "bg-[#6b7c5c]" : "bg-[#d4dbc9]"} relative`}>
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${s.on ? "left-5" : "left-1"}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

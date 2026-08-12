"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { AlertTriangle, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Beaker, Boxes, BrainCircuit, Check, ChevronDown, Clock3, Download, FlaskConical, Gauge, LayoutDashboard, Menu, Megaphone, RefreshCw, Search, Settings2, ShieldCheck, Target, TrendingUp, Users, X } from "lucide-react";
import { analyticsSeed } from "@/lib/data";

type Analytics = typeof analyticsSeed;
type AdminSection = "overview" | "products" | "sales" | "customers" | "growth" | "experiments" | "recommendations" | "methodology";

const navigation: { key: AdminSection; label: string; hint: string; icon: typeof LayoutDashboard }[] = [
  { key: "overview", label: "Control room", hint: "আজকের pulse", icon: LayoutDashboard },
  { key: "products", label: "Products & inventory", hint: "Margin, stock, returns", icon: Boxes },
  { key: "sales", label: "Sales & profitability", hint: "Revenue, AOV, forecast", icon: TrendingUp },
  { key: "customers", label: "Customers", hint: "CLV, RFM, cohorts", icon: Users },
  { key: "growth", label: "Growth & promotions", hint: "ROI, coupon, funnel", icon: Megaphone },
  { key: "experiments", label: "Experiments", hint: "A/B results", icon: FlaskConical },
  { key: "recommendations", label: "Recommendations", hint: "Human-reviewed actions", icon: BrainCircuit },
  { key: "methodology", label: "Methodology & health", hint: "Definitions, freshness", icon: ShieldCheck },
];

export function AdminDashboard({ user }: { user: { name?: string | null; email?: string | null } | null }) {
  const [active, setActive] = useState<AdminSection>("overview");
  const [data, setData] = useState<Analytics>(analyticsSeed);
  const [source, setSource] = useState("Seed preview");
  const [sideOpen, setSideOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/analytics/overview", { cache: "no-store" })
      .then(async (response) => response.ok ? await response.json() as { analytics?: Analytics; source?: string } : Promise.reject(new Error("analytics unavailable")))
      .then((payload: { analytics?: Analytics; source?: string }) => { if (payload.analytics) setData(payload.analytics); setSource(payload.source === "d1" ? "Database snapshot" : "Seed preview"); })
      .catch(() => setSource("Seed preview"));
  }, []);

  const item = navigation.find((entry) => entry.key === active)!;
  return (
    <main className="admin-app">
      <aside className={`admin-sidebar ${sideOpen ? "open" : ""}`}>
        <div className="admin-brand"><span className="brand-mark">দ</span><div><strong>DESHIJAAT</strong><small>CONTROL ROOM</small></div><button onClick={() => setSideOpen(false)}><X /></button></div>
        <div className="admin-workspace"><span>DJ</span><div><strong>DESHIJAAT Commerce</strong><small>Synthetic workspace</small></div><ChevronDown /></div>
        <nav>{navigation.map(({ key, label, hint, icon: Icon }) => <button key={key} className={active === key ? "active" : ""} onClick={() => { setActive(key); setSideOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}><Icon /><span><strong>{label}</strong><small>{hint}</small></span>{key === "recommendations" && <b>4</b>}</button>)}</nav>
        <div className="admin-side-foot"><Link href="/"><ArrowLeft /> Storefront</Link><p><ShieldCheck />Owner-only private preview</p></div>
      </aside>
      <section className="admin-main">
        <header className="admin-topbar"><button className="admin-menu" onClick={() => setSideOpen(true)}><Menu /></button><div className="admin-search"><Search /><input placeholder="Search metrics, products, orders…" /></div><div className="admin-top-actions"><button><Download /> <span>Export</span></button><button><Settings2 /></button><span className="admin-avatar">{(user?.name || user?.email || "DA").slice(0, 2).toUpperCase()}</span></div></header>
        <div className="admin-content">
          <div className="admin-page-head"><div><span>{item.label}</span><h1>{pageTitle(active)}</h1><p>{pageSubtitle(active)}</p></div><div className="admin-head-actions"><div className="data-source"><i />{source}</div><button><Clock3 /> {data.meta.range}<ChevronDown /></button><button className="refresh-button" aria-label="Refresh"><RefreshCw /></button></div></div>
          <div className="synthetic-banner"><Beaker /><div><strong>Synthetic analytics demo</strong><p>এই dashboard-এর সব value illustrative; live DESHIJAAT performance নয়। BDT • Asia/Dhaka • Last refresh {data.meta.freshness}</p></div></div>
          {active === "overview" && <Overview data={data} setActive={setActive} />}
          {active === "products" && <ProductsInventory data={data} />}
          {active === "sales" && <SalesProfitability data={data} />}
          {active === "customers" && <Customers data={data} />}
          {active === "growth" && <Growth data={data} />}
          {active === "experiments" && <Experiments />}
          {active === "recommendations" && <Recommendations data={data} />}
          {active === "methodology" && <Methodology data={data} />}
        </div>
      </section>
    </main>
  );
}

function pageTitle(active: AdminSection) {
  const titles: Record<AdminSection, string> = { overview: "ব্যবসার pulse, এক নজরে।", products: "পণ্যের গতি ও মজুত।", sales: "রাজস্ব থেকে প্রকৃত অবদান।", customers: "কারা ফিরছেন, কেন ফিরছেন।", growth: "কোন প্রচার সত্যি কাজ করছে।", experiments: "অনুমান নয়—পরীক্ষার ফল।", recommendations: "ব্যাখ্যাসহ পরবর্তী পদক্ষেপ।", methodology: "সংজ্ঞা পরিষ্কার, data trustworthy." };
  return titles[active];
}
function pageSubtitle(active: AdminSection) {
  const subtitles: Record<AdminSection, string> = { overview: "Settled commerce, inventory, customer এবং growth signal-এর একীভূত staging view।", products: "Best seller, margin, return, batch-aware stock, turnover এবং bundle performance।", sales: "Day/week/month trend, AOV, CAC, CLV, margin ও confidence-banded forecast।", customers: "Contribution CLV, repeat behavior, RFM এবং acquisition cohort retention।", growth: "Coupon, elasticity, campaign ROI, messaging, recovery, funnel ও attribution।", experiments: "Sticky assignment, exposure count, lift, confidence এবং profit guardrail।", recommendations: "Automation নয়—evidence, confidence ও expected impact দেখে মানুষ সিদ্ধান্ত নেবে।", methodology: "প্রতিটি KPI-এর contract, denominator, freshness ও reconciliation status।" };
  return subtitles[active];
}

function Overview({ data, setActive }: { data: Analytics; setActive: (value: AdminSection) => void }) {
  return <>
    <div className="kpi-grid">{data.kpis.map((kpi, index) => <div className="kpi-card" key={kpi.label}><span>{kpi.label}<small>ⓘ</small></span><strong>{kpi.value}</strong><p className={kpi.trend === "up" || kpi.trend === "down-good" ? "positive" : ""}>{kpi.trend === "up" ? <ArrowUpRight /> : <ArrowDownRight />}{kpi.change} <small>আগের ৩০ দিন</small></p>{index === 0 && <i>Settled / delivered basis</i>}</div>)}</div>
    <div className="admin-grid two-one">
      <ChartCard title="রাজস্ব ও গ্রস প্রফিট" subtitle="Daily • synthetic BDT" action="Sales view" onAction={() => setActive("sales")}><ResponsiveContainer width="100%" height={290}><AreaChart data={data.revenue}><defs><linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2b7251" stopOpacity={0.34}/><stop offset="1" stopColor="#2b7251" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="4 6" stroke="#e5e8e4" vertical={false}/><XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={11}/><YAxis tickLine={false} axisLine={false} fontSize={11} tickFormatter={(value) => `৳${value / 1000}k`}/><Tooltip content={<MoneyTooltip />}/><Area type="monotone" dataKey="revenue" stroke="#245b43" strokeWidth={3} fill="url(#revFill)"/><Line type="monotone" dataKey="profit" stroke="#c68c32" strokeWidth={2}/></AreaChart></ResponsiveContainer><div className="chart-legend"><span><i className="green" />Net revenue</span><span><i className="gold" />Gross profit</span><b>Gross profit ৳২,১৫,৫০০</b></div></ChartCard>
      <ChartCard title="Payment mix" subtitle="326 successful orders"><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={data.payments} dataKey="value" nameKey="name" innerRadius={64} outerRadius={92} paddingAngle={3}>{data.payments.map((entry) => <Cell key={entry.name} fill={entry.fill}/>)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="payment-legend">{data.payments.map((entry) => <span key={entry.name}><i style={{ background: entry.fill }} />{entry.name}<b>{Math.round(entry.value / 326 * 100)}%</b></span>)}</div></ChartCard>
    </div>
    <div className="admin-grid one-one">
      <ChartCard title="Commerce funnel" subtitle="Unique sessions • 30 days" action="Growth view" onAction={() => setActive("growth")}><div className="funnel-list">{data.funnel.map((stage, index) => <div key={stage.name}><span>{index + 1}</span><p><strong>{stage.name}</strong><small>{stage.value.toLocaleString("bn-BD")}</small></p><b>{stage.rate}</b><i style={{ width: `${Math.max(16, stage.value / data.funnel[0].value * 100)}%` }}/></div>)}</div></ChartCard>
      <ChartCard title="আজকের action queue" subtitle="Explainable • human reviewed" action="সব recommendation" onAction={() => setActive("recommendations")}><div className="mini-recommendations">{data.recommendations.slice(0, 3).map((rec) => <div key={rec.id}><span className={rec.priority === "জরুরি" ? "urgent" : "opportunity"}>{rec.priority}</span><div><strong>{rec.title}</strong><p>{rec.reason}</p></div><b>{rec.confidence}%</b></div>)}</div></ChartCard>
    </div>
    <div className="admin-grid one-one">
      <ChartCard title="Top product performance" subtitle="Revenue, margin ও stock cover" action="সব পণ্য" onAction={() => setActive("products")}><PerformanceTable rows={data.productPerformance.slice(0, 4)} /></ChartCard>
      <ChartCard title="Stock & margin signals" subtitle="Avoid discounting low stock"><div className="signal-cards"><div className="signal urgent"><AlertTriangle /><span><strong>২টি urgent restock</strong><p>সরিষার তেল ২.৪ দিন · ঘি ২.০ দিন cover</p></span></div><div className="signal good"><Target /><span><strong>১টি promo candidate</strong><p>চুই ঝাল · ৫২.১% margin · ২৭.৩ দিন cover</p></span></div><div className="signal"><Gauge /><span><strong>Inventory turnover ৫.৭×</strong><p>Trailing-90d COGS annualized / average inventory cost</p></span></div></div></ChartCard>
    </div>
  </>;
}

function ProductsInventory({ data }: { data: Analytics }) {
  return <>
    <div className="kpi-grid four"><Metric label="Units sold" value="১,০০৯" note="Top 5 demo products"/><Metric label="Inventory turnover" value="৫.৭×" note="Trailing 90d annualized"/><Metric label="Return rate" value="১.৪%" note="Returned / delivered units"/><Metric label="Bundle attach" value="২২.৭%" note="Eligible orders"/></div>
    <div className="admin-grid two-one"><ChartCard title="Revenue by product" subtitle="Net merchandise revenue"><ResponsiveContainer width="100%" height={320}><BarChart data={data.productPerformance} layout="vertical" margin={{ left: 8 }}><CartesianGrid strokeDasharray="4 6" stroke="#e5e8e4" horizontal={false}/><XAxis type="number" hide/><YAxis dataKey="name" type="category" width={90} tickLine={false} axisLine={false} fontSize={11}/><Tooltip content={<MoneyTooltip />}/><Bar dataKey="revenue" fill="#2d684d" radius={[0, 7, 7, 0]} barSize={18}/></BarChart></ResponsiveContainer></ChartCard><ChartCard title="Low-stock alerts" subtitle="Reorder point OR cover < 7 days"><div className="inventory-alerts"><div><span className="critical">CRITICAL</span><strong>বগুড়ার ঘি</strong><p>১১ units · ২.০ দিন cover</p><button>Review quality →</button></div><div><span className="critical">CRITICAL</span><strong>সরিষার তেল</strong><p>১৮ units · ২.৪ দিন cover</p><button>Create PO →</button></div><div><span className="watch">WATCH</span><strong>কালিজিরা চাল</strong><p>৯২ units · ১০.৩ দিন cover</p><button>Monitor →</button></div></div></ChartCard></div>
    <ChartCard title="Product performance ledger" subtitle="Synthetic demo • sortable production table"><PerformanceTable rows={data.productPerformance} full /></ChartCard>
    <div className="admin-grid one-one"><ChartCard title="Bundle performance" subtitle="পোলাও উৎসব • rice + ghee + gur"><div className="bundle-card"><div><span>৭৪</span><small>Bundle orders</small></div><div><span>৳১,০২,৯০০</span><small>Net revenue</small></div><div><span>৩৮.৪%</span><small>Gross margin</small></div><div><span>+৳২৮৪</span><small>AOV lift</small></div></div><p className="chart-footnote">Attach rate ২২.৭% of eligible orders. Discount cost ও landed cost order-item snapshot থেকে গণনা।</p></ChartCard><ChartCard title="Return / refund watch" subtitle="Actual reason review before action"><div className="return-bars">{data.productPerformance.map((product) => <div key={product.name}><span>{product.name}</span><div><i style={{ width: `${product.returns / 3 * 100}%` }} /></div><b className={product.returns > 2 ? "warn" : ""}>{product.returns}%</b></div>)}</div></ChartCard></div>
  </>;
}

function SalesProfitability({ data }: { data: Analytics }) {
  const forecast = data.revenue.concat([{ day: "১৬ আগ", revenue: 36700, profit: 14300 }, { day: "২০ আগ", revenue: 38200, profit: 14900 }, { day: "২৪ আগ", revenue: 40100, profit: 15600 }]);
  return <>
    <div className="kpi-grid four"><Metric label="Net revenue" value="৳৫,৫২,৬০০" change="+১৪.৮%"/><Metric label="Gross profit" value="৳২,১৫,৫০০" note="39.0% margin"/><Metric label="Net / allocated margin" value="১১.১%" note="৳61,500"/><Metric label="AOV" value="৳১,৬৯৫" change="+৩.১%"/></div>
    <div className="admin-grid two-one"><ChartCard title="Revenue trend & near-term forecast" subtitle="Illustrative until ≥12 months history"><ResponsiveContainer width="100%" height={320}><AreaChart data={forecast}><defs><linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#315f49" stopOpacity={0.3}/><stop offset="1" stopColor="#315f49" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="4 6" stroke="#e5e8e4" vertical={false}/><XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={11}/><YAxis tickFormatter={(value) => `৳${value / 1000}k`} tickLine={false} axisLine={false}/><Tooltip content={<MoneyTooltip />}/><Area dataKey="revenue" type="monotone" stroke="#315f49" strokeWidth={3} fill="url(#forecastFill)"/></AreaChart></ResponsiveContainer><p className="chart-footnote">Next 30d: ৳৬১৩K • 80% interval ৳৫৫৬K–৳৬৭৬K</p></ChartCard><ChartCard title="Unit economics" subtitle="Contribution view"><div className="unit-economics"><div><span>Net revenue</span><strong>৳৫৫২.৬K</strong></div><div className="negative"><span>COGS + return write-off</span><strong>−৳৩৩৭.১K</strong></div><div className="subtotal"><span>Gross profit</span><strong>৳২১৫.৫K</strong></div><div className="negative"><span>Gateway + fulfilment</span><strong>−৳৭৬.০K</strong></div><div className="negative"><span>Marketing + allocated opex</span><strong>−৳৭৮.০K</strong></div><div className="total"><span>Allocated operating profit</span><strong>৳৬১.৫K</strong></div></div></ChartCard></div>
    <div className="admin-grid one-one"><ChartCard title="Acquisition & customer value" subtitle="Delivered customer basis"><div className="value-ratio"><div><small>CAC</small><strong>৳২৯৬</strong><p>Attributable spend / first-time delivered customers</p></div><span>7.2×</span><div><small>Predicted 12m contribution CLV</small><strong>৳২,১৪০</strong><p>Model date 12 Aug • demo confidence</p></div></div></ChartCard><ChartCard title="Repeat purchase" subtitle="Rolling 365-day delivered orders"><div className="repeat-ring"><div style={{ background: `conic-gradient(#2d684d 0 28.4%, #e9ece8 28.4% 100%)` }}><span>২৮.৪%</span></div><p>Customers with ≥2 delivered orders / customers with ≥1 delivered order.</p></div></ChartCard></div>
  </>;
}

function Customers({ data }: { data: Analytics }) {
  return <>
    <div className="kpi-grid four"><Metric label="Customers" value="১,৮৪২" note="RFM eligible"/><Metric label="12m CLV" value="৳২,১৪০" note="Contribution profit"/><Metric label="Repeat rate" value="২৮.৪%" note="Rolling 365d"/><Metric label="CLV : CAC" value="৭.২×" change="Healthy demo"/></div>
    <div className="admin-grid two-one"><ChartCard title="RFM customer segments" subtitle="Weekly snapshot • 365-day window"><ResponsiveContainer width="100%" height={330}><BarChart data={data.rfm}><CartesianGrid strokeDasharray="4 6" vertical={false} stroke="#e5e8e4"/><XAxis dataKey="segment" tickLine={false} axisLine={false} fontSize={10} interval={0} angle={-14} textAnchor="end" height={55}/><YAxis tickLine={false} axisLine={false}/><Tooltip/><Bar dataKey="count" radius={[6, 6, 0, 0]}>{data.rfm.map((entry) => <Cell key={entry.segment} fill={entry.color}/>)}</Bar></BarChart></ResponsiveContainer></ChartCard><ChartCard title="Segment action" subtitle="Consent and product-safety filters apply"><div className="segment-actions"><div><span style={{ background: "#2b6b4c" }} /><p><strong>Champions • 184</strong><small>Early access, no blanket discount</small></p></div><div><span style={{ background: "#c59845" }} /><p><strong>Potential loyalists • 331</strong><small>Second-order bundle education</small></p></div><div><span style={{ background: "#cc7048" }} /><p><strong>At risk • 313</strong><small>Replenishment reminder, consent only</small></p></div><div><span style={{ background: "#a84438" }} /><p><strong>Can’t lose • 93</strong><small>Human-reviewed win-back</small></p></div></div></ChartCard></div>
    <ChartCard title="Acquisition cohort retention" subtitle="% with ≥1 delivered order in month N"><div className="cohort-table"><div className="cohort-row head"><span>Cohort</span><span>Size</span><span>M0</span><span>M1</span><span>M2</span><span>M3</span></div>{data.cohorts.map((row) => <div className="cohort-row" key={row.cohort}><strong>{row.cohort}</strong><span>{row.size}</span>{([row.m0, row.m1, row.m2, row.m3] as (number | null)[]).map((value, index) => <span key={index} className={value == null ? "empty" : ""} style={value != null ? { background: `rgba(44, 108, 77, ${Math.max(.1, value / 100)})` } : undefined}>{value == null ? "—" : `${value}%`}</span>)}</div>)}</div></ChartCard>
  </>;
}

function Growth({ data }: { data: Analytics }) {
  return <>
    <div className="kpi-grid four"><Metric label="Campaign revenue" value="৳২,৭৪,৯০০" change="+১২.৬%"/><Metric label="Blended ROI" value="৪২%" note="Contribution basis"/><Metric label="Coupon usage" value="২৯.৪%" note="96 / 326 orders"/><Metric label="Recovered revenue" value="৳৫৭,৯০০" note="31 orders"/></div>
    <div className="admin-grid two-one"><ChartCard title="Channel revenue & spend" subtitle="Last non-direct • 7d click / 1d view"><ResponsiveContainer width="100%" height={330}><BarChart data={data.channels}><CartesianGrid strokeDasharray="4 6" vertical={false} stroke="#e5e8e4"/><XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} interval={0} angle={-10} height={52}/><YAxis tickFormatter={(value) => `৳${value / 1000}k`} tickLine={false} axisLine={false}/><Tooltip content={<MoneyTooltip />}/><Legend/><Bar dataKey="revenue" name="Attributed revenue" fill="#315f49" radius={[5, 5, 0, 0]}/><Bar dataKey="spend" name="Spend" fill="#c99a48" radius={[5, 5, 0, 0]}/></BarChart></ResponsiveContainer></ChartCard><ChartCard title="Channel ROI" subtitle="Contribution profit before ad spend"><div className="roi-list">{data.channels.map((channel) => <div key={channel.name}><span>{channel.name}</span><div><i className={channel.roi < 0 ? "negative" : ""} style={{ width: `${Math.min(100, Math.max(4, Math.abs(channel.roi) / 2.25))}%` }}/></div><b className={channel.roi < 0 ? "negative-text" : ""}>{channel.roi}%</b></div>)}</div></ChartCard></div>
    <div className="admin-grid one-one"><ChartCard title="Coupons & discount effectiveness" subtitle="Always show the denominator"><div className="coupon-table"><div><span><b>DESHI10</b><small>62 / 480 recipients</small></span><strong>12.9%</strong><span>৳116.8K sales</span><span>৳11.7K cost</span></div><div><span><b>WELCOME5</b><small>34 / 350 recipients</small></span><strong>9.7%</strong><span>৳56.1K sales</span><span>৳2.8K cost</span></div></div><p className="chart-footnote">Elasticity estimate: −১.৪ (low confidence). Incremental contribution—not revenue alone—decides effectiveness.</p></ChartCard><ChartCard title="Abandoned cart recovery" subtitle="Consent-filtered audience"><div className="recovery-flow"><div><strong>৪৮২</strong><span>Abandoned<br/>after 24h</span></div><ArrowRight/><div><strong>২১৬</strong><span>Contactable<br/>+ consented</span></div><ArrowRight/><div className="success"><strong>৩১</strong><span>Recovered<br/>within 7d</span></div></div><p className="chart-footnote">14.4% recovery • purchased, unsubscribed, refunded ও held-product customers suppressed.</p></ChartCard></div>
    <div className="admin-grid one-one"><ChartCard title="Email / SMS / push performance" subtitle="Delivered-message denominators"><div className="message-table"><div><b>Email</b><span>4,800 sent</span><span>96% delivered</span><span>28% open</span><strong>1.8% conv.</strong></div><div><b>SMS</b><span>3,250 sent</span><span>96% delivered</span><span>7.9% click</span><strong>3.1% conv.</strong></div><div><b>Push</b><span>1,400 sent</span><span>80% delivered</span><span>5.2% click</span><strong>1.4% conv.</strong></div></div></ChartCard><ChartCard title="Funnel conversion" subtitle="Unique sessions"><div className="funnel-list compact">{data.funnel.map((stage, index) => <div key={stage.name}><span>{index + 1}</span><p><strong>{stage.name}</strong><small>{stage.value.toLocaleString("bn-BD")}</small></p><b>{stage.rate}</b><i style={{ width: `${Math.max(16, stage.value / data.funnel[0].value * 100)}%` }}/></div>)}</div></ChartCard></div>
  </>;
}

function Experiments() {
  return <>
    <div className="kpi-grid four"><Metric label="Running" value="২" note="Sticky assignment"/><Metric label="Concluded" value="৫" note="Last 90 days"/><Metric label="Exposures" value="৮,১৬০" note="Unique users"/><Metric label="Protected guardrails" value="৩" note="Profit, refund, trace"/></div>
    <div className="experiment-grid"><ExperimentCard status="Keep running" title="Free shipping threshold" hypothesis="৳১,৪৯৯ → ৳১,২৯৯ conversion বাড়াতে পারে, কিন্তু AOV guardrail রক্ষা করতে হবে।" aLabel="৳১,৪৯৯" bLabel="৳১,২৯৯" aValue="3.62%" bValue="4.07%" lift="+12.4% conv." confidence="p = .08" secondary="AOV ৳1,842 → ৳1,716 • revenue/session +4.6%"/><ExperimentCard status="Winner B" title="Bangla provenance CTA" hypothesis="‘উৎস দেখুন’ CTA trace engagement এবং downstream add-to-cart বাড়ায়।" aLabel="Trace দেখুন" bLabel="উৎসের গল্প দেখুন" aValue="17.2%" bValue="22.8%" lift="+32.6% trace clicks" confidence="p = .03" secondary="Add-to-cart 12.1% → 13.0% • profit guardrail passes" winner/></div>
    <ChartCard title="Experiment governance" subtitle="No false winners"><div className="governance-grid"><div><span>01</span><strong>Sticky assignment</strong><p>User-level, server-recorded assignment.</p></div><div><span>02</span><strong>Exposure event</strong><p>Rendered variation ≠ true exposure until logged.</p></div><div><span>03</span><strong>Primary + guardrails</strong><p>Conversion with profit and refund protection.</p></div><div><span>04</span><strong>Confidence rule</strong><p>No winner when p ≥ .05 or interval crosses zero.</p></div></div></ChartCard>
  </>;
}

function Recommendations({ data }: { data: Analytics }) {
  const [states, setStates] = useState<Record<string, string>>({});
  const decide = async (id: string, action: "accept" | "dismiss") => { setStates((current) => ({ ...current, [id]: action })); await fetch(`/api/admin/recommendations/${id}/${action}`, { method: "POST" }).catch(() => null); };
  return <><div className="recommendation-guard"><BrainCircuit /><div><h2>AI-style, not auto-pilot</h2><p>প্রতিটি suggestion explainable inputs, confidence ও expected impact দেখায়। কোনো promotion বা purchase order নিজে থেকে চালু হয় না।</p></div><span>Human approval required</span></div><div className="recommendation-grid">{data.recommendations.map((rec) => <article key={rec.id} className="recommendation-card"><div className="rec-top"><span className={rec.priority === "জরুরি" ? "urgent" : "opportunity"}>{rec.priority}</span><small>{rec.type}</small><b><i style={{ width: `${rec.confidence}%` }}/><span>{rec.confidence}% confidence</span></b></div><h2>{rec.title}</h2><p>{rec.reason}</p><div><small>EXPECTED IMPACT</small><strong>{rec.impact}</strong></div><ul><li><Check />Held, quarantined, expired ও unverified products excluded</li><li><Check />Unsupported “pure / organic / health” claims blocked</li></ul>{states[rec.id] ? <div className="rec-decided"><Check />{states[rec.id] === "accept" ? "Review queue-তে গৃহীত" : "Dismissed with audit event"}</div> : <footer><button onClick={() => void decide(rec.id, "dismiss")}>Dismiss</button><button onClick={() => void decide(rec.id, "accept")}>Review action <ArrowRight /></button></footer>}</article>)}</div></>;
}

function Methodology({ data }: { data: Analytics }) {
  const definitions = [
    ["Net revenue", "Settled/delivered merchandise + earned shipping − discounts − refunds, excluding VAT. COD only when delivered/collected."],
    ["Gross margin", "(Net revenue − landed item cost − return write-off) / net revenue."],
    ["AOV", "Net merchandise revenue / successful orders."],
    ["CAC", "Attributable acquisition spend / first-time delivered customers."],
    ["CLV", "Predicted 12-month contribution profit—not revenue—with model date and confidence."],
    ["Repeat purchase", "Customers with ≥2 delivered orders / customers with ≥1 delivered order in rolling 365 days."],
    ["Inventory turnover", "Trailing-90d COGS annualized / average inventory at cost."],
    ["Coupon redemption", "Unique successful redemptions / unique issued or exposed codes; denominator is always visible."],
    ["Campaign ROI", "(Attributed contribution profit before ad spend − spend) / spend."],
    ["Cohort retention", "% of first-delivered-order month cohort with ≥1 delivered order in month N."],
  ];
  return <><div className="data-health-grid"><div className="health-card good"><Check /><span><strong>Financial reconciliation</strong><p>Payments, delivered COD and refunds match snapshot.</p></span><b>Healthy</b></div><div className="health-card good"><Check /><span><strong>Event coverage</strong><p>97.8% sessions have product-view taxonomy.</p></span><b>Healthy</b></div><div className="health-card warn"><AlertTriangle /><span><strong>Late courier events</strong><p>7 shipment events arrived &gt;24h late.</p></span><b>Watch</b></div><div className="health-card"><Clock3 /><span><strong>Freshness</strong><p>{data.meta.freshness}</p></span><b>Current</b></div></div><ChartCard title="Metric dictionary" subtitle="One contract, every dashboard"><div className="definition-list">{definitions.map(([term, definition]) => <details key={term}><summary><strong>{term}</strong><ChevronDown /></summary><p>{definition}</p></details>)}</div></ChartCard><div className="admin-grid one-one"><ChartCard title="Financial source of truth" subtitle="Server events only"><div className="source-truth"><span>Order placed</span><ArrowRight/><span>Payment settled / COD delivered</span><ArrowRight/><span>Refund reconciled</span><ArrowRight/><strong>Metric daily</strong></div><p className="chart-footnote">Browser events support funnel analysis; they never override price, payment, order or refund facts.</p></ChartCard><ChartCard title="Data protection" subtitle="PII isolated from analytics"><div className="signal-cards"><div className="signal good"><ShieldCheck/><span><strong>Consent snapshots</strong><p>Email/SMS/push eligibility is time-aware.</p></span></div><div className="signal"><ShieldCheck/><span><strong>Role-gated exports</strong><p>Audience export expires and creates an audit log.</p></span></div><div className="signal"><ShieldCheck/><span><strong>Public trace privacy</strong><p>Approved fields only; no internal supplier data.</p></span></div></div></ChartCard></div></>;
}

function ChartCard({ title, subtitle, children, action, onAction }: { title: string; subtitle: string; children: React.ReactNode; action?: string; onAction?: () => void }) {
  return <section className="chart-card"><header><div><h2>{title}</h2><p>{subtitle}</p></div>{action && <button onClick={onAction}>{action}<ArrowRight /></button>}</header>{children}</section>;
}
function Metric({ label, value, note, change }: { label: string; value: string; note?: string; change?: string }) { return <div className="kpi-card"><span>{label}<small>ⓘ</small></span><strong>{value}</strong>{change && <p className="positive"><ArrowUpRight />{change}</p>}{note && <p className="neutral-note">{note}</p>}</div>; }
function MoneyTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color?: string }[]; label?: string }) { if (!active || !payload?.length) return null; return <div className="chart-tooltip"><strong>{label}</strong>{payload.map((entry) => <span key={entry.name}><i style={{ background: entry.color }} />{entry.name}: ৳{entry.value.toLocaleString()}</span>)}</div>; }
function PerformanceTable({ rows, full = false }: { rows: Analytics["productPerformance"]; full?: boolean }) { return <div className="performance-table"><div className="performance-row head"><span>পণ্য</span><span>Units</span><span>Revenue</span><span>Margin</span><span>Stock</span>{full && <><span>Cover</span><span>Returns</span></>}</div>{rows.map((row) => <div className="performance-row" key={row.name}><strong>{row.name}</strong><span>{row.units}</span><span>৳{(row.revenue / 1000).toFixed(1)}K</span><span>{row.margin}%</span><span className={row.cover < 7 ? "low" : ""}>{row.stock}</span>{full && <><span className={row.cover < 7 ? "low" : ""}>{row.cover}d</span><span className={row.returns > 2 ? "low" : ""}>{row.returns}%</span></>}</div>)}</div>; }
function ExperimentCard({ status, title, hypothesis, aLabel, bLabel, aValue, bValue, lift, confidence, secondary, winner = false }: { status: string; title: string; hypothesis: string; aLabel: string; bLabel: string; aValue: string; bValue: string; lift: string; confidence: string; secondary: string; winner?: boolean }) { return <article className="experiment-card"><div className="experiment-top"><span className={winner ? "winner" : "running"}>{winner ? <Check /> : <Clock3 />}{status}</span><small>Sticky user assignment</small></div><h2>{title}</h2><p>{hypothesis}</p><div className="variant-grid"><div><small>CONTROL A</small><strong>{aLabel}</strong><b>{aValue}</b></div><div className={winner ? "winner-box" : ""}><small>VARIANT B</small><strong>{bLabel}</strong><b>{bValue}</b></div></div><div className="experiment-result"><span><small>PRIMARY LIFT</small><strong>{lift}</strong></span><span><small>CONFIDENCE</small><strong>{confidence}</strong></span></div><footer><Beaker />{secondary}</footer></article>; }

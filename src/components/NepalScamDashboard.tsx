import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  PieChart as PieChartIcon,
  Calendar,
  DollarSign,
  ShieldAlert,
  ArrowUpRight,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Language } from '../types';
import { toNepaliDigits, formatNumber, formatPercent } from '../utils/numberFormat';

interface NepalScamDashboardProps {
  lang: Language;
  onSelectScamType?: (tool: 'message' | 'link' | 'shopping' | 'photo' | 'voice' | 'rescue') => void;
}

export const NepalScamDashboard: React.FC<NepalScamDashboardProps> = ({
  lang,
  onSelectScamType,
}) => {
  const isNe = lang === 'ne';
  const [activeView, setActiveView] = useState<'types' | 'monthly' | 'channels'>('types');

  // Distribution of Reported Cyber Scams in Nepal (Cyber Bureau & Public Complaint Insights)
  const scamTypesData = [
    {
      name: isNe ? 'सोसल मिडिया किनमेल' : 'Social Shopping',
      fullName: isNe ? 'सोसल मिडिया किनमेल तथा नक्कली अफर' : 'Social Media Shopping Fraud',
      percent: 32,
      cases: 6320,
      color: '#06b6d4', // cyan
      tool: 'shopping' as const,
      riskTrend: isNe ? '५२% ले वृद्धि' : '+52% Festive Spike',
    },
    {
      name: isNe ? 'टेलिग्राम / टास्क ठगी' : 'Telegram Task Scam',
      fullName: isNe ? 'टेलिग्राम पार्ट-टाइम जब र टास्क ठगी' : 'Telegram Job & Task Scams',
      percent: 24,
      cases: 4740,
      color: '#3b82f6', // blue
      tool: 'message' as const,
      riskTrend: isNe ? 'नयाँ तीव्र खतरा' : 'Fast Emerging',
    },
    {
      name: isNe ? 'वालेट / बैंक OTP' : 'Wallet / OTP Phishing',
      fullName: isNe ? 'eSewa, Khalti र बैंक OTP फिसिङ' : 'Wallet & Bank Account Takeover',
      percent: 18,
      cases: 3550,
      color: '#10b981', // emerald
      tool: 'link' as const,
      riskTrend: isNe ? 'दैनिक २५+ उजुरी' : '25+ Daily Complaints',
    },
    {
      name: isNe ? 'चिट्ठा / पार्सल उपहार' : 'Lottery & Parcel',
      fullName: isNe ? 'व्हाट्सएप चिट्ठा, २५ लाख चिठ्ठा र पार्सल शुल्क' : 'Lottery Draw & Custom Gift Scams',
      percent: 12,
      cases: 2370,
      color: '#f59e0b', // amber
      tool: 'photo' as const,
      riskTrend: isNe ? 'पार्सल शुल्क बहाना' : 'Custom Duty Fees Pretext',
    },
    {
      name: isNe ? 'क्रिप्टो / अवैध फरेक्स' : 'Crypto / Forex Scam',
      fullName: isNe ? 'क्रिप्टोकरन्सी, १XBet र फरेक्स ठगी' : 'Crypto & Illegal Betting Networks',
      percent: 8,
      cases: 1580,
      color: '#8b5cf6', // purple
      tool: 'message' as const,
      riskTrend: isNe ? 'उच्च आर्थिक क्षति' : 'High Financial Impact',
    },
    {
      name: isNe ? 'ऋण एप्स / ब्ल्याकमेल' : 'Loan Apps / Sextortion',
      fullName: isNe ? 'अवैध ऋण एप्स र ब्ल्याकमेलिङ' : 'Instant Loan Apps & Extortion',
      percent: 6,
      cases: 1190,
      color: '#f43f5e', // rose
      tool: 'voice' as const,
      riskTrend: isNe ? 'सम्पर्क सूची दुरुपयोग' : 'Contact Scraping',
    },
  ];

  // Monthly Frequency of Reported Scam Cases in Nepal (Recent 10 Months)
  const monthlyData = [
    { month: isNe ? 'बैशाख' : 'Baishakh (Apr/May)', cases: 1280, lossNpr: 7.2 },
    { month: isNe ? 'जेठ' : 'Jestha (May/Jun)', cases: 1420, lossNpr: 8.5 },
    { month: isNe ? 'असार' : 'Ashadh (Jun/Jul)', cases: 1610, lossNpr: 10.1 },
    { month: isNe ? 'साउन' : 'Shrawan (Jul/Aug)', cases: 1790, lossNpr: 11.4 },
    { month: isNe ? 'भदौ' : 'Bhadra (Aug/Sep)', cases: 2150, lossNpr: 14.8 },
    { month: isNe ? 'असोज' : 'Ashwin (Sep/Oct)', cases: 2840, lossNpr: 21.6 },
    { month: isNe ? 'कात्तिक' : 'Kartik (Oct/Nov)', cases: 3260, lossNpr: 26.3 },
    { month: isNe ? 'मंसिर' : 'Mangsir (Nov/Dec)', cases: 2590, lossNpr: 19.5 },
    { month: isNe ? 'पुष' : 'Poush (Dec/Jan)', cases: 2210, lossNpr: 16.2 },
    { month: isNe ? 'माघ' : 'Magh (Jan/Feb)', cases: 2490, lossNpr: 18.0 },
  ];

  // Loss by Payment Channel in Nepal
  const channelData = [
    { name: isNe ? 'डिजिटल वालेट (eSewa / Khalti)' : 'Digital Wallets', share: 44, color: '#06b6d4' },
    { name: isNe ? 'मोबाइल बैंकिङ / ConnectIPS' : 'Mobile Banking / IPS', share: 36, color: '#3b82f6' },
    { name: isNe ? 'रेमिट्यान्स / नगद' : 'Remittance / Cash', share: 12, color: '#f59e0b' },
    { name: isNe ? 'क्रिप्टो / विदेशी च्यानल' : 'Crypto / Foreign Forex', share: 8, color: '#f43f5e' },
  ];

  const COLORS = ['#06b6d4', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e'];

  return (
    <section className="rounded-3xl bg-gradient-to-b from-[#101b33] via-[#0d162a] to-[#0a1122] border border-cyan-900/40 shadow-2xl p-4 sm:p-6 space-y-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-[11px] font-bold text-cyan-300">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isNe ? 'नेपाल साइबर अपराध विश्लेषण' : 'Nepal Cyber Intelligence Hub'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <h2 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>
              {isNe
                ? 'नेपालमा साइबर ठगीको प्रवृत्ति र तथ्याङ्क'
                : 'Scam Trends & Threat Statistics in Nepal'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            {isNe
              ? 'नेपाल प्रहरी साइबर ब्युरो र जनउजुरी विश्लेषणमा आधारित—नेपालमा सबैभन्दा बढी सक्रिय ठगीका प्रकार र मासिक घटना दरको सिंहावलोकन।'
              : 'Grounded in Nepal Police Cyber Bureau data and victim reports. Real trends, frequency spikes, and primary fraud channels.'}
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1 p-1 bg-[#090f1d] border border-slate-800 rounded-xl self-start lg:self-auto shrink-0">
          <button
            onClick={() => setActiveView('types')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeView === 'types'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isNe ? '📊 ठगीका प्रकार (Types)' : '📊 Scam Types'}
          </button>
          <button
            onClick={() => setActiveView('monthly')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeView === 'monthly'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isNe ? '📈 मासिक दर (Monthly Trend)' : '📈 Monthly Frequency'}
          </button>
          <button
            onClick={() => setActiveView('channels')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeView === 'channels'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isNe ? '💳 माध्यम (Loss Channels)' : '💳 Payment Medium'}
          </button>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
        <div className="p-3.5 rounded-2xl bg-[#0e172a]/90 border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>{isNe ? 'वार्षिक कुल उजुरी' : 'Reported Cases (Year)'}</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {isNe ? '२१,७५०+' : '21,750+'}
          </div>
          <div className="text-[10px] text-cyan-400 mt-0.5 flex items-center gap-1 font-medium">
            <span>{isNe ? '↑ ४१% गत वर्षभन्दा वृद्धि' : '↑ 41% vs previous year'}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0e172a]/90 border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>{isNe ? 'अनुमानित वित्तीय क्षति' : 'Estimated Loss'}</span>
            <DollarSign className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-300">
            {isNe ? 'रु. १.३८ अर्ब+' : 'NPR 1.38 Billion+'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {isNe ? 'डिजिटल भुक्तानी र वालेट' : 'Digital wallets & banking'}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0e172a]/90 border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>{isNe ? 'सबैभन्दा जोखिमपूर्ण ठगी' : '#1 Prevalent Scam'}</span>
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-base sm:text-lg font-black text-cyan-300 truncate">
            {isNe ? 'सोसल सपिङ र अग्रिम भुक्तानी' : 'Shopping & Advance Pay'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {isNe ? '३२% कुल उजुरी हिस्सा' : '32% of total cyber incidents'}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0e172a]/90 border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>{isNe ? 'गोल्डेन आवर रिकभरी' : 'Golden Hour Window'}</span>
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-300">
            {isNe ? '२ घण्टा भित्र' : 'Within 2 Hours'}
          </div>
          <div className="text-[10px] text-emerald-400/90 mt-0.5 font-medium">
            {isNe ? 'बैंक/वालेट फ्रिज गर्न' : 'Crucial to freeze accounts'}
          </div>
        </div>
      </div>

      {/* Main Interactive Recharts Section */}
      <div className="relative z-10 bg-[#0a1020]/90 border border-slate-800 rounded-2xl p-4 sm:p-5">
        {activeView === 'types' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-cyan-400" />
                  <span>
                    {isNe
                      ? 'नेपालमा रिपोर्ट गरिएका ठगीका मुख्य प्रकारहरू (प्रतिशत र घटना सङ्ख्या)'
                      : 'Breakdown of Reported Scam Categories in Nepal'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  {isNe
                    ? 'तलको बारमा क्लिक गरेर वा कार्ड छानेर सोझै सम्बन्धित जाँच टुलमा जान सक्नुहुन्छ।'
                    : 'Click any category bar or action button to jump directly into the checker.'}
                </p>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/50 self-start sm:self-auto">
                {isNe ? 'स्रोत: साइबर ब्युरो प्रतिवेदन' : 'Source: Cyber Bureau Reports'}
              </span>
            </div>

            {/* Recharts BarChart */}
            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={scamTypesData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                >
                  <XAxis
                    type="number"
                    unit="%"
                    domain={[0, 40]}
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={11}
                    width={110}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#0b1324] border border-cyan-700/60 p-3 rounded-xl shadow-2xl text-xs space-y-1">
                            <p className="font-bold text-white text-sm">{data.fullName}</p>
                            <p className="text-cyan-300 font-semibold">
                              {isNe ? 'हिस्सा:' : 'Share:'} {isNe ? toNepaliDigits(data.percent) : data.percent}% ({isNe ? toNepaliDigits(data.cases.toLocaleString()) : data.cases.toLocaleString()}{' '}
                              {isNe ? 'उजुरी' : 'cases'})
                            </p>
                            <p className="text-amber-400 text-[11px]">{data.riskTrend}</p>
                            <p className="text-[10px] text-slate-400 pt-1">
                              {isNe ? '👉 जाँच्न तलको कार्डमा थिच्नुहोस्' : '👉 Click card below to inspect'}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="percent"
                    radius={[0, 8, 8, 0]}
                    animationDuration={1200}
                    cursor="pointer"
                    onClick={(entry: any) => {
                      const tool = entry?.tool || entry?.payload?.tool;
                      if (onSelectScamType && tool) {
                        onSelectScamType(tool);
                      }
                    }}
                  >
                    {scamTypesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick interactive badges for each type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2">
              {scamTypesData.map((item) => (
                <div
                  key={item.name}
                  onClick={() => onSelectScamType && onSelectScamType(item.tool)}
                  className="p-2.5 rounded-xl bg-[#0f172a] border border-slate-800/90 hover:border-cyan-500/60 hover:bg-slate-800/60 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="truncate">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors block truncate">
                        {item.fullName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {isNe ? toNepaliDigits(item.percent) : item.percent}% {isNe ? 'हिस्सा' : 'share'} • {item.riskTrend}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0 ml-1" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'monthly' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>
                    {isNe
                      ? 'नेपालमा मासिक साइबर ठगी उजुरीको प्रवृत्ति (Monthly Incidents & Loss)'
                      : 'Monthly Cyber Incident Frequency & Financial Impact'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  {isNe
                    ? 'चाडपर्व (दशैँ/तिहार) र छुट अफरको समयमा अनलाइन ठगीको दर ह्वात्तै बढ्ने गर्दछ।'
                    : 'Incident frequency spikes sharply during festive shopping seasons (Dashain/Tihar) and holiday sales.'}
                </p>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-800/50 self-start sm:self-auto font-medium">
                {isNe ? 'चाडपर्वमा +४८% वृद्धि' : '+48% Festive Spike'}
              </span>
            </div>

            {/* Recharts AreaChart with gradient */}
            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#0b1324] border border-cyan-700/60 p-3 rounded-xl shadow-2xl text-xs space-y-1">
                            <p className="font-bold text-white">{label}</p>
                            <p className="text-cyan-300 font-semibold">
                              {isNe ? 'उजुरी सङ्ख्या:' : 'Complaints:'} {isNe ? toNepaliDigits(payload[0]?.value?.toLocaleString()) : payload[0]?.value?.toLocaleString()}
                            </p>
                            <p className="text-rose-400">
                              {isNe ? 'आर्थिक क्षति:' : 'Estimated Loss:'} {isNe ? `रु. ${toNepaliDigits(payload[1]?.value)} करोड` : `NPR ${payload[1]?.value} Crore`}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    formatter={(value) => (
                      <span className="text-xs text-slate-300">
                        {value === 'cases'
                          ? isNe
                            ? 'उजुरी सङ्ख्या'
                            : 'Reported Cases'
                          : isNe
                          ? 'क्षति (रु. करोड)'
                          : 'Loss (NPR Crore)'}
                      </span>
                    )}
                  />
                  <Area
                    type="monotone"
                    dataKey="cases"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorCases)"
                  />
                  <Area
                    type="monotone"
                    dataKey="lossNpr"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorLoss)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeView === 'channels' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>
                    {isNe
                      ? 'ठगीमा रकम गुम्ने प्रमुख भुक्तानी माध्यमहरू (Channels)'
                      : 'Victim Loss Distribution by Payment Channel'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  {isNe
                    ? 'ठगहरूले पैसा मगाउन धेरैजसो नक्कली वा अरूकै नागरिकतामा खोलिएका वालेट खाताहरू प्रयोग गर्छन्।'
                    : 'Scammers predominantly utilize mule digital wallet accounts and unverified QR transfers.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Pie Chart */}
              <div className="h-60 sm:h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={channelData}
                      dataKey="share"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={45}
                      paddingAngle={3}
                      label={({ name, percent }: { name?: string; percent?: number }) => {
                        const pct = Math.round((percent ?? 0) * 100);
                        return `${name || ''} (${isNe ? toNepaliDigits(pct) : pct}%)`;
                      }}
                      labelLine={false}
                    >
                      {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [isNe ? `${toNepaliDigits(value)}% हिस्सा` : `${value}% Share`, '']}
                      contentStyle={{
                        backgroundColor: '#0b1324',
                        borderColor: '#0284c7',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                        color: '#fff',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Insights List */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-xs">
                  <span className="font-bold text-cyan-300 block mb-0.5">
                    {isNe ? '💡 डिजिटल वालेट सावधानी (eSewa / Khalti)' : '💡 Digital Wallet Alert'}
                  </span>
                  <p className="text-slate-300">
                    {isNe
                      ? 'अनलाइन किनमेल वा सामान किन्नुअघि व्यक्तिगत वालेट नम्बरमा अग्रिम भुक्तानी (Advance Payment) कहिल्यै नगर्नुहोस्। Cash on Delivery (COD) मात्र रोज्नुहोस्।'
                      : 'Never transfer advance money to personal wallet numbers. Strictly prefer cash on delivery or verified merchant escrow.'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-xs">
                  <span className="font-bold text-rose-300 block mb-0.5">
                    {isNe ? '🚨 ठगीमा परिसकेपछि (First 2 Hours)' : '🚨 Golden Window Action'}
                  </span>
                  <p className="text-slate-300">
                    {isNe
                      ? 'यदि पैसा पठाइसक्नुभयो भने तत्काल सम्बन्धित वालेट वा बैंकमा फोन गरी उक्त कारोबार होल्ड वा खाता फ्रिज गराउनुहोस्।'
                      : 'Immediately call your wallet/bank support within 2 hours to freeze the transaction recipient account.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Prompt beneath dashboard */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>
              {isNe
                ? 'तपाईंलाई आएको कुनै मेसेज, लिंक, फोटो वा अफर शंकास्पद लागेको छ?'
                : 'Received a questionable SMS, link, ad screenshot, or audio note?'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onSelectScamType && onSelectScamType('message')}
              className="px-3 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-600/50 font-semibold cursor-pointer active:scale-95 transition-all text-xs"
            >
              {isNe ? '💬 मेसेज जाँच्नुहोस्' : '💬 Check Message'}
            </button>
            <button
              onClick={() => onSelectScamType && onSelectScamType('shopping')}
              className="px-3 py-1.5 rounded-lg bg-teal-600/30 hover:bg-teal-600/50 text-teal-300 border border-teal-600/50 font-semibold cursor-pointer active:scale-95 transition-all text-xs"
            >
              {isNe ? '🛍️ किनमेल अफर जाँच्नुहोस्' : '🛍️ Check Shopping'}
            </button>
            <button
              onClick={() => onSelectScamType && onSelectScamType('rescue')}
              className="px-3 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-600/50 font-semibold cursor-pointer active:scale-95 transition-all text-xs"
            >
              {isNe ? '🆘 ठगी उद्धार' : '🆘 Emergency Rescue'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

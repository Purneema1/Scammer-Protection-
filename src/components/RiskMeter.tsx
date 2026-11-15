import React from 'react';
import { RiskLevel } from '../types';
import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';
import { toNepaliDigits } from '../utils/numberFormat';

interface RiskMeterProps {
  level: RiskLevel;
  score: number;
  lang: 'ne' | 'en';
  compact?: boolean;
}

function getArcPoint(cx: number, cy: number, r: number, percent: number) {
  const clamped = Math.max(0, Math.min(100, percent));
  const angleRad = Math.PI * (1 - clamped / 100);
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy - r * Math.sin(angleRad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startPercent: number,
  endPercent: number
) {
  const start = getArcPoint(cx, cy, r, startPercent);
  const end = getArcPoint(cx, cy, r, endPercent);
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 0 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({
  level,
  score,
  lang,
  compact = false,
}) => {
  const isNe = lang === 'ne';
  const clampedScore = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));

  const config = {
    HIGH_RISK: {
      bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-600/50',
      badgeBg:
        'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-500/20 dark:text-rose-200 dark:border-rose-500/40',
      icon: ShieldAlert,
      iconColor: 'text-rose-600 dark:text-rose-400',
      scoreText: 'text-rose-700 dark:text-rose-400',
      accentHex: '#f43f5e',
      trackActiveHex: '#e11d48',
      barColor: 'from-rose-600 to-red-500',
      title: isNe ? 'उच्च जोखिम (High Risk)' : 'High Risk (Likely Scam)',
      shortZone: isNe ? 'खतरा स्तर (६०–१००)' : 'Danger Zone (60–100)',
      subtitle: isNe
        ? 'ठगीसँग मिल्ने बलिया संकेतहरू भेटिएका छन्'
        : 'Strong deceptive indicators detected',
    },
    CAUTION: {
      bg: 'bg-amber-50 dark:bg-amber-950/35 border-amber-200 dark:border-amber-600/50',
      badgeBg:
        'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-500/20 dark:text-amber-200 dark:border-amber-500/40',
      icon: AlertTriangle,
      iconColor: 'text-amber-600 dark:text-amber-400',
      scoreText: 'text-amber-700 dark:text-amber-400',
      accentHex: '#f59e0b',
      trackActiveHex: '#d97706',
      barColor: 'from-amber-600 to-yellow-500',
      title: isNe ? 'सावधानी आवश्यक (Caution)' : 'Caution Required',
      shortZone: isNe ? 'सावधान स्तर (३०–५९)' : 'Caution Zone (30–59)',
      subtitle: isNe
        ? 'केही शंकास्पद ढाँचाहरू देखिएका छन्'
        : 'Suspicious elements found; verify source',
    },
    LOW_RISK: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/35 border-emerald-200 dark:border-emerald-600/50',
      badgeBg:
        'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-200 dark:border-emerald-500/40',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      scoreText: 'text-emerald-700 dark:text-emerald-400',
      accentHex: '#10b981',
      trackActiveHex: '#059669',
      barColor: 'from-emerald-600 to-teal-400',
      title: isNe ? 'कम जोखिम (Low Risk)' : 'Low Risk Detected',
      shortZone: isNe ? 'सुरक्षित स्तर (०–२९)' : 'Low Risk Zone (0–29)',
      subtitle: isNe
        ? 'कुनै स्पष्ट ठगी संकेत देखिएन (सतर्क भने रहनुहोस्)'
        : 'No overt threat patterns found in scan',
    },
  }[level];

  const Icon = config.icon;

  // Compact gauge bar for narrow side panels (PhotoChecker / VoiceChecker)
  if (compact) {
    const cx = 80;
    const cy = 72;
    const r = 56;
    const arcLen = Math.PI * r;
    const dashOffset = arcLen * (1 - clampedScore / 100);
    const marker = getArcPoint(cx, cy, r, clampedScore);

    return (
      <div className="mt-2 space-y-1.5">
        <div className="w-[140px] mx-auto">
          <svg
            viewBox="0 0 160 86"
            className="w-full h-auto overflow-visible"
            role="img"
            aria-label={`Scam Risk Score ${clampedScore} out of 100`}
          >
            <path
              d={describeArc(cx, cy, r, 0, 100)}
              fill="none"
              stroke="currentColor"
              className="text-slate-300 dark:text-slate-800"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d={describeArc(cx, cy, r, 0, 100)}
              fill="none"
              stroke={config.accentHex}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={arcLen}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 600ms cubic-bezier(0.16, 1, 0.3, 1)' }}
            />
            <circle
              cx={marker.x}
              cy={marker.y}
              r="5.5"
              fill="#ffffff"
              stroke={config.accentHex}
              strokeWidth="3"
            />
            <text
              x={cx}
              y={cy - 10}
              textAnchor="middle"
              className="fill-slate-950 dark:fill-white font-black text-[18px] tabular-nums"
              style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
            >
              {isNe ? toNepaliDigits(clampedScore) : clampedScore}/100
            </text>
          </svg>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${config.barColor} transition-all duration-700`}
            style={{ width: `${Math.max(4, clampedScore)}%` }}
          />
        </div>
      </div>
    );
  }

  // Full 0–100 Scam Risk Score Gauge for MessageChecker, LinkChecker, ShoppingChecker
  const cx = 120;
  const cy = 112;
  const r = 84;
  const arcLen = Math.PI * r;
  const dashOffset = arcLen * (1 - clampedScore / 100);
  const marker = getArcPoint(cx, cy, r, clampedScore);

  const bands = [
    {
      id: 'LOW_RISK',
      rangeNe: '०–२९',
      rangeEn: '0–29',
      labelNe: 'कम जोखिम',
      labelEn: 'Safe / Low',
      active: level === 'LOW_RISK',
      activeCls:
        'bg-emerald-100 dark:bg-emerald-950/70 border-emerald-400 dark:border-emerald-500/70 text-emerald-950 dark:text-emerald-200',
    },
    {
      id: 'CAUTION',
      rangeNe: '३०–५९',
      rangeEn: '30–59',
      labelNe: 'सावधानी',
      labelEn: 'Caution',
      active: level === 'CAUTION',
      activeCls:
        'bg-amber-100 dark:bg-amber-950/70 border-amber-400 dark:border-amber-500/70 text-amber-950 dark:text-amber-200',
    },
    {
      id: 'HIGH_RISK',
      rangeNe: '६०–१००',
      rangeEn: '60–100',
      labelNe: 'उच्च खतरा',
      labelEn: 'High Risk',
      active: level === 'HIGH_RISK',
      activeCls:
        'bg-rose-100 dark:bg-rose-950/70 border-rose-400 dark:border-rose-500/70 text-rose-950 dark:text-rose-200',
    },
  ];

  return (
    <div className={`p-4 sm:p-6 rounded-2xl border ${config.bg} shadow-md transition-all`}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left: Visual 0–100 Semi-Circular Scam Risk Score Gauge */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white/90 dark:bg-[#0b1220]/90 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-extrabold tracking-wide text-slate-700 dark:text-slate-300 mb-1">
            {isNe ? 'ठगी जोखिम स्कोर (Scam Risk Score)' : 'Scam Risk Score (0–100 Gauge)'}
          </span>

          <div className="w-full max-w-[230px]">
            <svg
              viewBox="0 0 240 136"
              className="w-full h-auto overflow-visible"
              role="img"
              aria-label={`Scam Risk Score: ${clampedScore} out of 100 (${config.title})`}
            >
              {/* Subtle Zone Background Segments (Safe 0-29, Caution 30-59, High 60-100) */}
              <path
                d={describeArc(cx, cy, r, 0, 28)}
                fill="none"
                stroke="#10b981"
                strokeOpacity="0.22"
                strokeWidth="15"
                strokeLinecap="round"
              />
              <path
                d={describeArc(cx, cy, r, 31, 58)}
                fill="none"
                stroke="#f59e0b"
                strokeOpacity="0.22"
                strokeWidth="15"
                strokeLinecap="round"
              />
              <path
                d={describeArc(cx, cy, r, 61, 100)}
                fill="none"
                stroke="#f43f5e"
                strokeOpacity="0.22"
                strokeWidth="15"
                strokeLinecap="round"
              />

              {/* Active Risk Progress Arc */}
              <path
                d={describeArc(cx, cy, r, 0, 100)}
                fill="none"
                stroke={config.accentHex}
                strokeWidth="15"
                strokeLinecap="round"
                strokeDasharray={arcLen}
                strokeDashoffset={dashOffset}
                style={{
                  transition: 'stroke-dashoffset 700ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />

              {/* Gauge Marker Indicator */}
              <circle
                cx={marker.x}
                cy={marker.y}
                r="8"
                fill="#ffffff"
                stroke={config.trackActiveHex}
                strokeWidth="4"
                style={{ transition: 'all 700ms cubic-bezier(0.16, 1, 0.3, 1)' }}
              />

              {/* Center Score Readout */}
              <text
                x={cx}
                y={cy - 22}
                textAnchor="middle"
                fill="currentColor"
                className={`${config.scoreText} font-black text-[36px] tabular-nums`}
                style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
              >
                {isNe ? toNepaliDigits(clampedScore) : clampedScore}
              </text>
              <text
                x={cx}
                y={cy - 2}
                textAnchor="middle"
                fill="currentColor"
                className="text-slate-600 dark:text-slate-400 font-bold text-[12px] tabular-nums"
              >
                {isNe ? '/ १०० अंक' : 'out of 100'}
              </text>

              {/* Base Scale Anchors */}
              <text
                x={cx - r}
                y={cy + 19}
                textAnchor="middle"
                fill="currentColor"
                className="text-emerald-700 dark:text-emerald-400 font-bold text-[11px] tabular-nums"
              >
                {isNe ? '०' : '0'}
              </text>
              <text
                x={cx}
                y={cy - r - 14}
                textAnchor="middle"
                fill="currentColor"
                className="text-amber-700 dark:text-amber-400 font-bold text-[11px] tabular-nums"
              >
                {isNe ? '५०' : '50'}
              </text>
              <text
                x={cx + r}
                y={cy + 19}
                textAnchor="middle"
                fill="currentColor"
                className="text-rose-700 dark:text-rose-400 font-bold text-[11px] tabular-nums"
              >
                {isNe ? '१००' : '100'}
              </text>
            </svg>
          </div>
        </div>

        {/* Right: Risk Verdict, Threshold Scale & Linear Bar */}
        <div className="md:col-span-7 flex flex-col justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/70 shadow-xs shrink-0">
              <Icon className={`w-7 h-7 ${config.iconColor}`} />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${config.badgeBg}`}
                >
                  {config.title}
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 tabular-nums">
                  {config.shortZone}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
                {config.subtitle}
              </p>
            </div>
          </div>

          {/* 3-Band Risk Threshold Meter */}
          <div className="grid grid-cols-3 gap-2">
            {bands.map((band) => (
              <div
                key={band.id}
                className={`p-2 rounded-xl border text-center transition-all ${
                  band.active
                    ? `${band.activeCls} shadow-xs font-extrabold`
                    : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 opacity-80'
                }`}
              >
                <span className="text-[11px] font-mono tabular-nums block font-bold">
                  {isNe ? band.rangeNe : band.rangeEn}
                </span>
                <span className="text-[11px] block truncate">
                  {isNe ? band.labelNe : band.labelEn}
                </span>
              </div>
            ))}
          </div>

          {/* Linear Progress Bar Reinforcing Exact Score */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
              <span>{isNe ? 'सुरक्षित (०%)' : 'Safe (0%)'}</span>
              <span className="font-mono tabular-nums">
                {isNe ? `स्कोर: ${toNepaliDigits(clampedScore)}/१००` : `Score: ${clampedScore}/100`}
              </span>
              <span>{isNe ? 'अत्यधिक खतरा (१००%)' : 'Critical (100%)'}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-900/80 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-300 dark:border-slate-800">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${config.barColor} transition-all duration-700 ease-out`}
                style={{ width: `${Math.max(5, clampedScore)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

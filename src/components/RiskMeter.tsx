import React from 'react';
import { RiskLevel } from '../types';
import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';
import { toNepaliDigits } from '../utils/numberFormat';

interface RiskMeterProps {
  level: RiskLevel;
  score: number;
  lang: 'ne' | 'en';
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ level, score, lang }) => {
  const isNe = lang === 'ne';

  const config = {
    HIGH_RISK: {
      bg: 'bg-rose-950/50 border-rose-600/60 text-rose-200',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      icon: ShieldAlert,
      iconColor: 'text-rose-400',
      barColor: 'from-rose-600 to-red-500',
      title: isNe ? 'उच्च जोखिम (High Risk)' : 'High Risk (Likely Scam)',
      subtitle: isNe
        ? 'ठगीसँग मिल्ने बलिया संकेतहरू भेटिएका छन्'
        : 'Strong deceptive indicators detected',
    },
    CAUTION: {
      bg: 'bg-amber-950/40 border-amber-600/50 text-amber-200',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
      barColor: 'from-amber-600 to-yellow-500',
      title: isNe ? 'सावधानी आवश्यक (Caution)' : 'Caution Required',
      subtitle: isNe
        ? 'केही शंकास्पद ढाँचाहरू देखिएका छन्'
        : 'Suspicious elements found; verify source',
    },
    LOW_RISK: {
      bg: 'bg-emerald-950/40 border-emerald-600/50 text-emerald-200',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      barColor: 'from-emerald-600 to-teal-400',
      title: isNe ? 'कम जोखिम (Low Risk)' : 'Low Risk Detected',
      subtitle: isNe
        ? 'कुनै स्पष्ट ठगी संकेत देखिएन (सतर्क भने रहनुहोस्)'
        : 'No overt threat patterns found in scan',
    },
  }[level];

  const Icon = config.icon;

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border ${config.bg} transition-all`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 shadow-inner">
            <Icon className={`w-8 h-8 ${config.iconColor}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${config.badgeBg}`}>
                {config.title}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {config.subtitle}
            </p>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-slate-800/60 pt-3 sm:pt-0">
          <span className="text-xs text-slate-400 font-medium">
            {isNe ? 'जोखिम सम्भाव्यता' : 'Risk Probability'}
          </span>
          <span className="text-2xl font-black tracking-tight text-white">
            {isNe ? toNepaliDigits(score) : score}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900/80 rounded-full h-2.5 mt-4 overflow-hidden p-0.5 border border-slate-800">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${config.barColor} transition-all duration-700 ease-out`}
          style={{ width: `${Math.max(5, score)}%` }}
        />
      </div>
    </div>
  );
};

import React from 'react';
import {
  History,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Trash2,
  X,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { CheckerType, HistoryEntry, formatRelativeTime } from '../utils/localHistory';
import { Language, RiskLevel } from '../types';
import { t } from '../translations';

interface RecentChecksBarProps<TInput = any, TResult = any> {
  type: CheckerType;
  lang: Language;
  entries: HistoryEntry<TInput, TResult>[];
  onSelect: (entry: HistoryEntry<TInput, TResult>) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export const RecentChecksBar = <TInput, TResult>({
  lang,
  entries,
  onSelect,
  onDelete,
  onClear,
}: RecentChecksBarProps<TInput, TResult>) => {
  const isNe = lang === 'ne';
  const currentT = t[lang];

  if (!entries || entries.length === 0) {
    return null;
  }

  const getRiskBadge = (level: RiskLevel, score: number) => {
    switch (level) {
      case 'HIGH_RISK':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            <span>{isNe ? 'उच्च जोखिम' : 'High Risk'} {score}%</span>
          </span>
        );
      case 'CAUTION':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>{isNe ? 'सावधानी' : 'Caution'} {score}%</span>
          </span>
        );
      case 'LOW_RISK':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>{isNe ? 'कम जोखिम' : 'Low Risk'} {score}%</span>
          </span>
        );
    }
  };

  return (
    <div className="mt-4 p-3.5 sm:p-4 rounded-2xl bg-[#0b1220]/90 border border-slate-800/90 shadow-sm animate-fadeIn">
      {/* Header with Title & Privacy Note */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400 shrink-0" />
          <h3 className="text-xs sm:text-sm font-semibold text-slate-200">
            {currentT.recentChecksTitle || (isNe ? 'पछिल्ला ३ जाँचहरू' : 'Recent Checks (Last 3)')}
          </h3>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/60 font-medium">
            <Lock className="w-2.5 h-2.5 text-emerald-400" />
            <span>{isNe ? 'उपकरणमा मात्र सुरक्षित' : 'Local device only'}</span>
          </span>
        </div>

        <button
          onClick={onClear}
          title={currentT.clearAllHistory || (isNe ? 'इतिहास मेटाउनुहोस्' : 'Clear History')}
          className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 transition-colors px-2 py-1 rounded-lg hover:bg-slate-800/60 cursor-pointer"
        >
          <Trash2 className="w-3 h-3" />
          <span className="hidden xs:inline">{currentT.clearAllHistory || (isNe ? 'मेटाउनुहोस्' : 'Clear')}</span>
        </button>
      </div>

      {/* Grid of up to 3 recent checks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mt-3">
        {entries.slice(0, 3).map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            className="group relative flex flex-col justify-between p-3 rounded-xl bg-[#121c33]/70 hover:bg-[#152340] border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer shadow-sm hover:shadow-cyan-950/30 text-left active:scale-[0.99]"
          >
            {/* Top row: Badges + Delete item */}
            <div className="flex items-center justify-between gap-1.5 mb-1.5">
              <div className="flex items-center gap-1 flex-wrap">
                {getRiskBadge(item.riskLevel, item.score)}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="opacity-60 hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title={currentT.deleteSingleHistory || (isNe ? 'हटाउनुहोस्' : 'Delete')}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content Preview */}
            <p className="text-xs text-slate-300 font-medium line-clamp-2 leading-relaxed mb-2.5">
              {item.preview}
            </p>

            {/* Bottom Row: Timestamp + Action label */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 mt-auto">
              <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                <Clock className="w-3 h-3 text-slate-500" />
                {formatRelativeTime(item.timestamp, lang)}
              </span>
              <span className="inline-flex items-center gap-1 text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>{currentT.viewAgain || (isNe ? 'पुनः हेर्नुहोस्' : 'View Report')}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

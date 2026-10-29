import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Gift,
  ShieldAlert,
  Briefcase,
  TrendingUp,
  Package,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { t } from '../translations';
import { Language, ScamEncyclopediaItem } from '../types';
import { scamEncyclopedia } from '../data/scamLibrary';

interface ScamLibraryProps {
  lang: Language;
}

export const ScamLibrary: React.FC<ScamLibraryProps> = ({ lang }) => {
  const currentT = t[lang];
  const isNe = lang === 'ne';

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(scamEncyclopedia[0].id);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Gift':
        return Gift;
      case 'ShieldAlert':
        return ShieldAlert;
      case 'Briefcase':
        return Briefcase;
      case 'TrendingUp':
        return TrendingUp;
      case 'Package':
        return Package;
      case 'AlertTriangle':
        return AlertTriangle;
      default:
        return BookOpen;
    }
  };

  const filteredItems = scamEncyclopedia.filter((item) => {
    const q = searchQuery.toLowerCase();
    const title = (isNe ? item.titleNe : item.titleEn).toLowerCase();
    const summary = (isNe ? item.summaryNe : item.summaryEn).toLowerCase();
    const category = (isNe ? item.categoryNe : item.categoryEn).toLowerCase();
    return title.includes(q) || summary.includes(q) || category.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="bg-[#121c33] border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              {currentT.libraryTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {currentT.librarySubtitle}
            </p>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/50 font-medium self-start sm:self-auto">
            {scamEncyclopedia.length} {isNe ? 'प्रकारका ठगीहरू' : 'Scam Categories'}
          </span>
        </div>

        {/* Search input */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isNe
                ? 'ठगीको नाम वा शब्द खोज्नुहोस् (उदा: चिट्ठा, OTP, जागिर, क्रिप्टो)...'
                : 'Search scams (e.g. lottery, OTP, job, investment, parcel)...'
            }
            className="w-full bg-[#0b1220] border border-slate-700/80 rounded-2xl py-3 pl-11 pr-4 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/80"
          />
        </div>
      </div>

      {/* Encyclopedia List */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isExpanded = expandedId === item.id;
          const Icon = getIcon(item.iconName);
          const isRecoveryTrap = item.id === 'recovery-scam';

          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all ${
                isRecoveryTrap
                  ? 'bg-[#151226] border-purple-800/50'
                  : 'bg-[#121c33] border-slate-800'
              } overflow-hidden shadow-md`}
            >
              {/* Accordion Header */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer select-none hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl ${
                      isRecoveryTrap
                        ? 'bg-purple-900/40 text-purple-300 border border-purple-700/50'
                        : 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/50'
                    }`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        {isNe ? item.categoryNe : item.categoryEn}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                      {isNe ? item.titleNe : item.titleEn}
                    </h3>
                  </div>
                </div>

                <div className="text-slate-400 hover:text-white shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </div>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="px-4 pb-5 sm:px-6 sm:pb-6 pt-2 border-t border-slate-800/80 space-y-4 text-xs sm:text-sm">
                  {/* Summary */}
                  <p className="text-slate-300 leading-relaxed">
                    {isNe ? item.summaryNe : item.summaryEn}
                  </p>

                  {/* Typical Real-World Example */}
                  <div className="p-3.5 rounded-xl bg-[#0b1220] border border-slate-800 font-mono text-xs text-amber-200/90 leading-relaxed">
                    <span className="block text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                      {isNe ? 'वास्तविक नमुना सन्देश (Typical Example):' : 'Typical Scam Message:'}
                    </span>
                    {isNe ? item.typicalExampleNe : item.typicalExampleEn}
                  </div>

                  {/* Red Flags & Defense Tips Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {/* Red Flags */}
                    <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-2">
                      <span className="font-bold text-rose-300 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                        {currentT.redFlagsTitle}
                      </span>
                      <ul className="space-y-1.5 text-slate-300">
                        {(isNe ? item.redFlagsNe : item.redFlagsEn).map(
                          (flag, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-rose-400 font-bold">•</span>
                              <span>{flag}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    {/* Defense Tips */}
                    <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-2">
                      <span className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        {currentT.defenseTipsTitle}
                      </span>
                      <ul className="space-y-1.5 text-slate-300">
                        {(isNe ? item.defenseTipsNe : item.defenseTipsEn).map(
                          (tip, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-emerald-400 font-bold">•</span>
                              <span>{tip}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

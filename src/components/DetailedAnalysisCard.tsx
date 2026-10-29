import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  UserX,
  Globe,
  Coins,
  KeyRound,
  ShieldCheck,
  Search,
  Sparkles,
} from 'lucide-react';
import { DetailedAnalysisData, Language } from '../types';

interface DetailedAnalysisCardProps {
  data?: DetailedAnalysisData;
  lang: Language;
}

export const DetailedAnalysisCard: React.FC<DetailedAnalysisCardProps> = ({
  data,
  lang,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const isNe = lang === 'ne';

  if (!data) return null;

  const {
    confidenceScore,
    confidenceLabelNe,
    confidenceLabelEn,
    suspiciousEntities,
    riskFactors,
  } = data;

  const getRiskFactorIcon = (id: string) => {
    switch (id) {
      case 'urgency':
        return Clock;
      case 'sender':
        return UserX;
      case 'domain':
      case 'domain_reputation':
      case 'punycode':
        return Globe;
      case 'advance_fee':
        return Coins;
      case 'credentials':
      case 'brand_mimicry':
        return KeyRound;
      default:
        return Activity;
    }
  };

  return (
    <div className="bg-[#10192e] border border-cyan-900/60 rounded-3xl overflow-hidden shadow-2xl transition-all animate-fadeIn">
      {/* Header with expand / collapse toggle */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none bg-gradient-to-r from-[#121e38] via-[#101a30] to-[#121e38] hover:bg-[#142340] border-b border-slate-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 shrink-0 shadow-inner">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                {isNe ? 'विस्तृत प्राविधिक विश्लेषण' : 'Detailed Technical Analysis'}
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 inline" />
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                {confidenceScore}% {isNe ? 'विश्वसनीयता' : 'Confidence'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isNe
                ? 'शंकास्पद तत्वहरू, जोखिम सूचकहरू र एआई निश्चितताको विस्तृत विवरण'
                : 'Breakdown of suspicious entities, threat confidence, and risk vectors'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
            {isExpanded
              ? isNe ? 'विवरण लुकाउनुहोस्' : 'Hide Details'
              : isNe ? 'विस्तृत विवरण हेर्नुहोस्' : 'Show Details'}
          </span>
          <div className="p-1 rounded-lg bg-slate-800 text-slate-300">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </div>
      </div>

      {/* Expandable Body */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-6 text-xs sm:text-sm">
          {/* 1. Confidence Score & Diagnostic Certainty */}
          <div className="p-4 rounded-2xl bg-[#0b1220] border border-slate-800/90 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  {isNe ? 'एआई विश्वसनीयता अंक (Threat Confidence Score)' : 'AI Threat Confidence Score'}
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isNe ? confidenceLabelNe : confidenceLabelEn}
                </p>
              </div>
              <div className="flex items-baseline gap-1 text-cyan-400 font-mono font-bold text-lg sm:text-xl self-start sm:self-auto">
                <span>{confidenceScore}%</span>
                <span className="text-xs text-slate-500 font-normal">/ 100%</span>
              </div>
            </div>

            {/* Confidence Bar */}
            <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800 p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-500 via-cyan-400 to-blue-500 transition-all duration-700"
                style={{ width: `${confidenceScore}%` }}
              />
            </div>
          </div>

          {/* 2. Suspicious Entities Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" />
                <span>
                  {isNe ? 'पत्ता लागेका शंकास्पद तत्वहरू (Suspicious Entities)' : 'Suspicious Entities Identified'}
                </span>
              </h4>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                {suspiciousEntities.length} {isNe ? 'तत्व फेला पर्यो' : 'Entities Found'}
              </span>
            </div>

            {suspiciousEntities.length === 0 ? (
              <div className="p-3.5 rounded-2xl bg-[#0b1220] border border-slate-800 text-slate-400 flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {isNe
                    ? 'यस सन्देश वा लिंकमा कुनै शंकास्पद संस्था, लिंक वा कीवर्ड पहिचान भएन।'
                    : 'No suspicious entities or weaponized keywords detected.'}
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {suspiciousEntities.map((ent, idx) => {
                  const isHigh = ent.risk === 'HIGH';
                  const isMed = ent.risk === 'MEDIUM';

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border flex flex-col justify-between gap-1.5 transition-colors ${
                        isHigh
                          ? 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                          : isMed
                          ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                          : 'bg-slate-900/40 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700/60 text-slate-300 font-mono">
                          {ent.type}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isHigh
                              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                              : isMed
                              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          }`}
                        >
                          {isHigh
                            ? isNe ? 'उच्च जोखिम' : 'High Risk'
                            : isMed
                            ? isNe ? 'मध्यम जोखिम' : 'Medium Risk'
                            : isNe ? 'कम जोखिम' : 'Low Risk'}
                        </span>
                      </div>

                      <div className="font-mono text-xs font-bold text-white break-all">
                        {ent.value}
                      </div>

                      <p className="text-[11px] text-slate-400 leading-snug">
                        {isNe ? ent.explanationNe : ent.explanationEn}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Specific Risk Factors Evaluation Matrix */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>
                {isNe ? 'विशिष्ट जोखिम सूचकहरूको मूल्यांकन (Specific Risk Factors)' : 'Specific Risk Factors Breakdown'}
              </span>
            </h4>

            <div className="space-y-2.5">
              {riskFactors.map((factor) => {
                const Icon = getRiskFactorIcon(factor.id);
                const isFlagged = factor.status === 'FLAGGED';
                const isWarning = factor.status === 'WARNING';
                const isClear = factor.status === 'CLEAR';

                return (
                  <div
                    key={factor.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                      isFlagged
                        ? 'bg-rose-950/25 border-rose-700/50'
                        : isWarning
                        ? 'bg-amber-950/25 border-amber-700/50'
                        : 'bg-[#0b1220] border-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                          isFlagged
                            ? 'bg-rose-900/40 text-rose-400 border border-rose-700/60'
                            : isWarning
                            ? 'bg-amber-900/40 text-amber-400 border border-amber-700/60'
                            : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                        }`}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h5 className="text-xs sm:text-sm font-bold text-white">
                            {isNe ? factor.nameNe : factor.nameEn}
                          </h5>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {isNe ? factor.detailNe : factor.detailEn}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 self-start sm:self-auto sm:pl-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                          isFlagged
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                            : isWarning
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        }`}
                      >
                        {isFlagged ? (
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        )}
                        <span>{isNe ? factor.statusNe : factor.statusEn}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

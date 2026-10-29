import React, { useState } from 'react';
import {
  Link as LinkIcon,
  Globe,
  AlertTriangle,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { t } from '../translations';
import { Language, LinkAnalysisResult } from '../types';
import { sampleLinks } from '../data/samples';
import { analyzeLinkClient } from '../utils/localAnalyzer';
import { extractDetailedAnalysisForLink } from '../utils/detailedAnalyzer';
import { RiskMeter } from './RiskMeter';
import { DetailedAnalysisCard } from './DetailedAnalysisCard';
import { RecentChecksBar } from './RecentChecksBar';
import {
  getRecentChecks,
  saveRecentCheck,
  deleteRecentCheck,
  clearRecentChecks,
  HistoryEntry,
} from '../utils/localHistory';

interface LinkCheckerProps {
  lang: Language;
  onOpenRescue?: () => void;
}

export const LinkChecker: React.FC<LinkCheckerProps> = ({ lang, onOpenRescue }) => {
  const currentT = t[lang];
  const isNe = lang === 'ne';

  const [url, setUrl] = useState('');
  const [analyzedUrl, setAnalyzedUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LinkAnalysisResult | null>(null);
  const [viewMode, setViewMode] = useState<'input' | 'result'>('input');
  const [showOriginalUrl, setShowOriginalUrl] = useState(true);
  const [recentChecks, setRecentChecks] = useState<HistoryEntry<string, LinkAnalysisResult>[]>(() =>
    getRecentChecks<string, LinkAnalysisResult>('link')
  );

  const handleCheck = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setAnalyzedUrl(url.trim());

    try {
      const res = await fetch('/api/analyze-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), lang }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setResult(json.data);
          saveRecentCheck('link', {
            preview: url.trim(),
            riskLevel: json.data.riskLevel,
            score: json.data.score,
            scamType: json.data.scamType || (lang === 'ne' ? 'फिसिङ / नक्कली लिंक' : 'Phishing / Suspicious Link'),
            inputData: url.trim(),
            result: json.data,
          });
          setRecentChecks(getRecentChecks<string, LinkAnalysisResult>('link'));
          setViewMode('result');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setLoading(false);
          return;
        }
      }
      throw new Error('Server returned non-ok');
    } catch {
      // Local heuristic fallback
      const local = analyzeLinkClient(url.trim(), lang);
      setResult(local);
      saveRecentCheck('link', {
        preview: url.trim(),
        riskLevel: local.riskLevel,
        score: local.score,
        scamType: local.scamType || (lang === 'ne' ? 'फिसिङ / नक्कली लिंक' : 'Phishing / Suspicious Link'),
        inputData: url.trim(),
        result: local,
      });
      setRecentChecks(getRecentChecks<string, LinkAnalysisResult>('link'));
      setViewMode('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecent = (entry: HistoryEntry<string, LinkAnalysisResult>) => {
    setUrl(entry.inputData);
    setAnalyzedUrl(entry.inputData);
    setResult(entry.result);
    setViewMode('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteRecent = (id: string) => {
    deleteRecentCheck('link', id);
    setRecentChecks(getRecentChecks<string, LinkAnalysisResult>('link'));
  };

  const handleClearRecent = () => {
    clearRecentChecks('link');
    setRecentChecks([]);
  };

  const handleSelectSample = (sampleUrl: string) => {
    setUrl(sampleUrl);
  };

  const handleBackToInput = () => {
    setViewMode('input');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetNewCheck = () => {
    setUrl('');
    setAnalyzedUrl('');
    setResult(null);
    setViewMode('input');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ==========================================
  // VIEW MODE: RESULT SCREEN (Dedicated Page)
  // ==========================================
  if (viewMode === 'result' && result) {
    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Navigation Bar for Result Page */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#121c33] border border-slate-800">
          <button
            onClick={handleBackToInput}
            className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer self-start active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>{currentT.backToInput}</span>
          </button>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleResetNewCheck}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 transition-all cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{currentT.checkAnotherLink}</span>
            </button>
          </div>
        </div>

        {/* Inspected Content Bubble */}
        <div className="p-4 rounded-2xl bg-[#0b1220] border border-slate-800/90 space-y-2">
          <div
            onClick={() => setShowOriginalUrl(!showOriginalUrl)}
            className="flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-400 hover:text-slate-200"
          >
            <div className="flex items-center gap-2">
              <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentT.inspectedUrl}</span>
            </div>
            {showOriginalUrl ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>

          {showOriginalUrl && (
            <p className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-cyan-300 font-mono leading-relaxed break-all">
              {analyzedUrl}
            </p>
          )}
        </div>

        {/* Result Card */}
        <div className="bg-[#121c33] border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6">
          {/* Header & Protocol inspection pill */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                {currentT.resultTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 break-all font-mono">
                {result.hostname}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border font-mono ${
                  result.protocol === 'https:'
                    ? 'bg-emerald-950/50 text-emerald-300 border-emerald-700/50'
                    : 'bg-rose-950/50 text-rose-300 border-rose-700/50'
                }`}
              >
                {result.protocol === 'https:' ? (
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Unlock className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span>{result.protocol.toUpperCase()}</span>
              </span>
            </div>
          </div>

          {/* Risk Meter Component */}
          <RiskMeter level={result.riskLevel} score={result.score} lang={lang} />

          {/* Verdict Summary */}
          <div className="p-4 rounded-2xl bg-[#0b1220] border border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              {isNe ? 'मूल्यांकन निष्कर्ष' : 'Verdict Summary'}
            </h4>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              {result.summary}
            </p>
          </div>

          {/* Findings */}
          {result.findings && result.findings.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                {isNe ? 'प्राविधिक तथा सुरक्षा संकेतहरू:' : 'Technical Findings & Clues:'}
              </h4>
              <ul className="space-y-2">
                {result.findings.map((f, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-300 flex items-start gap-2.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations && result.recommendations.length > 0 && (
            <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/40">
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                {currentT.recommendedSteps}
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* If High Risk and has rescue handler */}
          {result.riskLevel === 'HIGH_RISK' && onOpenRescue && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-600/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-rose-300">
                  {isNe
                    ? 'के तपाईंले यस लिंकमा आफ्नो पासवर्ड वा बैंकिङ विवरण राखिसक्नुभयो?'
                    : 'Did you enter your password or credentials on this link?'}
                </p>
                <p className="text-[11px] text-rose-200/80 mt-0.5">
                  {isNe
                    ? 'तुरुन्त आपतकालीन उद्धार चेकलिस्ट अनुसार पासवर्ड फेर्नुहोस्।'
                    : 'Follow our Emergency Rescue flow immediately to protect accounts.'}
                </p>
              </div>
              <button
                onClick={onOpenRescue}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shrink-0 cursor-pointer transition-all shadow-md active:scale-95"
              >
                {isNe ? 'उद्धार चेकलिस्ट खोल्नुहोस्' : 'Open Emergency Rescue'}
              </button>
            </div>
          )}

          {/* Warning Note */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
            {currentT.legalDisclaimer}
          </div>
        </div>

        {/* Expandable Detailed Analysis Card beneath primary result area */}
        <DetailedAnalysisCard
          data={
            result.detailedAnalysis ||
            extractDetailedAnalysisForLink(
              analyzedUrl,
              result.riskLevel,
              result.score,
              result.protocol,
              result.hostname,
              result.findings || []
            )
          }
          lang={lang}
        />

        {/* Bottom Back Button */}
        <div className="pt-2 text-center">
          <button
            onClick={handleBackToInput}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>{currentT.backToInput}</span>
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW MODE: INPUT SCREEN
  // ==========================================
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Input Section */}
      <div className="bg-[#121c33] border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-cyan-400" />
              {currentT.linkTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {currentT.linkSubtitle}
            </p>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/50 font-medium self-start sm:self-auto">
            {isNe ? 'फिसिङ र डोमेन स्क्यानर' : 'Phishing & Domain Scanner'}
          </span>
        </div>

        {/* Sample Links */}
        <div className="mt-4">
          <label className="text-xs font-semibold text-slate-300 block mb-2">
            {currentT.linkSamplesLabel}
          </label>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {sampleLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectSample(item.url)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all cursor-pointer active:scale-95 text-left"
              >
                <span className="text-cyan-400 mr-1.5">🔗</span>
                {isNe ? item.titleNe : item.titleEn}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Checks Bar (Last 3 Checks) */}
        <RecentChecksBar
          type="link"
          lang={lang}
          entries={recentChecks}
          onSelect={handleSelectRecent}
          onDelete={handleDeleteRecent}
          onClear={handleClearRecent}
        />

        {/* URL Input Form */}
        <div className="mt-4">
          <div className="relative flex items-center">
            <div className="absolute left-4 text-slate-400 pointer-events-none">
              <Globe className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={currentT.linkPlaceholder}
              className="w-full bg-[#0b1220] border border-slate-700/80 rounded-2xl py-3.5 pl-12 pr-4 text-sm sm:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 transition-all font-mono"
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 px-1">
            {currentT.linkDisclaimer}
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleCheck}
            disabled={loading || !url.trim()}
            className="w-full sm:flex-1 py-3 px-6 rounded-xl font-bold text-sm sm:text-base bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 shadow-lg shadow-cyan-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                <span>{currentT.linkAnalyzing}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-900" />
                <span>{currentT.linkAnalyzeBtn}</span>
              </>
            )}
          </button>

          {url && (
            <button
              onClick={() => {
                setUrl('');
              }}
              className="w-full sm:w-auto px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isNe ? 'मेटाउनुहोस्' : 'Clear'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

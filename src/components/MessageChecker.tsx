import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  Lock,
  Flag,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Lightbulb,
} from 'lucide-react';
import { t } from '../translations';
import { Language, MessageAnalysisResult } from '../types';
import { sampleMessages } from '../data/samples';
import { detectAndSanitizeText } from '../utils/privacyGuard';
import { analyzeMessageClient } from '../utils/localAnalyzer';
import { extractDetailedAnalysisForMessage } from '../utils/detailedAnalyzer';
import { RiskMeter } from './RiskMeter';
import { DetailedAnalysisCard } from './DetailedAnalysisCard';
import { VoiceReaderButton } from './VoiceReaderButton';
import { RecentChecksBar } from './RecentChecksBar';
import {
  getRecentChecks,
  saveRecentCheck,
  deleteRecentCheck,
  clearRecentChecks,
  HistoryEntry,
} from '../utils/localHistory';

interface MessageCheckerProps {
  lang: Language;
  onOpenRescue: () => void;
  onOpenReportModal?: (details: string) => void;
}

export const MessageChecker: React.FC<MessageCheckerProps> = ({
  lang,
  onOpenRescue,
  onOpenReportModal,
}) => {
  const currentT = t[lang];
  const isNe = lang === 'ne';

  const [message, setMessage] = useState('');
  const [analyzedMessage, setAnalyzedMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MessageAnalysisResult | null>(null);
  const [viewMode, setViewMode] = useState<'input' | 'result'>('input');
  const [showOriginalMessage, setShowOriginalMessage] = useState(true);
  const [copied, setCopied] = useState(false);
  const [privacyWarning, setPrivacyWarning] = useState<string[]>([]);
  const [recentChecks, setRecentChecks] = useState<HistoryEntry<string, MessageAnalysisResult>[]>(() =>
    getRecentChecks<string, MessageAnalysisResult>('message')
  );

  // Check privacy as user types
  const handleTextChange = (text: string) => {
    setMessage(text);
    if (text.length > 5) {
      const detection = detectAndSanitizeText(text, lang);
      if (detection.hasSensitiveData) {
        setPrivacyWarning(detection.detectedTypes);
      } else {
        setPrivacyWarning([]);
      }
    } else {
      setPrivacyWarning([]);
    }
  };

  // 1-Click Auto-Redact
  const handleAutoRedact = () => {
    const detection = detectAndSanitizeText(message, lang);
    setMessage(detection.sanitizedText);
    setPrivacyWarning([]);
  };

  // Run analysis and navigate to dedicated Result Page
  const handleAnalyze = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setAnalyzedMessage(message.trim());

    try {
      // Call backend API first
      const res = await fetch('/api/analyze-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim(), lang }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setResult(json.data);
          saveRecentCheck('message', {
            preview: message.trim().slice(0, 100),
            riskLevel: json.data.riskLevel,
            score: json.data.score,
            scamType: json.data.scamType,
            inputData: message.trim(),
            result: json.data,
          });
          setRecentChecks(getRecentChecks<string, MessageAnalysisResult>('message'));
          setViewMode('result');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setLoading(false);
          return;
        }
      }
      throw new Error('Server returned non-ok');
    } catch {
      // Graceful local heuristic fallback
      const localResult = analyzeMessageClient(message.trim(), lang);
      setResult(localResult);
      saveRecentCheck('message', {
        preview: message.trim().slice(0, 100),
        riskLevel: localResult.riskLevel,
        score: localResult.score,
        scamType: localResult.scamType,
        inputData: message.trim(),
        result: localResult,
      });
      setRecentChecks(getRecentChecks<string, MessageAnalysisResult>('message'));
      setViewMode('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecent = (entry: HistoryEntry<string, MessageAnalysisResult>) => {
    setMessage(entry.inputData);
    setAnalyzedMessage(entry.inputData);
    setResult(entry.result);
    setViewMode('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteRecent = (id: string) => {
    deleteRecentCheck('message', id);
    setRecentChecks(getRecentChecks<string, MessageAnalysisResult>('message'));
  };

  const handleClearRecent = () => {
    clearRecentChecks('message');
    setRecentChecks([]);
  };

  const handleSelectSample = (sampleText: string) => {
    setMessage(sampleText);
    const detection = detectAndSanitizeText(sampleText, lang);
    if (detection.hasSensitiveData) {
      setPrivacyWarning(detection.detectedTypes);
    } else {
      setPrivacyWarning([]);
    }
  };

  const handleBackToInput = () => {
    setViewMode('input');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetNewCheck = () => {
    setMessage('');
    setAnalyzedMessage('');
    setResult(null);
    setPrivacyWarning([]);
    setViewMode('input');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyReport = () => {
    if (!result) return;
    const reportText = `🛡️ Scam Protection AI Report (${new Date().toLocaleDateString()})
Input: "${analyzedMessage}"
Verdict: ${result.riskLevel} (${result.score}%)
Classification: ${result.scamType}

Summary:
${result.summary}

Warning Signs:
${result.warningSigns.map((s) => `• ${s}`).join('\n')}

Recommended Next Steps:
${result.actionSteps.map((a) => `• ${a}`).join('\n')}

Disclaimer: ${result.disclaimer}`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
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
            {result && (
              <VoiceReaderButton
                textToRead={`${result.summary}. ${result.warningSigns?.slice(0, 2).join('. ') || ''}. ${result.actionSteps?.[0] || ''}`}
                lang={lang}
              />
            )}

            <button
              onClick={handleResetNewCheck}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 transition-all cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{currentT.checkAnother}</span>
            </button>

            <button
              onClick={handleCopyReport}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">{currentT.copiedText}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentT.copyResult}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Inspected Content Bubble */}
        <div className="p-4 rounded-2xl bg-[#0b1220] border border-slate-800/90 space-y-2">
          <div
            onClick={() => setShowOriginalMessage(!showOriginalMessage)}
            className="flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-400 hover:text-slate-200"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentT.inspectedContent}</span>
            </div>
            {showOriginalMessage ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>

          {showOriginalMessage && (
            <p className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-200 font-mono leading-relaxed whitespace-pre-wrap">
              "{analyzedMessage}"
            </p>
          )}
        </div>

        {/* Primary Verdict Card */}
        <div className="bg-[#121c33] border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                {currentT.resultTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isNe ? 'वर्गीकरण: ' : 'Scam Classification: '}
                <span className="font-semibold text-cyan-300">{result.scamType}</span>
              </p>
            </div>
          </div>

          {/* Risk Meter Component */}
          <RiskMeter level={result.riskLevel} score={result.score} lang={lang} />

          {/* Verdict Summary */}
          <div className="p-4 rounded-2xl bg-[#0b1220] border border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
              {isNe ? 'विश्लेषण निष्कर्ष' : 'Analysis Summary'}
            </h4>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              {result.summary}
            </p>
          </div>

          {/* Warning Signs List */}
          {result.warningSigns && result.warningSigns.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                {currentT.warningSignsFound}
              </h4>
              <ul className="space-y-2">
                {result.warningSigns.map((sign, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-300 flex items-start gap-2.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Psychological Tricks Badges */}
          {result.psychologicalTricks && result.psychologicalTricks.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-rose-400" />
                {currentT.psychologicalTricks}
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.psychologicalTricks.map((trick, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-full bg-rose-950/40 border border-rose-800/50 text-rose-300 font-medium"
                  >
                    {trick}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Steps */}
          {result.actionSteps && result.actionSteps.length > 0 && (
            <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/40">
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                {currentT.recommendedSteps}
              </h4>
              <div className="space-y-2">
                {result.actionSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200"
                  >
                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* If High Risk, prompt emergency rescue */}
          {result.riskLevel === 'HIGH_RISK' && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-600/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-rose-300">
                  {isNe
                    ? 'के तपाईंले यस सन्देशमा पैसा वा विवरण दिइसक्नुभयो?'
                    : 'Did you already reply, share OTP, or send funds?'}
                </p>
                <p className="text-[11px] text-rose-200/80 mt-0.5">
                  {isNe
                    ? 'तुरुन्त उद्धार चेकलिस्ट हेरी खाता सुरक्षित गर्नुहोस्।'
                    : 'Follow our Emergency Rescue flow immediately.'}
                </p>
              </div>
              <button
                onClick={onOpenRescue}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shrink-0 cursor-pointer transition-all shadow-md active:scale-95"
              >
                {isNe ? 'आपतकालीन चेकलिस्ट खोल्नुहोस्' : 'Open Emergency Rescue'}
              </button>
            </div>
          )}

          {/* Legal Disclaimer & Feedback */}
          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p className="max-w-2xl">{result.disclaimer || currentT.legalDisclaimer}</p>
            {onOpenReportModal && (
              <button
                onClick={() => onOpenReportModal(result.summary)}
                className="text-slate-400 hover:text-slate-300 underline underline-offset-2 shrink-0 cursor-pointer"
              >
                {currentT.falsePositiveBtn}
              </button>
            )}
          </div>
        </div>

        {/* Expandable Detailed Analysis Card beneath primary result area */}
        <DetailedAnalysisCard
          data={
            result.detailedAnalysis ||
            extractDetailedAnalysisForMessage(
              analyzedMessage,
              result.riskLevel,
              result.score,
              result.warningSigns || [],
              result.psychologicalTricks || []
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
      {/* Input Card */}
      <div className="bg-[#121c33] border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              {currentT.msgTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {currentT.msgSubtitle}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/50 font-medium">
              {isNe ? 'एआई + नियम आधारित' : 'AI + Heuristics'}
            </span>
          </div>
        </div>

        {/* Preset Sample Pills */}
        <div className="mt-4">
          <label className="text-xs font-semibold text-slate-300 block mb-2">
            {currentT.msgSamplesLabel}
          </label>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {sampleMessages.map((sample) => (
              <button
                key={sample.id}
                onClick={() =>
                  handleSelectSample(isNe ? sample.textNe : sample.textEn)
                }
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all cursor-pointer active:scale-95 text-left"
              >
                <span className="text-cyan-400 mr-1.5">•</span>
                {isNe ? sample.titleNe : sample.titleEn}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Checks Bar (Last 3 Checks) */}
        <RecentChecksBar
          type="message"
          lang={lang}
          entries={recentChecks}
          onSelect={handleSelectRecent}
          onDelete={handleDeleteRecent}
          onClear={handleClearRecent}
        />

        {/* Text Area */}
        <div className="mt-4 relative">
          <textarea
            value={message}
            onChange={(e) => handleTextChange(e.target.value)}
            rows={5}
            placeholder={currentT.msgPlaceholder}
            className="w-full bg-[#0b1220] border border-slate-700/80 rounded-2xl p-4 text-sm sm:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 transition-all resize-y"
          />
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 mt-1">
            <span>
              {message.length} {isNe ? 'अक्षर' : 'characters'}
            </span>
            <div className="flex items-center gap-1 text-[11px]">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>{isNe ? 'गोप्य विवरण सुरक्षित' : 'Client-side safety check'}</span>
            </div>
          </div>
        </div>

        {/* Privacy Warning Banner if sensitive data detected */}
        {privacyWarning.length > 0 && (
          <div className="mt-3 p-3 rounded-xl bg-amber-950/40 border border-amber-600/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200 animate-fadeIn">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">{currentT.msgPrivacyWarning}</span>
                <p className="text-amber-300/80 text-[11px] mt-0.5">
                  {isNe ? 'पत्ता लागेको विवरण: ' : 'Detected: '}
                  {privacyWarning.join(', ')}
                </p>
              </div>
            </div>
            <button
              onClick={handleAutoRedact}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/50 font-semibold cursor-pointer shrink-0 transition-colors"
            >
              {currentT.msgRedactBtn}
            </button>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleAnalyze}
            disabled={loading || !message.trim()}
            className="w-full sm:flex-1 py-3 px-6 rounded-xl font-bold text-sm sm:text-base bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 shadow-lg shadow-cyan-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                <span>{currentT.msgAnalyzing}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-900" />
                <span>{currentT.msgAnalyzeBtn}</span>
              </>
            )}
          </button>

          {message && (
            <button
              onClick={() => {
                setMessage('');
                setPrivacyWarning([]);
              }}
              className="w-full sm:w-auto px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{currentT.msgClear}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

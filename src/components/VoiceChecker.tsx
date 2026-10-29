import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  AlertTriangle,
  CheckCircle,
  Copy,
  Check,
  RefreshCw,
  ArrowLeft,
  ShieldAlert,
  Radio,
  FileAudio,
} from 'lucide-react';
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
import {
  isSpeechRecognitionSupported,
  speakVerdict,
  stopSpeaking,
} from '../utils/voiceAssistant';
import { sampleVoiceQueries } from '../data/samples';
import { t } from '../translations';
import { MessageAnalysisResult, Language } from '../types';

interface VoiceCheckerProps {
  lang: Language;
  onOpenRescue: () => void;
  onOpenReportModal?: (context: string) => void;
}

export const VoiceChecker: React.FC<VoiceCheckerProps> = ({
  lang,
  onOpenRescue,
  onOpenReportModal,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MessageAnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  const [recentChecks, setRecentChecks] = useState<HistoryEntry<string, MessageAnalysisResult>[]>(() =>
    getRecentChecks<string, MessageAnalysisResult>('voice')
  );

  const handleSelectRecent = (entry: HistoryEntry<string, MessageAnalysisResult>) => {
    setTranscript(entry.inputData);
    setResult(entry.result);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const spokenVerdict = `${entry.result.summary}. ${entry.result.warningSigns?.slice(0, 2).join('. ') || ''}. ${entry.result.actionSteps?.[0] || ''}`;
    speakVerdict(spokenVerdict, lang);
  };

  const handleDeleteRecent = (id: string) => {
    deleteRecentCheck('voice', id);
    setRecentChecks(getRecentChecks<string, MessageAnalysisResult>('voice'));
  };

  const handleClearRecent = () => {
    clearRecentChecks('voice');
    setRecentChecks([]);
  };

  const recognitionRef = useRef<any>(null);
  const currentT = t[lang];
  const isNe = lang === 'ne';

  useEffect(() => {
    const supported = isSpeechRecognitionSupported();
    setRecognitionSupported(supported);

    if (supported) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = isNe ? 'ne-NP' : 'en-US';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        setTranscript(currentTranscript.trim());
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMsg(
            isNe
              ? 'माइक अनुमति दिइएको छैन। कृपया ब्राउजर सेटिङबाट माइक्रोफोन खोल्नुहोस्।'
              : 'Microphone permission denied. Please allow microphone access.'
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      stopSpeaking();
    };
  }, [isNe]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setErrorMsg(currentT.voiceNotSupported);
      return;
    }

    setErrorMsg('');
    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = isNe ? 'ne-NP' : 'en-US';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
        setIsListening(false);
      }
    }
  };

  const handleSelectSample = (sample: typeof sampleVoiceQueries[0]) => {
    const text = isNe ? sample.queryNe : sample.queryEn;
    setTranscript(text);
    setErrorMsg('');
  };

  const handleClear = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setTranscript('');
    setResult(null);
    setErrorMsg('');
    stopSpeaking();
  };

  const handleAnalyze = async () => {
    if (!transcript.trim()) {
      setErrorMsg(
        isNe
          ? 'कृपया माइक थिचेर बोल्नुहोस् वा तलका नमुना प्रश्नहरू छान्नुहोस्।'
          : 'Please speak into the mic or select a sample question first.'
      );
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/analyze-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: transcript.trim(),
          lang,
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to analyze query');
      }

      setResult(json.data);
      saveRecentCheck('voice', {
        preview: transcript.trim(),
        riskLevel: json.data.riskLevel,
        score: json.data.score,
        scamType: json.data.scamType,
        inputData: transcript.trim(),
        result: json.data,
      });
      setRecentChecks(getRecentChecks<string, MessageAnalysisResult>('voice'));
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Automatically speak the verdict in Nepali/English
      const spokenVerdict = `${json.data.summary}. ${json.data.warningSigns?.slice(0, 2).join('. ') || ''}. ${json.data.actionSteps?.[0] || ''}`;
      speakVerdict(spokenVerdict, lang);
    } catch (err: any) {
      console.error('Voice query error:', err);
      setErrorMsg(
        isNe
          ? 'बोलेको कुरा विश्लेषण गर्न सकिएन। कृपया फेरि प्रयास गर्नुहोस्।'
          : 'Failed to inspect spoken query. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (!result) return;
    const textToCopy = `[Scam Protection AI - Voice Query Report]
Question: "${transcript}"
Risk Level: ${result.riskLevel} (${result.score}/100)
Scam Type: ${result.scamType}
Summary: ${result.summary}

Warning Signs:
${result.warningSigns.map((w) => `• ${w}`).join('\n')}

Action Steps:
${result.actionSteps.map((a) => `• ${a}`).join('\n')}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Dedicated Full-Page Scan Report View
  if (result) {
    const isHigh = result.riskLevel === 'HIGH_RISK';
    const isCaution = result.riskLevel === 'CAUTION';
    const spokenSummaryText = `${result.summary}. ${result.warningSigns.slice(0, 2).join('. ')}. ${result.actionSteps[0] || ''}`;

    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Navigation back and header bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#111c33] border border-slate-800 shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setResult(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl border border-slate-700 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{currentT.backToInput}</span>
            </button>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{isNe ? 'आवाज विश्लेषण प्रतिवेदन (Voice Verdict)' : 'Voice Scam Scan Report'}</span>
            </h3>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <VoiceReaderButton textToRead={spokenSummaryText} lang={lang} />

            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 rounded-xl border border-cyan-800/50 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{currentT.checkAnotherVoice}</span>
            </button>
          </div>
        </div>

        {/* Primary Verdict Card */}
        <div
          className={`p-6 rounded-3xl border transition-all ${
            isHigh
              ? 'bg-gradient-to-br from-rose-950/40 via-[#181124] to-[#121c33] border-rose-500/40 shadow-xl'
              : isCaution
              ? 'bg-gradient-to-br from-amber-950/30 via-[#1a1c29] to-[#121c33] border-amber-500/40 shadow-xl'
              : 'bg-gradient-to-br from-emerald-950/30 via-[#111e29] to-[#121c33] border-emerald-500/40 shadow-xl'
          }`}
        >
          {/* Audio playing banner */}
          <div className="mb-4 p-3 rounded-2xl bg-cyan-950/50 border border-cyan-800/50 flex items-center justify-between text-xs text-cyan-200">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>{currentT.voiceResultAudioPrompt}</span>
            </div>
            <VoiceReaderButton textToRead={spokenSummaryText} lang={lang} />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900/80 border border-slate-700/80">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-cyan-300">{result.scamType}</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-white">
                {isHigh
                  ? currentT.riskHigh
                  : isCaution
                  ? currentT.riskCaution
                  : currentT.riskLow}
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                {result.summary}
              </p>
            </div>

            <div className="shrink-0 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-center min-w-[140px]">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {currentT.riskScore}
              </span>
              <span
                className={`text-4xl font-extrabold ${
                  isHigh ? 'text-rose-400' : isCaution ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {result.score}%
              </span>
              <RiskMeter score={result.score} level={result.riskLevel} lang={lang} />
            </div>
          </div>

          {/* Inspected Voice Question Text */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <FileAudio className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentT.voiceTranscriptLabel}</span>
            </span>
            <p className="text-sm sm:text-base font-semibold text-cyan-300 italic">
              "{transcript}"
            </p>
          </div>

          {/* Warning Signs and Recommended Steps */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-800/40">
              <h5 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>{currentT.warningSignsFound}</span>
              </h5>
              <ul className="space-y-2">
                {result.warningSigns.map((sign, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-rose-200">
                    <span className="text-rose-400 mt-0.5">•</span>
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/40">
              <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{currentT.recommendedSteps}</span>
              </h5>
              <ul className="space-y-2">
                {result.actionSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-emerald-200">
                    <span className="text-emerald-400 font-bold">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Emergency Rescue Trigger if High Risk */}
          {isHigh && (
            <div className="mt-6 p-4 rounded-2xl bg-rose-950/50 border border-rose-600/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0" />
                <div>
                  <h6 className="text-sm font-bold text-white">
                    {isNe ? 'के तपाईंले पैसा वा पासवर्ड दिइसक्नुभयो?' : 'Have you already sent funds or shared password?'}
                  </h6>
                  <p className="text-xs text-rose-200">
                    {isNe
                      ? 'नआत्तिनुहोस्! तुरुन्त बैंक खाता रोक्ने र प्रमाण सुरक्षित गर्ने आपतकालीन चेकलिस्ट हेर्नुहोस्।'
                      : 'Follow immediate steps to freeze accounts and file an official complaint.'}
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenRescue}
                className="w-full sm:w-auto px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-lg shrink-0"
              >
                {isNe ? '🆘 आपतकालीन उद्धार खोल्नुहोस्' : '🆘 Open Rescue Checklist'}
              </button>
            </div>
          )}

          {/* Action Footer */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyReport}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? currentT.copiedText : currentT.copyResult}</span>
              </button>

              {onOpenReportModal && (
                <button
                  onClick={() => onOpenReportModal(`Voice Analysis (${result.scamType})`)}
                  className="text-slate-400 hover:text-slate-200 underline cursor-pointer ml-2"
                >
                  {currentT.falsePositiveBtn}
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-400 max-w-md italic">
              {currentT.legalDisclaimer}
            </p>
          </div>
        </div>

        {/* Detailed Analysis Breakdown Card */}
        {result.detailedAnalysis && (
          <DetailedAnalysisCard
            data={result.detailedAnalysis}
            lang={lang}
          />
        )}
      </div>
    );
  }

  // Voice Recording & Input View
  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/60 border border-cyan-800/40 text-cyan-300">
          <Radio className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isNe ? 'आवाजबाट सहज पहुँच (Accessibility)' : 'Voice Speech Recognition'}</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-white">
          {currentT.voiceTitle}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          {currentT.voiceSubtitle}
        </p>
      </div>

      {/* Recent Checks Bar (Last 3 Checks) */}
      <RecentChecksBar
        type="voice"
        lang={lang}
        entries={recentChecks}
        onSelect={handleSelectRecent}
        onDelete={handleDeleteRecent}
        onClear={handleClearRecent}
      />

      {/* Voice Mic Central Recording Stage */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#101b30] via-[#0d1628] to-[#131f38] border border-slate-800 text-center relative overflow-hidden shadow-2xl">
        <div className="space-y-6">
          {/* Animated Glowing Mic Circle */}
          <div className="relative inline-flex items-center justify-center">
            {isListening && (
              <>
                <div className="absolute w-36 h-36 rounded-full bg-cyan-500/20 animate-ping" />
                <div className="absolute w-48 h-48 rounded-full bg-cyan-500/10 animate-pulse" />
              </>
            )}

            <button
              type="button"
              onClick={toggleListening}
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xl active:scale-95 z-10 ${
                isListening
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/40 scale-105 animate-pulse'
                  : 'bg-gradient-to-tr from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 shadow-cyan-500/30'
              }`}
              title={isListening ? currentT.voiceClickToStop : currentT.voiceClickToSpeak}
            >
              {isListening ? (
                <MicOff className="w-10 h-10 sm:w-12 sm:h-12" />
              ) : (
                <Mic className="w-10 h-10 sm:w-12 sm:h-12" />
              )}
            </button>
          </div>

          {/* Status Label */}
          <div className="space-y-1">
            <span
              className={`text-sm sm:text-base font-bold ${
                isListening ? 'text-rose-400 animate-pulse' : 'text-white'
              }`}
            >
              {isListening ? currentT.voiceListening : currentT.voiceClickToSpeak}
            </span>
            <p className="text-xs text-slate-400">
              {isNe ? 'नेपालीमा बोल्नुहोस् (Speak in Nepali or English)' : 'Speak clearly into your device microphone'}
            </p>
          </div>

          {/* Live Transcript Display Box */}
          <div className="max-w-2xl mx-auto text-left p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {currentT.voiceTranscriptLabel}
              </span>
              {transcript && (
                <button
                  type="button"
                  onClick={() => setTranscript('')}
                  className="text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {currentT.msgClear}
                </button>
              )}
            </div>

            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder={currentT.voicePrompt}
              rows={3}
              className="w-full bg-transparent border-none text-xs sm:text-sm text-cyan-200 placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="max-w-xl mx-auto p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/50 text-xs text-rose-300 flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading || !transcript.trim()}
              className={`px-8 py-3.5 font-bold text-sm sm:text-base rounded-2xl transition-all cursor-pointer shadow-lg active:scale-98 flex items-center gap-2 ${
                loading || !transcript.trim()
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 shadow-cyan-500/20'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>{currentT.voiceAnalyzing}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>{currentT.voiceAnalyzeBtn}</span>
                </>
              )}
            </button>

            {transcript && (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-3.5 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/80 rounded-2xl border border-slate-700 transition cursor-pointer"
              >
                {currentT.msgClear}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Preset Quick-Test Sample Voice Queries */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {currentT.voiceSamplesLabel}
          </span>
          <span className="text-[11px] text-cyan-400">
            {isNe ? '१-क्लिकमा सोध्नुहोस्' : '1-Click sample test'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sampleVoiceQueries.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectSample(item)}
              className="p-4 rounded-2xl bg-[#0f172a] hover:bg-[#142038] border border-slate-800 hover:border-cyan-500/50 text-left transition cursor-pointer flex flex-col justify-between gap-2.5 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/40">
                  {isNe ? item.categoryNe : item.categoryEn}
                </span>
                <span className="text-[11px] text-slate-500 group-hover:text-cyan-400 transition font-semibold">
                  {isNe ? 'जाँच्नुहोस् →' : 'Test →'}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition leading-snug">
                "{isNe ? item.queryNe : item.queryEn}"
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

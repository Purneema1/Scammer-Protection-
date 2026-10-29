import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  Image as ImageIcon,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Copy,
  Check,
  RefreshCw,
  ArrowLeft,
  Eye,
  FileText,
  ShieldAlert,
  ChevronDown,
  Info,
  X,
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
import { sampleScreenshots } from '../data/samples';
import { t } from '../translations';
import { ImageAnalysisResult, Language } from '../types';

interface PhotoInputData {
  imageBase64: string;
  imageFileName: string;
  notes: string;
}

interface PhotoCheckerProps {
  lang: Language;
  onOpenRescue: () => void;
  onOpenReportModal?: (context: string) => void;
}

export const PhotoChecker: React.FC<PhotoCheckerProps> = ({
  lang,
  onOpenRescue,
  onOpenReportModal,
}) => {
  const [imageBase64, setImageBase64] = useState<string>('');
  const [imageFileName, setImageFileName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [recentChecks, setRecentChecks] = useState<HistoryEntry<PhotoInputData, ImageAnalysisResult>[]>(() =>
    getRecentChecks<PhotoInputData, ImageAnalysisResult>('photo')
  );

  const handleSelectRecent = (entry: HistoryEntry<PhotoInputData, ImageAnalysisResult>) => {
    setImageBase64(entry.inputData.imageBase64);
    setImageFileName(entry.inputData.imageFileName || '');
    setNotes(entry.inputData.notes || '');
    setResult(entry.result);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteRecent = (id: string) => {
    deleteRecentCheck('photo', id);
    setRecentChecks(getRecentChecks<PhotoInputData, ImageAnalysisResult>('photo'));
  };

  const handleClearRecent = () => {
    clearRecentChecks('photo');
    setRecentChecks([]);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const currentT = t[lang];
  const isNe = lang === 'ne';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg(isNe ? 'कृपया तस्बिर वा स्क्रिनसट फाइल मात्र छान्नुहोस्।' : 'Please upload an image file (PNG, JPG, WebP).');
      return;
    }
    setErrorMsg('');
    setImageFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImageBase64(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleSelectSample = (sample: typeof sampleScreenshots[0]) => {
    setImageBase64(sample.imageUrl);
    setImageFileName(`${sample.id}.png`);
    setNotes(sample.sampleText);
    setErrorMsg('');
  };

  const handleClear = () => {
    setImageBase64('');
    setImageFileName('');
    setNotes('');
    setResult(null);
    setErrorMsg('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!imageBase64) {
      setErrorMsg(isNe ? 'कृपया पहिले कुनै फोटो वा स्क्रिनसट अपलोड गर्नुहोस्।' : 'Please upload an image or choose a sample.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          notes,
          lang,
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to analyze screenshot');
      }

      setResult(json.data);
      const previewText = json.data.scamType
        ? `${json.data.scamType}: ${json.data.summary?.slice(0, 70) || imageFileName || 'Photo Scan'}`
        : imageFileName || 'Screenshot Check';

      saveRecentCheck('photo', {
        preview: previewText,
        riskLevel: json.data.riskLevel,
        score: json.data.score,
        scamType: json.data.scamType || 'Image Analysis',
        inputData: {
          imageBase64,
          imageFileName,
          notes,
        },
        result: json.data,
      });
      setRecentChecks(getRecentChecks<PhotoInputData, ImageAnalysisResult>('photo'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Image analysis error:', err);
      setErrorMsg(
        isNe
          ? 'फोटो विश्लेषण गर्न सकिएन। कृपया फेरि प्रयास गर्नुहोस् वा अर्को तस्बिर छान्नुहोस्।'
          : 'Failed to inspect image. Please try again with a clear screenshot.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (!result) return;
    const textToCopy = `[Scam Protection AI - Photo Scan Report]
Risk Level: ${result.riskLevel} (${result.score}/100)
Scam Type: ${result.scamType}
Summary: ${result.summary}

Extracted Text:
${result.extractedText}

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

    // Summary spoken aloud
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
              <span>{isNe ? 'फोटो तथा स्क्रिनसट विश्लेषण प्रतिवेदन' : 'Screenshot Scan Report'}</span>
            </h3>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <VoiceReaderButton textToRead={spokenSummaryText} lang={lang} />

            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 rounded-xl border border-cyan-800/50 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{currentT.checkAnotherPhoto}</span>
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

          {/* Inspected Image + Extracted OCR Text Split */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Image Preview Box */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>{currentT.inspectedPhoto}</span>
              </span>
              <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center max-h-72">
                <img
                  src={imageBase64}
                  alt="Inspected Screenshot"
                  className="w-full h-auto object-contain max-h-72"
                />
              </div>
              {notes && (
                <div className="mt-2 text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="font-semibold text-slate-300 block mb-0.5">
                    {currentT.photoNotesLabel}:
                  </span>
                  {notes}
                </div>
              )}
            </div>

            {/* Extracted OCR text box */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-400" />
                <span>{currentT.photoOcrTextTitle}</span>
              </span>
              <div className="flex-1 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300 leading-relaxed overflow-y-auto max-h-64 whitespace-pre-wrap">
                {result.extractedText || (isNe ? 'फोटोबाट कुनै स्पष्ट लेखाइ पत्ता लागेन।' : 'No clear text transcribed.')}
              </div>
            </div>
          </div>

          {/* Visual Clues Badges */}
          {result.visualClues && result.visualClues.length > 0 && (
            <div className="mt-5 p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/40">
              <h5 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>{currentT.photoVisualCluesTitle}</span>
              </h5>
              <div className="flex flex-wrap gap-2">
                {result.visualClues.map((clue, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-cyan-950/60 text-cyan-200 border border-cyan-700/50"
                  >
                    <span>🔍</span>
                    <span>{clue}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Warning Signs and Action Steps */}
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
                    {isNe ? 'के तपाईंले यस विक्रेतालाई पैसा पठाइसक्नुभयो?' : 'Have you already sent money to this seller?'}
                  </h6>
                  <p className="text-xs text-rose-200">
                    {isNe
                      ? 'तुरुन्त बैंक/वालेट रोक्ने र प्रमाण सुरक्षित गर्ने आपतकालीन चेकलिस्ट हेर्नुहोस्।'
                      : 'Access immediate bank block instructions and evidence steps.'}
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
                  onClick={() => onOpenReportModal(`Photo Analysis (${result.scamType})`)}
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

  // Input & Upload View
  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/60 border border-cyan-800/40 text-cyan-300">
          <Camera className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isNe ? 'मल्टिमोडल एआई सुरक्षा' : 'Multimodal Vision Defense'}</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-white">
          {currentT.photoTitle}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          {currentT.photoSubtitle}
        </p>
      </div>

      {/* Recent Checks Bar (Last 3 Checks) */}
      <RecentChecksBar
        type="photo"
        lang={lang}
        entries={recentChecks}
        onSelect={handleSelectRecent}
        onDelete={handleDeleteRecent}
        onClear={handleClearRecent}
      />

      {/* Main Upload Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`p-6 sm:p-8 rounded-3xl border-2 border-dashed transition-all text-center relative ${
          isDragging
            ? 'border-cyan-400 bg-cyan-950/30 scale-[1.01]'
            : imageBase64
            ? 'border-cyan-500/50 bg-[#101b30]'
            : 'border-slate-700/80 bg-[#0e172a] hover:border-slate-600'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <input
          type="file"
          ref={cameraInputRef}
          onChange={handleFileChange}
          accept="image/*"
          capture="environment"
          className="hidden"
        />

        {imageBase64 ? (
          <div className="space-y-4">
            <div className="relative inline-block max-w-md w-full rounded-2xl overflow-hidden border border-cyan-500/40 bg-slate-950 shadow-2xl">
              <img
                src={imageBase64}
                alt="Uploaded Screenshot"
                className="w-full h-auto max-h-80 object-contain mx-auto"
              />
              <button
                onClick={handleClear}
                className="absolute top-2 right-2 p-1.5 bg-slate-900/90 hover:bg-rose-600 text-white rounded-full transition cursor-pointer shadow-md"
                title={currentT.photoClear}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              {imageFileName || (isNe ? 'तस्बिर छानिएको छ' : 'Image selected')}
            </p>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-700/50 flex items-center justify-center mx-auto text-cyan-400 shadow-inner">
              <Upload className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-sm sm:text-base font-bold text-white">
                {currentT.photoUploadPrompt}
              </h4>
              <p className="text-xs text-slate-400">
                {isNe ? 'PNG, JPG, WebP वा मोबाइल स्क्रिनसट' : 'Supports PNG, JPG, WebP screenshots'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer shadow-md active:scale-95"
              >
                <ImageIcon className="w-4 h-4" />
                <span>{currentT.photoBrowseBtn}</span>
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer border border-slate-700 shadow-md active:scale-95"
              >
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>{currentT.photoCameraBtn}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Optional User Notes Field */}
      <div className="space-y-2 p-4 rounded-2xl bg-[#0f172a] border border-slate-800">
        <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
          <span>{currentT.photoNotesLabel}</span>
          <span className="text-[11px] text-slate-500 font-normal">
            {isNe ? 'विक्रेताको माग वा तपाईंलाई लागेको शंका' : 'Context helps AI detect nuances'}
          </span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={currentT.photoNotesPlaceholder}
          rows={2}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
        />
      </div>

      {/* Error message */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/50 text-xs text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Action Submit Button */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={handleAnalyze}
          disabled={loading || !imageBase64}
          className={`w-full sm:flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 font-bold text-sm sm:text-base rounded-2xl transition-all cursor-pointer shadow-lg active:scale-98 ${
            loading || !imageBase64
              ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 shadow-cyan-500/20'
          }`}
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>{currentT.photoAnalyzing}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>{currentT.photoAnalyzeBtn}</span>
            </>
          )}
        </button>

        {imageBase64 && (
          <button
            onClick={handleClear}
            className="w-full sm:w-auto px-4 py-3.5 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 rounded-2xl border border-slate-700 transition cursor-pointer"
          >
            {currentT.photoClear}
          </button>
        )}
      </div>

      {/* Preset Sample Screenshots for 1-Click Verification */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {currentT.photoSamplesLabel}
          </span>
          <span className="text-[11px] text-cyan-400">
            {isNe ? 'तत्काल परीक्षण गर्नुहोस्' : 'Click to inspect sample'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {sampleScreenshots.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className="p-3.5 rounded-2xl bg-[#0f172a] hover:bg-[#142038] border border-slate-800 hover:border-cyan-500/50 text-left transition cursor-pointer flex flex-col justify-between gap-2.5 group"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/40 inline-block">
                  {isNe ? sample.categoryNe : sample.categoryEn}
                </span>
                <h5 className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
                  {isNe ? sample.titleNe : sample.titleEn}
                </h5>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {isNe ? sample.descriptionNe : sample.descriptionEn}
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                <span>{isNe ? 'नमुना स्क्रिनसट' : 'Mock Screenshot'}</span>
                <span className="text-cyan-400 font-semibold group-hover:translate-x-0.5 transition">
                  {isNe ? 'प्रयोग गर्नुहोस् →' : 'Use sample →'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

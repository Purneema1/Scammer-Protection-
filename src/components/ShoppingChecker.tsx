import React, { useState } from 'react';
import {
  ShoppingBag,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Tag,
  Coins,
  Store,
  MessageCircleOff,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { t } from '../translations';
import { Language, ShoppingScamInput, ShoppingAnalysisResult } from '../types';
import { sampleShoppingItems } from '../data/samples';
import { analyzeShoppingScamClient } from '../utils/shoppingAnalyzer';
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

interface ShoppingCheckerProps {
  lang: Language;
  onOpenRescue: () => void;
  onOpenReportModal?: (details: string) => void;
}

export const ShoppingChecker: React.FC<ShoppingCheckerProps> = ({
  lang,
  onOpenRescue,
  onOpenReportModal,
}) => {
  const currentT = t[lang];
  const isNe = lang === 'ne';

  const defaultForm: ShoppingScamInput = {
    productName: '',
    marketPrice: '',
    advertisedPrice: '',
    advancePayment: '',
    sellerName: '',
    sellerPlatform: 'Facebook Marketplace',
    sellerProfileUrl: '',
    paymentMethod: 'Personal eSewa / QR',
    hasReturnPolicy: false,
    hasPhysicalStore: false,
    commentsDisabled: false,
    adDescription: '',
    screenshotNotes: '',
  };

  const [form, setForm] = useState<ShoppingScamInput>(defaultForm);
  const [analyzedItem, setAnalyzedItem] = useState<ShoppingScamInput | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ShoppingAnalysisResult | null>(null);
  const [viewMode, setViewMode] = useState<'input' | 'result'>('input');
  const [showItemDetails, setShowItemDetails] = useState(true);
  const [copied, setCopied] = useState(false);
  const [recentChecks, setRecentChecks] = useState<HistoryEntry<ShoppingScamInput, ShoppingAnalysisResult>[]>(() =>
    getRecentChecks<ShoppingScamInput, ShoppingAnalysisResult>('shopping')
  );

  const handleInputChange = (field: keyof ShoppingScamInput, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectSample = (sample: typeof sampleShoppingItems[0]) => {
    setForm({ ...sample.data });
  };

  const handleAnalyze = async () => {
    if (!form.productName.trim() || !form.advertisedPrice) return;

    setLoading(true);
    setAnalyzedItem({ ...form });

    try {
      const res = await fetch('/api/analyze-shopping-scam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: form, lang }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setResult(json.data);
          const preview = `${form.productName} (रु. ${form.advertisedPrice}) - ${form.sellerPlatform}`;
          saveRecentCheck('shopping', {
            preview,
            riskLevel: json.data.riskLevel,
            score: json.data.score,
            scamType: json.data.scamType || (lang === 'ne' ? 'अनलाइन किनमेल ठगी' : 'Online Shopping Scam'),
            inputData: { ...form },
            result: json.data,
          });
          setRecentChecks(getRecentChecks<ShoppingScamInput, ShoppingAnalysisResult>('shopping'));
          setViewMode('result');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setLoading(false);
          return;
        }
      }
      throw new Error('Server returned non-ok');
    } catch {
      // Local heuristic fallback
      const local = analyzeShoppingScamClient(form, lang);
      setResult(local);
      const preview = `${form.productName} (रु. ${form.advertisedPrice}) - ${form.sellerPlatform}`;
      saveRecentCheck('shopping', {
        preview,
        riskLevel: local.riskLevel,
        score: local.score,
        scamType: local.scamType || (lang === 'ne' ? 'अनलाइन किनमेल ठगी' : 'Online Shopping Scam'),
        inputData: { ...form },
        result: local,
      });
      setRecentChecks(getRecentChecks<ShoppingScamInput, ShoppingAnalysisResult>('shopping'));
      setViewMode('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecent = (entry: HistoryEntry<ShoppingScamInput, ShoppingAnalysisResult>) => {
    setForm(entry.inputData);
    setAnalyzedItem(entry.inputData);
    setResult(entry.result);
    setViewMode('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteRecent = (id: string) => {
    deleteRecentCheck('shopping', id);
    setRecentChecks(getRecentChecks<ShoppingScamInput, ShoppingAnalysisResult>('shopping'));
  };

  const handleClearRecent = () => {
    clearRecentChecks('shopping');
    setRecentChecks([]);
  };

  const handleBackToInput = () => {
    setViewMode('input');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setForm(defaultForm);
    setAnalyzedItem(null);
    setResult(null);
    setViewMode('input');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyReport = () => {
    if (!result || !analyzedItem) return;
    const reportText = `🛡️ Scam Protection AI — Social Media Shopping Analysis (${new Date().toLocaleDateString()})
Product: ${analyzedItem.productName}
Market Price: Rs. ${analyzedItem.marketPrice || 'N/A'} | Advertised Price: Rs. ${analyzedItem.advertisedPrice}
Advance Demanded: Rs. ${analyzedItem.advancePayment || '0'}
Seller: ${analyzedItem.sellerName} (${analyzedItem.sellerPlatform})

Verdict: ${result.riskLevel} (${result.score}%)
Summary: ${result.summary}

Warning Signs:
${result.warningSigns.map((w) => `• ${w}`).join('\n')}

Safe Purchasing Advice:
${result.safeAlternatives.map((s) => `• ${s}`).join('\n')}

Disclaimer: ${result.disclaimer}`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // ==========================================
  // VIEW MODE: RESULT SCREEN (Dedicated Page)
  // ==========================================
  if (viewMode === 'result' && result && analyzedItem) {
    const marketP = Number(analyzedItem.marketPrice) || 0;
    const advP = Number(analyzedItem.advertisedPrice) || 0;
    const depositP = Number(analyzedItem.advancePayment) || 0;

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
                textToRead={`${result.summary}. ${result.warningSigns?.slice(0, 2).join('. ') || ''}. ${result.safeAlternatives?.[0] || ''}`}
                lang={lang}
              />
            )}

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 transition-all cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{currentT.checkAnotherShopping}</span>
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

        {/* Inspected Deal Summary Bubble */}
        <div className="p-4 rounded-2xl bg-[#0b1220] border border-slate-800 space-y-3">
          <div
            onClick={() => setShowItemDetails(!showItemDetails)}
            className="flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-slate-400 hover:text-slate-200"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentT.inspectedShoppingItem}: <strong className="text-white">{analyzedItem.productName}</strong></span>
            </div>
            {showItemDetails ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>

          {showItemDetails && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{isNe ? 'विज्ञापन मूल्य' : 'Offered Price'}</span>
                <span className="text-cyan-300 font-bold">रु. {advP.toLocaleString()}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{isNe ? 'बजार मूल्य' : 'Market Price'}</span>
                <span className="text-slate-300">{marketP > 0 ? `रु. ${marketP.toLocaleString()}` : 'N/A'}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{isNe ? 'अग्रिम माग' : 'Advance Demanded'}</span>
                <span className={depositP > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                  {depositP > 0 ? `रु. ${depositP.toLocaleString()}` : 'रु. ० (None)'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{isNe ? 'प्लेटफर्म' : 'Platform'}</span>
                <span className="text-slate-300 truncate block">{analyzedItem.sellerPlatform}</span>
              </div>
            </div>
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
                {isNe ? 'मूल्यांकन: ' : 'Assessment: '}
                <span className="font-semibold text-cyan-300">{analyzedItem.sellerName || 'Online Seller Deal'}</span>
              </p>
            </div>
          </div>

          {/* Risk Meter */}
          <RiskMeter level={result.riskLevel} score={result.score} lang={lang} />

          {/* 3 Key Shopping Diagnostics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. Price Assessment */}
            <div className="p-3.5 rounded-2xl bg-[#0b1220] border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                {currentT.priceAssessment}
              </span>
              <p className="text-xs sm:text-sm font-semibold text-white">
                {result.priceAssessment}
              </p>
            </div>

            {/* 2. Advance Payment Assessment */}
            <div className="p-3.5 rounded-2xl bg-[#0b1220] border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-rose-400" />
                {currentT.advanceAssessment}
              </span>
              <p className="text-xs sm:text-sm font-semibold text-white">
                {result.advancePaymentAssessment}
              </p>
            </div>

            {/* 3. Seller Credibility */}
            <div className="p-3.5 rounded-2xl bg-[#0b1220] border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-amber-400" />
                {currentT.sellerAssessment}
              </span>
              <p className="text-xs sm:text-sm font-semibold text-white">
                {result.sellerAssessment}
              </p>
            </div>
          </div>

          {/* Summary Box */}
          <div className="p-4 rounded-2xl bg-[#0b1220] border border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              {isNe ? 'निष्कर्ष र विश्लेषण' : 'Analysis Verdict Summary'}
            </h4>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              {result.summary}
            </p>
          </div>

          {/* Warning Signs */}
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

          {/* Safe Purchasing Recommendations */}
          {result.safeAlternatives && result.safeAlternatives.length > 0 && (
            <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/40">
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                {currentT.safeAlternatives}
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                {result.safeAlternatives.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-cyan-400 font-bold shrink-0 mt-0.5">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Emergency Alert if High Risk */}
          {result.riskLevel === 'HIGH_RISK' && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-600/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-rose-300">
                  {isNe
                    ? 'के तपाईंले यस विक्रेतालाई अग्रिम पैसा पठाइसक्नुभयो?'
                    : 'Did you already transfer advance money to this seller?'}
                </p>
                <p className="text-[11px] text-rose-200/80 mt-0.5">
                  {isNe
                    ? 'पैसा पठाइसकेको भए तत्काल बैंक वा वालेटमा खबर गरी खाता रोक्का गराउने प्रक्रिया चाल्नुहोस्।'
                    : 'If funds were transferred, open our Emergency Rescue flow immediately.'}
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

          {/* Disclaimer */}
          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p className="max-w-2xl">{result.disclaimer}</p>
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
        <DetailedAnalysisCard data={result.detailedAnalysis} lang={lang} />

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
      <div className="bg-[#121c33] border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-6">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
              {currentT.shoppingTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {currentT.shoppingSubtitle}
            </p>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/50 font-medium self-start sm:self-auto">
            {isNe ? 'मूल्य, Advance र विक्रेता विश्लेषण' : 'Price, Advance & Seller Check'}
          </span>
        </div>

        {/* Preset Sample Deals */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2">
            {currentT.shoppingSamplesLabel}
          </label>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {sampleShoppingItems.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all cursor-pointer active:scale-95 text-left"
              >
                <span className="text-cyan-400 mr-1.5">🛍️</span>
                {isNe ? sample.titleNe : sample.titleEn}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Checks Bar (Last 3 Checks) */}
        <RecentChecksBar
          type="shopping"
          lang={lang}
          entries={recentChecks}
          onSelect={handleSelectRecent}
          onDelete={handleDeleteRecent}
          onClear={handleClearRecent}
        />

        {/* Input Form Fields */}
        <div className="space-y-4">
          {/* Row 1: Product Name & Selling Platform */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                {currentT.productNameLabel}
              </label>
              <input
                type="text"
                value={form.productName}
                onChange={(e) => handleInputChange('productName', e.target.value)}
                placeholder={isNe ? 'उदा: iPhone 15 Pro, Nike Air Jordan, सुनको गहना' : 'e.g., iPhone 15 Pro, Nike Sneakers'}
                className="w-full bg-[#0b1220] border border-slate-700/80 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                {currentT.sellerPlatformLabel}
              </label>
              <select
                value={form.sellerPlatform}
                onChange={(e) => handleInputChange('sellerPlatform', e.target.value)}
                className="w-full bg-[#0b1220] border border-slate-700/80 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Facebook Marketplace">Facebook Marketplace</option>
                <option value="TikTok Shop / Ad">TikTok Shop / Video Ad</option>
                <option value="Instagram Store">Instagram Store Page</option>
                <option value="Telegram / WhatsApp Group">Telegram / WhatsApp Store</option>
                <option value="Daraz / Hamrobazar">Daraz / Hamrobazar</option>
                <option value="Other Online Website">Other Website</option>
              </select>
            </div>
          </div>

          {/* Row 2: Price Details (Market vs Advertised vs Advance) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                {currentT.marketPriceLabel}
              </label>
              <input
                type="number"
                value={form.marketPrice}
                onChange={(e) => handleInputChange('marketPrice', e.target.value)}
                placeholder="उदा: 30000"
                className="w-full bg-[#0b1220] border border-slate-700/80 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                {currentT.advertisedPriceLabel}
              </label>
              <input
                type="number"
                value={form.advertisedPrice}
                onChange={(e) => handleInputChange('advertisedPrice', e.target.value)}
                placeholder="उदा: 12000"
                className="w-full bg-[#0b1220] border border-slate-700/80 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1 text-rose-300">
                {currentT.advancePaymentLabel}
              </label>
              <input
                type="number"
                value={form.advancePayment}
                onChange={(e) => handleInputChange('advancePayment', e.target.value)}
                placeholder="उदा: 6000"
                className="w-full bg-[#0b1220] border border-rose-900/60 rounded-xl p-3 text-sm text-rose-200 placeholder:text-slate-600 font-mono focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Row 3: Seller Name, Profile URL, Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                {currentT.sellerNameLabel}
              </label>
              <input
                type="text"
                value={form.sellerName}
                onChange={(e) => handleInputChange('sellerName', e.target.value)}
                placeholder="उदा: Mega Clearance Hub"
                className="w-full bg-[#0b1220] border border-slate-700/80 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                {currentT.sellerProfileUrlLabel}
              </label>
              <input
                type="text"
                value={form.sellerProfileUrl}
                onChange={(e) => handleInputChange('sellerProfileUrl', e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full bg-[#0b1220] border border-slate-700/80 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                {currentT.paymentMethodLabel}
              </label>
              <select
                value={form.paymentMethod}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                className="w-full bg-[#0b1220] border border-slate-700/80 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Personal eSewa / QR">Personal Digital Wallet (eSewa / Khalti QR)</option>
                <option value="Personal Bank Account">Personal Bank Account Transfer</option>
                <option value="Cash on Delivery (COD)">Cash on Delivery (COD - सामान पाएपछि)</option>
                <option value="Official Merchant Gateway">Official Merchant Payment Gateway</option>
              </select>
            </div>
          </div>

          {/* Row 4: Transparency Checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <label className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-colors ${
              form.commentsDisabled
                ? 'bg-rose-950/40 border-rose-700/60 text-rose-200'
                : 'bg-[#0b1220] border-slate-800 text-slate-400'
            }`}>
              <input
                type="checkbox"
                checked={form.commentsDisabled}
                onChange={(e) => handleInputChange('commentsDisabled', e.target.checked)}
                className="rounded text-rose-500 focus:ring-0"
              />
              <span className="text-xs font-medium">
                {currentT.commentsDisabledLabel}
              </span>
            </label>

            <label className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-colors ${
              form.hasPhysicalStore
                ? 'bg-emerald-950/30 border-emerald-700/60 text-emerald-200'
                : 'bg-[#0b1220] border-slate-800 text-slate-400'
            }`}>
              <input
                type="checkbox"
                checked={form.hasPhysicalStore}
                onChange={(e) => handleInputChange('hasPhysicalStore', e.target.checked)}
                className="rounded text-emerald-500 focus:ring-0"
              />
              <span className="text-xs font-medium">
                {currentT.hasPhysicalStoreLabel}
              </span>
            </label>

            <label className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-colors ${
              form.hasReturnPolicy
                ? 'bg-emerald-950/30 border-emerald-700/60 text-emerald-200'
                : 'bg-[#0b1220] border-slate-800 text-slate-400'
            }`}>
              <input
                type="checkbox"
                checked={form.hasReturnPolicy}
                onChange={(e) => handleInputChange('hasReturnPolicy', e.target.checked)}
                className="rounded text-emerald-500 focus:ring-0"
              />
              <span className="text-xs font-medium">
                {currentT.hasReturnPolicyLabel}
              </span>
            </label>
          </div>

          {/* Row 5: Ad Description Text */}
          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">
              {currentT.adDescriptionLabel}
            </label>
            <textarea
              rows={3}
              value={form.adDescription}
              onChange={(e) => handleInputChange('adDescription', e.target.value)}
              placeholder={isNe ? 'फेसबुक वा टिकटक विज्ञापनमा लेखिएको सम्पूर्ण व्यहोरा यहाँ पेस्ट गर्नुहोस्...' : 'Paste the full ad caption or chat negotiation text here...'}
              className="w-full bg-[#0b1220] border border-slate-700/80 rounded-xl p-3 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Row 6: Screenshot / Video Details */}
          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">
              {currentT.screenshotNotesLabel}
            </label>
            <input
              type="text"
              value={form.screenshotNotes}
              onChange={(e) => handleInputChange('screenshotNotes', e.target.value)}
              placeholder={isNe ? 'जस्तै: विदेशी भिडियोमा नेपाली अडियो हालिएको, वाटरमार्क मेटाइएको, नक्कली रसिद देखाइएको...' : 'e.g. video shows foreign store, logo blurred, fake customer screenshot attached...'}
              className="w-full bg-[#0b1220] border border-slate-700/80 rounded-xl p-3 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleAnalyze}
            disabled={loading || !form.productName.trim() || !form.advertisedPrice}
            className="w-full sm:flex-1 py-3 px-6 rounded-xl font-bold text-sm sm:text-base bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 shadow-lg shadow-cyan-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                <span>{currentT.shoppingAnalyzing}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{currentT.shoppingAnalyzeBtn}</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isNe ? 'खाली गर्नुहोस्' : 'Reset'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

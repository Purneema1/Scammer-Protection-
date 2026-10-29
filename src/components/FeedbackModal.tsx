import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  CheckCircle2,
  MessageSquare,
  Star,
  AlertTriangle,
  FileQuestion,
  Users,
  ThumbsUp,
  CornerDownRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { Language, CustomerFeedback, CustomerIssue, CustomerComment } from '../types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialContext?: string;
  defaultTab?: 'feedback' | 'issue' | 'community';
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialContext = '',
  defaultTab = 'feedback',
}) => {
  const isNe = lang === 'ne';
  const [activeTab, setActiveTab] = useState<'feedback' | 'issue' | 'community'>(defaultTab);

  // Tab 1: Feedback state
  const [rating, setRating] = useState<number>(5);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [feedbackType, setFeedbackType] = useState<CustomerFeedback['feedbackType']>('accuracy');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [submittingFb, setSubmittingFb] = useState(false);
  const [fbSuccess, setFbSuccess] = useState(false);

  // Tab 2: Issue state
  const [issueTitle, setIssueTitle] = useState('');
  const [issueCategory, setIssueCategory] = useState<CustomerIssue['category']>('new_scam_pattern');
  const [issueSeverity, setIssueSeverity] = useState<CustomerIssue['severity']>('HIGH');
  const [issueContact, setIssueContact] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [submittingIssue, setSubmittingIssue] = useState(false);
  const [issueSuccessTicket, setIssueSuccessTicket] = useState<string | null>(null);

  // Tab 3: Community comments
  const [comments, setComments] = useState<CustomerComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentTopic, setCommentTopic] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isVictim, setIsVictim] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      loadComments();
    }
  }, [isOpen, defaultTab]);

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const res = await fetch('/api/comments');
      const data = await res.json();
      if (data.comments) {
        setComments(data.comments);
      }
    } catch {
      // silent
    } finally {
      setLoadingComments(false);
    }
  };

  if (!isOpen) return null;

  // Handle Feedback Submit
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackComment.trim() || submittingFb) return;

    setSubmittingFb(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim() || undefined,
          customerEmail: customerEmail.trim() || undefined,
          rating,
          feedbackType,
          checkContext: initialContext || undefined,
          comment: feedbackComment.trim(),
        }),
      });
      if (res.ok) {
        setFbSuccess(true);
        setTimeout(() => {
          setFbSuccess(false);
          setFeedbackComment('');
          onClose();
        }, 2200);
      }
    } catch {
      alert(isNe ? 'प्रतिक्रिया पठाउन सकिएन' : 'Failed to submit feedback');
    } finally {
      setSubmittingFb(false);
    }
  };

  // Handle Issue Submit
  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueTitle.trim() || !issueDescription.trim() || submittingIssue) return;

    setSubmittingIssue(true);
    try {
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim() || undefined,
          customerContact: issueContact.trim() || undefined,
          category: issueCategory,
          severity: issueSeverity,
          title: issueTitle.trim(),
          description: issueDescription.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.issue) {
        setIssueSuccessTicket(data.issue.ticketNumber);
        setTimeout(() => {
          setIssueSuccessTicket(null);
          setIssueTitle('');
          setIssueDescription('');
          onClose();
        }, 3000);
      }
    } catch {
      alert(isNe ? 'समस्या दर्ता गर्न सकिएन' : 'Failed to register issue ticket');
    } finally {
      setSubmittingIssue(false);
    }
  };

  // Handle Comment Submit
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentTopic.trim() || !commentText.trim() || submittingComment) return;

    setSubmittingComment(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: commentAuthor.trim() || undefined,
          topic: commentTopic.trim(),
          content: commentText.trim(),
          isVerifiedVictim: isVictim,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCommentText('');
        setCommentTopic('');
        loadComments();
      }
    } catch {
      // silent
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleLike = async (id: string) => {
    try {
      await fetch(`/api/comments/${id}/like`, { method: 'POST' });
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, likes: (c.likes || 0) + 1 } : c))
      );
    } catch {
      // silent
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#0f172a] border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl relative max-h-[90vh] flex flex-col overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header & Navigation Tabs */}
        <div className="space-y-4 shrink-0 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <span>{isNe ? 'प्रतिक्रिया, समस्या दर्ता र छलफल' : 'Feedback, Issue Ticket & Comments'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isNe
                ? 'तपाईंको अनुभव, सुझाव वा नयाँ ठगीको जानकारी हामीलाई पठाउनुहोस्'
                : 'Share your ratings, report detection discrepancies, or raise urgent issues.'}
            </p>
          </div>

          {/* 3 Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('feedback')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 ${
                activeTab === 'feedback'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>{isNe ? '⭐ प्रतिक्रिया र रेटिङ' : '⭐ Rating & Feedback'}</span>
            </button>

            <button
              onClick={() => setActiveTab('issue')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 ${
                activeTab === 'issue'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{isNe ? '⚠️ समस्या दर्ता (Ticket)' : '⚠️ Raise Issue'}</span>
            </button>

            <button
              onClick={() => setActiveTab('community')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 ${
                activeTab === 'community'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{isNe ? '💬 नागरिक सचेतना छलफल' : '💬 Community Forum'}</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-4 pr-1 space-y-4">
          {/* ======================================================== */}
          {/* TAB 1: CUSTOMER FEEDBACK & 5-STAR RATING                 */}
          {/* ======================================================== */}
          {activeTab === 'feedback' && (
            <div>
              {fbSuccess ? (
                <div className="py-12 text-center space-y-3">
                  <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
                  <h3 className="text-lg font-bold text-white">
                    {isNe ? 'प्रतिक्रिया दर्ता भयो! धन्यवाद।' : 'Feedback Submitted Successfully!'}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {isNe
                      ? 'तपाईंको अमूल्य प्रतिक्रिया व्यवस्थापक (Admin) प्यानलमा प्राप्त भइसकेको छ। यसले एआईलाई अझ चुस्त बनाउन सहयोग गर्दछ।'
                      : 'Your rating and feedback have been stored and logged for the cyber defense team.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  {/* Star Rating Selection */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-2">
                    <label className="text-xs font-bold text-slate-300 block">
                      {isNe ? 'एपको नतिजा र अनुभव कत्तिको प्रभावकारी लाग्यो?' : 'How accurate and helpful was this scan?'}
                    </label>
                    <div className="flex items-center justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-125 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-amber-400 font-bold block">
                      {rating === 5 && (isNe ? 'उत्कृष्ट (५/५)' : 'Excellent (5/5)')}
                      {rating === 4 && (isNe ? 'धेरै राम्रो (४/५)' : 'Very Good (4/5)')}
                      {rating === 3 && (isNe ? 'ठिकै (३/५)' : 'Average (3/5)')}
                      {rating === 2 && (isNe ? 'सुधार आवश्यक (२/५)' : 'Needs Improvement (2/5)')}
                      {rating === 1 && (isNe ? 'असहमत / गलत नतिजा (१/५)' : 'Poor / Inaccurate (1/5)')}
                    </span>
                  </div>

                  {/* Context note if available */}
                  {initialContext && (
                    <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-300">
                      <span className="font-bold">{isNe ? 'सम्बन्धित जाँच: ' : 'Checked Context: '}</span>
                      {initialContext}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300">
                        {isNe ? 'तपाईंको नाम (ऐच्छिक)' : 'Your Name (Optional)'}
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder={isNe ? 'जस्तै: सन्तोष शर्मा' : 'e.g., Santosh Sharma'}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300">
                        {isNe ? 'प्रतिक्रियाको श्रेणी' : 'Feedback Category'}
                      </label>
                      <select
                        value={feedbackType}
                        onChange={(e) => setFeedbackType(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="accuracy">{isNe ? 'नतिजा शुद्धता (Accuracy)' : 'Accuracy'}</option>
                        <option value="false_positive">{isNe ? 'गल्तीले ठगी भनियो (False Positive)' : 'False Positive'}</option>
                        <option value="missed_scam">{isNe ? 'ठगी पहिचान भएन (Missed Scam)' : 'Missed Scam'}</option>
                        <option value="app_experience">{isNe ? 'एप अनुभव (App Experience)' : 'App Experience'}</option>
                        <option value="feature_request">{isNe ? 'नयाँ सुविधाको माग (Feature Request)' : 'Feature Request'}</option>
                        <option value="general">{isNe ? 'सामान्य टिप्पणी (General)' : 'General'}</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">
                      {isNe ? 'तपाईंको टिप्पणी वा अनुभव *' : 'Your Comments & Experience *'}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      placeholder={
                        isNe
                          ? 'यस एपले तपाईंलाई कसरी मद्दत गर्यो वा के सुधार गर्नुपर्ला? (व्यक्तिगत पासवर्ड नलेख्नुहोस्)...'
                          : 'How did this app assist you, or what could be improved? (Do not enter passwords)...'
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                    >
                      {isNe ? 'रद्द गर्नुहोस्' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={!feedbackComment.trim() || submittingFb}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-1.5 transition cursor-pointer disabled:opacity-40"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submittingFb ? (isNe ? 'पठाउँदैछ...' : 'Submitting...') : isNe ? 'प्रतिक्रिया पठाउनुहोस्' : 'Submit Feedback'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: RAISE AN ISSUE / COMPLAINT TICKET                */}
          {/* ======================================================== */}
          {activeTab === 'issue' && (
            <div>
              {issueSuccessTicket ? (
                <div className="py-10 text-center space-y-3">
                  <CheckCircle2 className="w-14 h-14 text-rose-400 mx-auto animate-bounce" />
                  <h3 className="text-lg font-bold text-white">
                    {isNe ? 'समस्या टिकट सफलतापूर्वक दर्ता भयो!' : 'Support Ticket Created!'}
                  </h3>
                  <div className="inline-block px-4 py-1.5 bg-rose-950/80 border border-rose-700/60 rounded-xl text-sm font-mono text-rose-300 font-bold">
                    Ticket: {issueSuccessTicket}
                  </div>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {isNe
                      ? 'व्यवस्थापकले यो टिकट हेरेर तुरुन्त अनुसन्धान र समाधान गर्नेछन्।'
                      : 'Our admin team will review this ticket and update its status accordingly.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleIssueSubmit} className="space-y-4">
                  <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-900/40 text-xs text-rose-300">
                    {isNe
                      ? '⚠️ नयाँ शैलीको ठगी, नतिजामा ठूलो त्रुटि, वा आपतकालीन साइबर सहायताका लागि यहाँ समस्या दर्ता गर्नुहोस्।'
                      : 'Report emerging scam tactics, severe misclassifications, or urgent support requirements.'}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">
                      {isNe ? 'समस्याको शीर्षक (Title) *' : 'Issue Summary / Title *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={issueTitle}
                      onChange={(e) => setIssueTitle(e.target.value)}
                      placeholder={isNe ? 'जस्तै: विद्युत महसुलको नयाँ नक्कली SMS, वा इसेवा खाता रोक्का समस्या' : 'e.g., New NEA electricity power cutoff SMS scam'}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300">
                        {isNe ? 'समस्याको प्रकार (Category)' : 'Issue Category'}
                      </label>
                      <select
                        value={issueCategory}
                        onChange={(e) => setIssueCategory(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                      >
                        <option value="new_scam_pattern">{isNe ? 'नयाँ ठगी शैली (New Scam Pattern)' : 'New Scam Pattern'}</option>
                        <option value="wrong_verdict">{isNe ? 'गलत नतिजा (Inaccurate Verdict)' : 'Inaccurate Verdict'}</option>
                        <option value="emergency_escalation">{isNe ? 'आपतकालीन सहयोग (Emergency Escalation)' : 'Emergency Help'}</option>
                        <option value="wallet_reversal">{isNe ? 'वालेट / बैंक रोक्का समस्या (Wallet Hold)' : 'Wallet Reversal Issue'}</option>
                        <option value="app_bug">{isNe ? 'एपको प्राविधिक समस्या (App Bug)' : 'Technical Bug'}</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300">
                        {isNe ? 'प्राथमिकता (Severity)' : 'Severity Level'}
                      </label>
                      <select
                        value={issueSeverity}
                        onChange={(e) => setIssueSeverity(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                      >
                        <option value="CRITICAL">{isNe ? 'अत्यन्त गम्भीर (Critical - पैसा फसेको)' : 'Critical (Money Lost)'}</option>
                        <option value="HIGH">{isNe ? 'उच्च (High)' : 'High'}</option>
                        <option value="MEDIUM">{isNe ? 'मध्यम (Medium)' : 'Medium'}</option>
                        <option value="LOW">{isNe ? 'सामान्य (Low)' : 'Low'}</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300">
                        {isNe ? 'तपाईंको नाम' : 'Your Name'}
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder={isNe ? 'जस्तै: सुवास खड्का' : 'Your name'}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300">
                        {isNe ? 'सम्पर्क नम्बर / इमेल (ऐच्छिक)' : 'Contact Phone / Email'}
                      </label>
                      <input
                        type="text"
                        value={issueContact}
                        onChange={(e) => setIssueContact(e.target.value)}
                        placeholder={isNe ? '98******** वा इमेल' : 'Phone or Email'}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">
                      {isNe ? 'विस्तृत विवरण र प्रमाण *' : 'Detailed Description & Incident Context *'}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={issueDescription}
                      onChange={(e) => setIssueDescription(e.target.value)}
                      placeholder={
                        isNe
                          ? 'घटना, ठगको नम्बर वा कसरी ठग्ने प्रयास भयो भन्ने विस्तृत जानकारी यहाँ लेख्नुहोस्...'
                          : 'Describe the incident, phone numbers, website links, or what happened in detail...'
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                    >
                      {isNe ? 'रद्द' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={!issueTitle.trim() || !issueDescription.trim() || submittingIssue}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 transition cursor-pointer disabled:opacity-40"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{submittingIssue ? (isNe ? 'दर्ता हुँदैछ...' : 'Registering...') : isNe ? 'समस्या दर्ता गर्नुहोस्' : 'Raise Support Ticket'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: COMMUNITY COMMENTS & SCAM WARNINGS                */}
          {/* ======================================================== */}
          {activeTab === 'community' && (
            <div className="space-y-4">
              {/* Post a comment form */}
              <form onSubmit={handleCommentSubmit} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-white block">
                  {isNe ? '📢 आफ्नो अनुभव वा ठगीको चेतावनी कमेन्ट गर्नुहोस्:' : '📢 Post a Scam Warning or Experience:'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    placeholder={isNe ? 'तपाईंको नाम (उदा: सन्दीप)' : 'Your Name'}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    required
                    value={commentTopic}
                    onChange={(e) => setCommentTopic(e.target.value)}
                    placeholder={isNe ? 'विषय (उदा: टेलिग्राम जब वा फेसबुक आइफोन)' : 'Scam Topic (e.g., Telegram Tasks)'}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <textarea
                  rows={2}
                  required
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={
                    isNe
                      ? 'अन्य नेपाली नागरिकलाई सचेत गराउन आफ्नो अनुभव वा सल्लाह यहाँ लेख्नुहोस्...'
                      : 'Share warning tips or what to avoid with other citizens...'
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isVictim}
                      onChange={(e) => setIsVictim(e.target.checked)}
                      className="rounded border-slate-700 text-rose-500 focus:ring-0"
                    />
                    <span>{isNe ? 'म यो ठगीमा परेको थिएँ (Victim Experience)' : 'I was targeted by this scam'}</span>
                  </label>

                  <button
                    type="submit"
                    disabled={!commentTopic.trim() || !commentText.trim() || submittingComment}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition cursor-pointer disabled:opacity-40"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingComment ? (isNe ? 'पोस्ट हुँदैछ...' : 'Posting...') : isNe ? 'कमेन्ट पोस्ट गर्नुहोस्' : 'Post Comment'}</span>
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                  {isNe ? 'ताजा नागरिक अनुभव तथा कमेन्टहरू:' : 'Recent Community Warnings:'}
                </span>

                {loadingComments ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    {isNe ? 'कमेन्टहरू खुल्दैछन्...' : 'Loading community comments...'}
                  </div>
                ) : comments.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 bg-slate-900/50 rounded-2xl">
                    {isNe ? 'अहिले कुनै कमेन्ट छैन। पहिलो कमेन्ट तपाईं नै गर्नुहोस्!' : 'No community comments yet. Be the first to share!'}
                  </div>
                ) : (
                  comments.map((cmt) => (
                    <div
                      key={cmt.id}
                      className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{cmt.authorName}</span>
                          {cmt.isVerifiedVictim && (
                            <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-rose-950 text-rose-300 border border-rose-800/60">
                              {isNe ? 'पीडित अनुभव' : 'Victim Report'}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {new Date(cmt.timestamp).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="text-cyan-400 font-semibold">{cmt.topic}</div>
                      <p className="text-slate-300 leading-relaxed">{cmt.content}</p>

                      {/* Admin replies if any */}
                      {cmt.replies && cmt.replies.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-800/80 space-y-1.5 pl-3 border-l-2 border-emerald-500/50">
                          {cmt.replies.map((rep) => (
                            <div key={rep.id} className="text-[11px]">
                              <span className="font-bold text-emerald-400">
                                {rep.author} {rep.isAdmin && '(Official Admin): '}
                              </span>
                              <span className="text-slate-300">{rep.text}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                        <button
                          onClick={() => handleLike(cmt.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                        >
                          <ThumbsUp className="w-3 h-3 text-cyan-400" />
                          <span>{cmt.likes || 1} {isNe ? 'सहमत' : 'Helpful'}</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

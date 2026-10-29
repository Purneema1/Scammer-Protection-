import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Unlock,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Trash2,
  Download,
  MessageSquare,
  Link as LinkIcon,
  ShoppingBag,
  Camera,
  Mic,
  Bot,
  Star,
  Users,
  Eye,
  X,
  Send,
  RefreshCw,
  FileText,
  LifeBuoy,
  PhoneCall,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import {
  Language,
  CustomerCheckRecord,
  CustomerFeedback,
  CustomerIssue,
  CustomerComment,
  AdminStats,
} from '../types';

interface AdminDashboardProps {
  lang: Language;
  onNavigateHome: () => void;
}

export function AdminDashboard({ lang, onNavigateHome }: AdminDashboardProps) {
  const isNe = lang === 'ne';

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('scam_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'checks' | 'feedback' | 'issues' | 'comments'>('checks');

  // Stats
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Checks State
  const [checks, setChecks] = useState<CustomerCheckRecord[]>([]);
  const [loadingChecks, setLoadingChecks] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCheckForModal, setSelectedCheckForModal] = useState<CustomerCheckRecord | null>(null);

  // Feedback State
  const [feedbacks, setFeedbacks] = useState<CustomerFeedback[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});

  // Issues State
  const [issues, setIssues] = useState<CustomerIssue[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [selectedIssueForEdit, setSelectedIssueForEdit] = useState<CustomerIssue | null>(null);
  const [editIssueStatus, setEditIssueStatus] = useState<CustomerIssue['status']>('OPEN');
  const [editIssueSeverity, setEditIssueSeverity] = useState<CustomerIssue['severity']>('HIGH');
  const [editAdminNotes, setEditAdminNotes] = useState('');
  const [editAdminReply, setEditAdminReply] = useState('');
  const [savingIssue, setSavingIssue] = useState(false);

  // Comments State
  const [comments, setComments] = useState<CustomerComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentReplyMap, setCommentReplyMap] = useState<Record<string, string>>({});

  // Load Initial Data once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
      loadChecks();
      loadFeedbacks();
      loadIssues();
      loadComments();
    }
  }, [isAuthenticated]);

  const handlePinSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsVerifying(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput.trim() }),
      });
      const data = await res.json();
      if (data.success && data.authorized) {
        setIsAuthenticated(true);
        sessionStorage.setItem('scam_admin_auth', 'true');
      } else {
        setAuthError(data.error || (isNe ? 'गलत पिन कोड' : 'Invalid PIN'));
      }
    } catch {
      setAuthError(isNe ? 'प्रमाणीकरण असफल' : 'Authentication failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleQuickDemoUnlock = () => {
    setPinInput('admin123');
    setIsAuthenticated(true);
    sessionStorage.setItem('scam_admin_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('scam_admin_auth');
  };

  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.stats) setStats(data.stats);
    } catch {
      // silent
    } finally {
      setLoadingStats(false);
    }
  };

  const loadChecks = async () => {
    setLoadingChecks(true);
    try {
      const params = new URLSearchParams();
      if (selectedTool !== 'all') params.append('toolType', selectedTool);
      if (selectedRisk !== 'all') params.append('riskLevel', selectedRisk);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/admin/checks?${params.toString()}`);
      const data = await res.json();
      if (data.checks) setChecks(data.checks);
    } catch {
      // silent
    } finally {
      setLoadingChecks(false);
    }
  };

  const handleDeleteCheck = async (id: string) => {
    if (!confirm(isNe ? 'के यो चेक लग मेटाउन चाहनुहुन्छ?' : 'Delete this check log?')) return;
    try {
      await fetch(`/api/admin/checks/${id}`, { method: 'DELETE' });
      setChecks((prev) => prev.filter((c) => c.id !== id));
      loadStats();
    } catch {
      alert('Failed to delete');
    }
  };

  const handleClearAllChecks = async () => {
    if (!confirm(isNe ? 'सबै ग्राहक चेक लगहरू खाली गर्न निश्चित हुनुहुन्छ?' : 'Clear ALL check logs?')) return;
    try {
      await fetch('/api/admin/clear-checks', { method: 'POST' });
      setChecks([]);
      loadStats();
    } catch {
      alert('Failed to clear');
    }
  };

  const loadFeedbacks = async () => {
    setLoadingFeedback(true);
    try {
      const res = await fetch('/api/feedback');
      const data = await res.json();
      if (data.feedback) setFeedbacks(data.feedback);
    } catch {
      // silent
    } finally {
      setLoadingFeedback(false);
    }
  };

  const handleReplyFeedback = async (id: string) => {
    const reply = replyTextMap[id];
    if (!reply || !reply.trim()) return;

    try {
      const res = await fetch(`/api/feedback/${id}/reply`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply }),
      });
      if (res.ok) {
        setReplyTextMap((prev) => ({ ...prev, [id]: '' }));
        loadFeedbacks();
      }
    } catch {
      alert('Failed to reply');
    }
  };

  const loadIssues = async () => {
    setLoadingIssues(true);
    try {
      const res = await fetch('/api/issues');
      const data = await res.json();
      if (data.issues) setIssues(data.issues);
    } catch {
      // silent
    } finally {
      setLoadingIssues(false);
    }
  };

  const handleOpenEditIssue = (issue: CustomerIssue) => {
    setSelectedIssueForEdit(issue);
    setEditIssueStatus(issue.status);
    setEditIssueSeverity(issue.severity);
    setEditAdminNotes(issue.adminNotes || '');
    setEditAdminReply(issue.adminReply || '');
  };

  const handleSaveIssue = async () => {
    if (!selectedIssueForEdit) return;
    setSavingIssue(true);
    try {
      const res = await fetch(`/api/issues/${selectedIssueForEdit.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editIssueStatus,
          severity: editIssueSeverity,
          adminNotes: editAdminNotes,
          adminReply: editAdminReply,
        }),
      });
      if (res.ok) {
        setSelectedIssueForEdit(null);
        loadIssues();
        loadStats();
      }
    } catch {
      alert('Failed to update issue');
    } finally {
      setSavingIssue(false);
    }
  };

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const res = await fetch('/api/comments');
      const data = await res.json();
      if (data.comments) setComments(data.comments);
    } catch {
      // silent
    } finally {
      setLoadingComments(false);
    }
  };

  const handleReplyComment = async (commentId: string) => {
    const text = commentReplyMap[commentId];
    if (!text || !text.trim()) return;

    try {
      const res = await fetch(`/api/comments/${commentId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: 'Cyber Bureau Support Admin',
          text,
          isAdmin: true,
        }),
      });
      if (res.ok) {
        setCommentReplyMap((prev) => ({ ...prev, [commentId]: '' }));
        loadComments();
      }
    } catch {
      alert('Failed to reply');
    }
  };

  // Export Checks to CSV
  const handleExportChecksCSV = () => {
    if (checks.length === 0) return;
    const headers = ['ID', 'Date', 'Tool', 'CustomerSession', 'RiskLevel', 'Score', 'InputSummary', 'SolutionSummary'];
    const rows = checks.map((c) => [
      c.id,
      new Date(c.timestamp).toLocaleString(),
      c.toolNameEn,
      c.customerSession,
      c.riskLevel,
      c.score,
      `"${c.inputSummary.replace(/"/g, '""')}"`,
      `"${c.solutionSummary.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `scam_checks_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ==========================================
  // VIEW: PIN AUTHENTICATION FORM
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-[#121c33] border border-slate-700/80 rounded-3xl shadow-2xl space-y-6 animate-fadeIn">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-700/50 flex items-center justify-center text-cyan-400 mx-auto shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white">
            {isNe ? 'व्यवस्थापक नियन्त्रण कक्ष (Admin Portal)' : 'Scam Defense Admin Portal'}
          </h2>
          <p className="text-xs text-slate-400">
            {isNe
              ? 'ग्राहकहरूले के-के जाँचे, कस्तो समाधान आयो, र प्राप्त समस्याहरूको अनुगमन गर्न पिन कोड प्रविष्ट गर्नुहोस्।'
              : 'Enter admin passcode to inspect customer checks, AI solutions, and manage support tickets.'}
          </p>
        </div>

        <form onSubmit={handlePinSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              {isNe ? 'व्यवस्थापक पिन कोड (Admin PIN)' : 'Admin PIN Code'}
            </label>
            <input
              type="password"
              autoFocus
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="admin123"
              className="w-full bg-[#0b1220] border border-slate-700 rounded-xl px-4 py-3 text-sm text-center text-white tracking-widest placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
            {authError && <p className="text-xs text-rose-400 text-center font-medium">{authError}</p>}
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-slate-950 font-bold text-sm transition shadow-lg shadow-cyan-950/50 cursor-pointer disabled:opacity-50"
          >
            {isVerifying ? (isNe ? 'जाँच्दैछ...' : 'Verifying...') : isNe ? 'लगइन गर्नुहोस्' : 'Unlock Admin Portal'}
          </button>

          {/* Quick Demo Login Option */}
          <div className="pt-2 border-t border-slate-800 text-center space-y-2">
            <span className="text-[11px] text-slate-400 block">
              {isNe ? 'परीक्षणको लागि सिधै खोल्नुहोस् (Default PIN: admin123):' : 'Demo Passcode: admin123'}
            </span>
            <button
              type="button"
              onClick={handleQuickDemoUnlock}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 transition cursor-pointer"
            >
              <Unlock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isNe ? 'एक क्लिकमा डेमो एडमिन खोल्नुहोस्' : 'One-Click Demo Unlock'}</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ==========================================
  // VIEW: AUTHENTICATED ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Admin Header Bar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-[#121c33] via-[#0f172a] to-[#121c33] border border-slate-700/80 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-500 p-0.5 shadow-lg">
            <div className="w-full h-full bg-[#0d1627] rounded-[14px] flex items-center justify-center">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white tracking-tight">
                {isNe ? 'साइबर सुरक्षा व्यवस्थापक प्यानल (Admin Dashboard)' : 'Cyber Defense Admin Control'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                LIVE LOGGING
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {isNe
                ? 'ग्राहकहरूले गरेको जाँच, एआईले दिएको समाधान, प्रतिक्रिया र दर्ता भएका समस्याहरूको प्रत्यक्ष व्यवस्थापन।'
                : 'Real-time customer check records, AI generated solutions, user ratings, and issue resolution.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={() => {
              loadStats();
              loadChecks();
              loadFeedbacks();
              loadIssues();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            title={isNe ? 'डाटा ताजा गर्नुहोस्' : 'Refresh Data'}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 text-slate-300 border border-slate-700 hover:border-rose-800/50 text-xs font-semibold transition cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isNe ? 'लगआउट' : 'Lock Admin'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Overview Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
              {isNe ? 'कुल ग्राहक जाँचहरू' : 'Total Customer Checks'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{stats.totalChecks}</span>
              <span className="text-xs text-cyan-400 font-semibold">{isNe ? 'स्क्यान' : 'Scans'}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0f172a] border border-rose-900/30 space-y-1">
            <span className="text-[11px] font-semibold text-rose-300 block uppercase tracking-wider">
              {isNe ? 'उच्च जोखिम (ठगी रोकियो)' : 'High-Risk Blocked'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-rose-400">{stats.highRiskCount}</span>
              <span className="text-xs text-rose-300 font-semibold">
                {stats.totalChecks > 0 ? Math.round((stats.highRiskCount / stats.totalChecks) * 100) : 0}%
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0f172a] border border-amber-900/30 space-y-1">
            <span className="text-[11px] font-semibold text-amber-300 block uppercase tracking-wider">
              {isNe ? 'औसत ग्राहक रेटिङ' : 'Average User Rating'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-400">{stats.avgRating} ★</span>
              <span className="text-xs text-slate-400">({stats.totalFeedback} {isNe ? 'समीक्षा' : 'reviews'})</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0f172a] border border-emerald-900/30 space-y-1">
            <span className="text-[11px] font-semibold text-emerald-300 block uppercase tracking-wider">
              {isNe ? 'दर्ता भएका समस्या (Tickets)' : 'Active Issues'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-400">{stats.openIssues}</span>
              <span className="text-xs text-slate-400 font-semibold">{isNe ? 'सुलझाउन बाँकी' : 'Open'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('checks')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 cursor-pointer ${
            activeTab === 'checks'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>{isNe ? '१. ग्राहक जाँच र समाधान लग (Checks Log)' : '1. Customer Checks & Solutions Log'}</span>
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 cursor-pointer ${
            activeTab === 'feedback'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>{isNe ? '२. ग्राहक प्रतिक्रिया र रेटिङ (Feedback)' : '2. Ratings & Feedback'}</span>
          {feedbacks.length > 0 && (
            <span className="px-2 py-0.2 rounded-full bg-black/40 text-[10px]">
              {feedbacks.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('issues')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 cursor-pointer ${
            activeTab === 'issues'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>{isNe ? '३. ग्राहक समस्या दर्ता र टिकट (Tickets)' : '3. Raised Issues & Tickets'}</span>
          {issues.filter((i) => i.status === 'OPEN').length > 0 && (
            <span className="px-2 py-0.2 rounded-full bg-rose-950 text-rose-300 text-[10px] animate-pulse">
              {issues.filter((i) => i.status === 'OPEN').length} New
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('comments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 cursor-pointer ${
            activeTab === 'comments'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{isNe ? '४. नागरिक छलफल व्यवस्थापन (Comments)' : '4. Community Comments'}</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: CUSTOMER CHECKS & SOLUTIONS LOG                   */}
      {/* ======================================================== */}
      {activeTab === 'checks' && (
        <div className="space-y-4">
          {/* Filters & Actions Bar */}
          <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadChecks()}
                placeholder={isNe ? 'ग्राहक आईडी, सन्देश, लिंक वा ठगी प्रकार खोजी गर्नुहोस्...' : 'Search by customer session, query or scam type...'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Filter by Tool */}
            <div className="flex items-center gap-2">
              <select
                value={selectedTool}
                onChange={(e) => {
                  setSelectedTool(e.target.value);
                  setTimeout(loadChecks, 50);
                }}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">{isNe ? 'सबै टुलहरू (All Tools)' : 'All Tools'}</option>
                <option value="message">{isNe ? '💬 सन्देश (Message)' : 'Message'}</option>
                <option value="link">{isNe ? '🔗 लिंक (Link)' : 'Link'}</option>
                <option value="shopping">{isNe ? '🛍️ किनमेल (Shopping)' : 'Shopping'}</option>
                <option value="photo">{isNe ? '📸 फोटो (Photo)' : 'Photo'}</option>
                <option value="voice">{isNe ? '🎙️ आवाज (Voice)' : 'Voice'}</option>
                <option value="chat">{isNe ? '🤖 च्याटबट (Chat)' : 'Chat'}</option>
              </select>

              {/* Filter by Risk */}
              <select
                value={selectedRisk}
                onChange={(e) => {
                  setSelectedRisk(e.target.value);
                  setTimeout(loadChecks, 50);
                }}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">{isNe ? 'सबै जोखिम स्तर' : 'All Risk Levels'}</option>
                <option value="HIGH_RISK">{isNe ? '🚨 उच्च जोखिम (HIGH_RISK)' : 'HIGH_RISK'}</option>
                <option value="CAUTION">{isNe ? '⚠️ सावधानी (CAUTION)' : 'CAUTION'}</option>
                <option value="LOW_RISK">{isNe ? '✅ सुरक्षित (LOW_RISK)' : 'LOW_RISK'}</option>
              </select>

              <button
                onClick={handleExportChecksCSV}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold cursor-pointer transition shrink-0"
                title="Export report to CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">CSV</span>
              </button>

              <button
                onClick={handleClearAllChecks}
                className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 transition cursor-pointer"
                title={isNe ? 'सबै लग मेटाउनुहोस्' : 'Clear all logs'}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Checks List Table / Cards */}
          {loadingChecks ? (
            <div className="p-12 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl">
              {isNe ? 'ग्राहक चेक लगहरू लोड हुँदैछन्...' : 'Loading customer checks...'}
            </div>
          ) : checks.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 bg-slate-900/40 rounded-2xl">
              {isNe ? 'कुनै चेक लग फेला परेन।' : 'No check logs matching criteria.'}
            </div>
          ) : (
            <div className="space-y-3">
              {checks.map((chk) => {
                const isHigh = chk.riskLevel === 'HIGH_RISK';
                const isCaution = chk.riskLevel === 'CAUTION';

                return (
                  <div
                    key={chk.id}
                    className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-slate-700 transition space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      {/* Meta: Tool & Customer ID */}
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">
                          {isNe ? chk.toolNameNe : chk.toolNameEn}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          {chk.customerSession}
                        </span>
                        {chk.location && (
                          <span className="text-[11px] text-slate-500 hidden sm:inline">
                            • {chk.location}
                          </span>
                        )}
                      </div>

                      {/* Risk Badge & Score */}
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isHigh
                              ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                              : isCaution
                              ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                          }`}
                        >
                          {chk.riskLevel} ({chk.score}/100)
                        </span>

                        <span className="text-[11px] text-slate-500">
                          {new Date(chk.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    {/* What Customer Entered vs AI Solution */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                      {/* Customer Input */}
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                        <span className="text-[11px] font-bold text-cyan-400 block uppercase tracking-wider">
                          {isNe ? 'ग्राहकले जाँचेको विवरण (Customer Input):' : 'Customer Input:'}
                        </span>
                        <p className="text-slate-200 line-clamp-2 leading-relaxed">
                          {chk.inputSummary}
                        </p>
                      </div>

                      {/* AI Generated Solution */}
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                        <span className="text-[11px] font-bold text-emerald-400 block uppercase tracking-wider">
                          {isNe ? 'एआईले दिएको समाधान (Solution Output):' : 'AI Solution & Verdict:'}
                        </span>
                        {chk.scamType && (
                          <div className="text-[11px] font-semibold text-rose-300 line-clamp-1">
                            {chk.scamType}
                          </div>
                        )}
                        <p className="text-slate-300 line-clamp-2 leading-relaxed">
                          {chk.solutionSummary}
                        </p>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                      <span className="text-[11px] text-slate-500">
                        Engine: {chk.source || 'gemini-3.8-flash'}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedCheckForModal(chk)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/40 text-xs font-semibold transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isNe ? 'सम्पूर्ण समाधान हेर्नुहोस्' : 'View Full Solution'}</span>
                        </button>

                        <button
                          onClick={() => handleDeleteCheck(chk.id)}
                          className="p-1 rounded-lg hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: CUSTOMER FEEDBACK & 5-STAR RATINGS                */}
      {/* ======================================================== */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">
                {isNe ? 'ग्राहक प्रतिक्रिया र समीक्षा (Customer Ratings & Reviews)' : 'Customer Feedback & Ratings'}
              </h3>
              <p className="text-xs text-slate-400">
                {isNe
                  ? 'ग्राहकहरूले एप प्रयोग गरेपछि दिएको रेटिङ र सल्लाहहरू यहाँ हेर्न तथा उत्तर दिन सकिन्छ।'
                  : 'Inspect customer satisfaction ratings, false-positive reports, and respond to users.'}
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
              {stats ? `${stats.avgRating} / 5.0 Average` : '5.0 ★'}
            </div>
          </div>

          {loadingFeedback ? (
            <div className="p-12 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl">
              {isNe ? 'प्रतिक्रियाहरू लोड हुँदैछन्...' : 'Loading feedbacks...'}
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 bg-slate-900/40 rounded-2xl">
              {isNe ? 'अहिलेसम्म कुनै प्रतिक्रिया आएको छैन।' : 'No customer feedback received yet.'}
            </div>
          ) : (
            <div className="space-y-3">
              {feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{fb.customerName}</span>
                      {fb.customerEmail && (
                        <span className="text-slate-400 text-[11px]">({fb.customerEmail})</span>
                      )}
                      <span className="px-2 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                        {fb.feedbackType}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: fb.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {new Date(fb.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {fb.checkContext && (
                    <div className="text-[11px] text-cyan-300 bg-slate-950 p-2 rounded-lg font-mono">
                      Context: {fb.checkContext}
                    </div>
                  )}

                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-900">
                    "{fb.comment}"
                  </p>

                  {/* Existing Admin Reply */}
                  {fb.adminReply && (
                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs space-y-1">
                      <span className="font-bold text-emerald-400 block">
                        {isNe ? 'व्यवस्थापकको जवाफ (Official Admin Reply):' : 'Official Admin Response:'}
                      </span>
                      <p className="text-slate-300">{fb.adminReply}</p>
                    </div>
                  )}

                  {/* Reply Input Form */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={replyTextMap[fb.id] || ''}
                      onChange={(e) => setReplyTextMap({ ...replyTextMap, [fb.id]: e.target.value })}
                      placeholder={isNe ? 'ग्राहकलाई जवाफ पठाउनुहोस्...' : 'Type response to customer...'}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      onClick={() => handleReplyFeedback(fb.id)}
                      disabled={!replyTextMap[fb.id]?.trim()}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-slate-950 transition cursor-pointer disabled:opacity-40"
                    >
                      {isNe ? 'जवाफ दिनुहोस्' : 'Reply'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: CUSTOMER ISSUES & TICKETS                         */}
      {/* ======================================================== */}
      {activeTab === 'issues' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">
                {isNe ? 'ग्राहक समस्या दर्ता र टिकट व्यवस्थापन (Support Tickets)' : 'Customer Raised Issues & Tickets'}
              </h3>
              <p className="text-xs text-slate-400">
                {isNe
                  ? 'ग्राहकले नयाँ ठगी, गलत नतिजा वा आपतकालीन सहयोगका लागि उठाएका समस्याहरूको स्थिति व्यवस्थापन गर्नुहोस्।'
                  : 'Manage tickets reported by citizens regarding new scams, wrong verdicts, and wallet freeze assistance.'}
              </p>
            </div>
          </div>

          {loadingIssues ? (
            <div className="p-12 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl">
              {isNe ? 'टिकटहरू लोड हुँदैछन्...' : 'Loading support tickets...'}
            </div>
          ) : issues.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 bg-slate-900/40 rounded-2xl">
              {isNe ? 'कुनै समस्या दर्ता भएको छैन।' : 'No active customer issues.'}
            </div>
          ) : (
            <div className="space-y-3">
              {issues.map((iss) => {
                const isOpen = iss.status === 'OPEN';
                const isInvestigating = iss.status === 'INVESTIGATING';
                const isResolved = iss.status === 'RESOLVED';

                return (
                  <div
                    key={iss.id}
                    className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-300 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
                          {iss.ticketNumber}
                        </span>
                        <span className="font-bold text-white">{iss.customerName}</span>
                        {iss.customerContact && (
                          <span className="text-slate-400 text-[11px]">📞 {iss.customerContact}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Severity Badge */}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            iss.severity === 'CRITICAL'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : iss.severity === 'HIGH'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {iss.severity}
                        </span>

                        {/* Status Badge */}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isResolved
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : isInvestigating
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                          }`}
                        >
                          {iss.status}
                        </span>

                        <span className="text-[11px] text-slate-500">
                          {new Date(iss.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">{iss.title}</h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-900">
                        {iss.description}
                      </p>
                    </div>

                    {/* Admin Investigation Notes & Reply */}
                    {(iss.adminNotes || iss.adminReply) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                        {iss.adminNotes && (
                          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                            <span className="font-bold text-slate-400 block text-[10px]">INTERNAL NOTES:</span>
                            {iss.adminNotes}
                          </div>
                        )}
                        {iss.adminReply && (
                          <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-slate-200">
                            <span className="font-bold text-emerald-400 block text-[10px]">REPLY TO CITIZEN:</span>
                            {iss.adminReply}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                      <span className="text-[11px] text-slate-500">
                        Category: {iss.category}
                      </span>

                      <button
                        onClick={() => handleOpenEditIssue(iss)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold transition cursor-pointer"
                      >
                        {isNe ? 'स्थिति परिवर्तन / समाधान गर्नुहोस्' : 'Update Status & Reply'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: COMMUNITY COMMENTS & DISCUSSION                   */}
      {/* ======================================================== */}
      {activeTab === 'comments' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">
                {isNe ? 'सामुदायिक ठगी सचेतना कमेन्टहरू (Community Forum Moderation)' : 'Citizen Forum & Scam Warning Moderation'}
              </h3>
              <p className="text-xs text-slate-400">
                {isNe
                  ? 'नागरिकहरूले शेयर गरेका वास्तविक अनुभव तथा सचेतना कमेन्टहरू हेर्नुहोस् र आधिकारिक जवाफ दिनुहोस्।'
                  : 'Review citizen experiences, like helpful advice, and post official guidance.'}
              </p>
            </div>
          </div>

          {loadingComments ? (
            <div className="p-12 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl">
              {isNe ? 'कमेन्टहरू लोड हुँदैछन्...' : 'Loading comments...'}
            </div>
          ) : comments.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 bg-slate-900/40 rounded-2xl">
              {isNe ? 'कुनै कमेन्ट छैन।' : 'No community comments.'}
            </div>
          ) : (
            <div className="space-y-3">
              {comments.map((cmt) => (
                <div
                  key={cmt.id}
                  className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{cmt.authorName}</span>
                      {cmt.isVerifiedVictim && (
                        <span className="px-2 py-0.2 rounded-full text-[10px] bg-rose-950 text-rose-300 border border-rose-800">
                          {isNe ? 'पीडित अनुभव' : 'Victim Report'}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {new Date(cmt.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-cyan-400 text-xs font-semibold">{cmt.topic}</div>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-900">
                    {cmt.content}
                  </p>

                  {/* Replies */}
                  {cmt.replies && cmt.replies.length > 0 && (
                    <div className="space-y-1.5 pl-3 border-l-2 border-emerald-500/50">
                      {cmt.replies.map((rep) => (
                        <div key={rep.id} className="text-xs">
                          <span className="font-bold text-emerald-400">{rep.author}: </span>
                          <span className="text-slate-300">{rep.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Official Admin Reply Field */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={commentReplyMap[cmt.id] || ''}
                      onChange={(e) => setCommentReplyMap({ ...commentReplyMap, [cmt.id]: e.target.value })}
                      placeholder={isNe ? 'आधिकारिक व्यवस्थापक जवाफ लेख्नुहोस्...' : 'Post official admin reply...'}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={() => handleReplyComment(cmt.id)}
                      disabled={!commentReplyMap[cmt.id]?.trim()}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer disabled:opacity-40"
                    >
                      {isNe ? 'जवाफ पोस्ट' : 'Post Reply'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: FULL CHECK DETAIL & SOLUTION INSPECTOR          */}
      {/* ======================================================== */}
      {selectedCheckForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#0f172a] border border-slate-700 rounded-3xl p-5 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setSelectedCheckForModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {isNe ? selectedCheckForModal.toolNameNe : selectedCheckForModal.toolNameEn}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    selectedCheckForModal.riskLevel === 'HIGH_RISK'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                >
                  {selectedCheckForModal.riskLevel} ({selectedCheckForModal.score}/100)
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-2">
                {selectedCheckForModal.scamType || (isNe ? 'जाँचको नतिजा' : 'Check Details')}
              </h3>
              <p className="text-xs text-slate-400">
                Session: {selectedCheckForModal.customerSession} • {new Date(selectedCheckForModal.timestamp).toLocaleString()}
              </p>
            </div>

            {/* Input Section */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                {isNe ? 'ग्राहकले राखेको सामग्री (Customer Input):' : 'Customer Input Details:'}
              </span>
              <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                {selectedCheckForModal.inputSummary}
              </p>
              {selectedCheckForModal.fullInput && (
                <pre className="text-[11px] text-slate-400 bg-slate-900 p-2.5 rounded-xl overflow-x-auto font-mono">
                  {JSON.stringify(selectedCheckForModal.fullInput, null, 2)}
                </pre>
              )}
            </div>

            {/* Solution & Verdict Section */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                {isNe ? 'एआईले दिएको समाधान (AI Solution Output):' : 'AI Solution & Instructions Provided:'}
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {selectedCheckForModal.solutionSummary}
              </p>

              {/* Warning signs given */}
              {selectedCheckForModal.warningSigns && selectedCheckForModal.warningSigns.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-amber-400 block">
                    {isNe ? 'पहिचान गरिएका जोखिमका संकेतहरू (Warning Signs):' : 'Warning Indicators Flagged:'}
                  </span>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pl-1">
                    {selectedCheckForModal.warningSigns.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action steps given */}
              {selectedCheckForModal.actionSteps && selectedCheckForModal.actionSteps.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-cyan-400 block">
                    {isNe ? 'ग्राहकलाई दिइएको सुरक्षा निर्देशन (Action Steps):' : 'Action Steps Provided to Customer:'}
                  </span>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pl-1">
                    {selectedCheckForModal.actionSteps.map((a, idx) => (
                      <li key={idx}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCheckForModal(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
              >
                {isNe ? 'बन्द गर्नुहोस्' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: ISSUE STATUS UPDATE & RESOLUTION DIALOGUE       */}
      {/* ======================================================== */}
      {selectedIssueForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-[#0f172a] border border-slate-700 rounded-3xl p-5 sm:p-7 shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedIssueForEdit(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-3 py-1 rounded-lg bg-rose-950 text-rose-300 border border-rose-800">
                  {selectedIssueForEdit.ticketNumber}
                </span>
                <span className="text-xs text-slate-400">{selectedIssueForEdit.customerName}</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">{selectedIssueForEdit.title}</h3>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 text-xs text-slate-300 border border-slate-800">
              {selectedIssueForEdit.description}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">{isNe ? 'स्थिति (Status)' : 'Status'}</label>
                <select
                  value={editIssueStatus}
                  onChange={(e) => setEditIssueStatus(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="OPEN">OPEN (सुलझाउन बाँकी)</option>
                  <option value="INVESTIGATING">INVESTIGATING (अनुसन्धान हुँदैछ)</option>
                  <option value="RESOLVED">RESOLVED (समाधान भयो)</option>
                  <option value="CLOSED">CLOSED (बन्द गरियो)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">{isNe ? 'गम्भीरता (Severity)' : 'Severity'}</label>
                <select
                  value={editIssueSeverity}
                  onChange={(e) => setEditIssueSeverity(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-slate-300 font-bold block">
                {isNe ? 'आन्तरिक अनुसन्धान नोट (Admin Notes):' : 'Internal Investigation Notes:'}
              </label>
              <textarea
                rows={2}
                value={editAdminNotes}
                onChange={(e) => setEditAdminNotes(e.target.value)}
                placeholder={isNe ? 'नेपाल प्रहरी वा प्राविधिक टिमका लागि आन्तरिक टिप्पणी...' : 'Internal notes for technical / police team...'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-emerald-400 font-bold block">
                {isNe ? 'ग्राहकलाई जाने आधिकारिक समाधान सन्देश (Official Reply to Citizen):' : 'Official Resolution Message to Citizen:'}
              </label>
              <textarea
                rows={3}
                value={editAdminReply}
                onChange={(e) => setEditAdminReply(e.target.value)}
                placeholder={isNe ? 'समस्या समाधान भएको वा के गर्ने भनेर ग्राहकलाई लेख्नुहोस्...' : 'Explain resolution or advice for the citizen...'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedIssueForEdit(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              >
                {isNe ? 'रद्द' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSaveIssue}
                disabled={savingIssue}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition cursor-pointer disabled:opacity-40"
              >
                {savingIssue ? (isNe ? 'अपडेट हुँदैछ...' : 'Updating...') : isNe ? 'परिवर्तन सुरक्षित गर्नुहोस्' : 'Save Resolution'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

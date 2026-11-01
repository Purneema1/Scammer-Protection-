import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  FileText,
  Video,
  Image as ImageIcon,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Edit3,
  Check,
  ArrowLeft,
  ExternalLink,
  Play,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Language } from '../types';
import {
  getAppContentSettings,
  saveAppContentSettings,
  resetAppContentSettings,
  AppContentSettings,
} from '../utils/contentStorage';
import {
  getAppMediaSettings,
  saveAppMediaSettings,
  resetAppMediaSettings,
  getAppVideos,
  saveAppVideos,
  addOrUpdateVideo,
  deleteVideo,
  resetAppVideos,
  AppMediaSettings,
  ScamVideoItem,
} from '../utils/mediaStorage';
import { TOOL_PHOTOS } from '../constants/toolImages';

interface AdminDashboardProps {
  lang: Language;
  onNavigateHome: () => void;
}

type AdminSection = 'content' | 'video' | 'image';

export function AdminDashboard({ lang, onNavigateHome }: AdminDashboardProps) {
  const isNe = lang === 'ne';

  // Active section & hamburger drawer state
  const [activeSection, setActiveSection] = useState<AdminSection>('content');
  const [menuOpen, setMenuOpen] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Content state
  const [contentForm, setContentForm] = useState<AppContentSettings>(() => getAppContentSettings());

  // Media (Images) state
  const [mediaSettings, setMediaSettings] = useState<AppMediaSettings>(() => getAppMediaSettings());

  // Videos state
  const [videoList, setVideoList] = useState<ScamVideoItem[]>(() => getAppVideos());
  const [editingVideo, setEditingVideo] = useState<ScamVideoItem | null>(null);
  const [isAddingVideo, setIsAddingVideo] = useState(false);

  // Video editor modal form
  const [videoForm, setVideoForm] = useState<Partial<ScamVideoItem>>({
    titleNe: '',
    titleEn: '',
    descNe: '',
    descEn: '',
    youtubeId: '',
    category: 'wallet',
    duration: '०४:००',
    thumbnail: '',
  });

  // Load latest settings on mount
  useEffect(() => {
    setContentForm(getAppContentSettings());
    setMediaSettings(getAppMediaSettings());
    setVideoList(getAppVideos());
  }, []);

  const showToast = (message: string) => {
    setSaveToast(message);
    setTimeout(() => {
      setSaveToast(null);
    }, 3500);
  };

  // Helper to extract YouTube video ID if full URL is entered
  const extractYouTubeId = (urlOrId: string): string => {
    const cleaned = urlOrId.trim();
    if (cleaned.length === 11 && !cleaned.includes('/') && !cleaned.includes('?')) {
      return cleaned;
    }
    const match = cleaned.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : cleaned;
  };

  // ----------------------------------------------------
  // CONTENT MANAGEMENT HANDLERS
  // ----------------------------------------------------
  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    saveAppContentSettings(contentForm);
    showToast(isNe ? 'सामग्री सफलतापूर्वक सुरक्षित गरियो!' : 'App content saved successfully!');
  };

  const handleResetContent = () => {
    if (window.confirm(isNe ? 'के तपाईं सबै सामग्री पूर्वनिर्धारितमा फर्काउन चाहनुहुन्छ?' : 'Reset all content to defaults?')) {
      const def = resetAppContentSettings();
      setContentForm(def);
      showToast(isNe ? 'सामग्री पूर्वनिर्धारितमा फर्कियो!' : 'Content reset to default settings!');
    }
  };

  // ----------------------------------------------------
  // IMAGE MANAGEMENT HANDLERS
  // ----------------------------------------------------
  const handleBannerUrlChange = (key: keyof AppMediaSettings['banners'], val: string) => {
    setMediaSettings((prev) => ({
      ...prev,
      banners: {
        ...prev.banners,
        [key]: val,
      },
    }));
  };

  const handleToolPhotoChange = (toolKey: string, val: string) => {
    setMediaSettings((prev) => ({
      ...prev,
      tools: {
        ...prev.tools,
        [toolKey]: val,
      },
    }));
  };

  const handleSaveImages = (e: React.FormEvent) => {
    e.preventDefault();
    saveAppMediaSettings(mediaSettings);
    showToast(isNe ? 'सबै तस्विरहरू सुरक्षित गरियो!' : 'All images saved successfully!');
  };

  const handleResetImages = () => {
    if (window.confirm(isNe ? 'के तपाईं सबै तस्विरहरू पूर्वनिर्धारितमा फर्काउन चाहनुहुन्छ?' : 'Reset all images to default?')) {
      const def = resetAppMediaSettings();
      setMediaSettings(def);
      showToast(isNe ? 'तस्विरहरू पूर्वनिर्धारितमा फर्कियो!' : 'Images reset to default!');
    }
  };

  // ----------------------------------------------------
  // VIDEO MANAGEMENT HANDLERS
  // ----------------------------------------------------
  const handleOpenAddVideo = () => {
    setEditingVideo(null);
    setVideoForm({
      id: `vid-${Date.now()}`,
      titleNe: '',
      titleEn: '',
      descNe: '',
      descEn: '',
      youtubeId: '',
      category: 'wallet',
      duration: '०४:००',
      thumbnail: '',
    });
    setIsAddingVideo(true);
  };

  const handleOpenEditVideo = (v: ScamVideoItem) => {
    setEditingVideo(v);
    setVideoForm({ ...v });
    setIsAddingVideo(true);
  };

  const handleDeleteVideo = (id: string) => {
    if (window.confirm(isNe ? 'के तपाईं यो भिडियो हटाउन चाहनुहुन्छ?' : 'Delete this video?')) {
      const updated = deleteVideo(id);
      setVideoList(updated);
      showToast(isNe ? 'भिडियो हटाइयो!' : 'Video removed successfully!');
    }
  };

  const handleSaveVideoModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.titleNe && !videoForm.titleEn) {
      alert(isNe ? 'कृपया भिडियोको शीर्षक राख्नुहोस्।' : 'Please enter a video title.');
      return;
    }
    const cleanYtId = extractYouTubeId(videoForm.youtubeId || '');
    if (!cleanYtId) {
      alert(isNe ? 'कृपया मान्य YouTube भिडियो ID वा URL राख्नुहोस्।' : 'Please enter a valid YouTube Video ID or URL.');
      return;
    }

    const finalThumb =
      videoForm.thumbnail && videoForm.thumbnail.trim().length > 5
        ? videoForm.thumbnail.trim()
        : `https://img.youtube.com/vi/${cleanYtId}/hqdefault.jpg`;

    const newVideoItem: ScamVideoItem = {
      id: videoForm.id || `vid-${Date.now()}`,
      titleNe: videoForm.titleNe || videoForm.titleEn || '',
      titleEn: videoForm.titleEn || videoForm.titleNe || '',
      descNe: videoForm.descNe || '',
      descEn: videoForm.descEn || '',
      youtubeId: cleanYtId,
      category: (videoForm.category as ScamVideoItem['category']) || 'wallet',
      duration: videoForm.duration || '०४:००',
      thumbnail: finalThumb,
    };

    const updated = addOrUpdateVideo(newVideoItem);
    setVideoList(updated);
    setIsAddingVideo(false);
    setEditingVideo(null);
    showToast(isNe ? 'भिडियो सुरक्षित गरियो!' : 'Video saved successfully!');
  };

  const handleResetVideos = () => {
    if (window.confirm(isNe ? 'पूर्वनिर्धारित भिडियोहरू फर्काउन चाहनुहुन्छ?' : 'Reset to default awareness videos?')) {
      const def = resetAppVideos();
      setVideoList(def);
      showToast(isNe ? 'भिडियोहरू पूर्वनिर्धारितमा फर्किए!' : 'Videos reset to default!');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-100">
      {/* ======================================================== */}
      {/* 1. TOP ADMIN BAR WITH HAMBURGER MENU BUTTON */}
      {/* ======================================================== */}
      <header className="p-4 sm:p-5 rounded-3xl bg-[#0c1424] border border-cyan-800/50 shadow-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Trigger Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 font-bold text-xs sm:text-sm cursor-pointer transition-all active:scale-95 shadow-md"
            aria-label="Toggle Navigation Menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            <span className="font-bold">{isNe ? '☰ मेनु' : '☰ Menu'}</span>
          </button>

          <div>
            <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>{isNe ? 'व्यवस्थापक प्यानल' : 'Admin Panel'}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                {activeSection === 'content'
                  ? isNe
                    ? 'सामग्री'
                    : 'Content'
                  : activeSection === 'video'
                  ? isNe
                    ? 'भिडियो'
                    : 'Video'
                  : isNe
                  ? 'तस्विर'
                  : 'Image'}
              </span>
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-400 hidden sm:block">
              {isNe
                ? 'सामग्री (Content), भिडियो (Video) र तस्विर (Image) मात्र व्यवस्थापन गर्नुहोस्'
                : 'Directly manage app content, videos, and images'}
            </p>
          </div>
        </div>

        {/* Back to Home Button */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer transition-all active:scale-95 shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>{isNe ? 'गृहपृष्ठमा फर्कनुहोस्' : 'Back to Home'}</span>
        </button>
      </header>

      {/* Save Success Toast */}
      {saveToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm font-bold flex items-center justify-between shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveToast}</span>
          </div>
          <button onClick={() => setSaveToast(null)} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. HAMBURGER SLIDE DRAWER / MODAL OVERLAY */}
      {/* ======================================================== */}
      {menuOpen && (
        <div className="relative z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer Sheet */}
          <div className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-[#0c1424] border-r border-cyan-800/60 p-5 shadow-2xl flex flex-col justify-between overflow-y-auto animate-fadeIn">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-slate-950 font-black">
                    A
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white">
                      {isNe ? 'व्यवस्थापक मेनु' : 'Admin Menu'}
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      {isNe ? 'परिवर्तन गर्न छान्नुहोस्' : 'Select section to edit'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Menu Navigation Links */}
              <nav className="space-y-2">
                {/* 1. Content */}
                <button
                  onClick={() => {
                    setActiveSection('content');
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl font-bold text-xs sm:text-sm text-left transition-all cursor-pointer ${
                    activeSection === 'content'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-md'
                      : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    <div>
                      <div className="font-black">
                        {isNe ? '१. सामग्री व्यवस्थापन (Content)' : '1. Content Management'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {isNe ? 'हेडलाइन, सूचना, फोन नम्बर, इमेल' : 'Headlines, alert notices, phone'}
                      </div>
                    </div>
                  </div>
                  {activeSection === 'content' && <span className="text-cyan-400 font-black">●</span>}
                </button>

                {/* 2. Video */}
                <button
                  onClick={() => {
                    setActiveSection('video');
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl font-bold text-xs sm:text-sm text-left transition-all cursor-pointer ${
                    activeSection === 'video'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-400/50 shadow-md'
                      : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="font-black">
                        {isNe ? '२. भिडियो व्यवस्थापन (Video)' : '2. Video Management'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {isNe ? 'सचेतना भिडियोहरू, YouTube ID, लिङ्क' : 'Scam awareness videos & clips'}
                      </div>
                    </div>
                  </div>
                  {activeSection === 'video' && <span className="text-purple-400 font-black">●</span>}
                </button>

                {/* 3. Image */}
                <button
                  onClick={() => {
                    setActiveSection('image');
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl font-bold text-xs sm:text-sm text-left transition-all cursor-pointer ${
                    activeSection === 'image'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-md'
                      : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ImageIcon className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="font-black">
                        {isNe ? '३. तस्विर व्यवस्थापन (Image)' : '3. Image Management'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {isNe ? 'ब्यानर तस्विरहरू र टुल फोटोहरू' : 'Hero banners & tool card photos'}
                      </div>
                    </div>
                  </div>
                  {activeSection === 'image' && <span className="text-emerald-400 font-black">●</span>}
                </button>
              </nav>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-6 border-t border-slate-800 space-y-2.5">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onNavigateHome();
                }}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs cursor-pointer shadow-lg active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isNe ? 'एपको गृहपृष्ठमा जानुहोस्' : 'Return to App Homepage'}</span>
              </button>
              <div className="text-center text-[10px] text-slate-500">
                Scamly Admin v2.0
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. MAIN CONTENT BODY ACCORDING TO ACTIVE SECTION */}
      {/* ======================================================== */}

      {/* ---------------------------------------------------- */}
      {/* SECTION 1: CONTENT (सामग्री) MANAGEMENT */}
      {/* ---------------------------------------------------- */}
      {activeSection === 'content' && (
        <div className="space-y-6">
          {/* Section banner */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#101e38] via-[#0d162a] to-[#101e38] border border-cyan-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>{isNe ? 'सामग्री व्यवस्थापन' : 'Content Management'}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {isNe ? 'गृहपृष्ठ हेडलाइन तथा सूचना पाठहरू सम्पादन गर्नुहोस्' : 'Edit App Headlines & Announcement Texts'}
              </h2>
              <p className="text-xs text-slate-400">
                {isNe
                  ? 'यहाँ परिवर्तन गरिएका शब्दहरू सेभ गर्नासाथ गृहपृष्ठमा तुरुन्तै देखिनेछन्।'
                  : 'Changes saved here are instantly applied across the home screen and alerts.'}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleResetContent}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isNe ? 'पूर्वनिर्धारित' : 'Reset Default'}</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveContent} className="space-y-6">
            {/* Group A: Hero Headlines */}
            <div className="p-5 rounded-3xl bg-[#0e1628] border border-slate-800 space-y-4">
              <h3 className="text-sm font-black text-cyan-300 flex items-center gap-2">
                <span>🎯</span>
                <span>{isNe ? 'मुख्य गृहपृष्ठ हेडलाइन (Hero Headlines)' : 'Hero Main Headline'}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    {isNe ? 'हेडलाइन (नेपाली)' : 'Headline (Nepali)'}
                  </label>
                  <input
                    type="text"
                    value={contentForm.heroHeadlineNe}
                    onChange={(e) => setContentForm({ ...contentForm, heroHeadlineNe: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-cyan-400 outline-none"
                    placeholder="शंकास्पद अफर वा सन्देश पैसा पठाउनुअघि नै जाँच्नुहोस्"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    {isNe ? 'हेडलाइन (English)' : 'Headline (English)'}
                  </label>
                  <input
                    type="text"
                    value={contentForm.heroHeadlineEn}
                    onChange={(e) => setContentForm({ ...contentForm, heroHeadlineEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-cyan-400 outline-none"
                    placeholder="Verify Questionable Offers Before Transferring Money"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    {isNe ? 'सब-हेडलाइन विवरण (नेपाली)' : 'Subheadline Description (Nepali)'}
                  </label>
                  <textarea
                    rows={3}
                    value={contentForm.heroSubheadlineNe}
                    onChange={(e) => setContentForm({ ...contentForm, heroSubheadlineNe: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-cyan-400 outline-none resize-none"
                    placeholder="SMS, नक्कली सपिङ पेज, फिसिङ लिंक..."
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    {isNe ? 'सब-हेडलाइन विवरण (English)' : 'Subheadline Description (English)'}
                  </label>
                  <textarea
                    rows={3}
                    value={contentForm.heroSubheadlineEn}
                    onChange={(e) => setContentForm({ ...contentForm, heroSubheadlineEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-cyan-400 outline-none resize-none"
                    placeholder="Scan SMS, fake store offers..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Group B: Emergency & Helpline Numbers */}
            <div className="p-5 rounded-3xl bg-[#0e1628] border border-slate-800 space-y-4">
              <h3 className="text-sm font-black text-rose-300 flex items-center gap-2">
                <span>🚨</span>
                <span>{isNe ? 'नेपाल प्रहरी हटलाइन तथा सम्पर्क जानकारी' : 'Emergency Hotline & Contact Info'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    {isNe ? 'साइबर ब्युरो हटलाइन फोन' : 'Cyber Bureau Hotline Phone'}
                  </label>
                  <input
                    type="text"
                    value={contentForm.helplinePhone}
                    onChange={(e) => setContentForm({ ...contentForm, helplinePhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-cyan-400 outline-none font-mono"
                    placeholder="०१-४२११३०४"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    {isNe ? 'साइबर ब्युरो आधिकारिक इमेल' : 'Cyber Bureau Official Email'}
                  </label>
                  <input
                    type="email"
                    value={contentForm.helplineEmail}
                    onChange={(e) => setContentForm({ ...contentForm, helplineEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-cyan-400 outline-none font-mono"
                    placeholder="cyberbureau@nepalpolice.gov.np"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    {isNe ? 'आपतकालीन सूचना स्ट्रिप (नेपाली)' : 'Emergency Notification Strip (Nepali)'}
                  </label>
                  <textarea
                    rows={2}
                    value={contentForm.emergencyAlertNe}
                    onChange={(e) => setContentForm({ ...contentForm, emergencyAlertNe: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-cyan-400 outline-none resize-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    {isNe ? 'आपतकालीन सूचना स्ट्रिप (English)' : 'Emergency Notification Strip (English)'}
                  </label>
                  <textarea
                    rows={2}
                    value={contentForm.emergencyAlertEn}
                    onChange={(e) => setContentForm({ ...contentForm, emergencyAlertEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-cyan-400 outline-none resize-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Group C: Complaint Notice */}
            <div className="p-5 rounded-3xl bg-[#0e1628] border border-slate-800 space-y-4">
              <h3 className="text-sm font-black text-amber-300 flex items-center gap-2">
                <span>📋</span>
                <span>{isNe ? 'साइबर ब्युरो उजुरी मस्यौदा सूचना' : 'Complaint Generator Notice'}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    {isNe ? 'उजुरी सूचना (नेपाली)' : 'Notice (Nepali)'}
                  </label>
                  <textarea
                    rows={2}
                    value={contentForm.complaintNoticeNe}
                    onChange={(e) => setContentForm({ ...contentForm, complaintNoticeNe: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-cyan-400 outline-none resize-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    {isNe ? 'उजुरी सूचना (English)' : 'Notice (English)'}
                  </label>
                  <textarea
                    rows={2}
                    value={contentForm.complaintNoticeEn}
                    onChange={(e) => setContentForm({ ...contentForm, complaintNoticeEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-cyan-400 outline-none resize-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Save Button Bar */}
            <div className="p-4 rounded-2xl bg-[#0c1424] border border-slate-800 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-400">
                {isNe ? 'सामग्री सेभ गरेपछि एपमा प्रत्यक्ष लागू हुन्छ।' : 'Saving applies changes directly to the app.'}
              </span>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm cursor-pointer shadow-lg active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{isNe ? 'सामग्री सेभ गर्नुहोस्' : 'Save Content'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* SECTION 2: VIDEO (भिडियो) MANAGEMENT */}
      {/* ---------------------------------------------------- */}
      {activeSection === 'video' && (
        <div className="space-y-6">
          {/* Header Strip */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#1b122e] via-[#140d24] to-[#1b122e] border border-purple-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
                <Video className="w-4 h-4" />
                <span>{isNe ? 'भिडियो व्यवस्थापन' : 'Video Management'}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {isNe ? 'ठगी सचेतना भिडियोहरू व्यवस्थापन गर्नुहोस्' : 'Manage Cyber Awareness Videos'}
              </h2>
              <p className="text-xs text-slate-400">
                {isNe
                  ? 'एपको भिडियो सेन्टर तथा गृहपृष्ठमा देखिने YouTube भिडियोहरू थप्न, सच्याउन वा मेटाउन सक्नुहुन्छ।'
                  : 'Add, update or remove YouTube cyber defense guides shown across the app.'}
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleResetVideos}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isNe ? 'पूर्वनिर्धारित' : 'Reset'}</span>
              </button>
              <button
                type="button"
                onClick={handleOpenAddVideo}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 text-xs font-black cursor-pointer shadow-lg active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{isNe ? 'नयाँ भिडियो थप्नुहोस्' : 'Add New Video'}</span>
              </button>
            </div>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videoList.map((vid, idx) => (
              <div
                key={vid.id}
                className="rounded-3xl bg-[#0e1628] border border-slate-800 overflow-hidden flex flex-col justify-between group hover:border-purple-500/40 transition-all"
              >
                <div>
                  {/* Thumbnail and duration */}
                  <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={vid.thumbnail}
                      alt={vid.titleNe}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 text-white font-mono text-[10px] font-bold">
                      {vid.duration}
                    </span>
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-purple-500/90 text-white text-[10px] font-bold uppercase">
                      {vid.category}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-black text-white leading-snug line-clamp-2">
                      {isNe ? vid.titleNe : vid.titleEn}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {isNe ? vid.descNe : vid.descEn}
                    </p>
                    <div className="text-[11px] font-mono text-purple-300 flex items-center gap-1 pt-1">
                      <span>YouTube ID:</span>
                      <span className="bg-slate-900 px-1.5 py-0.5 rounded text-white">{vid.youtubeId}</span>
                    </div>
                  </div>
                </div>

                {/* Video Card Action Buttons */}
                <div className="p-3 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <a
                    href={`https://www.youtube.com/watch?v=s${vid.youtubeId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{isNe ? 'YouTube मा हेर्नुहोस्' : 'Watch Link'}</span>
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditVideo(vid)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-400/40 text-xs font-bold cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isNe ? 'सम्पादन' : 'Edit'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteVideo(vid.id)}
                      className="p-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/30 cursor-pointer"
                      title={isNe ? 'मेटाउनुहोस्' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add / Edit Video Modal */}
          {isAddingVideo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
              <div className="w-full max-w-lg bg-[#0e1628] border border-purple-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Video className="w-5 h-5 text-purple-400" />
                    <span>
                      {editingVideo
                        ? isNe
                          ? 'भिडियो सम्पादन गर्नुहोस्'
                          : 'Edit Video'
                        : isNe
                        ? 'नयाँ भिडियो थप्नुहोस्'
                        : 'Add New Video'}
                    </span>
                  </h3>
                  <button
                    onClick={() => setIsAddingVideo(false)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveVideoModal} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      {isNe ? 'YouTube भिडियो ID वा पुरा URL' : 'YouTube Video ID or Full URL'}
                    </label>
                    <input
                      type="text"
                      value={videoForm.youtubeId || ''}
                      onChange={(e) => setVideoForm({ ...videoForm, youtubeId: e.target.value })}
                      placeholder="उदा: bB_UfRCOi-4 वा https://youtu.be/..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm font-mono focus:border-purple-400 outline-none"
                      required
                    />
                    <p className="text-[10px] text-slate-400">
                      {isNe
                        ? 'सिधा YouTube ID वा लिङ्क राख्नुहोस्, यसले स्वतः पहिचान गर्छ।'
                        : 'Paste full YouTube link or 11-char ID.'}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      {isNe ? 'भिडियो शीर्षक (नेपाली)' : 'Video Title (Nepali)'}
                    </label>
                    <input
                      type="text"
                      value={videoForm.titleNe || ''}
                      onChange={(e) => setVideoForm({ ...videoForm, titleNe: e.target.value })}
                      placeholder="उदा: eSewa, Khalti OTP ठगीबाट जोगिने उपाय"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-purple-400 outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      {isNe ? 'भिडियो शीर्षक (English)' : 'Video Title (English)'}
                    </label>
                    <input
                      type="text"
                      value={videoForm.titleEn || ''}
                      onChange={(e) => setVideoForm({ ...videoForm, titleEn: e.target.value })}
                      placeholder="e.g. Preventing OTP & Banking Scams in Nepal"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-purple-400 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      {isNe ? 'विवरण (नेपाली)' : 'Description (Nepali)'}
                    </label>
                    <textarea
                      rows={2}
                      value={videoForm.descNe || ''}
                      onChange={(e) => setVideoForm({ ...videoForm, descNe: e.target.value })}
                      placeholder="यस भिडियोले देखाउने मुख्य जानकारी..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-purple-400 outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        {isNe ? 'श्रेणी (Category)' : 'Category'}
                      </label>
                      <select
                        value={videoForm.category || 'wallet'}
                        onChange={(e) =>
                          setVideoForm({
                            ...videoForm,
                            category: e.target.value as ScamVideoItem['category'],
                          })
                        }
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none"
                      >
                        <option value="wallet">eSewa/Khalti (वालेट)</option>
                        <option value="shopping">Shopping (सपिङ)</option>
                        <option value="telegram">Telegram (टेलिग्राम)</option>
                        <option value="police">Police Bureau (प्रहरी)</option>
                        <option value="ai">AI Deepfake (एआई)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        {isNe ? 'समय (Duration)' : 'Duration'}
                      </label>
                      <input
                        type="text"
                        value={videoForm.duration || '०४:१५'}
                        onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                        placeholder="०४:१५"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      {isNe ? 'कस्टम थम्बनेल फोटो URL (ऐच्छिक)' : 'Custom Thumbnail URL (Optional)'}
                    </label>
                    <input
                      type="url"
                      value={videoForm.thumbnail || ''}
                      onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.value })}
                      placeholder="खाली छोडेमा YouTube को थम्बनेल आफै राखिन्छ"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsAddingVideo(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                    >
                      {isNe ? 'रद्द गर्नुहोस्' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 text-xs font-black cursor-pointer shadow-lg active:scale-95 transition-all"
                    >
                      {isNe ? 'भिडियो सेभ गर्नुहोस्' : 'Save Video'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* SECTION 3: IMAGE (तस्विर) MANAGEMENT */}
      {/* ---------------------------------------------------- */}
      {activeSection === 'image' && (
        <div className="space-y-6">
          {/* Header Strip */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#102422] via-[#0d1c1a] to-[#102422] border border-emerald-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <ImageIcon className="w-4 h-4" />
                <span>{isNe ? 'तस्विर व्यवस्थापन' : 'Image Management'}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {isNe ? 'ब्यानर तथा टुल कार्डका तस्विरहरू परिवर्तन गर्नुहोस्' : 'Manage App Banners & Tool Card Photos'}
              </h2>
              <p className="text-xs text-slate-400">
                {isNe
                  ? 'कुनै पनि तस्विरको नयाँ फोटो लिङ्क (URL) राखेर प्रत्यक्ष प्रिभ्यु हेर्नुहोस् र सेभ गर्नुहोस्।'
                  : 'Update banner image URLs and tool card photography with live visual previews.'}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleResetImages}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isNe ? 'पूर्वनिर्धारित' : 'Reset Default'}</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveImages} className="space-y-8">
            {/* 1. App Banners */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-emerald-300 flex items-center gap-2">
                <span>🖼️</span>
                <span>{isNe ? 'मुख्य ब्यानर तस्विरहरू (App Banners)' : 'Main App Banners'}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hero Banner */}
                <div className="p-4 rounded-3xl bg-[#0e1628] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white">
                      {isNe ? 'गृहपृष्ठ मुख्य ब्यानर (Hero Banner)' : 'Hero Banner'}
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono">16:9 / 3:1 HD</span>
                  </div>
                  <div className="h-36 rounded-2xl bg-slate-900 overflow-hidden relative border border-slate-800">
                    <img
                      src={mediaSettings.banners.hero}
                      alt="Hero Banner Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="url"
                    value={mediaSettings.banners.hero}
                    onChange={(e) => handleBannerUrlChange('hero', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono outline-none focus:border-emerald-400"
                    placeholder="https://..."
                    required
                  />
                </div>

                {/* Rescue Banner */}
                <div className="p-4 rounded-3xl bg-[#0e1628] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white">
                      {isNe ? 'आपतकालीन उद्दार ब्यानर (SOS Rescue Banner)' : 'Rescue Banner'}
                    </span>
                    <span className="text-[10px] text-rose-400 font-mono">SOS Emergency</span>
                  </div>
                  <div className="h-36 rounded-2xl bg-slate-900 overflow-hidden relative border border-slate-800">
                    <img
                      src={mediaSettings.banners.rescue}
                      alt="Rescue Banner Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="url"
                    value={mediaSettings.banners.rescue}
                    onChange={(e) => handleBannerUrlChange('rescue', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono outline-none focus:border-emerald-400"
                    placeholder="https://..."
                    required
                  />
                </div>

                {/* Complaint Banner */}
                <div className="p-4 rounded-3xl bg-[#0e1628] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white">
                      {isNe ? 'साइबर ब्युरो उजुरी ब्यानर (Police Complaint)' : 'Complaint Banner'}
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono">Legal Bureau</span>
                  </div>
                  <div className="h-36 rounded-2xl bg-slate-900 overflow-hidden relative border border-slate-800">
                    <img
                      src={mediaSettings.banners.complaint}
                      alt="Complaint Banner Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="url"
                    value={mediaSettings.banners.complaint}
                    onChange={(e) => handleBannerUrlChange('complaint', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono outline-none focus:border-emerald-400"
                    placeholder="https://..."
                    required
                  />
                </div>

                {/* Stats Banner */}
                <div className="p-4 rounded-3xl bg-[#0e1628] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white">
                      {isNe ? 'ठगी तथ्याङ्क ब्यानर (Scam Trends / Stats)' : 'Stats Banner'}
                    </span>
                    <span className="text-[10px] text-purple-400 font-mono">Analytics</span>
                  </div>
                  <div className="h-36 rounded-2xl bg-slate-900 overflow-hidden relative border border-slate-800">
                    <img
                      src={mediaSettings.banners.stats}
                      alt="Stats Banner Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="url"
                    value={mediaSettings.banners.stats}
                    onChange={(e) => handleBannerUrlChange('stats', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono outline-none focus:border-emerald-400"
                    placeholder="https://..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* 2. Tool Card Photos */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-cyan-300 flex items-center gap-2">
                <span>🛡️</span>
                <span>{isNe ? '१३ ठगी सुरक्षा टुलहरूको तस्विर (Scam Protection Tool Photos)' : 'Tool Card Photos'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(TOOL_PHOTOS).map((toolKey) => {
                  const item = TOOL_PHOTOS[toolKey];
                  const currentImgUrl = mediaSettings.tools[toolKey] || item.image;

                  return (
                    <div
                      key={toolKey}
                      className="p-3.5 rounded-2xl bg-[#0e1628] border border-slate-800 space-y-2.5 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white line-clamp-1">
                            {isNe ? (item.tagNe || item.altNe) : (item.tagEn || item.altEn)}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
                            {toolKey}
                          </span>
                        </div>

                        {/* Image Preview */}
                        <div className="h-28 rounded-xl bg-slate-900 overflow-hidden relative border border-slate-800">
                          <img
                            src={currentImgUrl}
                            alt={item.altNe}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-400">
                          {isNe ? 'फोटो लिङ्क (URL)' : 'Photo URL'}
                        </label>
                        <input
                          type="url"
                          value={currentImgUrl}
                          onChange={(e) => handleToolPhotoChange(toolKey, e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-[11px] font-mono outline-none focus:border-emerald-400"
                          required
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Save Button Bar */}
            <div className="p-4 rounded-2xl bg-[#0c1424] border border-slate-800 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-400">
                {isNe ? 'सबै तस्विरहरू सेभ गर्नासाथ एपमा प्रत्यक्ष देखिनेछन्।' : 'Images will update live on all pages.'}
              </span>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm cursor-pointer shadow-lg active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{isNe ? 'तस्विरहरू सेभ गर्नुहोस्' : 'Save Images'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

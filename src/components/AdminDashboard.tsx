import React, { useState, useEffect, useRef } from 'react';
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
  Palette,
  Type,
  Eye,
  Layers,
  Sliders,
  Upload,
  Film,
  Loader2,
  CheckCircle2,
  FileVideo,
} from 'lucide-react';
import { Language } from '../types';
import { MediaUploader } from './MediaUploader';
import { extractVideoMetadata, uploadFileToServer } from '../utils/uploadHelper';
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
import {
  THEME_PRESETS,
  FONT_OPTIONS,
  BACKGROUND_VARIANTS,
  getAppThemeSettings,
  saveAppThemeSettings,
  resetAppThemeSettings,
  AppThemeSettings,
  ThemeId,
  FontFamilyId,
  BackgroundVariantId,
} from '../utils/themeStorage';
import { TOOL_PHOTOS } from '../constants/toolImages';

interface AdminDashboardProps {
  lang: Language;
  onNavigateHome: () => void;
}

type AdminSection = 'content' | 'video' | 'image' | 'theme';

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
  const [videoSourceType, setVideoSourceType] = useState<'upload' | 'youtube'>('upload');
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState<string | null>(null);
  const [thumbUploading, setThumbUploading] = useState(false);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const thumbFileInputRef = useRef<HTMLInputElement>(null);

  // Theme & Font state
  const [themeSettings, setThemeSettings] = useState<AppThemeSettings>(() => getAppThemeSettings());
  const [customHexInput, setCustomHexInput] = useState<string>(() => getAppThemeSettings().customPrimaryColor || '');

  // Video editor modal form
  const [videoForm, setVideoForm] = useState<Partial<ScamVideoItem>>({
    titleNe: '',
    titleEn: '',
    descNe: '',
    descEn: '',
    youtubeId: '',
    videoUrl: '',
    aspectRatio: '16/9',
    category: 'wallet',
    duration: '०४:००',
    thumbnail: '',
    isDirectUpload: false,
  });

  // Load latest settings on mount
  useEffect(() => {
    setContentForm(getAppContentSettings());
    setMediaSettings(getAppMediaSettings());
    setVideoList(getAppVideos());
    const initialTheme = getAppThemeSettings();
    setThemeSettings(initialTheme);
    setCustomHexInput(initialTheme.customPrimaryColor || '');
  }, []);

  const showToast = (message: string) => {
    setSaveToast(message);
    setTimeout(() => {
      setSaveToast(null);
    }, 3500);
  };

  // ----------------------------------------------------
  // THEME & FONT MANAGEMENT HANDLERS
  // ----------------------------------------------------
  const handleSelectThemePreset = (themeId: ThemeId) => {
    const updated = { ...themeSettings, activeThemeId: themeId };
    setThemeSettings(updated);
    saveAppThemeSettings(updated);
    showToast(isNe ? 'थिम सफलतापूर्वक लागू गरियो!' : 'Theme applied successfully!');
  };

  const handleSelectFont = (fontId: FontFamilyId) => {
    const updated = { ...themeSettings, activeFontId: fontId };
    setThemeSettings(updated);
    saveAppThemeSettings(updated);
    showToast(isNe ? 'फन्ट सफलतापूर्वक परिवर्तन गरियो!' : 'Font style updated successfully!');
  };

  const handleCustomAccentColor = (colorHex: string) => {
    const updated = { ...themeSettings, customPrimaryColor: colorHex };
    setCustomHexInput(colorHex);
    setThemeSettings(updated);
    saveAppThemeSettings(updated);
    showToast(isNe ? 'कस्टम रङ लागू गरियो!' : 'Custom accent color applied!');
  };

  const handleSelectBackgroundVariant = (variantId: BackgroundVariantId) => {
    const updated = { ...themeSettings, backgroundVariant: variantId };
    setThemeSettings(updated);
    saveAppThemeSettings(updated);
    showToast(isNe ? 'पृष्ठभूमि भेरियन्ट परिवर्तन गरियो!' : 'Background variant applied!');
  };

  const handleClearCustomPrimary = () => {
    const updated = { ...themeSettings, customPrimaryColor: undefined };
    setCustomHexInput('');
    setThemeSettings(updated);
    saveAppThemeSettings(updated);
    showToast(isNe ? 'थिमको पूर्वनिर्धारित रङ पुनःस्थापना गरियो!' : 'Theme default primary restored!');
  };

  const handleResetTheme = () => {
    if (window.confirm(isNe ? 'के तपाईं थिम सेटिङहरू पूर्वनिर्धारितमा फर्काउन चाहनुहुन्छ?' : 'Reset theme settings to default?')) {
      const def = resetAppThemeSettings();
      setThemeSettings(def);
      setCustomHexInput('');
      showToast(isNe ? 'थिम पूर्वनिर्धारितमा फर्कियो!' : 'Theme settings reset to default!');
    }
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
    setVideoSourceType('upload');
    setVideoUploading(false);
    setVideoUploadProgress(null);
    setVideoForm({
      id: `vid-${Date.now()}`,
      titleNe: '',
      titleEn: '',
      descNe: '',
      descEn: '',
      youtubeId: '',
      videoUrl: '',
      aspectRatio: '16/9',
      category: 'wallet',
      duration: '०४:००',
      thumbnail: '',
      isDirectUpload: true,
    });
    setIsAddingVideo(true);
  };

  const handleOpenEditVideo = (v: ScamVideoItem) => {
    setEditingVideo(v);
    const isDirect =
      v.isDirectUpload ||
      Boolean(
        v.videoUrl ||
          (v.youtubeId &&
            (v.youtubeId.startsWith('/uploads/') ||
              v.youtubeId.endsWith('.mp4') ||
              v.youtubeId.endsWith('.webm') ||
              v.youtubeId.endsWith('.mov')))
      );
    setVideoSourceType(isDirect ? 'upload' : 'youtube');
    setVideoUploading(false);
    setVideoUploadProgress(null);
    setVideoForm({
      ...v,
      isDirectUpload: Boolean(isDirect),
      videoUrl: v.videoUrl || (isDirect ? v.youtubeId : undefined),
    });
    setIsAddingVideo(true);
  };

  const handleVideoFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setVideoUploading(true);
      setVideoUploadProgress(
        isNe ? 'भिडियो रिजोल्युसन तथा ढाँचा पहिचान गरिँदैछ...' : 'Detecting video dimensions & aspect ratio...'
      );

      const meta = await extractVideoMetadata(file);

      setVideoUploadProgress(isNe ? 'सर्भरमा भिडियो अपलोड हुँदैछ...' : 'Uploading video file to server...');

      const result = await uploadFileToServer(file);

      setVideoForm((prev) => ({
        ...prev,
        youtubeId: result.url,
        videoUrl: result.url,
        isDirectUpload: true,
        width: meta.width,
        height: meta.height,
        aspectRatio: meta.aspectRatio,
        duration: prev.duration || meta.durationFormattedNe,
        thumbnail: prev.thumbnail || meta.thumbnailDataUrl || '',
        titleNe: prev.titleNe || file.name.replace(/\.[^/.]+$/, ''),
        titleEn: prev.titleEn || file.name.replace(/\.[^/.]+$/, ''),
      }));

      setVideoUploadProgress(null);
      showToast(isNe ? `भिडियो अपलोड भयो! (${meta.aspectRatioLabel})` : `Video uploaded! (${meta.aspectRatioLabel})`);
    } catch (err: any) {
      console.error('Video upload failed', err);
      alert(err.message || (isNe ? 'भिडियो अपलोड गर्न सकिएन' : 'Failed to upload video'));
    } finally {
      setVideoUploading(false);
      if (videoFileInputRef.current) videoFileInputRef.current.value = '';
    }
  };

  const handleThumbFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setThumbUploading(true);
      const result = await uploadFileToServer(file);
      setVideoForm((prev) => ({ ...prev, thumbnail: result.url }));
      showToast(isNe ? 'थम्बनेल तस्विर अपलोड भयो!' : 'Thumbnail image uploaded!');
    } catch (err: any) {
      alert(err.message || 'Thumbnail upload failed');
    } finally {
      setThumbUploading(false);
      if (thumbFileInputRef.current) thumbFileInputRef.current.value = '';
    }
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

    const isDirect = videoSourceType === 'upload' || videoForm.isDirectUpload;
    let videoSource = '';

    if (isDirect) {
      videoSource = videoForm.videoUrl || videoForm.youtubeId || '';
      if (!videoSource) {
        alert(isNe ? 'कृपया भिडियो फाइल अपलोड गर्नुहोस्।' : 'Please upload a video file.');
        return;
      }
    } else {
      const cleanYtId = extractYouTubeId(videoForm.youtubeId || '');
      if (!cleanYtId) {
        alert(isNe ? 'कृपया मान्य YouTube भिडियो ID वा URL राख्नुहोस्।' : 'Please enter a valid YouTube Video ID or URL.');
        return;
      }
      videoSource = cleanYtId;
    }

    const finalThumb =
      videoForm.thumbnail && videoForm.thumbnail.trim().length > 5
        ? videoForm.thumbnail.trim()
        : isDirect
        ? 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=800&q=80'
        : `https://img.youtube.com/vi/${videoSource}/hqdefault.jpg`;

    const newVideoItem: ScamVideoItem = {
      id: videoForm.id || `vid-${Date.now()}`,
      titleNe: videoForm.titleNe || videoForm.titleEn || '',
      titleEn: videoForm.titleEn || videoForm.titleNe || '',
      descNe: videoForm.descNe || '',
      descEn: videoForm.descEn || '',
      youtubeId: videoSource,
      videoUrl: isDirect ? videoSource : undefined,
      aspectRatio: videoForm.aspectRatio || (isDirect ? '16/9' : undefined),
      width: videoForm.width,
      height: videoForm.height,
      isDirectUpload: Boolean(isDirect),
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
                  : activeSection === 'image'
                  ? isNe
                    ? 'तस्विर'
                    : 'Image'
                  : isNe
                  ? 'थिम तथा फन्ट'
                  : 'Theme & Font'}
              </span>
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-400 hidden sm:block">
              {isNe
                ? 'सामग्री (Content), भिडियो (Video), तस्विर (Image) र थिम (Theme) व्यवस्थापन गर्नुहोस्'
                : 'Directly manage app content, videos, images, and visual themes'}
            </p>
          </div>
        </div>

        {/* Global Sync Indicator */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 text-emerald-300 border border-emerald-700/50 text-xs font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden xs:inline">{isNe ? 'सबै प्रयोगकर्तामा स्वतः सिंक' : 'Live Global Sync'}</span>
          </span>
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="text-[11px] text-slate-400 hover:text-cyan-300 px-2.5 py-1.5 rounded-xl hover:bg-slate-800/60 border border-slate-700/50 transition-colors cursor-pointer"
              title={isNe ? 'एप पूर्वावलोकन' : 'View App'}
            >
              {isNe ? 'एप पूर्वावलोकन ↗' : 'View App ↗'}
            </button>
          )}
        </div>
      </header>

      {/* Direct Horizontal Quick Navigation Tabs (Always Visible) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveSection('content')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
            activeSection === 'content'
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md font-black'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{isNe ? '१. सामग्री सम्पादन (Content)' : '1. Content'}</span>
        </button>

        <button
          onClick={() => setActiveSection('video')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
            activeSection === 'video'
              ? 'bg-purple-500 text-slate-950 border-purple-400 shadow-md font-black'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>{isNe ? '२. भिडियो हब (Videos)' : '2. Videos'}</span>
        </button>

        <button
          onClick={() => setActiveSection('image')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
            activeSection === 'image'
              ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md font-black'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>{isNe ? '३. तस्विर व्यवस्थापन (Images)' : '3. Images'}</span>
        </button>

        <button
          onClick={() => setActiveSection('theme')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
            activeSection === 'theme'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-300 shadow-lg font-black'
              : 'bg-slate-900/80 hover:bg-slate-800 text-amber-300 border-amber-500/40'
          }`}
        >
          <Palette className="w-4 h-4 text-amber-400" />
          <span>{isNe ? '🎨 ४. थिम तथा फन्ट (Themes)' : '🎨 4. Themes & Fonts'}</span>
        </button>
      </div>

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

                {/* 4. Theme & Font Design */}
                <button
                  onClick={() => {
                    setActiveSection('theme');
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl font-bold text-xs sm:text-sm text-left transition-all cursor-pointer ${
                    activeSection === 'theme'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-md'
                      : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Palette className="w-5 h-5 text-amber-400" />
                    <div>
                      <div className="font-black">
                        {isNe ? '४. थिम तथा फन्ट डिजाइन (Theme)' : '4. Theme & Font Styling'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {isNe ? '१० उज्यालो थिम, रङ र अक्षर फन्ट' : '10 bright themes, colors & fonts'}
                      </div>
                    </div>
                  </div>
                  {activeSection === 'theme' && <span className="text-amber-400 font-black">●</span>}
                </button>
              </nav>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-6 border-t border-slate-800 space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <p className="text-xs font-bold text-emerald-400">● {isNe ? 'केन्द्रीय डाटाबेस सिंक' : 'Live Cloud Sync'}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {isNe ? 'सबै प्रयोगकर्ता तथा उपकरणमा तुरुन्तै लागु हुन्छ' : 'Changes apply globally to all users'}
                </p>
              </div>
              <div className="text-center text-[10px] text-slate-500 font-mono">
                Scamly Admin Control Panel v2.0
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
                    <div className="text-[11px] font-mono text-purple-300 flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="px-2 py-0.5 rounded-md bg-purple-950/80 border border-purple-500/40 text-[10px] font-bold text-purple-300">
                        {vid.isDirectUpload || vid.youtubeId.startsWith('/uploads/')
                          ? vid.aspectRatio === '9/16'
                            ? '📱 9:16 Reel'
                            : vid.aspectRatio === '1/1'
                            ? '🔲 1:1 Square'
                            : '📂 Direct Video'
                          : '▶ YouTube'}
                      </span>
                      {vid.width && vid.height && (
                        <span className="text-[10px] text-slate-400">
                          {vid.width}x{vid.height}
                        </span>
                      )}
                      <span className="text-slate-400 truncate max-w-[160px] text-[10px]">
                        {vid.youtubeId}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Video Card Action Buttons */}
                <div className="p-3 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <a
                    href={
                      vid.isDirectUpload || vid.youtubeId.startsWith('/uploads/')
                        ? vid.videoUrl || vid.youtubeId
                        : `https://www.youtube.com/watch?v=${vid.youtubeId}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>
                      {vid.isDirectUpload || vid.youtubeId.startsWith('/uploads/')
                        ? isNe
                          ? 'भिडियो खोल्नुहोस्'
                          : 'Open Video'
                        : isNe
                        ? 'YouTube मा हेर्नुहोस्'
                        : 'Watch Link'}
                    </span>
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
              <div className="w-full max-w-xl bg-[#0e1628] border border-purple-500/60 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto my-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Video className="w-5 h-5 text-purple-400" />
                    <span>
                      {editingVideo
                        ? isNe
                          ? 'भिडियो सम्पादन गर्नुहोस्'
                          : 'Edit Video'
                        : isNe
                        ? 'नयाँ भिडियो थप्नुहोस् (Direct Upload or YouTube)'
                        : 'Add Video (Direct Upload or YouTube)'}
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
                  {/* Source Mode Toggle: Direct Upload vs YouTube */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">
                      {isNe ? 'भिडियो स्रोत छान्नुहोस् (Video Source)' : 'Choose Video Source'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setVideoSourceType('upload');
                          setVideoForm((prev) => ({ ...prev, isDirectUpload: true }));
                        }}
                        className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold cursor-pointer transition-all ${
                          videoSourceType === 'upload'
                            ? 'bg-purple-600/30 text-purple-200 border-purple-500 shadow-md font-black'
                            : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        <Upload className="w-4 h-4 text-purple-400" />
                        <span>{isNe ? '📂 सिधै भिडियो फाइल अपलोड' : 'Direct Video Upload'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setVideoSourceType('youtube');
                          setVideoForm((prev) => ({ ...prev, isDirectUpload: false }));
                        }}
                        className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold cursor-pointer transition-all ${
                          videoSourceType === 'youtube'
                            ? 'bg-purple-600/30 text-purple-200 border-purple-500 shadow-md font-black'
                            : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        <Film className="w-4 h-4 text-purple-400" />
                        <span>{isNe ? '▶️ YouTube लिङ्क वा ID' : 'YouTube Link'}</span>
                      </button>
                    </div>
                  </div>

                  {/* DIRECT VIDEO FILE UPLOAD ZONE */}
                  {videoSourceType === 'upload' && (
                    <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-800/40 space-y-3">
                      <input
                        ref={videoFileInputRef}
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,video/x-matroska"
                        className="hidden"
                        onChange={handleVideoFileSelect}
                      />

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-black text-purple-300">
                          {isNe ? 'भिडियो फाइल (MP4, WebM, MOV)' : 'Video File (MP4, WebM, MOV)'}
                        </span>
                        <span className="text-[10px] text-cyan-400 font-mono">
                          {isNe ? 'कुनै पनि आकार (ठाडो/तेर्सो)' : 'Any Ratio (9:16 / 16:9 / 1:1)'}
                        </span>
                      </div>

                      {/* Drop / Click Box */}
                      <div
                        onClick={() => !videoUploading && videoFileInputRef.current?.click()}
                        className="border-2 border-dashed border-purple-500/40 hover:border-purple-400/80 bg-slate-900/80 rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-colors"
                      >
                        {videoUploading ? (
                          <div className="flex flex-col items-center gap-2 py-2 text-purple-300">
                            <Loader2 className="w-7 h-7 animate-spin text-purple-400" />
                            <span className="text-xs font-bold">{videoUploadProgress || (isNe ? 'अपलोड हुँदैछ...' : 'Uploading...')}</span>
                            <span className="text-[10px] text-slate-400">
                              {isNe ? 'कृपया केही सेकेन्ड पर्खनुहोस्' : 'Please wait a moment'}
                            </span>
                          </div>
                        ) : (
                          <>
                            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                              <FileVideo className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">
                                {videoForm.videoUrl || (videoForm.youtubeId && videoForm.youtubeId.startsWith('/uploads/'))
                                  ? isNe
                                    ? 'नयाँ भिडियो बदल्न यहाँ क्लिक गर्नुहोस्'
                                    : 'Click to replace video file'
                                  : isNe
                                  ? 'कम्प्युटर वा मोबाइलबाट भिडियो फाइल छान्नुहोस्'
                                  : 'Select video file from device'}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {isNe
                                  ? 'MP4, WebM, MOV समर्थित • जुनसुकै साइज (ठाडो Reel वा तेर्सो HD)'
                                  : 'Supports MP4, WebM, MOV • Any aspect ratio'}
                              </p>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Uploaded Video Metadata & Natural Ratio Preview */}
                      {(videoForm.videoUrl || (videoForm.youtubeId && videoForm.youtubeId.startsWith('/uploads/'))) && (
                        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>{isNe ? 'भिडियो लोड भयो' : 'Video Loaded'}</span>
                            </span>
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                              {videoForm.aspectRatio === '9/16'
                                ? '📱 9:16 Vertical Reel'
                                : videoForm.aspectRatio === '1/1'
                                ? '🔲 1:1 Square'
                                : '🖥️ 16:9 Widescreen'}
                              {videoForm.width && videoForm.height ? ` (${videoForm.width}x${videoForm.height})` : ''}
                            </span>
                          </div>

                          {/* Live Natural Ratio Video Player Preview */}
                          <div
                            className="w-full mx-auto bg-black rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center"
                            style={{
                              aspectRatio: videoForm.aspectRatio ? videoForm.aspectRatio.replace('/', ' / ') : '16 / 9',
                              maxHeight: '220px',
                            }}
                          >
                            <video
                              key={videoForm.videoUrl || videoForm.youtubeId}
                              src={videoForm.videoUrl || videoForm.youtubeId}
                              controls
                              className="w-full h-full object-contain max-h-[220px]"
                            />
                          </div>
                          <p className="text-[10px] text-slate-400 text-center">
                            {isNe
                              ? '👆 एपमा पनि यो भिडियो यही प्राकृतिक अनुपात र साइजमा चल्नेछ।'
                              : '👆 This video will play in this exact natural ratio across the app.'}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* YOUTUBE EMBED SOURCE INPUT */}
                  {videoSourceType === 'youtube' && (
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
                        required={videoSourceType === 'youtube'}
                      />
                      <p className="text-[10px] text-slate-400">
                        {isNe
                          ? 'सिधा YouTube ID वा लिङ्क राख्नुहोस्, यसले स्वतः पहिचान गर्छ।'
                          : 'Paste full YouTube link or 11-char ID.'}
                      </p>
                    </div>
                  )}

                  {/* Title Inputs */}
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

                  {/* Description */}
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

                  {/* Category and Duration */}
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

                  {/* Direct Thumbnail Upload or URL */}
                  <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <input
                      ref={thumbFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleThumbFileSelect}
                    />

                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-300">
                        {isNe ? 'थम्बनेल कभर फोटो (Thumbnail Image)' : 'Thumbnail Cover Photo'}
                      </label>
                      {videoForm.thumbnail && (
                        <span className="text-[10px] text-emerald-400 font-bold">✓ {isNe ? 'थम्बनेल सेट छ' : 'Ready'}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {videoForm.thumbnail && (
                        <div className="w-12 h-12 rounded-xl bg-slate-950 overflow-hidden shrink-0 border border-slate-700">
                          <img src={videoForm.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                        </div>
                      )}

                      <button
                        type="button"
                        disabled={thumbUploading}
                        onClick={() => thumbFileInputRef.current?.click()}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                      >
                        {thumbUploading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5 text-purple-400" />
                        )}
                        <span>{isNe ? 'सिधै थम्बनेल फोटो अपलोड' : 'Upload Thumbnail Image'}</span>
                      </button>
                    </div>

                    <input
                      type="url"
                      value={videoForm.thumbnail || ''}
                      onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.value })}
                      placeholder="वा फोटोको URL राख्नुहोस्..."
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none font-mono"
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
                      disabled={videoUploading}
                      className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 text-xs font-black cursor-pointer shadow-lg active:scale-95 transition-all disabled:opacity-50"
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
                <MediaUploader
                  label={isNe ? 'गृहपृष्ठ मुख्य ब्यानर (Hero Banner)' : 'Hero Banner'}
                  badge="16:9 / 3:1 HD"
                  currentUrl={mediaSettings.banners.hero}
                  onUrlChange={(url) => handleBannerUrlChange('hero', url)}
                  isNe={isNe}
                />

                <MediaUploader
                  label={isNe ? 'आपतकालीन उद्दार ब्यानर (SOS Rescue Banner)' : 'Rescue Banner'}
                  badge="SOS Emergency"
                  currentUrl={mediaSettings.banners.rescue}
                  onUrlChange={(url) => handleBannerUrlChange('rescue', url)}
                  isNe={isNe}
                />

                <MediaUploader
                  label={isNe ? 'साइबर ब्युरो उजुरी ब्यानर (Police Complaint)' : 'Complaint Banner'}
                  badge="Legal Bureau"
                  currentUrl={mediaSettings.banners.complaint}
                  onUrlChange={(url) => handleBannerUrlChange('complaint', url)}
                  isNe={isNe}
                />

                <MediaUploader
                  label={isNe ? 'ठगी तथ्याङ्क ब्यानर (Scam Trends / Stats)' : 'Stats Banner'}
                  badge="Analytics"
                  currentUrl={mediaSettings.banners.stats}
                  onUrlChange={(url) => handleBannerUrlChange('stats', url)}
                  isNe={isNe}
                />
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
                  const label = isNe ? item.tagNe || item.altNe : item.tagEn || item.altEn;

                  return (
                    <MediaUploader
                      key={toolKey}
                      label={label}
                      badge={toolKey}
                      compact={true}
                      currentUrl={currentImgUrl}
                      onUrlChange={(url) => handleToolPhotoChange(toolKey, url)}
                      isNe={isNe}
                    />
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

      {/* ---------------------------------------------------- */}
      {/* SECTION 4: THEME & APPEARANCE SETTINGS PANEL        */}
      {/* (१० वटा विशिष्ट थिमहरू, प्राथमिक रङ, फन्ट, र पृष्ठभूमि भेरियन्ट) */}
      {/* ---------------------------------------------------- */}
      {activeSection === 'theme' && (
        <div className="space-y-8 animate-fadeIn">
          {/* 1. Header & Quick Actions Banner */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#172033] via-[#0f172a] to-[#172033] border border-cyan-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <Palette className="w-4 h-4" />
                <span>{isNe ? 'थिम तथा दृश्य शैली व्यवस्थापन' : 'Theme & Appearance Settings'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {isNe
                  ? '१० वटा विशिष्ट थिमहरू, प्राथमिक रङ, फन्ट र पृष्ठभूमि'
                  : '10 Distinct Themes, Primary Colors, Fonts & Canvas'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {isNe
                  ? 'उच्च कन्ट्रास्ट ग्यारेन्टी: पृष्ठभूमि उज्यालो (Light) हुँदा अक्षर गाढा (Dark) र पृष्ठभूमि डार्क हुँदा अक्षर चम्किलो सेतो (White) रहने गरी १० वटै प्रिमियम लक्जरी थिमहरू तयार पारिएका छन्। प्राथमिक रङ, फन्ट र क्यानभास भेरियन्ट तुरुन्तै एपभरि लागू हुन्छन्।'
                  : 'Strict Contrast Guarantee: Light background enforces dark typography, and dark background enforces crystal white typography across all 10 premium themes. Instant global sync.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={onNavigateHome}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 cursor-pointer active:scale-95 transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>{isNe ? 'एपमा हेर्नुहोस्' : 'Preview Public App'}</span>
              </button>

              <button
                type="button"
                onClick={handleResetTheme}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer active:scale-95 transition-all"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>{isNe ? 'पूर्वनिर्धारितमा फर्काउनुहोस्' : 'Reset Defaults'}</span>
              </button>
            </div>
          </div>

          {/* 2. Active Theme Status & Telemetry Bar */}
          <div className="p-5 rounded-3xl bg-[#0e1628] border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-0.5">
                  {isNe ? 'हाल सक्रिय थिम र कन्फिगरेसन' : 'Currently Active Configuration'}
                </span>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <span>
                    {THEME_PRESETS.find((t) => t.id === themeSettings.activeThemeId)?.nameNe || 'उज्यालो हिमाल'}
                  </span>
                  <span className="text-xs text-slate-400 font-normal">
                    ({THEME_PRESETS.find((t) => t.id === themeSettings.activeThemeId)?.nameEn || 'Himalayan Snow Bright'})
                  </span>
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    THEME_PRESETS.find((t) => t.id === themeSettings.activeThemeId)?.mode === 'light'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                  }`}
                >
                  {THEME_PRESETS.find((t) => t.id === themeSettings.activeThemeId)?.mode === 'light'
                    ? '☀️ उज्यालो (Daylight Light)'
                    : '🌙 डार्क (Obsidian Dark)'}
                </span>

                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-900 text-cyan-300 border border-slate-700 font-mono">
                  {FONT_OPTIONS.find((f) => f.id === themeSettings.activeFontId)?.nameNe?.split(' ')[0] || 'मुक्ता'}
                </span>

                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-900 text-emerald-300 border border-slate-700 font-mono">
                  {BACKGROUND_VARIANTS.find((b) => b.id === themeSettings.backgroundVariant)?.nameNe?.split(' ')[0] || 'पूर्वनिर्धारित'}
                </span>
              </div>
            </div>

            {/* Quick status chips */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              {(() => {
                const activePreset =
                  THEME_PRESETS.find((t) => t.id === themeSettings.activeThemeId) || THEME_PRESETS[0];
                const activeColor = themeSettings.customPrimaryColor || activePreset.previewColors.primary;
                return (
                  <>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 block">{isNe ? 'क्यानभास (Background)' : 'Background Canvas'}</span>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-slate-600 shrink-0"
                          style={{ backgroundColor: activePreset.previewColors.bg }}
                        />
                        <span className="font-mono text-[11px] font-bold text-slate-200">
                          {activePreset.previewColors.bg}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 block">{isNe ? 'कार्ड सतह (Surface Card)' : 'Surface Card'}</span>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-slate-600 shrink-0"
                          style={{ backgroundColor: activePreset.previewColors.card }}
                        />
                        <span className="font-mono text-[11px] font-bold text-slate-200">
                          {activePreset.previewColors.card}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 block">{isNe ? 'मुख्य रङ (Primary)' : 'Primary Accent'}</span>
                        {themeSettings.customPrimaryColor && (
                          <button
                            onClick={handleClearCustomPrimary}
                            className="text-[9px] text-amber-400 hover:underline cursor-pointer"
                            title={isNe ? 'मूल रङ फर्काउनुहोस्' : 'Reset to default color'}
                          >
                            {isNe ? 'मूल रङ' : 'Reset'}
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-slate-600 shrink-0 shadow-sm"
                          style={{ backgroundColor: activeColor }}
                        />
                        <span className="font-mono text-[11px] font-bold text-cyan-300">
                          {activeColor}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 block">{isNe ? 'अक्षर रङ (Text)' : 'Text Contrast'}</span>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-slate-600 shrink-0"
                          style={{ backgroundColor: activePreset.previewColors.text }}
                        />
                        <span className="font-mono text-[11px] font-bold text-slate-200">
                          {activePreset.previewColors.text}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 block">{isNe ? 'पृष्ठभूमि भेरियन्ट' : 'Background Variant'}</span>
                      <span className="font-mono text-xs font-bold text-emerald-400 block pt-0.5">
                        {themeSettings.backgroundVariant}
                      </span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* 3. Interactive Live Theme Sandbox / Preview Canvas */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0b1220] border border-cyan-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-black text-white">
                  {isNe ? 'प्रत्यक्ष अन्तरक्रियात्मक थिम स्यान्डबक्स (Live Theme Sandbox)' : 'Interactive Live Theme Sandbox'}
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                {isNe ? 'तपाईंले चयन गरेका सबै शैलीहरू यहाँ तत्काल देखिनेछन्' : 'Renders with live active CSS variables'}
              </span>
            </div>

            {/* Sandbox Container Rendered with Active Theme CSS Variables */}
            <div
              className={`p-5 sm:p-6 transition-all duration-200 border space-y-5 ${themeSettings.cardRoundness}`}
              style={{
                backgroundColor: 'var(--app-bg)',
                color: 'var(--app-text-main)',
                borderColor: 'var(--app-border)',
                fontFamily: 'var(--app-font-family)',
              }}
            >
              {/* Simulated Mini App Header */}
              <div
                className="p-3 sm:p-4 rounded-2xl flex items-center justify-between border"
                style={{
                  backgroundColor: 'var(--app-card-bg)',
                  borderColor: 'var(--app-border)',
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs text-white"
                    style={{ backgroundColor: 'var(--app-accent-primary)' }}
                  >
                    S
                  </div>
                  <div>
                    <span className="font-black text-sm block" style={{ color: 'var(--app-text-main)' }}>
                      Scamly
                    </span>
                    <span className="text-[10px] block" style={{ color: 'var(--app-text-muted)' }}>
                      {isNe ? 'नेपालको राष्ट्रिय साइबर सुरक्षा पोर्टल' : 'Nepal Cyber Defense Portal'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="px-2.5 py-1 rounded-full text-[11px] font-bold border"
                    style={{
                      backgroundColor: 'var(--app-card-subtle)',
                      borderColor: 'var(--app-border-highlight)',
                      color: 'var(--app-accent-primary)',
                    }}
                  >
                    {isNe ? '✓ प्रणाली सक्रिय छ' : 'System Active'}
                  </span>
                </div>
              </div>

              {/* Simulated Feature Search / Verification Card */}
              <div
                className="p-4 sm:p-5 rounded-2xl border space-y-3"
                style={{
                  backgroundColor: 'var(--app-card-bg)',
                  borderColor: 'var(--app-border)',
                }}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold" style={{ color: 'var(--app-text-main)' }}>
                    {isNe
                      ? 'सशंकित लिङ्क, फोन नम्बर वा बैंक खाता जाँच गर्नुहोस्'
                      : 'Verify Suspicious Link, Phone or Bank Account'}
                  </h4>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: 'var(--app-card-subtle)',
                      color: 'var(--app-text-muted)',
                    }}
                  >
                    AI Shield v2
                  </span>
                </div>

                <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
                  {isNe
                    ? 'कुनै पनि ईसेवा, खल्ती वा बैंकिङ ठगी लिङ्क यहाँ राखेर तुरुन्तै प्रमाणीकरण गर्न सकिन्छ।'
                    : 'Instant heuristic threat analysis for phishing links and payment scams in Nepal.'}
                </p>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <input
                    type="text"
                    readOnly
                    value="https://nepal-lottery-gift.com/claim-reward"
                    className="flex-1 px-3.5 py-2 rounded-xl text-xs font-mono border outline-none"
                    style={{
                      backgroundColor: 'var(--app-card-subtle)',
                      borderColor: 'var(--app-border)',
                      color: 'var(--app-text-main)',
                    }}
                  />
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl text-xs font-black text-white cursor-pointer transition-all active:scale-95 shadow-md shrink-0"
                    style={{
                      backgroundColor: 'var(--app-accent-primary)',
                    }}
                  >
                    {isNe ? 'स्क्यान गर्नुहोस्' : 'Scan Threat'}
                  </button>
                </div>
              </div>

              {/* CSS Variables Inspector pills */}
              <div
                className="p-2.5 rounded-xl border flex flex-wrap items-center gap-2 text-[10px] font-mono"
                style={{
                  backgroundColor: 'var(--app-card-subtle)',
                  borderColor: 'var(--app-border)',
                  color: 'var(--app-text-muted)',
                }}
              >
                <span className="font-bold">{isNe ? 'सक्रिय CSS चरहरू:' : 'Active CSS Variables:'}</span>
                <span>--app-bg: <strong style={{ color: 'var(--app-text-main)' }}>var(--app-bg)</strong></span>
                <span>·</span>
                <span>--app-card-bg: <strong style={{ color: 'var(--app-text-main)' }}>var(--app-card-bg)</strong></span>
                <span>·</span>
                <span>--app-accent-primary: <strong style={{ color: 'var(--app-accent-primary)' }}>var(--app-accent-primary)</strong></span>
                <span>·</span>
                <span>--app-font-family: <strong style={{ color: 'var(--app-text-main)' }}>var(--app-font-family)</strong></span>
              </div>
            </div>
          </div>

          {/* 4. TEN RICH DISTINCT THEMES GRID */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-black text-white">
                  {isNe
                    ? '१० वटा विशिष्ट रङ थिमहरू (१० Distinct Color Themes)'
                    : '10 Distinct Color Themes (Bright Daylight & Dark)'}
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                {isNe ? '१-क्लिकमा तत्काल सक्रिय हुने' : 'Click to apply instantly'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {THEME_PRESETS.map((preset, index) => {
                const isActive = themeSettings.activeThemeId === preset.id;
                return (
                  <div
                    key={preset.id}
                    className={`p-5 rounded-3xl transition-all border flex flex-col justify-between gap-4 ${
                      isActive
                        ? 'bg-[#121c32] border-cyan-400 shadow-xl shadow-cyan-500/10 ring-2 ring-cyan-400/40'
                        : 'bg-[#0e1628] hover:bg-[#121a30] border-slate-800'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Theme Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 border"
                            style={{
                              backgroundColor: preset.previewColors.card,
                              color: preset.previewColors.primary,
                              borderColor: preset.previewColors.border,
                            }}
                          >
                            {index + 1}
                          </span>
                          <div>
                            <h4 className="text-sm font-black text-white">{preset.nameNe}</h4>
                            <p className="text-[11px] text-slate-400 font-medium">{preset.nameEn}</p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              preset.mode === 'light'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                            }`}
                          >
                            {preset.mode === 'light' ? '☀️ उज्यालो (Daylight)' : '🌙 डार्क (Dark)'}
                          </span>
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                            {preset.mode === 'light'
                              ? (isNe ? '✒️ गाढा अक्षर (Dark Text)' : '✒️ Dark Letters')
                              : (isNe ? '❄️ सेतो अक्षर (White Text)' : '❄️ White Letters')}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {isNe ? preset.taglineNe : preset.taglineEn}
                      </p>

                      {/* Mini Live Preview Card inside each theme */}
                      <div
                        className="p-3 rounded-2xl border space-y-2"
                        style={{
                          backgroundColor: preset.previewColors.bg,
                          borderColor: preset.previewColors.border,
                        }}
                      >
                        {/* Mini Top bar */}
                        <div
                          className="px-2.5 py-1 rounded-lg flex items-center justify-between border"
                          style={{
                            backgroundColor: preset.previewColors.card,
                            borderColor: preset.previewColors.border,
                          }}
                        >
                          <span
                            className="text-[10px] font-black"
                            style={{ color: preset.previewColors.text }}
                          >
                            Scamly UI
                          </span>
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: preset.previewColors.primary }}
                          />
                        </div>

                        {/* Mini content with button */}
                        <div
                          className="p-2 rounded-lg border flex items-center justify-between gap-2"
                          style={{
                            backgroundColor: preset.previewColors.card,
                            borderColor: preset.previewColors.border,
                          }}
                        >
                          <span
                            className="text-[10px] font-bold truncate"
                            style={{ color: preset.previewColors.text }}
                          >
                            {isNe ? 'साइबर सुरक्षा कवच' : 'Active Defense'}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded text-[9px] font-bold text-white shrink-0"
                            style={{ backgroundColor: preset.previewColors.primary }}
                          >
                            {isNe ? 'सुरक्षित' : 'Safe'}
                          </span>
                        </div>
                      </div>

                      {/* Color Palette Preview Swatches */}
                      <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-bold">
                          {isNe ? 'रङ प्यालेट:' : 'Color Palette:'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-5 h-5 rounded-lg border border-slate-600 shadow-sm"
                            style={{ backgroundColor: preset.previewColors.bg }}
                            title="Background"
                          />
                          <span
                            className="w-5 h-5 rounded-lg border border-slate-600 shadow-sm"
                            style={{ backgroundColor: preset.previewColors.card }}
                            title="Card Surface"
                          />
                          <span
                            className="w-5 h-5 rounded-lg border border-slate-600 shadow-sm"
                            style={{ backgroundColor: preset.previewColors.primary }}
                            title="Primary Accent"
                          />
                          <span
                            className="w-5 h-5 rounded-lg border border-slate-600 shadow-sm"
                            style={{ backgroundColor: preset.previewColors.text }}
                            title="Text Color"
                          />
                          <span
                            className="w-5 h-5 rounded-lg border border-slate-600 shadow-sm"
                            style={{ backgroundColor: preset.previewColors.border }}
                            title="Border Color"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectThemePreset(preset.id)}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2 ${
                        isActive
                          ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/20'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {isActive ? (
                        <>
                          <Check className="w-4 h-4 text-slate-950 font-black" />
                          <span>{isNe ? '✓ सक्रिय थिम' : 'Active Theme'}</span>
                        </>
                      ) : (
                        <span>{isNe ? 'यो थिम लागू गर्नुहोस्' : 'Apply This Theme'}</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. BACKGROUND VARIANT SELECTOR */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0e1628] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-black text-white">
                  {isNe ? 'पृष्ठभूमि भेरियन्ट (Background Canvas Variants)' : 'Background Canvas Variants'}
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                {isNe ? 'क्यानभास र कार्ड सतहको टोन अनुकूलन' : 'Tailor canvas depth and border contrast'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {BACKGROUND_VARIANTS.map((v) => {
                const isSelected = themeSettings.backgroundVariant === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleSelectBackgroundVariant(v.id)}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#142340] border-cyan-400 shadow-md ring-1 ring-cyan-400/50'
                        : 'bg-slate-900/90 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white">{v.nameNe}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                      <span className="text-[10px] text-cyan-400/80 font-mono block">{v.nameEn}</span>
                      <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                        {isNe ? v.descriptionNe : v.descriptionEn}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded text-center block ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isSelected ? (isNe ? 'सक्रिय छ' : 'Active') : (isNe ? 'चयन गर्नुहोस्' : 'Select')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. PRIMARY ACCENT COLOR PICKER */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0e1628] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-black text-white">
                  {isNe ? 'प्राथमिक रङ अनुकूलन (Primary Accent Color)' : 'Primary Accent Color Customizer'}
                </h3>
              </div>
              {themeSettings.customPrimaryColor && (
                <button
                  type="button"
                  onClick={handleClearCustomPrimary}
                  className="text-xs text-amber-400 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{isNe ? 'थिमको मूल रङ फर्काउनुहोस्' : 'Reset to Theme Default'}</span>
                </button>
              )}
            </div>

            <p className="text-xs text-slate-400">
              {isNe
                ? 'तपाईंले छान्नुभएको प्राथमिक रङ मुख्य बटन, ब्यानर, एक्टिभ ट्याब र सुरक्षा सूचकहरूमा तुरुन्तै लागू हुनेछ।'
                : 'Selected primary accent color is applied to buttons, highlights, active tabs, and cyber badges.'}
            </p>

            {/* Curated Swatch Palette */}
            <div className="flex flex-wrap items-center gap-2.5">
              {[
                { name: 'Sky Blue', hex: '#0284c7' },
                { name: 'Emerald', hex: '#059669' },
                { name: 'Golden Amber', hex: '#d97706' },
                { name: 'Royal Blue', hex: '#2563eb' },
                { name: 'Rose Coral', hex: '#e11d48' },
                { name: 'Lavender', hex: '#7c3aed' },
                { name: 'Arctic Teal', hex: '#0891b2' },
                { name: 'Nepal Crimson', hex: '#dc2626' },
                { name: 'Neon Cyan', hex: '#06b6d4' },
                { name: 'Titanium Slate', hex: '#334155' },
              ].map((c) => {
                const isSelected =
                  themeSettings.customPrimaryColor?.toLowerCase() === c.hex.toLowerCase();
                return (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => handleCustomAccentColor(c.hex)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-slate-800 border-cyan-400 shadow-sm ring-1 ring-cyan-400/40 text-white'
                        : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0 shadow-sm"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Color Input & Hex Code Entry */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-300">
                  {isNe ? 'कलर ह्विल (Color Wheel):' : 'Color Wheel:'}
                </span>
                <input
                  type="color"
                  value={themeSettings.customPrimaryColor || '#0284c7'}
                  onChange={(e) => handleCustomAccentColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  title={isNe ? 'आफ्नै रङ छान्नुहोस्' : 'Pick custom color'}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">HEX:</span>
                <input
                  type="text"
                  value={customHexInput}
                  onChange={(e) => setCustomHexInput(e.target.value)}
                  placeholder="#0284c7"
                  className="w-28 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-mono outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customHexInput.trim().startsWith('#') && customHexInput.trim().length >= 4) {
                      handleCustomAccentColor(customHexInput.trim());
                    } else {
                      showToast(isNe ? 'कृपया मान्य HEX कोड (#xxxxxx) राख्नुहोस्' : 'Please enter a valid HEX color (#xxxxxx)');
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs cursor-pointer active:scale-95 transition-all"
                >
                  {isNe ? 'लागू गर्नुहोस्' : 'Apply'}
                </button>
              </div>
            </div>
          </div>

          {/* 7. TYPOGRAPHY / FONT FAMILY SELECTOR */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0e1628] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-black text-white">
                  {isNe
                    ? 'अक्षर फन्ट छनोट (Typography Font Styles)'
                    : 'Typography & Text Font Styles'}
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                {isNe ? 'नेपाली र अंग्रेजी दुवैमा उच्च स्पष्टता' : 'Optimized for Nepali & English legibility'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FONT_OPTIONS.map((font) => {
                const isFontActive = themeSettings.activeFontId === font.id;
                return (
                  <div
                    key={font.id}
                    onClick={() => handleSelectFont(font.id)}
                    className={`p-4 rounded-3xl transition-all border cursor-pointer space-y-3 ${
                      isFontActive
                        ? 'bg-[#121c32] border-cyan-400 shadow-xl shadow-cyan-500/10 ring-2 ring-cyan-400/40'
                        : 'bg-[#0c1424] hover:bg-[#121a30] border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-white">{font.nameNe}</h4>
                      {isFontActive && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950">
                          {isNe ? 'सक्रिय' : 'Active'}
                        </span>
                      )}
                    </div>

                    <div
                      className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5"
                      style={{ fontFamily: font.fontFamily }}
                    >
                      <p className="text-sm font-bold text-white leading-snug">
                        {font.sampleNe}
                      </p>
                      <p className="text-xs text-slate-300">
                        {font.sampleEn}
                      </p>
                    </div>

                    <button
                      type="button"
                      className={`w-full py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                        isFontActive
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-black'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {isFontActive ? (isNe ? '✓ यो फन्ट सक्रिय छ' : 'Selected') : (isNe ? 'यो फन्ट छान्नुहोस्' : 'Select Font')}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 8. CARD CORNER ROUNDNESS STYLES */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0e1628] border border-slate-800 space-y-3">
            <h3 className="text-sm font-black text-white">
              {isNe ? 'कार्ड कुना शैली (Card Corner Radius Style)' : 'Card Roundness Style'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(
                [
                  { id: 'rounded-xl', nameNe: 'मध्यम (Moderate - 12px)', nameEn: 'Moderate (rounded-xl)' },
                  { id: 'rounded-2xl', nameNe: 'आधुनिक मानक (Modern - 16px)', nameEn: 'Modern Standard (rounded-2xl)' },
                  { id: 'rounded-3xl', nameNe: 'सफ्ट कर्भ (Soft - 24px)', nameEn: 'Soft Curve (rounded-3xl)' },
                ] as const
              ).map((r) => {
                const isSelected = themeSettings.cardRoundness === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      const updated = { ...themeSettings, cardRoundness: r.id };
                      setThemeSettings(updated);
                      saveAppThemeSettings(updated);
                      showToast(isNe ? 'कार्ड शैली परिवर्तन गरियो!' : 'Card style updated!');
                    }}
                    className={`p-3.5 rounded-2xl border text-xs font-bold text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-700'
                    }`}
                  >
                    <div>{r.nameNe}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{r.nameEn}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 9. BOTTOM GLOBAL PERSISTENCE ACTION BAR */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-[#0c1424] via-[#101b33] to-[#0c1424] border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <span className="text-xs text-slate-300 leading-relaxed">
              {isNe
                ? '✓ छानिएका थिम, रङ, फन्ट र पृष्ठभूमि सेटिङहरू तत्कालै सुरक्षित हुन्छन् र सम्पूर्ण एपमा प्रत्यक्ष देखिन्छन्।'
                : '✓ Selected theme, color, font, and background settings are instantly saved and active globally.'}
            </span>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={onNavigateHome}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer active:scale-95 transition-all"
              >
                {isNe ? 'एप हेर्नुहोस्' : 'View Public App'}
              </button>
              <button
                type="button"
                onClick={() => {
                  saveAppThemeSettings(themeSettings);
                  showToast(isNe ? 'थिम र फन्ट सुरक्षित गरियो!' : 'Theme settings confirmed and saved globally!');
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-teal-400 hover:from-amber-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm cursor-pointer shadow-lg active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{isNe ? 'थिम सेटिङहरू सुरक्षित गर्नुहोस्' : 'Save Theme Settings'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

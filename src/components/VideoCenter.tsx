import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { PageView } from '../App';
import { getAppVideos, ScamVideoItem } from '../utils/mediaStorage';

interface VideoCenterProps {
  lang: Language;
  onNavigateTool: (page: PageView) => void;
  isOpenModal?: boolean;
  onCloseModal?: () => void;
}

export const VideoCenter: React.FC<VideoCenterProps> = ({
  lang,
  onNavigateTool,
  isOpenModal = false,
  onCloseModal,
}) => {
  const isNe = lang === 'ne';
  const [videos, setVideos] = useState<ScamVideoItem[]>(() => getAppVideos());
  const [activeVideo, setActiveVideo] = useState<ScamVideoItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const handleUpdate = () => {
      setVideos(getAppVideos());
    };
    window.addEventListener('app_videos_changed', handleUpdate);
    return () => window.removeEventListener('app_videos_changed', handleUpdate);
  }, []);

  const categories = [
    { id: 'all', labelNe: 'सबै भिडियोहरू', labelEn: 'All Videos' },
    { id: 'wallet', labelNe: 'बैंकिङ र OTP', labelEn: 'Banking & OTP' },
    { id: 'shopping', labelNe: 'अनलाइन किनमेल', labelEn: 'Shopping Scams' },
    { id: 'telegram', labelNe: 'टेलिग्राम टास्क', labelEn: 'Telegram Tasks' },
    { id: 'police', labelNe: 'प्रहरी उजुरी', labelEn: 'Police Complaint' },
    { id: 'ai', labelNe: 'AI भ्वाइस ठगी', labelEn: 'AI Voice Cloning' },
  ];

  const filteredVideos = videos.filter((v) => {
    if (selectedCategory === 'all') return true;
    return v.category === selectedCategory;
  });

  const getEmbedUrl = (videoIdOrUrl: string) => {
    if (videoIdOrUrl.includes('youtube.com') || videoIdOrUrl.includes('youtu.be')) {
      const match = videoIdOrUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      const id = match ? match[1] : videoIdOrUrl;
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    }
    return `https://www.youtube-nocookie.com/embed/${videoIdOrUrl}?autoplay=1&rel=0`;
  };

  const content = (
    <div className="space-y-6">
      {/* Video Center Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#0c1527] via-[#12203a] to-[#0c1527] border border-cyan-800/40 shadow-xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-700/60 text-[11px] font-bold text-cyan-300">
            <span>{isNe ? 'साइबर सुरक्षा भिडियो सचेतना केन्द्र' : 'Cyber Security Video Awareness'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {isNe ? 'ठगीबाट जोगिने आधिकारिक भिडियो ट्युटोरियल' : 'Official Scam Prevention Video Guides'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            {isNe
              ? 'हेरेर सिक्नुहोस्! नेपालमा चल्ने मुख्य ठगीका शैली, eSewa/Khalti सुरक्षित राख्ने तरिका र साइबर ब्युरोमा उजुरी दिने भिडियो।'
              : 'Watch real case studies and practical tutorials on preventing mobile banking traps, fake shops, and task frauds.'}
          </p>
        </div>

        {isOpenModal && onCloseModal && (
          <button
            onClick={onCloseModal}
            className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs font-bold"
          >
            ✕ {isNe ? 'बन्द गर्नुहोस्' : 'Close'}
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer active:scale-95 shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            {isNe ? cat.labelNe : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="group rounded-2xl bg-[#0f172a] hover:bg-[#131f37] border border-slate-800 hover:border-cyan-500/60 shadow-lg overflow-hidden flex flex-col justify-between transition-all duration-200"
          >
            {/* Clear, Bright Video Thumbnail */}
            <div
              onClick={() => setActiveVideo(video)}
              className="relative aspect-video w-full overflow-hidden cursor-pointer bg-slate-900"
            >
              <img
                src={video.thumbnail}
                alt={isNe ? video.titleNe : video.titleEn}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 filter brightness-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />

              {/* Minimal Text Badge for Playing */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="px-3 py-1.5 rounded-full bg-cyan-500/95 text-slate-950 font-black text-xs shadow-xl group-hover:scale-110 group-hover:bg-cyan-400 transition-transform">
                  ▶ PLAY
                </div>
              </div>

              {/* Duration Tag */}
              <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-bold text-white">
                <span>{video.duration}</span>
              </div>
            </div>

            {/* Video Info */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
              <div>
                <h3
                  onClick={() => setActiveVideo(video)}
                  className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 cursor-pointer"
                >
                  {isNe ? video.titleNe : video.titleEn}
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-2">
                  {isNe ? video.descNe : video.descEn}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveVideo(video)}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <span>{isNe ? 'भिडियो हेर्नुहोस् →' : 'Watch Video →'}</span>
                </button>

                {video.relatedTool && (
                  <button
                    onClick={() => {
                      if (isOpenModal && onCloseModal) onCloseModal();
                      onNavigateTool(video.relatedTool as PageView);
                    }}
                    className="text-[11px] font-semibold text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <span>{isNe ? 'टुल जाँच्नुहोस् →' : 'Open Tool →'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-[#0b1220] border border-cyan-800/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-white truncate">
                  {isNe ? activeVideo.titleNe : activeVideo.titleEn}
                </h3>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {isNe ? 'साइबर सचेतना भिडियो ट्युटोरियल' : 'Cyber Awareness Video Guide'}
                </p>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0 font-bold text-xs"
              >
                ✕ {isNe ? 'बन्द' : 'Close'}
              </button>
            </div>

            {/* Responsive Video Embed Container */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={getEmbedUrl(activeVideo.youtubeId)}
                title={isNe ? activeVideo.titleNe : activeVideo.titleEn}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Modal Footer with Actions */}
            <div className="p-4 sm:p-5 bg-[#0e1628] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <p className="text-slate-300 line-clamp-2 max-w-xl">
                {isNe ? activeVideo.descNe : activeVideo.descEn}
              </p>

              {activeVideo.relatedTool && (
                <button
                  onClick={() => {
                    const tool = activeVideo.relatedTool as PageView;
                    setActiveVideo(null);
                    if (isOpenModal && onCloseModal) onCloseModal();
                    onNavigateTool(tool);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-md cursor-pointer shrink-0"
                >
                  <span>{isNe ? 'सम्बन्धित सुरक्षा टुल खोल्नुहोस् →' : 'Launch Related Tool →'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isOpenModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <div className="relative w-full max-w-5xl bg-[#0b1220] border border-cyan-800/80 rounded-3xl p-4 sm:p-6 shadow-2xl my-auto">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

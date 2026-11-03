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

  const isDirectVideo = (video: ScamVideoItem) => {
    if (video.isDirectUpload || video.videoUrl) return true;
    const src = video.videoUrl || video.youtubeId || '';
    return (
      src.startsWith('/uploads/') ||
      src.endsWith('.mp4') ||
      src.endsWith('.webm') ||
      src.endsWith('.mov') ||
      src.endsWith('.mkv') ||
      src.startsWith('blob:') ||
      src.startsWith('data:video')
    );
  };

  const getVideoSrc = (video: ScamVideoItem) => {
    return video.videoUrl || video.youtubeId;
  };

  const getEmbedUrl = (videoIdOrUrl: string) => {
    if (videoIdOrUrl.includes('youtube.com') || videoIdOrUrl.includes('youtu.be')) {
      const match = videoIdOrUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      const id = match ? match[1] : videoIdOrUrl;
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    }
    return `https://www.youtube-nocookie.com/embed/${videoIdOrUrl}?autoplay=1&rel=0`;
  };

  const getVideoRatioInfo = (video: ScamVideoItem) => {
    const rawRatio = video.aspectRatio || (video.width && video.height ? `${video.width}/${video.height}` : '16/9');
    const isVertical = rawRatio === '9/16' || (video.height && video.width ? video.height > video.width : false);
    const isSquare = rawRatio === '1/1' || (video.height && video.width ? video.height === video.width : false);
    const cssRatio = rawRatio.replace('/', ' / ');

    let labelNe = '16:9 फराकिलो भिडियो';
    let labelEn = '16:9 Widescreen';
    if (isVertical) {
      labelNe = '📱 9:16 ठाडो भिडियो (Vertical Reel)';
      labelEn = '📱 9:16 Vertical Reel';
    } else if (isSquare) {
      labelNe = '🔲 1:1 चारपाटे (Square)';
      labelEn = '🔲 1:1 Square';
    } else if (rawRatio === '4/3') {
      labelNe = '📺 4:3 स्ट्यान्डर्ड';
      labelEn = '📺 4:3 Standard';
    }

    return { rawRatio, cssRatio, isVertical, isSquare, labelNe, labelEn };
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
              ? 'हेरेर सिक्नुहोस्! प्रत्यक्ष अपलोड गरिएका र YouTube का सचेतना भिडियोहरू तिनीहरूको प्राकृतिक साइज (ठाडो र तेर्सो) मा हेर्नुहोस्।'
              : 'Watch uploaded direct video guides and YouTube tutorials in their native uploaded dimensions & aspect ratios.'}
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
        {filteredVideos.map((video) => {
          const ratioInfo = getVideoRatioInfo(video);
          const isDirect = isDirectVideo(video);

          return (
            <div
              key={video.id}
              className="group rounded-2xl bg-[#0f172a] hover:bg-[#131f37] border border-slate-800 hover:border-cyan-500/60 shadow-lg overflow-hidden flex flex-col justify-between transition-all duration-200"
            >
              {/* Clear, Bright Video Thumbnail */}
              <div
                onClick={() => setActiveVideo(video)}
                className="relative aspect-video w-full overflow-hidden cursor-pointer bg-slate-950 flex items-center justify-center"
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

                {/* Aspect Ratio / Upload Format Badge */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                  <span>{isDirect ? (ratioInfo.isVertical ? '📱 9:16 Reel' : '📂 MP4/WebM') : '▶ YouTube'}</span>
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
          );
        })}
      </div>

      {/* Video Player Modal with Natural Uploaded Aspect Ratio ("jun size ma upload gareyo tai size ma app ma play hune") */}
      {activeVideo && (() => {
        const ratioInfo = getVideoRatioInfo(activeVideo);
        const isDirect = isDirectVideo(activeVideo);
        const videoSrc = getVideoSrc(activeVideo);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/90 backdrop-blur-md animate-fadeIn overflow-y-auto">
            <div
              className={`relative w-full ${
                ratioInfo.isVertical ? 'max-w-md' : 'max-w-4xl'
              } bg-[#0b1220] border border-cyan-800/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[96vh] my-auto transition-all`}
            >
              {/* Modal Header with Aspect Ratio & Format Indicators */}
              <div className="p-3.5 sm:p-4 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-300 text-[10px] font-bold">
                      {isNe ? ratioInfo.labelNe : ratioInfo.labelEn}
                    </span>
                    {activeVideo.width && activeVideo.height && (
                      <span className="text-[10px] font-mono text-slate-400">
                        {activeVideo.width}x{activeVideo.height}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white truncate mt-1">
                    {isNe ? activeVideo.titleNe : activeVideo.titleEn}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0 font-bold text-xs"
                >
                  ✕ {isNe ? 'बन्द' : 'Close'}
                </button>
              </div>

              {/* Natural Size / Adaptive Aspect Ratio Video Playback Container */}
              <div className="relative w-full bg-black flex items-center justify-center overflow-hidden">
                <div
                  className="relative w-full mx-auto flex items-center justify-center"
                  style={{
                    aspectRatio: ratioInfo.cssRatio,
                    maxHeight: '74vh',
                  }}
                >
                  {isDirect ? (
                    <video
                      key={videoSrc}
                      src={videoSrc}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain max-h-[74vh]"
                    >
                      <source src={videoSrc} />
                      Your browser does not support HTML5 video playback.
                    </video>
                  ) : (
                    <iframe
                      src={getEmbedUrl(activeVideo.youtubeId)}
                      title={isNe ? activeVideo.titleNe : activeVideo.titleEn}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
              </div>

              {/* Modal Footer with Actions */}
              <div className="p-3.5 sm:p-4 bg-[#0e1628] border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <p className="text-slate-300 line-clamp-2 max-w-xl">
                  {isNe ? activeVideo.descNe : activeVideo.descEn}
                </p>

                <div className="flex items-center gap-2 shrink-0">
                  {isDirect && (
                    <a
                      href={videoSrc}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                      title={isNe ? 'भिडियो डाउनलोड गर्नुहोस्' : 'Download Video'}
                    >
                      📥 {isNe ? 'डाउनलोड' : 'Download'}
                    </a>
                  )}

                  {activeVideo.relatedTool && (
                    <button
                      onClick={() => {
                        const tool = activeVideo.relatedTool as PageView;
                        setActiveVideo(null);
                        if (isOpenModal && onCloseModal) onCloseModal();
                        onNavigateTool(tool);
                      }}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-md cursor-pointer"
                    >
                      <span>{isNe ? 'सम्बन्धित सुरक्षा टुल →' : 'Related Tool →'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
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

import React, { useState, useRef } from 'react';
import { Upload, CheckCircle2, Loader2, Image as ImageIcon, Link as LinkIcon, X } from 'lucide-react';
import { uploadFileToServer } from '../utils/uploadHelper';
import { isValidImageFile } from '../utils/imageHelper';

interface MediaUploaderProps {
  label: string;
  badge?: string;
  aspectHint?: string;
  currentUrl: string;
  onUrlChange: (url: string) => void;
  isNe: boolean;
  compact?: boolean;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  label,
  badge,
  aspectHint,
  currentUrl,
  onUrlChange,
  isNe,
  compact = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      setUploadError(isNe ? 'कृपया मान्य फोटो फाइल (JPG, PNG, WebP) छान्नुहोस्' : 'Please select a valid image file');
      return;
    }

    try {
      setUploading(true);
      setUploadError(null);
      setUploadSuccess(false);

      const result = await uploadFileToServer(file);
      onUrlChange(result.url);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      console.error('Image upload failed', err);
      setUploadError(err.message || (isNe ? 'अपलोड असफल भयो' : 'Upload failed'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`rounded-3xl bg-white dark:bg-[#0e1628] border border-slate-200 dark:border-slate-800 shadow-sm ${compact ? 'p-3 space-y-2.5' : 'p-4 space-y-3'}`}>
      {/* Header Info */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-black text-slate-950 dark:text-white truncate" title={label}>
          {label}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {badge && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-800/60 text-cyan-950 dark:text-cyan-300 font-bold">
              {badge}
            </span>
          )}
          {aspectHint && <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono font-medium">{aspectHint}</span>}
        </div>
      </div>

      {/* Preview Box */}
      <div
        className={`relative rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 group ${
          compact ? 'h-28' : 'h-36'
        }`}
      >
        {currentUrl ? (
          <img
            src={currentUrl}
            alt={label}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=800&q=80';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-1 text-xs">
            <ImageIcon className="w-6 h-6" />
            <span>{isNe ? 'तस्विर छैन' : 'No Image'}</span>
          </div>
        )}

        {/* Upload Overlay indicator */}
        {uploading && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center text-cyan-400 gap-1.5 text-xs font-bold">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{isNe ? 'अपलोड हुँदैछ...' : 'Uploading...'}</span>
          </div>
        )}

        {uploadSuccess && (
          <div className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-emerald-900/90 text-emerald-200 text-[10px] font-bold flex items-center gap-1 shadow-lg">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isNe ? 'अपलोड भयो' : 'Uploaded'}</span>
          </div>
        )}
      </div>

      {/* Upload & Link Controls */}
      <div className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          className="hidden"
          onChange={handleFileSelect}
        />

        <div className="flex items-center gap-2">
          {/* Direct File Upload Button */}
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-600/20 dark:hover:bg-cyan-600/30 text-cyan-950 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/40 text-xs font-bold transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />
            )}
            <span>{isNe ? 'सिधै फोटो अपलोड' : 'Upload Direct Image'}</span>
          </button>

          {/* Toggle URL Input */}
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className={`p-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              showUrlInput
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white border-slate-300 dark:border-slate-800'
            }`}
            title={isNe ? 'लिङ्क (URL) राख्नुहोस्' : 'Enter URL manually'}
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Optional Manual URL Input */}
        {showUrlInput && (
          <div className="flex items-center gap-1.5 animate-fadeIn">
            <input
              type="text"
              value={currentUrl}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="https://..."
              className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-950 dark:text-white text-xs font-mono outline-none focus:border-cyan-400"
            />
            <button
              type="button"
              onClick={() => setShowUrlInput(false)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white bg-slate-200 dark:bg-slate-800 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {uploadError && <p className="text-[11px] text-rose-400 font-medium">{uploadError}</p>}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  CloudUpload,
  Loader2,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  ImageIcon,
  Video,
  Sparkles,
  AlertCircle,
  Link as LinkIcon,
  Play,
} from 'lucide-react';

interface AssetImageLinkFieldProps {
  label: string;
  description?: string;
  value: string;
  onChange: (newUrl: string) => void;
  onUpload?: (file: File) => Promise<string | void>;
  imageKitConfigured?: boolean;
  folder?: string;
  recommendedSize?: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'wide' | 'auto';
  placeholder?: string;
  mediaType?: 'image' | 'video' | 'auto';
}

export const AssetImageLinkField: React.FC<AssetImageLinkFieldProps> = ({
  label,
  description,
  value,
  onChange,
  onUpload,
  imageKitConfigured = false,
  folder = '/dlorenz/media',
  recommendedSize,
  aspectRatio = 'landscape',
  placeholder = 'https://ik.imagekit.io/... or https://...',
  mediaType = 'auto',
}) => {
  const [copied, setCopied] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [mediaError, setMediaError] = useState(false);

  const isVideo =
    mediaType === 'video' ||
    (mediaType === 'auto' &&
      typeof value === 'string' &&
      (value.endsWith('.mp4') || value.endsWith('.webm') || value.endsWith('.mov') || value.includes('/video/')));

  const isImageKitUrl = value?.includes('ik.imagekit.io') || value?.includes('imagekit.io');
  const isDataUrl = value?.startsWith('data:');
  const isExternalUrl = value?.startsWith('http') && !isImageKitUrl;

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setMediaError(false);

    if (onUpload) {
      setIsUploading(true);
      try {
        const uploadedUrl = await onUpload(file);
        if (uploadedUrl && typeof uploadedUrl === 'string') {
          onChange(uploadedUrl);
        }
      } catch (err: any) {
        console.error('File upload error:', err);
        setUploadError(err?.message || 'Upload failed');
      } finally {
        setIsUploading(false);
      }
    } else {
      // Fallback: Read as Data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = event.target?.result as string;
        onChange(res);
      };
      reader.readAsDataURL(file);
    }
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square max-w-[140px]';
      case 'portrait':
        return 'aspect-[3/4] max-w-[140px]';
      case 'wide':
        return 'aspect-[21/9] max-h-[140px]';
      case 'landscape':
      default:
        return 'aspect-video max-w-[200px]';
    }
  };

  return (
    <div className="bg-[#111216] border border-[#262933] rounded-2xl p-4 sm:p-5 space-y-4 font-condensed">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
            {isVideo ? (
              <Video className="w-3.5 h-3.5 text-[#00C2CB]" />
            ) : (
              <LinkIcon className="w-3.5 h-3.5 text-[#4EFE32]" />
            )}
            <span>{label}</span>
          </label>

          {/* Media Format Indicator */}
          {isVideo ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#00C2CB]/15 text-[#00C2CB] border border-[#00C2CB]/30 flex items-center gap-1">
              <Play className="w-2.5 h-2.5 fill-current" />
              <span>Video Stream (MP4/WebM)</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#4EFE32]/10 text-[#4EFE32] border border-[#4EFE32]/20 flex items-center gap-1">
              <ImageIcon className="w-2.5 h-2.5" />
              <span>Image Asset</span>
            </span>
          )}

          {/* Hosting Type Badge */}
          {isImageKitUrl && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#4EFE32]/15 text-[#4EFE32] border border-[#4EFE32]/30 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>ImageKit CDN</span>
            </span>
          )}
          {isExternalUrl && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#00C2CB]/15 text-[#00C2CB] border border-[#00C2CB]/30">
              External CDN
            </span>
          )}
          {isDataUrl && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-400/15 text-amber-400 border border-amber-400/30">
              Local Data URL
            </span>
          )}
        </div>

        {recommendedSize && (
          <span className="text-[10px] text-[#A0A6B2] font-mono">
            Rec: {recommendedSize}
          </span>
        )}
      </div>

      {description && (
        <p className="text-xs text-[#A0A6B2] leading-relaxed">{description}</p>
      )}

      {/* URL Input & Quick Actions */}
      <div className="space-y-1.5">
        <div className="relative flex items-center">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => {
              setMediaError(false);
              onChange(e.target.value);
            }}
            placeholder={placeholder}
            className="w-full pl-3.5 pr-28 py-2.5 rounded-xl bg-[#16181D] border border-[#262933] focus:border-[#4EFE32] text-xs text-white font-mono outline-none placeholder:text-[#505664] transition-all"
          />

          <div className="absolute right-1.5 flex items-center gap-1">
            {value && (
              <>
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy direct media URL"
                  className="p-1.5 rounded-lg bg-[#262933] hover:bg-[#343844] text-[#A0A6B2] hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-[#4EFE32]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>

                {!isDataUrl && (
                  <a
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    title="Open media in new tab"
                    className="p-1.5 rounded-lg bg-[#262933] hover:bg-[#343844] text-[#A0A6B2] hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => onChange('')}
                  title="Clear media link"
                  className="p-1.5 rounded-lg bg-[#FF4444]/10 hover:bg-[#FF4444]/25 text-[#FF6666] transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        {copied && (
          <span className="text-[11px] text-[#4EFE32] font-semibold flex items-center gap-1">
            <Check className="w-3 h-3" /> Copied direct URL to clipboard!
          </span>
        )}
      </div>

      {/* Grid for Preview & File Uploader */}
      <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4 items-center">
        {/* Visual Thumbnail Preview */}
        <div
          className={`relative rounded-xl overflow-hidden bg-[#16181D] border border-[#262933] flex items-center justify-center p-1 group shadow-inner ${getAspectClass()}`}
        >
          {value && !mediaError ? (
            isVideo ? (
              <video
                src={value}
                muted
                loop
                autoPlay
                playsInline
                onError={() => setMediaError(true)}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <img
                src={value}
                alt={label}
                onError={() => setMediaError(true)}
                className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            )
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-3 text-[#505664]">
              {mediaError ? (
                <>
                  <AlertCircle className="w-5 h-5 text-[#FF4444] mb-1" />
                  <span className="text-[10px] text-[#FF6666] font-bold uppercase">
                    Invalid Link
                  </span>
                </>
              ) : (
                <>
                  {isVideo ? (
                    <Video className="w-6 h-6 mb-1 opacity-60 text-[#00C2CB]" />
                  ) : (
                    <ImageIcon className="w-6 h-6 mb-1 opacity-60" />
                  )}
                  <span className="text-[10px] uppercase font-bold tracking-wider">
                    {isVideo ? 'No Video Link' : 'No Image Link'}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Upload Dropzone */}
        <div className="flex-1 space-y-2">
          <label
            className={`flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl border-2 border-dashed transition-all text-center ${
              isUploading
                ? 'border-[#4EFE32] bg-[#4EFE32]/10 cursor-wait'
                : 'border-[#262933] hover:border-[#4EFE32] bg-[#16181D] hover:bg-[#1A1C22] cursor-pointer'
            }`}
          >
            {isUploading ? (
              <Loader2 className="w-5 h-5 text-[#4EFE32] mb-1 animate-spin" />
            ) : (
              <CloudUpload className="w-5 h-5 text-[#4EFE32] mb-1" />
            )}
            <span className="text-xs font-bold uppercase text-white tracking-wide">
              {isUploading
                ? 'Uploading to ImageKit CDN...'
                : imageKitConfigured
                ? `Upload to ImageKit Cloud (${folder})`
                : isVideo
                ? 'Upload Video / Media File'
                : 'Upload Media (WebP / JPG / PNG / MP4)'}
            </span>
            <span className="text-[10px] text-[#A0A6B2] mt-0.5">
              {imageKitConfigured
                ? `Destination: ${folder} (Automatic CDN Link update)`
                : 'Pushes to ImageKit CDN or saves locally in browser state'}
            </span>
            <input
              type="file"
              accept={isVideo ? 'video/*,image/*' : 'image/*,video/*'}
              disabled={isUploading}
              className="sr-only"
              onChange={handleFileSelected}
            />
          </label>

          {uploadError && (
            <p className="text-[11px] text-[#FF6666] font-bold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {uploadError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

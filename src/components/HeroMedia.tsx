import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Maximize, Film } from 'lucide-react';
import { ViewMode } from '../types';

interface HeroMediaProps {
  viewMode: ViewMode;
  className?: string;
}

export const HeroMedia: React.FC<HeroMediaProps> = ({ viewMode, className = '' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleLoadedData = () => {
      setIsLoaded(true);
      // Auto-play safely
      video.play().catch(() => {
        setIsPlaying(false);
      });
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadeddata', handleLoadedData);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(console.error);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const restartVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().then(() => setIsPlaying(true)).catch(console.error);
  };

  const requestFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.requestFullscreen) {
      video.requestFullscreen().catch(console.error);
    }
  };

  return (
    <div
      id="hero-media-wrapper"
      className={`relative w-full h-full overflow-hidden transition-all duration-700 ${
        viewMode === 'split'
          ? 'rounded-2xl border border-neutral-700/60 shadow-2xl shadow-neutral-950/80 bg-neutral-900'
          : 'bg-neutral-950'
      } ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onTouchStart={() => setShowControls(true)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        id="hero-background-video"
        className={`w-full h-full object-cover transition-opacity duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        src="/assets/dlorenz-hero-video.mp4"
        poster="/assets/dlorenz-hero-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-label="DLORENZ SOLUTIONS Architectural Video Reel"
      />

      {/* Instant Poster Fallback when loading */}
      {!isLoaded && (
        <img
          src="/assets/dlorenz-hero-poster.jpg"
          alt="DLORENZ SOLUTIONS Architectural Facade"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          referrerPolicy="no-referrer"
        />
      )}

      {/* Cinematic Lighting & Contrast Overlays */}
      {viewMode === 'immersive' ? (
        <>
          {/* Deep dark gradient from left & top for maximum text readability */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-neutral-950/95 via-neutral-950/80 to-neutral-950/40" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/70" />
          <div className="absolute inset-0 pointer-events-none bg-radial from-transparent via-neutral-950/20 to-neutral-950/80" />
        </>
      ) : (
        <>
          {/* Framed mode subtle glass vignette */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-neutral-950/90 via-transparent to-neutral-950/30" />
          <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-2xl" />
        </>
      )}

      {/* Architectural HUD Overlay Details */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 pointer-events-none z-20">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-900/80 backdrop-blur-md border border-neutral-700/60 text-[11px] font-mono tracking-wider text-neutral-300">
          <Film className="w-3 h-3 text-neutral-400" />
          <span>BRAND REEL 4K</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </span>
      </div>

      {/* Media Floating Controls (Responsive HUD) */}
      <div
        id="hero-media-controls"
        className={`absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-20 flex items-center justify-between gap-3 p-2 sm:p-2.5 rounded-xl bg-neutral-950/80 backdrop-blur-md border border-neutral-800/80 transition-all duration-300 ${
          showControls || !isPlaying ? 'opacity-100 translate-y-0' : 'opacity-80 sm:opacity-40 hover:opacity-100 translate-y-0'
        }`}
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Play/Pause Button */}
          <button
            id="media-play-pause-btn"
            onClick={togglePlay}
            className="p-1.5 sm:p-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 hover:text-white transition-colors"
            title={isPlaying ? 'Pause Reel' : 'Play Reel'}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Mute/Unmute */}
          <button
            id="media-mute-btn"
            onClick={toggleMute}
            className="p-1.5 sm:p-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 hover:text-white transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-neutral-400" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
          </button>

          {/* Restart */}
          <button
            id="media-restart-btn"
            onClick={restartVideo}
            className="p-1.5 sm:p-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors hidden sm:inline-flex"
            title="Restart Video"
            aria-label="Restart video"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex-1 mx-2 sm:mx-4 flex items-center gap-2">
          <div className="relative w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 bottom-0 bg-neutral-300 rounded-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-neutral-400 hidden sm:inline whitespace-nowrap">
            {isPlaying ? 'PLAYING' : 'PAUSED'}
          </span>
        </div>

        {/* Fullscreen Trigger */}
        <button
          id="media-fullscreen-btn"
          onClick={requestFullscreen}
          className="p-1.5 sm:p-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
          title="Fullscreen"
          aria-label="View video in fullscreen"
        >
          <Maximize className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

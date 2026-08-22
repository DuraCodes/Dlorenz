import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// MediaItemType defines the structure of a media item
export interface MediaItemType {
  id: number | string;
  type: 'image' | 'video' | string;
  title: string;
  desc: string;
  url: string;
  span: string;
}

// MediaItem component renders either a video or image based on item.type
const MediaItem = ({
  item,
  className,
  onClick,
}: {
  item: MediaItemType;
  className?: string;
  onClick?: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null); // Reference for video element
  const [isInView, setIsInView] = useState(false); // To track if video is in the viewport
  const [isBuffering, setIsBuffering] = useState(true); // To track if video is buffering

  // Intersection Observer to detect if video is in view and play/pause accordingly
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setIsInView(entry.isIntersecting); // Set isInView to true if the video is in view
      });
    }, options);

    if (videoRef.current) {
      observer.observe(videoRef.current); // Start observing the video element
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current); // Clean up observer when component unmounts
      }
    };
  }, []);

  // Handle video play/pause based on whether the video is in view or not
  useEffect(() => {
    let mounted = true;

    const handleVideoPlay = async () => {
      if (!videoRef.current || !isInView || !mounted) return; // Don't play if video is not in view or component is unmounted

      try {
        if (videoRef.current.readyState >= 3) {
          setIsBuffering(false);
          await videoRef.current.play(); // Play the video if it's ready
        } else {
          setIsBuffering(true);
          await new Promise((resolve) => {
            if (videoRef.current) {
              videoRef.current.oncanplay = resolve; // Wait until the video can start playing
            }
          });
          if (mounted) {
            setIsBuffering(false);
            await videoRef.current.play();
          }
        }
      } catch (error) {
        console.warn('Video playback failed:', error);
      }
    };

    if (isInView) {
      handleVideoPlay();
    } else if (videoRef.current) {
      videoRef.current.pause();
    }

    return () => {
      mounted = false;
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      }
    };
  }, [isInView]);

  // Render either a video or image based on item.type
  if (item.type === 'video') {
    return (
      <div className={`${className} relative overflow-hidden`}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          onClick={onClick}
          playsInline
          muted
          loop
          preload="auto"
          style={{
            opacity: isBuffering ? 0.8 : 1,
            transition: 'opacity 0.2s',
            transform: 'translateZ(0)',
            willChange: 'transform',
          }}
        >
          <source src={item.url} type="video/mp4" />
        </video>
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>
    );
  }

  return (
    <img
      src={item.url} // Image source URL
      alt={item.title} // Alt text for the image
      className={`${className} object-cover cursor-pointer`} // Style the image
      onClick={onClick} // Trigger onClick when the image is clicked
      loading="lazy" // Lazy load the image for performance
      decoding="async" // Decode the image asynchronously
      referrerPolicy="no-referrer"
    />
  );
};

// GalleryModal component displays the selected media item in a modal
interface GalleryModalProps {
  selectedItem: MediaItemType;
  isOpen: boolean;
  onClose: () => void;
  setSelectedItem: (item: MediaItemType | null) => void;
  mediaItems: MediaItemType[]; // List of media items to display in the modal
}

const GalleryModal = ({
  selectedItem,
  isOpen,
  onClose,
  setSelectedItem,
  mediaItems,
}: GalleryModalProps) => {
  const [dockPosition, setDockPosition] = useState({ x: 0, y: 0 }); // Track the position of the dockable panel

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null; // Return null if the modal is not open

  return (
    <>
      {/* Main Modal Backdrop & Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30,
        }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 sm:p-6"
      >
        {/* Main Content Card */}
        <div className="relative w-full max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden bg-[#16181D] border border-[#262933] shadow-2xl flex flex-col">
          <div className="flex-1 p-3 sm:p-6 flex items-center justify-center bg-[#111216]/60">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedItem.id}
                className="relative w-full aspect-[16/9] max-h-[65vh] rounded-xl overflow-hidden shadow-2xl bg-black/40"
                initial={{ y: 20, scale: 0.97 }}
                animate={{
                  y: 0,
                  scale: 1,
                  transition: {
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                    mass: 0.5,
                  },
                }}
                exit={{
                  y: 20,
                  scale: 0.97,
                  transition: { duration: 0.15 },
                }}
                onClick={onClose}
              >
                <MediaItem
                  item={selectedItem}
                  className="w-full h-full object-contain"
                  onClick={onClose}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-[#111216] via-[#111216]/70 to-transparent">
                  <h3 className="text-white text-lg sm:text-2xl font-bold uppercase tracking-tight">
                    {selectedItem.title}
                  </h3>
                  <p className="text-neutral-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                    {selectedItem.desc}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Close Button */}
          <motion.button
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2.5 rounded-full bg-[#1A1C22]/90 border border-[#262933] text-neutral-200 hover:text-white hover:border-[#4EFE32] hover:bg-[#262933] transition-colors shadow-lg backdrop-blur-md cursor-pointer"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Draggable Dock */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        initial={false}
        animate={{ x: dockPosition.x, y: dockPosition.y }}
        onDragEnd={(_, info) => {
          setDockPosition((prev) => ({
            x: prev.x + info.offset.x,
            y: prev.y + info.offset.y,
          }));
        }}
        className="fixed z-50 left-1/2 bottom-4 -translate-x-1/2 touch-none max-w-[95vw] overflow-x-auto no-scrollbar"
      >
        <motion.div className="relative rounded-2xl bg-[#16181D]/90 backdrop-blur-2xl border border-[#262933] shadow-2xl p-2 cursor-grab active:cursor-grabbing">
          <div className="flex items-center gap-1.5 sm:gap-2 px-1">
            {mediaItems.map((item, index) => (
              <motion.div
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedItem(item);
                }}
                className={`
                  relative group w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer border
                  ${
                    selectedItem.id === item.id
                      ? 'border-[#4EFE32] ring-2 ring-[#4EFE32]/40 shadow-lg scale-105'
                      : 'border-[#262933] hover:border-neutral-400 opacity-70 hover:opacity-100'
                  }
                `}
                initial={{ rotate: index % 2 === 0 ? -4 : 4 }}
                animate={{
                  scale: selectedItem.id === item.id ? 1.15 : 1,
                  rotate: selectedItem.id === item.id ? 0 : index % 2 === 0 ? -4 : 4,
                  y: selectedItem.id === item.id ? -4 : 0,
                }}
                whileHover={{
                  scale: 1.2,
                  rotate: 0,
                  y: -6,
                  transition: { type: 'spring', stiffness: 400, damping: 25 },
                }}
              >
                <MediaItem item={item} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/40" />
                {selectedItem.id === item.id && (
                  <motion.div
                    layoutId="activeGlow"
                    className="absolute -inset-1 bg-[#4EFE32]/20 blur-sm pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export interface InteractiveBentoGalleryProps {
  mediaItems: MediaItemType[];
  title: string;
  description: string;
  className?: string;
}

export const InteractiveBentoGallery: React.FC<InteractiveBentoGalleryProps> = ({
  mediaItems,
  title,
  description,
  className = '',
}) => {
  const [selectedItem, setSelectedItem] = useState<MediaItemType | null>(null);
  const [items, setItems] = useState(mediaItems);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setItems(mediaItems);
  }, [mediaItems]);

  return (
    <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 ${className}`}>
      <div className="mb-8 sm:mb-12 text-center max-w-3xl mx-auto">
        <motion.h2
          className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase font-condensed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>
        <motion.p
          className="mt-2.5 text-xs sm:text-sm md:text-base text-neutral-400 font-sans leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {description}
        </motion.p>
      </div>

      <AnimatePresence mode="wait">
        {selectedItem ? (
          <GalleryModal
            selectedItem={selectedItem}
            isOpen={true}
            onClose={() => setSelectedItem(null)}
            setSelectedItem={setSelectedItem}
            mediaItems={items}
          />
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[140px] sm:auto-rows-[160px] md:auto-rows-[170px]"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08 },
              },
            }}
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                layoutId={`media-${item.id}`}
                className={`relative overflow-hidden rounded-2xl cursor-pointer group bg-[#16181D] border border-[#262933] hover:border-[#4EFE32]/60 shadow-lg transition-all duration-300 ${item.span}`}
                onClick={() => !isDragging && setSelectedItem(item)}
                variants={{
                  hidden: { y: 30, scale: 0.95, opacity: 0 },
                  visible: {
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    transition: {
                      type: 'spring',
                      stiffness: 350,
                      damping: 25,
                      delay: index * 0.04,
                    },
                  },
                }}
                whileHover={{ scale: 1.015 }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.4}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={(e, info) => {
                  setIsDragging(false);
                  const moveDistance = info.offset.x + info.offset.y;
                  if (Math.abs(moveDistance) > 40) {
                    const newItems = [...items];
                    const draggedItem = newItems[index];
                    const targetIndex =
                      moveDistance > 0
                        ? Math.min(index + 1, items.length - 1)
                        : Math.max(index - 1, 0);
                    newItems.splice(index, 1);
                    newItems.splice(targetIndex, 0, draggedItem);
                    setItems(newItems);
                  }
                }}
              >
                <MediaItem
                  item={item}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onClick={() => !isDragging && setSelectedItem(item)}
                />
                <motion.div
                  className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 bg-gradient-to-t from-[#111216] via-[#111216]/50 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <span className="text-[10px] font-bold text-[#4EFE32] uppercase tracking-wider block mb-0.5">
                    {item.type === 'video' ? 'Video Artifact' : 'Field Execution'}
                  </span>
                  <h3 className="text-white text-xs sm:text-sm font-bold uppercase tracking-tight line-clamp-1 group-hover:text-[#4EFE32] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-neutral-300 text-[11px] sm:text-xs mt-0.5 line-clamp-2 leading-tight">
                    {item.desc}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveBentoGallery;

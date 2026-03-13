import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageLightboxProps {
  images: string[];
  initialIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ImageLightbox({
  images,
  initialIndex = 0,
  open,
  onOpenChange,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setImageError(false);
  }, [initialIndex, open]);

  // Prefetch neighboring images for instant transitions
  useEffect(() => {
    if (!open || images.length <= 1) return;
    
    const prefetch = (index: number) => {
      const img = new Image();
      img.src = images[index];
    };

    const nextIndex = (currentIndex + 1) % images.length;
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    
    prefetch(nextIndex);
    prefetch(prevIndex);
  }, [currentIndex, open, images]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, currentIndex, images.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setImageError(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setImageError(false);
  };

  if (!open) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="relative w-full h-full flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-50 text-white hover:bg-white/10"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Main Image */}
        <div className="relative w-[95vw] h-[85vh] flex items-center justify-center overflow-hidden">
          <img
            key={currentImage}
            src={currentImage}
            alt={`Gallery image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg animate-in fade-in zoom-in-95 duration-500 will-change-transform"
            onError={() => setImageError(true)}
            loading="eager"
          />

          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 h-12 w-12 sm:h-14 sm:w-14"
            onClick={handlePrev}
          >
            <ChevronLeft className="h-8 w-8 sm:h-10 sm:w-10" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 h-12 w-12 sm:h-14 sm:w-14"
            onClick={handleNext}
          >
            <ChevronRight className="h-8 w-8 sm:h-10 sm:w-10" />
          </Button>
        </div>

        {/* Image Counter */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm font-medium bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Thumbnail Strip - Optimized with lazy loading */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-4 py-2 scrollbar-none no-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                setImageError(false);
              }}
              className={`relative h-14 w-14 rounded-md overflow-hidden transition-all flex-shrink-0 border-2 ${
                idx === currentIndex ? "border-primary scale-110 shadow-lg z-10" : "border-transparent opacity-40 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

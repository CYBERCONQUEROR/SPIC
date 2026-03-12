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
        <div className="relative w-[95vw] h-[85vh] flex items-center justify-center">
          {imageError ? (
            <div className="w-full h-full flex items-center justify-center bg-black/50 rounded-lg">
              <div className="text-center text-white">
                <p className="mb-2">Failed to load image</p>
                <p className="text-sm text-gray-400">{currentImage}</p>
              </div>
            </div>
          ) : (
            <img
              key={currentImage}
              src={currentImage}
              alt={`Gallery image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg animate-in fade-in duration-300"
              onError={() => setImageError(true)}
              loading="eager"
            />
          )}

          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
            onClick={handlePrev}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
            onClick={handleNext}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Thumbnail Strip */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4 pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                setImageError(false);
              }}
              className={`relative h-12 w-12 rounded overflow-hidden transition-all flex-shrink-0 ${
                idx === currentIndex ? "ring-2 ring-primary scale-110" : "opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.opacity = "0.3";
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

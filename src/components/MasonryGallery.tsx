import { useState, useEffect } from "react";
import { Maximize2 } from "lucide-react";
import ImageLightbox from "./ImageLightbox";

interface MasonryGalleryProps {
  eventId: string;
  eventName: string;
  imageList?: string[];
  open: boolean;
}

export default function MasonryGallery({ eventId, eventName, imageList, open }: MasonryGalleryProps) {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      loadImages();
    }
  }, [eventId, open, imageList]);

  const loadImages = async () => {
    try {
      setLoading(true);
      const folderName = eventId.toLowerCase().replace(/\s+/g, "-");
      const imageUrls: string[] = [];

      if (imageList && imageList.length > 0) {
        imageList.forEach(name => {
          imageUrls.push(`/events/${folderName}/${name}`);
        });
        setImages(imageUrls);
      } else {
        for (let i = 1; i <= 30; i++) {
          const imageUrl = `/events/${folderName}/img${i}.jpg`;
          try {
            const res = await fetch(imageUrl, { method: "HEAD", cache: "no-cache" });
            if (res.ok) {
              imageUrls.push(imageUrl);
            }
          } catch {
            // Continue
          }
        }
        setImages(imageUrls);
      }
    } catch (err) {
      console.error("Failed to load gallery images:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-center">
        <p className="text-sm text-muted-foreground">No images available for this event</p>
      </div>
    );
  }

  return (
    <>
      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="relative break-inside-avoid overflow-hidden rounded-lg group cursor-pointer"
            onClick={() => {
              setSelectedImageIndex(idx);
              setLightboxOpen(true);
            }}
          >
            <img
              src={img}
              alt={`Gallery image ${idx + 1}`}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Maximize2 className="h-6 w-6 text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <ImageLightbox
        images={images}
        initialIndex={selectedImageIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </>
  );
}

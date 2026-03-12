import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface EventGalleryProps {
  eventId: string;
  eventName: string;
  imageList?: string[]; // Optional: provide image names directly
}

export default function EventGallery({ eventId, eventName, imageList }: EventGalleryProps) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const loadImages = () => {
      if (!mounted) return;
      try {
        setLoading(true);
        setError(false);
        const folderName = eventId.toLowerCase().replace(/\s+/g, "-");
        const imageUrls: string[] = [];

        // If imageList is provided, use those specific filenames
        if (imageList && imageList.length > 0) {
          imageList.forEach(name => {
            imageUrls.push(`/events/${folderName}/${name}`);
          });
          setImages(imageUrls);
        } else {
          // Optimization: Removed massive sequential array queries that stall the client queue.
          setImages([]);
        }
      } catch (err) {
        console.error("Failed to load gallery images:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
    return () => { mounted = false; };
  }, [eventId, imageList]);

  if (loading) {
    return (
      <Button disabled size="sm" variant="outline">
        Loading...
      </Button>
    );
  }

  if (error || images.length === 0) {
    return null;
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => navigate(`/gallery?event=${eventId}`)}
      className="gap-2"
    >
      Previous Highlights
      <ExternalLink className="h-4 w-4" />
    </Button>
  );
}

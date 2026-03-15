import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";
import ImageLightbox from "@/components/ImageLightbox";
import SmartImage from "@/components/SmartImage";
import { pastEvents, type Event } from "@/data/events";

function EventGalleryCard({ event }: { event: Event }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [images, setImages] = useState<string[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    const folderName = event.id.toLowerCase().replace(/\s+/g, "-");
    const imageUrls: string[] = [];
    const imageList = event.imageList;

    if (imageList && imageList.length > 0) {
      imageList.forEach((name) => {
        imageUrls.push(`/events/${folderName}/${name}`);
      });
      setImages(imageUrls);
    }
  }, [event.id, event.imageList]);


  const handleOpenChange = (open: boolean) => {
    setLightboxOpen(open);
    if (!open) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("event");
      setSearchParams(newParams);
    }
  };

  if (images.length === 0) return null;

  return (
    <>
      <Card
        className="group overflow-hidden cursor-pointer border border-border/70 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col will-change-transform"
        onClick={() => setLightboxOpen(true)}
      >
        <div className="relative overflow-hidden">
          <SmartImage
            src={images[0]}
            alt={event.name}
            className="group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
            <ImageIcon className="text-white h-10 w-10 shadow-sm" />
          </div>
        </div>
        <CardContent className="p-5 flex-1 glass-card border-t-0">
          <h3 className="font-display font-semibold text-lg mb-1">{event.name}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <ImageIcon className="h-3 w-3" />
            {images.length} photos
          </p>
        </CardContent>
      </Card>

      <ImageLightbox
        images={images}
        open={lightboxOpen}
        onOpenChange={handleOpenChange}
      />
    </>
  );
}

const Gallery = () => {
  const [searchParams] = useSearchParams();
  const eventFilter = searchParams.get("event");

  const displayedEvents = eventFilter
    ? pastEvents.filter(e => e.id === eventFilter)
    : pastEvents;

  return (
    <main>
      <section className="section-padding text-center px-4">
        <AnimatedSection className="max-w-2xl mx-auto">
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Event <span className="text-gradient">Gallery</span>
          </h1>
          <p className="text-base text-muted-foreground">Reliving the best moments from our past events and workshops.</p>
        </AnimatedSection>
      </section>

      <section className="section-padding-sm pt-0 border-t-0">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedEvents.map((event, i) => (
              <AnimatedSection key={event.id} delay={i * 0.05}>
                <EventGalleryCard event={event} />
              </AnimatedSection>
            ))}
            {eventFilter && displayedEvents.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-muted-foreground">Event gallery not found.</p>
                <Button variant="link" onClick={() => window.location.href = '/gallery'}>
                  View All Gallery
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Gallery;

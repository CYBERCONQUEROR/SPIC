import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: "video" | "square" | "portrait" | "auto" | "4/3";
  containerClassName?: string;
}

export default function SmartImage({
  src,
  alt,
  className,
  aspectRatio = "4/3",
  containerClassName,
  ...props
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const aspectStyles = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    auto: "aspect-auto",
    "4/3": "aspect-[4/3]",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted/20",
        aspectStyles[aspectRatio],
        containerClassName
      )}
    >
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30 animate-pulse">
          <ImageIcon className="h-6 w-6 text-muted-foreground/20" />
        </div>
      )}
      
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
          <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={cn(
            "h-full w-full object-cover transition-all duration-700 ease-in-out",
            loaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-105 blur-lg",
            className
          )}
          loading="lazy"
          decoding="async"
          {...props}
        />
      )}
    </div>
  );
}

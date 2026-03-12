import AnimatedSection from "@/components/AnimatedSection";
import { LucideIcon } from "lucide-react";

interface ValueCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
  gradient?: string;
}

export default function ValueCard({
  icon: Icon,
  title,
  description,
  delay = 0,
  gradient = "from-primary/20 to-primary/5",
}: ValueCardProps) {
  return (
    <AnimatedSection delay={delay}>
      <div className="group relative overflow-hidden rounded-2xl p-8 hover:shadow-2xl transition-all duration-500">
        {/* Animated gradient background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />

        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-2xl border border-primary/20 group-hover:border-primary/50 transition-colors duration-500" />

        {/* Content */}
        <div className="relative z-10 flex flex-col gap-4">
          {/* Icon with glow */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary/20 group-hover:shadow-lg group-hover:shadow-primary/50 transition-all duration-500">
            <Icon className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-500" />
          </div>

          {/* Title */}
          <h3 className="font-display text-xl font-bold group-hover:text-primary transition-colors duration-500">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-500 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Animated line at bottom */}
        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary via-primary to-transparent w-0 group-hover:w-full transition-all duration-500" />
      </div>
    </AnimatedSection>
  );
}

import AnimatedSection from "@/components/AnimatedSection";

interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
  imageUrl?: string;
  isLeft?: boolean;
}

export default function TimelineItem({
  year,
  title,
  description,
  imageUrl,
  isLeft = false,
}: TimelineItemProps) {
  return (
    <AnimatedSection className="relative mb-12 last:mb-0">
      <div className={`flex flex-col md:flex-row gap-8 items-start md:items-center ${isLeft ? "md:flex-row-reverse" : ""}`}>
        {/* Content Card */}
        <div className="flex-1 relative">
          <div className="group relative overflow-hidden rounded-2xl border border-primary/20 hover:border-primary/50 p-6 hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-primary/5 via-transparent to-transparent hover:from-primary/15">
            {/* Animated glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-primary/5 transition-all duration-500" />

            <div className="relative z-10">
              <h3 className="font-display text-2xl font-bold text-gradient mb-2">{year}</h3>
              <h4 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">{title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

              {/* Image if provided */}
              {imageUrl && (
                <div className="mt-4 rounded-lg overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline Node - Center on desktop */}
        <div className="hidden md:flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-primary border-4 border-background shadow-lg shadow-primary/50 relative z-20 group hover:scale-125 transition-transform" />
          <div className="h-24 w-1 bg-gradient-to-b from-primary to-transparent mt-2" />
        </div>

        {/* Spacer for two-column layout */}
        <div className="flex-1" />
      </div>
    </AnimatedSection>
  );
}

interface InteractiveTimelineProps {
  items: {
    year: string;
    title: string;
    description: string;
    imageUrl?: string;
  }[];
  title?: string;
  subtitle?: string;
}

export function InteractiveTimeline({ items, title, subtitle }: InteractiveTimelineProps) {
  return (
    <section className="section-padding border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        {title && (
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">{title}</h2>
            {subtitle && <p className="text-muted-foreground text-lg">{subtitle}</p>}
          </AnimatedSection>
        )}

        {/* Timeline Container */}
        <div className="max-w-4xl mx-auto relative">
          {/* Center line on desktop */}
          <div className="absolute left-0 right-0 top-0 bottom-0 flex justify-center hidden md:block">
            <div className="w-1 bg-gradient-to-b from-primary via-primary to-transparent rounded-full" />
          </div>

          {/* Timeline Items */}
          <div className="relative z-10">
            {items.map((item, index) => (
              <TimelineItem
                key={item.year}
                year={item.year}
                title={item.title}
                description={item.description}
                imageUrl={item.imageUrl}
                isLeft={index % 2 === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

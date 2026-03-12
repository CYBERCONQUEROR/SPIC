import AnimatedSection from "@/components/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";

interface WhoWeAreSectionProps {
  title: string;
  subtitle: string;
  mainText: string;
  quote: string;
  visionText: string;
  imageUrl?: string;
}

export default function WhoWeAreSection({
  title,
  subtitle,
  mainText,
  quote,
  visionText,
  imageUrl = "/about/spic-community.jpg",
}: WhoWeAreSectionProps) {
  return (
    <section className="pt-24 sm:pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Image Side */}
          <AnimatedSection delay={0}>
            <div className="relative overflow-hidden rounded-2xl h-96 md:h-full min-h-96 group">
              <img
                src={imageUrl}
                alt="SPIC Community"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </AnimatedSection>

          {/* Text Side */}
          <AnimatedSection delay={0.1}>
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold mb-2">{title}</h2>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  {subtitle}
                </p>
              </div>

              {/* Main Content Card */}
              <Card className="border-primary/20 hover:border-primary/50 transition-colors duration-500 group">
                <CardContent className="p-6 space-y-4">
                  <p className="leading-relaxed text-foreground/90">{mainText}</p>

                  {/* Quote */}
                  <blockquote className="border-l-4 border-primary pl-4 py-2 text-primary/90 italic text-sm group-hover:text-primary transition-colors bg-primary/5 rounded-r-lg">
                    "{quote}"
                  </blockquote>

                  <p className="leading-relaxed text-foreground/90">{visionText}</p>
                </CardContent>
              </Card>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

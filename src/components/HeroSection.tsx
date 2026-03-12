import AnimatedSection from "@/components/AnimatedSection";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  imageUrl?: string;
}

export default function HeroSection({ title, subtitle, imageUrl = "/about/about-hero.jpg" }: HeroSectionProps) {
  return (
    <section className="relative h-screen max-h-[600px] w-full overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${imageUrl}')`,
        }}
      />

      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        <AnimatedSection>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold mb-4 animate-in fade-in slide-in-from-bottom-10 duration-700">
            {title}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-light text-white/90 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-150">
            {subtitle}
          </p>
        </AnimatedSection>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/50 to-transparent" />
    </section>
  );
}

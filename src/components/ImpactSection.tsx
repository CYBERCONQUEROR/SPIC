import AnimatedSection from "@/components/AnimatedSection";
import Counter from "@/components/Counter";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  number: number;
  suffix?: string;
  label: string;
  delay?: number;
}

function StatCard({ icon: Icon, number, suffix = "+", label, delay = 0 }: StatCardProps) {
  return (
    <AnimatedSection delay={delay} className="group">
      <div className="relative overflow-hidden rounded-2xl p-8 h-full hover:shadow-2xl transition-all duration-500">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Glowing border */}
        <div className="absolute inset-0 rounded-2xl border border-primary/20 group-hover:border-primary/50 transition-colors duration-500" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          {/* Icon with glow */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 group-hover:bg-primary/20 group-hover:shadow-lg group-hover:shadow-primary/50 transition-all duration-500">
            <Icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-500" />
          </div>

          {/* Counter */}
          <div className="flex items-baseline justify-center gap-1">
            <Counter to={number} duration={2} className="text-4xl sm:text-5xl font-bold text-gradient" />
            <span className="text-2xl font-bold text-primary">{suffix}</span>
          </div>

          {/* Label */}
          <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-500 font-medium">
            {label}
          </p>
        </div>

        {/* Animated bottom line */}
        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary via-primary to-transparent w-0 group-hover:w-full transition-all duration-500" />
      </div>
    </AnimatedSection>
  );
}

interface ImpactSectionProps {
  stats: Array<{
    icon: LucideIcon;
    number: number;
    suffix?: string;
    label: string;
  }>;
  title?: string;
  subtitle?: string;
}

export default function ImpactSection({ stats, title = "Our Impact", subtitle = "Metrics That Matter" }: ImpactSectionProps) {
  return (
    <section className="section-padding border-t border-border/40">
      <div className="container mx-auto px-4">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">{title}</h2>
          {subtitle && <p className="text-muted-foreground text-lg">{subtitle}</p>}
        </AnimatedSection>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <StatCard
              key={stat.label}
              icon={stat.icon}
              number={stat.number}
              suffix={stat.suffix}
              label={stat.label}
              delay={idx * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

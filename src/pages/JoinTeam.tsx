import AnimatedSection from "@/components/AnimatedSection";
import { Timer } from "lucide-react";

const JoinTeam = () => {
  return (
    <main className="flex min-h-[70vh] items-center justify-center">
      <section className="section-padding text-center px-4">
        <AnimatedSection className="max-w-2xl mx-auto flex flex-col items-center">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Timer className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Join the <span className="text-gradient">SPIC Family</span>
          </h1>
          <p className="text-base text-muted-foreground max-w-lg mx-auto mb-8">
            Our applications are not open yet. We are working hard behind the scenes to bring you exciting opportunities. Stay tuned!
          </p>
          <div className="bg-primary/5 text-primary border border-primary/20 px-6 py-3 rounded-full font-semibold inline-flex items-center gap-2 shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            Coming Soon
          </div>
        </AnimatedSection>
      </section>
    </main>
  );
};

export default JoinTeam;

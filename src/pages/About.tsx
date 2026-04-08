import AnimatedSection from "@/components/AnimatedSection";
import Counter from "@/components/Counter";
import HeroSection from "@/components/HeroSection";
import WhoWeAreSection from "@/components/WhoWeAreSection";
import ValueCard from "@/components/ValueCard";
import { InteractiveTimeline } from "@/components/InteractiveTimeline";
import ImpactSection from "@/components/ImpactSection";
import { timelineData } from "@/data/timeline";
import { BookOpen, Target, Eye, Users, Zap, Trophy } from "lucide-react";

const impactStats = [
  { icon: Users, number: 500, suffix: "+", label: "Students Impacted" },
  { icon: Trophy, number: 20, suffix: "+", label: "Events Organized" },
  { icon: BookOpen, number: 10, suffix: "+", label: "Workshops Conducted" },
  { icon: Zap, number: 5, suffix: "+", label: "Industry Collaborations" },
];

const timelineItems = timelineData.map(item => ({
  year: item.year,
  title: item.events[0] || "SPIC Milestone",
  description: item.events.join(" • "),
  imageUrl: `/about/journey/${item.year}.jpg`,
}));

const About = () => {
  return (
    <main>
      {/* Who We Are Section */}
      <WhoWeAreSection
        title="Who We Are"
        subtitle="A Student Society of the EII Department, RKGIT"
        mainText="The Society of Promotion of Innovation and Creativity (SPIC) is a student-run society at RKGIT, dedicated to fostering a culture of innovation, entrepreneurship, and creativity among students. Our mission is to provide a platform for students to learn, build, and grow."
        quote="We believe in the power of ideas and aim to create an environment where students can turn their ideas into reality."
        visionText="Our vision is to create a vibrant community of innovators and entrepreneurs who are not afraid to take risks and challenge the status quo. We organize a variety of events and activities throughout the year, including hackathons, workshops, innovation fairs, and guest lectures by industry experts."
        imageUrl="/about/spic-community.jpg"
      />

      {/* Mission & Vision Section */}
      <section className="section-padding border-t border-border/40">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">Our Mission & Vision</h2>
            <p className="text-muted-foreground text-lg">Guiding Principles</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <ValueCard
              icon={Target}
              title="Our Mission"
              description="Provide a platform for students to learn, build, and grow through innovation-driven activities and mentorship."
              gradient="from-blue-500/20 to-blue-500/5"
              delay={0}
            />
            <ValueCard
              icon={Eye}
              title="Our Vision"
              description="Create a vibrant community of innovators and entrepreneurs who challenge the status quo and build the future."
              gradient="from-purple-500/20 to-purple-500/5"
              delay={0.1}
            />
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <ImpactSection
        stats={impactStats}
        title="Our Impact"
        subtitle="Metrics That Matter"
      />

      {/* Timeline Section */}
      <InteractiveTimeline
        items={timelineItems}
        title="Our Journey"
        subtitle="Milestones & Growth"
      />
    </main>
  );
};

export default About;

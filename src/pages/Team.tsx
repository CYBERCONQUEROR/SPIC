import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { facultyAdvisor, coreLeadership, departmentHeads, teamMembers } from "@/data/team";
import { Linkedin, Mail, User } from "lucide-react";
import type { TeamMember } from "@/data/team";
import { motion } from "framer-motion";

type MemberCardProps = {
  member: TeamMember;
  size?: "lg" | "md" | "sm";
  showRole?: boolean;
  showDepartment?: boolean;
  onClick?: () => void;
};

const MemberCard = ({
  member,
  size = "md",
  showRole = true,
  showDepartment = true,
  onClick,
}: MemberCardProps) => (
  <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: "easeOut" }}>
    <Card
      className="h-full group cursor-pointer overflow-hidden rounded-xl border border-border/60 bg-card/80 shadow-md hover:shadow-xl hover:border-border transition-transform transition-shadow duration-200"
      onClick={onClick}
    >
      <CardContent className={size === "lg" ? "p-5 text-center" : "p-4 text-center"}>
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="mx-auto mb-4 inline-flex w-fit items-center justify-center rounded-full border border-border/70 bg-background/80 shadow-sm"
        >
          <div
            className={`flex items-center justify-center rounded-full ${
              size === "lg" ? "h-20 w-20" : size === "md" ? "h-16 w-16" : "h-12 w-12"
            }`}
          >
            {member.image ? (
              <img
                src={member.image}
                alt={member.name}
                className={`${size === "lg" ? "h-20 w-20" : size === "md" ? "h-16 w-16" : "h-12 w-12"} rounded-full object-cover`}
              />
            ) : (
              <User className={`text-primary ${size === "lg" ? "h-8 w-8" : size === "md" ? "h-6 w-6" : "h-5 w-5"}`} />
            )}
          </div>
        </motion.div>
        <div className="flex flex-col items-center justify-center min-h-[3.9rem]">
          <h3 className={`font-display font-semibold text-foreground ${size === "sm" ? "text-xs" : "text-sm"} mb-0.5`}>
            {member.name}
          </h3>
          {showRole && (
            <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
              {member.role}
            </span>
          )}
          {showDepartment && member.department && (
            <p className="text-[11px] text-primary mt-1 opacity-90">{member.department}</p>
          )}
        </div>
        {member.linkedinUrl && (
          <div className="mt-3 flex items-center justify-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <a
              href={member.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} LinkedIn`}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border/70 bg-background/60 text-muted-foreground hover:border-primary/70 hover:text-primary transition-colors duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <Linkedin className="h-3.5 w-3.5" />
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

const Team = () => {
  const [activeMember, setActiveMember] = useState<TeamMember | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenMember = (member: TeamMember) => {
    setActiveMember(member);
    setDialogOpen(true);
  };

  return (
    <main>
      <section className="border-b border-border/40 bg-background/95">
        <div className="container mx-auto px-4 py-14 sm:py-18 text-center">
          <AnimatedSection className="max-w-2xl mx-auto">
            <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">Entrepreneurship Cell</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3 text-foreground">
              Leadership & Team
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              A focused, cross-functional team driving innovation, events, and community for aspiring entrepreneurs.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <div className="container mx-auto px-4 py-14 sm:py-20 space-y-16">
        {/* Faculty */}
        <section className="max-w-xs mx-auto">
          <AnimatedSection className="text-center mb-5">
            <h2 className="font-display text-base sm:text-lg font-semibold text-foreground tracking-tight">
              Faculty Coordinator
            </h2>
            <div className="mx-auto mt-3 h-px w-20 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </AnimatedSection>
          <AnimatedSection>
            <MemberCard member={facultyAdvisor} size="lg" onClick={() => handleOpenMember(facultyAdvisor)} />
          </AnimatedSection>
        </section>

        {/* Core Leadership */}
        <section>
          <AnimatedSection className="text-center mb-6">
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
              Core Leadership
            </h2>
            <div className="mx-auto mt-3 h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {coreLeadership.map((m, i) => (
              <AnimatedSection key={m.id} delay={i * 0.06}>
                <MemberCard member={m} size="lg" onClick={() => handleOpenMember(m)} />
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* Department Heads */}
        <section>
          <AnimatedSection className="text-center mb-6">
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
              Department Heads
            </h2>
            <div className="mx-auto mt-3 h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </AnimatedSection>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {departmentHeads.map((m, i) => (
              <AnimatedSection key={m.id} delay={i * 0.05}>
                <MemberCard member={m} onClick={() => handleOpenMember(m)} />
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* Members */}
        <section>
          <AnimatedSection className="text-center mb-6">
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
              Team Members
            </h2>
            <div className="mx-auto mt-3 h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <p className="text-sm text-muted-foreground mt-3">A growing community of builders, creators, and doers.</p>
          </AnimatedSection>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {teamMembers.map((m, i) => (
              <AnimatedSection key={m.id} delay={i * 0.04}>
                <MemberCard
                  member={m}
                  size="sm"
                  showRole={false}
                  showDepartment={false}
                  onClick={() => handleOpenMember(m)}
                />
              </AnimatedSection>
            ))}
          </div>
        </section>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md sm:max-w-lg border-border/60 bg-background/95 backdrop-blur-md justify-items-center">
          {activeMember && (
            <div className="w-full flex flex-col items-center gap-4 text-center">
              <div className="mx-auto mb-2 rounded-full border border-border/70 bg-background/80 p-[3px] shadow-sm">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-background/90">
                  {activeMember.image ? (
                    <img
                      src={activeMember.image}
                      alt={activeMember.name}
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10 text-primary" />
                  )}
                </div>
              </div>

              <DialogHeader className="items-center text-center space-y-1.5">
                <DialogTitle className="font-display text-xl font-semibold text-foreground">
                  {activeMember.name}
                </DialogTitle>
                {activeMember.role !== "Member" && (
                  <div className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-0.5 text-[11px] font-medium uppercase tracking-wide text-primary">
                    {activeMember.role}
                  </div>
                )}
                {activeMember.role !== "Member" && activeMember.department && (
                  <DialogDescription className="mt-1 text-xs uppercase tracking-wide text-accent">
                    {activeMember.department}
                  </DialogDescription>
                )}
              </DialogHeader>

              {activeMember.bio && (
                <p className="mt-1 text-sm text-muted-foreground text-center max-w-md">{activeMember.bio}</p>
              )}

              <div className="mt-3 flex items-center justify-center gap-3">
                {activeMember.linkedinUrl && (
                  <a
                    href={activeMember.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${activeMember.name} LinkedIn`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background/80 text-muted-foreground hover:border-primary hover:text-primary transition-colors duration-200"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Team;

import { useState } from "react";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { upcomingEvents, pastEvents, type Event } from "@/data/events";
import { Calendar, MapPin, Users, Mic } from "lucide-react";
import EventRegistration from "@/components/EventRegistration";
import EventGallery from "@/components/EventGallery";

type Filter = "all" | "upcoming" | "past";

const statusColors: Record<string, string> = {
  open: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800",
  closed: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800",
  ended: "bg-muted text-muted-foreground",
};

const EventCard = ({
  event,
  onRegister,
}: {
  event: Event;
  onRegister?: (event: Event) => void;
}) => (
  <Card className="h-full group border border-border/70 glass-card hover:shadow-2xl hover:-translate-y-1 transition-all duration-200">
    <CardContent className="p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-display font-semibold text-base">{event.name}</h3>
        <Badge variant="outline" className={`text-[10px] capitalize shrink-0 ${statusColors[event.status] ?? ""}`}>
          {event.status === "open" ? "Open" : event.status === "closed" ? "Closed" : "Ended"}
        </Badge>
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.venue}</span>
        {event.attendees && <span className="flex items-center gap-1"><Users className="h-3 w-3" />{event.attendees}+</span>}
        {event.speakers && <span className="flex items-center gap-1"><Mic className="h-3 w-3" />{event.speakers} speakers</span>}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{event.description}</p>
      {event.status === "open" ? (
        <Button size="sm" onClick={() => onRegister?.(event)}>
          Register Now
        </Button>
      ) : event.status === "ended" ? (
        <EventGallery eventId={event.id} eventName={event.name} imageList={event.imageList} />
      ) : (
        <Button size="sm" variant="ghost" disabled className="text-muted-foreground">
          Coming Soon
        </Button>
      )}
    </CardContent>
  </Card>
);

const Events = () => {
  const [filter, setFilter] = useState<Filter>("all");
  const [registerEvent, setRegisterEvent] = useState<Event | null>(null);

  return (
    <main>
      <section className="section-padding text-center px-4">
        <AnimatedSection className="max-w-2xl mx-auto">
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Events by <span className="text-gradient">SPIC</span>
          </h1>
          <p className="text-base text-muted-foreground">Where Innovation Meets Action</p>
        </AnimatedSection>
      </section>

      <section className="section-padding-sm border-t border-border/40">
        <div className="container mx-auto px-4">
          {/* Filter */}
          <div className="flex gap-2 mb-10 flex-wrap">
            {(["all", "upcoming", "past"] as Filter[]).map((f) => (
              <Button key={f} size="sm" variant={filter === f ? "default" : "ghost"} onClick={() => setFilter(f)} className="capitalize">
                {f}
              </Button>
            ))}
          </div>

          {/* Upcoming */}
          {(filter === "all" || filter === "upcoming") && (
            <div className="mb-16">
              <AnimatedSection>
                <h2 className="font-display text-xl sm:text-2xl font-bold mb-6">Upcoming Events</h2>
              </AnimatedSection>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {upcomingEvents.map((e, i) => (
                  <AnimatedSection key={e.id} delay={i * 0.06}>
                    <EventCard event={e} onRegister={setRegisterEvent} />
                  </AnimatedSection>
                ))}
              </div>
            </div>
          )}

          {/* Past */}
          {(filter === "all" || filter === "past") && (
            <div>
              <AnimatedSection>
                <h2 className="font-display text-xl sm:text-2xl font-bold mb-1.5">Past Events</h2>
                <p className="text-muted-foreground text-sm mb-6">Relive the Moments</p>
              </AnimatedSection>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {pastEvents.map((e, i) => (
                  <AnimatedSection key={e.id} delay={i * 0.05}>
                    <EventCard event={e} />
                  </AnimatedSection>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Registration Dialog */}
      {registerEvent && (
        <EventRegistration
          event={registerEvent}
          open={!!registerEvent}
          onOpenChange={(open) => {
            if (!open) setRegisterEvent(null);
          }}
        />
      )}
    </main>
  );
};

export default Events;

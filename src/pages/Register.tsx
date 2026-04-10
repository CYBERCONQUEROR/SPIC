import { useParams, Link } from "react-router-dom";
import { upcomingEvents, pastEvents } from "@/data/events";
import EventRegistrationForm from "@/components/EventRegistrationForm";
import TeamRegistrationForm from "@/components/TeamRegistrationForm";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Register() {
  const { eventId } = useParams<{ eventId: string }>();
  
  const allEvents = [...upcomingEvents, ...pastEvents];
  const event = allEvents.find((e) => e.id === eventId);

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
        <p className="text-muted-foreground mb-8">The event you are looking for does not exist or has been removed.</p>
        <Button asChild>
          <Link to="/events">Back to Events</Link>
        </Button>
      </div>
    );
  }

  if (event.status !== "open") {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertTitle>Registration Closed</AlertTitle>
          <AlertDescription>
            Registration for {event.name} is currently {event.status}.
          </AlertDescription>
        </Alert>
        <Button asChild className="mt-8">
          <Link to="/events">View Other Events</Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-4 pb-20 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl mx-auto">
        <AnimatedSection className="mb-4 sm:mb-8">
          <Link 
            to="/events" 
            className="inline-flex items-center text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Events
          </Link>
        </AnimatedSection>

        <div className="flex flex-col gap-6 w-full">
          {/* Detailed Info (Collapsible on mobile) */}
          <div className="w-full">
            <AnimatedSection className="mb-6">
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-center sm:text-left mb-2">
                {event.name}
              </h1>
              <div className="h-1 w-20 bg-primary rounded-full mx-auto sm:mx-0 mb-6" />
              
              <details className="lg:hidden">
                <summary className="text-xs font-semibold text-primary cursor-pointer hover:underline mb-4 text-center">
                  View Event Details & Schedule
                </summary>
                <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3 mb-6 animate-in fade-in duration-300">
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    {event.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-border/50">
                    <div className="space-y-1">
                      <span className="font-bold block text-primary font-display uppercase tracking-wider">Date</span>
                      <span className="text-foreground">{event.date}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold block text-primary font-display uppercase tracking-wider">Venue</span>
                      <span className="text-foreground">{event.venue}</span>
                    </div>
                  </div>
                </div>
              </details>

              <div className="hidden lg:block space-y-6">
                <p className="text-base text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
                <div className="grid grid-cols-3 gap-6 p-6 rounded-2xl bg-secondary/50 border border-border shadow-inner">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest block">Date</span>
                    <span className="text-lg font-medium">{event.date}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest block">Venue</span>
                    <span className="text-lg font-medium">{event.venue}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest block">Event type</span>
                    <span className="text-lg font-medium capitalize">{event.category}</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Form Area - Centered Card */}
          <div className="w-full flex justify-center">
            <div className="w-full max-w-xl">
              <AnimatedSection delay={0.3}>
                {event.id === "ideation-2" ? (
                  <TeamRegistrationForm event={event} />
                ) : (
                  <EventRegistrationForm event={event} />
                )}
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

import { Link } from "react-router-dom";
import { Instagram, Linkedin, Youtube, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* About */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-display font-bold text-[10px]">
                SP
              </div>
              <span className="font-display text-base font-bold">SPIC</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Society of Promotion of Innovation and Creativity — A Student Society of the EII Department, RKGIT.
            </p>
            <p className="text-sm font-medium text-primary mt-3">Innovate. Create. Inspire.</p>
          </div>

          {/* Connect */}
          <div className="sm:justify-self-end">
            <h4 className="font-display text-sm font-semibold mb-4 text-foreground">Connect</h4>
            <div className="flex gap-2.5 mb-4">
              {[
                { icon: Instagram, label: "Instagram", url: "#" },
                { icon: Linkedin, label: "LinkedIn", url: "#" },
                { icon: Youtube, label: "YouTube", url: "#" },
                { icon: Mail, label: "Email", url: "mailto:spic@rkgit.edu.in" },
              ].map(({ icon: Icon, label, url }) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-200">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">spic@rkgit.edu.in</p>
          </div>
        </div>

        <div className="border-t border-border/60 mt-10 pt-6 text-center text-xs text-muted-foreground">
          &copy; 2026 SPIC – Society of Promotion of Innovation & Creativity | RKGIT
        </div>
      </div>
    </footer>
  );
};

export default Footer;

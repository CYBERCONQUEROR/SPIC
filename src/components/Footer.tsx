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
              <img
                src="Gemini_Generated_Image_c51bomc51bomc51b-removebg-preview.png"
                alt="SPIC Logo"
                className="h-8 w-8 rounded-full object-cover border border-border/70 shadow-sm"
              />
              <span className="font-display text-base font-semibold tracking-tight text-foreground">
                SPIC
              </span>
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
                { icon: Instagram, label: "Instagram" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Youtube, label: "YouTube" },
                { icon: Mail, label: "Email" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground cursor-default transition-all duration-200">
                  <Icon className="h-4 w-4" />
                </div>
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

import { useState } from "react";
import { Instagram, Linkedin, Youtube, Mail, Loader2 } from "lucide-react";
import { api } from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Footer = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", concern: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.contact(formData);
      toast.success(data.message || "Message sent! We'll get back to you soon.");
      setOpen(false);
      setFormData({ name: "", email: "", concern: "" });
    } catch (error: any) {
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
              The Entrepreneur Cell of RKGIT — Promoting innovation and creativity since 2022.
            </p>
            <p className="text-sm font-medium text-primary mt-3">Innovate. Create. Inspire.</p>
          </div>

          {/* Connect */}
          <div className="sm:justify-self-end">
            <h4 className="font-display text-sm font-semibold mb-4 text-foreground">Connect</h4>
            <div className="flex gap-2.5 mb-4">
              <a
                href="https://www.instagram.com/spic_rkgit?igsh=MWowamxuMTd6aWh6Zg=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground cursor-not-allowed transition-all duration-200">
                <Linkedin className="h-4 w-4" />
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground cursor-not-allowed transition-all duration-200">
                <Youtube className="h-4 w-4" />
              </div>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <button className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-200">
                    <Mail className="h-4 w-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle>Contact SPIC</DialogTitle>
                      <DialogDescription>
                        Send us your questions or concerns. We'll reply as soon as possible.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="concern">Your Concern</Label>
                        <Textarea
                          id="concern"
                          required
                          className="min-h-[100px]"
                          value={formData.concern}
                          onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send Message
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-sm text-muted-foreground">spic@rkgit.edu.in</p>
          </div>
        </div>

        <div className="border-t border-border/60 mt-10 pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} SPIC – The Entrepreneur Cell of RKGIT | RKGIT
        </div>
      </div>
    </footer>
  );
};

export default Footer;

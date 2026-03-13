import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, Palette, Droplets, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button size="sm" variant="ghost" disabled>
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost" className="relative group">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-card border-border/50">
        <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2 cursor-pointer transition-colors duration-200 hover:bg-primary/10">
          <Sun className="h-4 w-4 text-orange-500" />
          <span>Light (White)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2 cursor-pointer transition-colors duration-200 hover:bg-primary/10">
          <Moon className="h-4 w-4 text-blue-400" />
          <span>Classic Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("midnight")} className="gap-2 cursor-pointer transition-colors duration-200 hover:bg-primary/10">
          <Droplets className="h-4 w-4 text-cyan-400" />
          <span>Midnight Blue</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("violet")} className="gap-2 cursor-pointer transition-colors duration-200 hover:bg-primary/10">
          <Zap className="h-4 w-4 text-purple-400" />
          <span>Deep Violet</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="gap-2 cursor-pointer transition-colors duration-200 hover:bg-primary/10">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <span>System Default</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, SunMedium } from "lucide-react";
import { siteConfig } from "@/config/siteData";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Social Links", path: "/social" },
];

export function Navbar() {
  const brandmarkSrc = `${import.meta.env.BASE_URL}brandmark.gif`;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    return prefersLight ? "light" : "dark";
  });
  const formatLocalTime = useMemo(
    () => () =>
      new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/New_York",
        timeZoneName: "short",
      }).format(new Date()),
    []
  );
  const [localTime, setLocalTime] = useState(formatLocalTime());
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const tick = () => setLocalTime(formatLocalTime());
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [formatLocalTime]);

  useEffect(() => {
    document.documentElement.classList.toggle("light-mode", theme === "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === "theme" && (event.newValue === "light" || event.newValue === "dark")) {
        setTheme(event.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "glass py-3"
          : "bg-transparent py-4"
      )}
    >
      <nav className="container flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-foreground hover:text-primary transition-colors"
        >
          <img
            src={brandmarkSrc}
            alt=""
            className="h-6 w-6"
            aria-hidden="true"
            decoding="async"
          />
          <span>{siteConfig.name}</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onMouseEnter={() => {
                if (link.path === "/social") {
                  import("@/pages/SocialLinks");
                }
              }}
              className={cn(
                "relative font-medium transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded px-2 py-1",
                location.pathname === link.path
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.name}
              {location.pathname === link.path && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Right-side controls */}
        <div className="hidden md:flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-semibold text-foreground/90 min-w-[220px] justify-center h-10">
            <span className="text-foreground/80">Jman's local time:</span>
            <span className="text-foreground">{localTime}</span>
          </div>
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background min-w-[140px] justify-center h-10"
            aria-label="Toggle color theme"
            title="Toggle color theme"
          >
            {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="text-sm font-medium">{theme === "dark" ? "Light" : "Dark"}</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-foreground hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile top bar extras */}
      <div className="md:hidden container mt-2 flex items-center justify-between gap-3 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-semibold text-foreground/90 min-w-[220px] justify-center h-10">
          <span className="text-foreground/80">Jman's local time:</span>
          <span className="text-foreground">{localTime}</span>
        </div>
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background min-w-[140px] justify-center h-10"
          aria-label="Toggle color theme"
          title="Toggle color theme"
        >
          {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden absolute top-full left-0 right-0 glass overflow-hidden transition-all duration-300",
          isMobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="container py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                location.pathname === link.path
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

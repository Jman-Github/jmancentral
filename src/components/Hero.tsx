import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

interface HeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  showScrollButton?: boolean;
  scrollTarget?: string;
  scrollButtonLabel?: string;
}

export function Hero({
  title,
  subtitle,
  backgroundImage,
  showScrollButton = false,
  scrollTarget = "#projects",
  scrollButtonLabel = "View Projects",
}: HeroProps) {
  const [parallax, setParallax] = useState(0);
  const [isDesktop, setIsDesktop] = useState<boolean>(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!isDesktop) {
        setParallax(0);
        return;
      }
      const offset = window.scrollY * 0.15;
      setParallax(Math.min(offset, 80));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDesktop]);

  const backgroundStyle = useMemo(
    () => ({
      backgroundImage: `url(${backgroundImage})`,
      transform: `translateY(${parallax * -1}px) scale(1.02)`,
      willChange: "transform",
      transition: "transform 120ms ease-out",
      backgroundPosition: "center",
      backgroundSize: "cover",
    }),
    [backgroundImage, parallax]
  );

  const handleScroll = () => {
    const element = document.querySelector(scrollTarget);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[75vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden w-full max-w-full px-4 mx-auto">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={backgroundStyle}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_0%,_transparent_45%,_rgba(0,0,0,0.55)_100%)]" />
      {/* Grain / Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none hero-grain" />

      {/* Content */}
      <div className="relative z-10 container text-center px-4 py-24">
        <h1
          className={cn(
            "text-5xl md:text-7xl font-bold mb-4 animate-fade-in",
            "text-gradient"
          )}
        >
          {title}
        </h1>
        <p
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          {subtitle}
        </p>

        {showScrollButton && (
          <button
            onClick={handleScroll}
            className={cn(
              "mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full",
              "bg-primary text-primary-foreground font-semibold",
              "hover:glow transition-all duration-300 hover:scale-105",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "animate-fade-in"
            )}
            style={{ animationDelay: "0.4s" }}
          >
            {scrollButtonLabel}
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </button>
        )}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

import { useLayoutEffect, useRef, useState } from "react";
import { ExternalLink, ChevronDown, ChevronUp, Calendar, Star } from "lucide-react";
import type { Project } from "@/config/siteData";
import type { GitHubProjectStats } from "@/hooks/use-github-project-stats";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ProjectCardProps {
  project: Project;
  index: number;
  stats?: GitHubProjectStats;
}

export function ProjectCard({ project, index, stats }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [chipsExpanded, setChipsExpanded] = useState(false);
  const [chipsOverflowing, setChipsOverflowing] = useState(false);
  const [chipRowHeight, setChipRowHeight] = useState<number | null>(null);
  const [descOpen, setDescOpen] = useState(false);
  const chipsRef = useRef<HTMLDivElement | null>(null);
  const lastUpdated = stats?.lastUpdated ?? project.lastUpdated;
  const toggleDetails = () => setIsExpanded((prev) => !prev);

  useLayoutEffect(() => {
    const container = chipsRef.current;

    if (!container) {
      return;
    }

    const measure = () => {
      const firstChip = container.firstElementChild as HTMLElement | null;

      if (!firstChip) {
        setChipRowHeight(null);
        setChipsOverflowing(false);
        setChipsExpanded(false);
        return;
      }

      const nextRowHeight = Math.ceil(firstChip.getBoundingClientRect().height);
      const hasOverflow = container.scrollHeight > nextRowHeight + 1;

      setChipRowHeight(nextRowHeight);
      setChipsOverflowing(hasOverflow);

      if (!hasOverflow) {
        setChipsExpanded(false);
      }
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(container);
    window.addEventListener("resize", measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [lastUpdated, stats?.latestRelease, stats?.stars]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleDetails();
    }
  };

  return (
    <article
      className={cn(
        "group glass rounded-xl overflow-hidden transition-all duration-300",
        "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
        "animate-slide-up"
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={toggleDetails}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Project Image */}
          {project.image && (
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-muted overflow-hidden">
              <img
                src={project.image}
                alt={`${project.name} icon`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Project Info */}
          <div className="flex-1 min-w-0">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="text-left w-full text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  title={project.name}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.stopPropagation();
                    }
                  }}
                  aria-expanded={false}
                  aria-label={`Project name: ${project.name}`}
                >
                  {project.name}
                </button>
              </PopoverTrigger>
                <PopoverContent
                  side="bottom"
                  align="start"
                  sideOffset={8}
                  className="max-w-xs text-sm font-semibold text-foreground leading-relaxed"
                  onClick={(e) => e.stopPropagation()}
                >
                  {project.name}
                </PopoverContent>
              </Popover>
            <div className="relative mt-1">
              <Popover open={descOpen} onOpenChange={setDescOpen}>
                <PopoverTrigger asChild>
                  <button
                    className="text-left w-full text-sm text-muted-foreground cursor-pointer pr-2 transition-all line-clamp-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    title={project.description}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.stopPropagation();
                      }
                    }}
                    aria-expanded={descOpen}
                    aria-label={`Description: ${project.description}`}
                  >
                    {project.description}
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  side="bottom"
                  align="start"
                  sideOffset={8}
                  className="max-w-xs text-sm leading-relaxed"
                  onClick={(e) => e.stopPropagation()}
                >
                  {project.description}
                </PopoverContent>
              </Popover>
            </div>
            {(stats || lastUpdated) && (
              <div className="mt-2">
                <div
                  ref={chipsRef}
                  className="flex flex-wrap items-center gap-2 overflow-hidden transition-[max-height] duration-300"
                  style={
                    chipsExpanded || !chipsOverflowing || chipRowHeight === null
                      ? undefined
                      : { maxHeight: `${chipRowHeight}px` }
                  }
                >
                  {typeof stats?.stars === "number" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
                      <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                      {stats.stars.toLocaleString()} stars
                    </span>
                  )}
                  {stats?.latestRelease && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
                      Latest release: {stats.latestRelease}
                    </span>
                  )}
                  {lastUpdated && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
                      <Calendar className="h-3 w-3" aria-hidden="true" />
                      Updated {lastUpdated}
                    </span>
                  )}
                </div>
                {chipsOverflowing && (
                  <div className="mt-1.5">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setChipsExpanded((current) => !current);
                      }}
                      className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground/80 transition-colors hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      aria-expanded={chipsExpanded}
                      aria-label={chipsExpanded ? "Show fewer project details" : "Show more project details"}
                    >
                      {chipsExpanded ? "Show less" : "Show all"}
                      {chipsExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-3">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
              "bg-primary text-primary-foreground font-medium text-sm",
              "hover:glow-sm transition-all duration-300",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-4 w-4" />
            Visit
          </a>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
              "bg-secondary text-secondary-foreground font-medium text-sm",
              "hover:bg-muted transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            )}
            aria-expanded={isExpanded}
            aria-controls={`details-${project.id}`}
          >
            Details
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Expandable Details */}
        <div
          id={`details-${project.id}`}
          className={cn(
            "overflow-hidden transition-all duration-300",
            isExpanded ? "max-h-40 mt-4" : "max-h-0"
          )}
        >
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">{project.details}</p>
            <div className="mt-3 flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                  project.status === "active"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-muted-foreground/20 text-muted-foreground"
                )}
              >
                {project.status === "active" ? "Active" : "Discontinued"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

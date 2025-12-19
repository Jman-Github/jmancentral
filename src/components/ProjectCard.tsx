import { useState } from "react";
import { ExternalLink, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import type { Project } from "@/config/siteData";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [descOpen, setDescOpen] = useState(false);
  const toggleDetails = () => setIsExpanded((prev) => !prev);
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
            {project.lastUpdated && (
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
                  <Calendar className="h-3 w-3" aria-hidden="true" />
                  Updated {project.lastUpdated}
                </span>
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

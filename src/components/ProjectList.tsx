import type { ReactNode } from "react";
import { ArrowUpRight, Star } from "lucide-react";
import { PlatformIcon } from "@/components/PlatformIcon";
import type { Project } from "@/config/siteData";
import { formatDate, formatNumber, getRepositoryStats } from "@/lib/github-stats";
import { cn } from "@/lib/utils";

function ProjectIcon({ project }: { project: Project }) {
  if (project.icon) {
    return <img src={project.icon} alt="" width={40} height={40} loading="lazy" decoding="async" className="size-10 rounded-[10px]" />;
  }
  return (
    <span className="grid size-10 place-items-center rounded-[10px] border border-line bg-surface text-muted">
      <PlatformIcon name={project.platform} className="size-5" />
    </span>
  );
}

function ProjectMeta({ project }: { project: Project }) {
  const repo = getRepositoryStats(project.githubRepo);
  const items: ReactNode[] = [];

  if (repo) {
    items.push(
      <span className="inline-flex items-center gap-1">
        <Star className="size-3.5" aria-hidden="true" />
        {formatNumber(repo.stars)}
        <span className="sr-only"> stars</span>
      </span>,
    );
    if (repo.latestRelease) items.push(<span>{repo.latestRelease}</span>);
    const pushed = formatDate(repo.pushedAt);
    if (pushed) items.push(<span>Updated {pushed}</span>);
  } else {
    if (project.platform === "roblox") items.push(<span>Roblox</span>);
    if (project.lastUpdated) items.push(<span>Last updated {project.lastUpdated}</span>);
  }

  if (items.length === 0) return null;

  return (
    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-subtle">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

interface ProjectListProps {
  projects: Project[];
  muted?: boolean;
  /** Heading level for project names; use h4 when the list sits under its own h3 (e.g. "Discontinued"). */
  headingLevel?: "h3" | "h4";
}

export function ProjectList({ projects, muted = false, headingLevel: Heading = "h3" }: ProjectListProps) {
  return (
    <ul>
      {projects.map((project) => (
        <li
          key={project.id}
          className="group relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 border-b border-line py-6 first:pt-0 last:border-b-0 last:pb-0 has-[a:focus-visible]:rounded-sm has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-accent sm:grid-cols-[2.5rem_minmax(0,1fr)_1.25rem] sm:gap-x-5"
        >
          <ProjectIcon project={project} />
          <div className="min-w-0">
            <Heading className={cn("font-medium leading-snug", muted ? "text-muted" : "text-fg")}>
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="decoration-1 underline-offset-4 after:absolute after:inset-0 supports-[selector(:has(*))]:focus-visible:outline-none group-hover:underline"
              >
                {project.name}
                {/* Phones have no hover and hide the arrow column, so show the link cue inline. */}
                <ArrowUpRight className="ml-1 inline size-3.5 align-[-1px] text-subtle sm:hidden" aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Heading>
            <p className={cn("mt-1.5 max-w-[65ch] text-[15px] leading-relaxed", muted ? "text-subtle" : "text-muted")}>{project.description}</p>
            <ProjectMeta project={project} />
          </div>
          <ArrowUpRight
            className="hidden size-5 text-subtle transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent sm:block"
            aria-hidden="true"
          />
        </li>
      ))}
    </ul>
  );
}

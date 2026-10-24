import { Suspense } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/config/siteData";
import { useGitHubProjectStats } from "@/hooks/use-github-project-stats";

const activeProjects = projects.filter((p) => p.status === "active");
const discontinuedProjects = projects.filter((p) => p.status === "discontinued");

export function ProjectsSection() {
  const { data: githubStats = {} } = useGitHubProjectStats(activeProjects);

  return (
    <section id="projects" className="py-20">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
          My Projects
        </h2>

        {/* Active Projects */}
        {activeProjects.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4 md:mb-8">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-glow-pulse" />
              <h3 className="text-xl font-semibold text-foreground">Active Projects</h3>
            </div>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:snap-none lg:grid-cols-3">
              {activeProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="min-w-[280px] max-w-[340px] snap-center md:min-w-0 md:max-w-none"
                >
                  <ProjectCard
                    project={project}
                    index={index}
                    stats={githubStats[project.id]}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Discontinued Projects */}
        {discontinuedProjects.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4 md:mb-8">
              <div className="w-3 h-3 rounded-full bg-muted-foreground" />
              <h3 className="text-xl font-semibold text-foreground">Discontinued Projects</h3>
            </div>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:snap-none">
              {discontinuedProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="min-w-[280px] max-w-[340px] snap-center md:min-w-0 md:max-w-none"
                >
                  <ProjectCard project={project} index={index} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function LazyProjectsSection() {
  return (
    <Suspense fallback={<div className="text-center text-muted-foreground py-12">Loading projects…</div>}>
      <ProjectsSection />
    </Suspense>
  );
}

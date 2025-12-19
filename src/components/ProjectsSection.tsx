import { Suspense } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/config/siteData";
import { cn } from "@/lib/utils";

const activeProjects = projects.filter((p) => p.status === "active");
const discontinuedProjects = projects.filter((p) => p.status === "discontinued");

function getCenteredLastCardWrapperClass(index: number, total: number) {
  const isLastOdd = total % 2 === 1 && index === total - 1;
  return isLastOdd ? "md:col-span-2 md:flex md:justify-center" : undefined;
}

function getCenteredLastCardInnerClass(index: number, total: number) {
  const isLastOdd = total % 2 === 1 && index === total - 1;
  return isLastOdd ? "w-full md:w-[calc((100%-1.5rem)/2)]" : "w-full";
}

export function ProjectsSection() {
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
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:snap-none">
              {activeProjects.map((project, index) => (
                <div
                  key={project.id}
                  className={cn(
                    "min-w-[280px] max-w-[340px] snap-center md:min-w-0 md:max-w-none",
                    getCenteredLastCardWrapperClass(index, activeProjects.length)
                  )}
                >
                  <div className={cn(getCenteredLastCardInnerClass(index, activeProjects.length))}>
                    <ProjectCard project={project} index={index} />
                  </div>
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
                  className={cn(
                    "min-w-[280px] max-w-[340px] snap-center md:min-w-0 md:max-w-none",
                    getCenteredLastCardWrapperClass(index, discontinuedProjects.length)
                  )}
                >
                  <div
                    className={cn(
                      getCenteredLastCardInnerClass(index, discontinuedProjects.length)
                    )}
                  >
                    <ProjectCard project={project} index={index} />
                  </div>
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

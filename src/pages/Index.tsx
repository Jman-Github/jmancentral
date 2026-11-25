import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { GitHubSummary } from "@/components/GitHubSummary";
import { Layout } from "@/components/Layout";
import { PageIntro } from "@/components/PageIntro";
import { ProjectList } from "@/components/ProjectList";
import { Section } from "@/components/Section";
import pages from "@/config/pages.json";
import { projects, site } from "@/config/siteData";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import { githubStats } from "@/lib/github-stats";

const activeProjects = projects.filter((project) => project.status === "active");
const discontinuedProjects = projects.filter((project) => project.status === "discontinued");

const Index = () => {
  usePageMetadata(pages.home);

  return (
    <Layout>
      <PageIntro eyebrow={site.owner} title="Open-source tools for patching Android apps.">
        <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-muted">
          I build and maintain Universal Patch Manager, Patch Bundle Registry, and Awesome Android Patching for the ReVanced,
          Morphe, and Reseam communities.
        </p>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[15px]">
          <li>
            <a href={site.githubUrl} target="_blank" rel="noreferrer" className="link tap-target inline-flex items-center gap-1">
              GitHub
              <ArrowUpRight className="size-4 text-subtle" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a href={`mailto:${site.email}`} className="link tap-target">
              Email
            </a>
          </li>
          <li>
            <Link to="/social" className="link tap-target inline-flex items-center gap-1">
              Social links
              <ArrowRight className="size-4 text-subtle" aria-hidden="true" />
            </Link>
          </li>
        </ul>
      </PageIntro>

      <Section id="projects" label="Projects">
        <ProjectList projects={activeProjects} />
        {discontinuedProjects.length > 0 && (
          <>
            <h3 className="mb-4 mt-12 font-mono text-[13px] text-muted">Discontinued</h3>
            <ProjectList projects={discontinuedProjects} muted headingLevel="h4" />
          </>
        )}
      </Section>

      <Section
        id="github"
        label="GitHub"
        aside={
          <a
            href={githubStats.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="tap-target inline-flex items-center gap-1 font-mono text-[13px] text-subtle transition-colors hover:text-fg"
          >
            @{githubStats.username}
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        }
      >
        <GitHubSummary />
      </Section>
    </Layout>
  );
};

export default Index;

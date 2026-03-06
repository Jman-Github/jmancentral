import { Suspense, lazy } from "react";
import { Hero } from "@/components/Hero";
import { Layout } from "@/components/Layout";
import { siteConfig } from "@/config/siteData";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import heroImage from "@/assets/hero-home.jpg";

const ProjectsSection = lazy(() =>
  import("@/components/ProjectsSection").then((m) => ({ default: m.ProjectsSection }))
);

const Index = () => {
  usePageMetadata({
    title: "Jman Central - Projects and Links",
    description: "JMAN CENTRAL - Personal hub for projects, social links, and more.",
    url: siteConfig.siteUrl,
  });

  return (
    <Layout>
      {/* Hero Section */}
      <Hero
        title="HOME"
        subtitle={siteConfig.tagline}
        backgroundImage={heroImage}
        showScrollButton
        scrollTarget="#projects"
      />

      {/* Projects Section (lazy-loaded) */}
      <Suspense fallback={<div className="text-center text-muted-foreground py-12">Loading projects…</div>}>
        <ProjectsSection />
      </Suspense>
    </Layout>
  );
};

export default Index;

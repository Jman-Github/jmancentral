import { Suspense, lazy } from "react";
import { Hero } from "@/components/Hero";
import { Layout } from "@/components/Layout";
import { siteConfig } from "@/config/siteData";
import heroImage from "@/assets/hero-social.jpg";

const ProjectsSection = lazy(() =>
  import("@/components/ProjectsSection").then((m) => ({ default: m.ProjectsSection }))
);

const Index = () => {
  return (
    <Layout>
      {/* SEO */}
      <title>{siteConfig.name} - Home</title>
      <meta name="description" content={`${siteConfig.name} - ${siteConfig.tagline}`} />

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

import { Hero } from "@/components/Hero";
import { Layout } from "@/components/Layout";
import { SocialCard } from "@/components/SocialCard";
import { socialLinks, siteConfig } from "@/config/siteData";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import heroImage from "@/assets/hero-social.jpg";

const SocialLinks = () => {
  usePageMetadata({
    title: "Jman Central - Social Links",
    description: "Find JMAN CENTRAL across the internet.",
    url: `${siteConfig.siteUrl}/social`,
  });

  return (
    <Layout>
      {/* Hero Section */}
      <Hero
        title="SOCIAL LINKS"
        subtitle="Find me around the internet"
        backgroundImage={heroImage}
        showScrollButton
        scrollTarget="#social-links"
        scrollButtonLabel="View Social Links"
      />
      {/* Social Grid */}
      <section id="social-links" className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {socialLinks.map((social, index) => {
              const isCenteredLast =
                socialLinks.length % 3 === 1 &&
                index === socialLinks.length - 1;
              return (
              <div key={social.id} className={isCenteredLast ? "lg:col-start-2" : undefined}>
                <SocialCard social={social} index={index} />
              </div>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SocialLinks;

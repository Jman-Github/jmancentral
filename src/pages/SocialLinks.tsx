import { Hero } from "@/components/Hero";
import { Layout } from "@/components/Layout";
import { SocialCard } from "@/components/SocialCard";
import { socialLinks, siteConfig } from "@/config/siteData";
import heroImage from "@/assets/hero-home.jpg";

const SocialLinks = () => {
  return (
    <Layout>
      {/* SEO */}
      <title>{siteConfig.name} - Social Links</title>
      <meta
        name="description"
        content={`Find ${siteConfig.name} across the internet`}
      />

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
            {socialLinks.map((social, index) => (
              <div key={social.id}>
                <SocialCard social={social} index={index} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SocialLinks;

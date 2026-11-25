import { Layout } from "@/components/Layout";
import { PageIntro } from "@/components/PageIntro";
import { Section } from "@/components/Section";
import { SocialList } from "@/components/SocialList";
import pages from "@/config/pages.json";
import { socialLinks } from "@/config/siteData";
import { usePageMetadata } from "@/hooks/use-page-metadata";

const SocialLinks = () => {
  usePageMetadata(pages.social);

  return (
    <Layout>
      <PageIntro eyebrow="Social links" title="Find me around the internet." />

      <Section id="profiles" label={`${socialLinks.length} profiles`}>
        <SocialList links={socialLinks} />
      </Section>
    </Layout>
  );
};

export default SocialLinks;

import { ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Layout } from "@/components/Layout";
import { PageIntro } from "@/components/PageIntro";
import pages from "@/config/pages.json";
import { usePageMetadata } from "@/hooks/use-page-metadata";

const NotFound = () => {
  const { pathname } = useLocation();
  let displayPath = pathname;
  try {
    displayPath = decodeURIComponent(pathname);
  } catch {
    // Malformed percent-encoding: show the raw path.
  }
  usePageMetadata({ title: pages.notFound.title, description: pages.notFound.description });

  return (
    <Layout>
      <PageIntro eyebrow="404" title="This page doesn't exist.">
        <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-muted">
          Nothing lives at <code className="break-all font-mono text-base text-fg">{displayPath}</code>. Check the address, or head back to
          the home page.
        </p>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[15px]">
          <li>
            <Link to="/" className="link tap-target inline-flex items-center gap-1">
              Home
              <ArrowRight className="size-4 text-subtle" aria-hidden="true" />
            </Link>
          </li>
          <li>
            <Link to="/social" className="link tap-target inline-flex items-center gap-1">
              Social links
              <ArrowRight className="size-4 text-subtle" aria-hidden="true" />
            </Link>
          </li>
        </ul>
      </PageIntro>
    </Layout>
  );
};

export default NotFound;

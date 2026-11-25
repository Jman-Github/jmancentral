import { useEffect } from "react";
import { site } from "@/config/siteData";

interface PageMetadata {
  title: string;
  description: string;
  /** Path for the canonical URL, e.g. "/social/". Omit for pages that shouldn't set one. */
  path?: string;
}

function upsertMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }
  element.href = href;
}

/** Keeps document metadata in sync during client-side navigation. */
export function usePageMetadata({ title, description, path }: PageMetadata) {
  useEffect(() => {
    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    // Pages without a path (the 404 page) get no canonical URL and are kept out of search results.
    if (path) {
      const url = new URL(path, site.url).href;
      upsertMeta("property", "og:url", url);
      upsertCanonical(url);
      document.head.querySelector('meta[name="robots"]')?.remove();
    } else {
      document.head.querySelector('link[rel="canonical"]')?.remove();
      document.head.querySelector('meta[property="og:url"]')?.remove();
      upsertMeta("name", "robots", "noindex");
    }
  }, [description, path, title]);
}

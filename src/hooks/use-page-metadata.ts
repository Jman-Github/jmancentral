import { useEffect } from "react";

type MetaAttribute = "name" | "property";

interface PageMetadata {
  title: string;
  description: string;
  url: string;
}

function upsertMetaTag(attribute: MetaAttribute, key: string, content: string) {
  let element = document.head.querySelector(
    `meta[${attribute}="${key}"]`,
  ) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function upsertCanonicalLink(url: string) {
  let element = document.head.querySelector(
    'link[rel="canonical"]',
  ) as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }

  element.setAttribute("href", url);
}

export function usePageMetadata({ title, description, url }: PageMetadata) {
  useEffect(() => {
    document.title = title;
    upsertMetaTag("name", "description", description);
    upsertMetaTag("property", "og:title", title);
    upsertMetaTag("property", "og:description", description);
    upsertMetaTag("property", "og:url", url);
    upsertMetaTag("name", "twitter:title", title);
    upsertMetaTag("name", "twitter:description", description);
    upsertCanonicalLink(url);
  }, [description, title, url]);
}

import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { seo } from "@/seo";

type SEOHeadProps = {
  title?: string;
  description?: string;
  notFound?: boolean;
};

const UNMANAGED = [
  'meta[name="description"]',
  'meta[name="title"]',
  'link[rel="canonical"]',
  'link[rel="alternate"][hreflang]',
  'meta[property="og:title"]',
  'meta[property="og:description"]',
  'meta[property="og:url"]',
  'meta[name="twitter:title"]',
  'meta[name="twitter:description"]',
  'script[type="application/ld+json"]',
];

function dropUnmanaged(selector: string) {
  document.querySelectorAll(selector).forEach((el) => {
    if (!el.hasAttribute("data-rh")) el.remove();
  });
}

/**
 * Per-route head. After Helmet writes its tags, drop the static homepage
 * title, description and canonical so hydration cannot leave them in place.
 */
export default function SEOHead({ title, description, notFound = false }: SEOHeadProps) {
  const { pathname } = useLocation();
  const resolved = seo.resolve(pathname, { title, description, notFound });

  useEffect(() => {
    const managedTitle = document.querySelector("title[data-rh]");
    if (managedTitle) {
      document.querySelectorAll("title").forEach((el) => {
        if (el !== managedTitle) el.remove();
      });
    }
    UNMANAGED.forEach(dropUnmanaged);
    if (!resolved.canonical) {
      document.querySelectorAll('link[rel="canonical"]').forEach((el) => el.remove());
    }
  }, [resolved.canonical, resolved.title, resolved.description, pathname]);

  return (
    <Helmet>
      <title>{resolved.title}</title>
      <meta name="description" content={resolved.description} />
      {resolved.robots ? <meta name="robots" content={resolved.robots} /> : null}
      {resolved.canonical ? <link rel="canonical" href={resolved.canonical} /> : null}
      {resolved.canonical ? (
        <link rel="alternate" hrefLang="nl-BE" href={resolved.canonical} />
      ) : null}
      {resolved.canonical ? (
        <link rel="alternate" hrefLang="x-default" href={resolved.canonical} />
      ) : null}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={resolved.title} />
      <meta property="og:description" content={resolved.description} />
      {resolved.canonical ? <meta property="og:url" content={resolved.canonical} /> : null}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={resolved.title} />
      <meta name="twitter:description" content={resolved.description} />
      {resolved.jsonLd ? (
        <script type="application/ld+json">{JSON.stringify(resolved.jsonLd)}</script>
      ) : null}
    </Helmet>
  );
}

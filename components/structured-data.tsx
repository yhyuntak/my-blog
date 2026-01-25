export function BlogPostingSchema({
  title,
  description,
  datePublished,
  dateModified,
  author,
  url,
}: {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  url: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: author || "Blog Author",
    },
    publisher: {
      "@type": "Organization",
      name: "My Blog",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteSchema({ url }: { url: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "My Blog",
    description: "A modern blog built with Next.js and Tailwind CSS",
    url: url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/posts?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

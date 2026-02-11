import React, { useEffect } from 'react';

interface SEOMetadata {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  robots?: string;
  h1?: string;
  h2s?: string[];
  structuredData?: object;
  viewport?: string;
}

/**
 * PageSEO Component
 * Dynamically sets meta tags and structured data for each page
 */
export const PageSEO: React.FC<{ seoData: SEOMetadata; children?: React.ReactNode }> = ({ seoData, children }) => {
  useEffect(() => {
    // Set page title
    if (seoData.title) {
      document.title = seoData.title;
    }

    // Set description meta tag
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      let element = document.querySelector(
        isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`
      ) as HTMLMetaElement;

      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }

      element.content = content;
    };

    // Basic meta tags
    if (seoData.description) setMetaTag('description', seoData.description);
    if (seoData.keywords) setMetaTag('keywords', seoData.keywords);
    if (seoData.robots) setMetaTag('robots', seoData.robots);
    if (seoData.viewport) setMetaTag('viewport', seoData.viewport);

    // Open Graph tags
    if (seoData.ogTitle) setMetaTag('og:title', seoData.ogTitle, true);
    if (seoData.ogDescription) setMetaTag('og:description', seoData.ogDescription, true);
    if (seoData.ogImage) setMetaTag('og:image', seoData.ogImage, true);
    if (seoData.ogUrl) setMetaTag('og:url', seoData.ogUrl, true);
    if (seoData.ogType) setMetaTag('og:type', seoData.ogType, true);

    // Twitter Card tags
    if (seoData.twitterCard) setMetaTag('twitter:card', seoData.twitterCard);
    if (seoData.twitterTitle) setMetaTag('twitter:title', seoData.twitterTitle);
    if (seoData.twitterDescription) setMetaTag('twitter:description', seoData.twitterDescription);
    if (seoData.twitterImage) setMetaTag('twitter:image', seoData.twitterImage);

    // Canonical URL
    if (seoData.canonical) {
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = seoData.canonical;
    }

    // Structured Data (JSON-LD)
    if (seoData.structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(seoData.structuredData);
    }

    return () => {
      // Cleanup is optional - you may want to keep meta tags for consistency
    };
  }, [seoData]);

  return <>{children}</>;
};

/**
 * Heading Component with SEO
 * Ensures proper H1/H2 structure
 */
export const SeoHeading: React.FC<{
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}> = ({ level, children, className = '' }) => {
  const headingClasses = {
    1: `text-4xl md:text-5xl font-bold ${className}`,
    2: `text-3xl md:text-4xl font-bold ${className}`,
    3: `text-2xl md:text-3xl font-bold ${className}`,
    4: `text-xl md:text-2xl font-bold ${className}`,
    5: `text-lg md:text-xl font-bold ${className}`,
    6: `text-base md:text-lg font-bold ${className}`
  };

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  return React.createElement(HeadingTag, {
    className: headingClasses[level],
    children
  });
};

/**
 * Meta Description Component
 * Visual preview of meta description (for admin/debugging)
 */
export const MetaPreview: React.FC<{
  title?: string;
  description?: string;
  url?: string;
}> = ({ title, description, url }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg border border-gray-300 my-4">
      <div className="text-blue-600 text-sm font-semibold">{url}</div>
      <div className="text-xl font-bold text-gray-900 mt-1">{title}</div>
      <div className="text-gray-700 text-sm mt-1">{description}</div>
      <div className="text-xs text-gray-500 mt-2">
        Title: {title?.length || 0}/60 | Description: {description?.length || 0}/160
      </div>
    </div>
  );
};

/**
 * Hook to manage page SEO
 */
export const usePageSEO = (seoData: SEOMetadata) => {
  const [seoMetadata, setSeoMetadata] = React.useState<SEOMetadata>(seoData);

  const updateSEO = (updates: Partial<SEOMetadata>) => {
    setSeoMetadata(prev => ({ ...prev, ...updates }));
  };

  return { seoMetadata, updateSEO };
};

/**
 * Image SEO Wrapper
 * Ensures proper alt text and lazy loading
 */
export const SeoImage: React.FC<{
  src: string;
  alt: string;
  title?: string;
  className?: string;
  lazy?: boolean;
}> = ({ src, alt, title, className = '', lazy = true }) => {
  return (
    <img
      src={src}
      alt={alt}
      title={title || alt}
      className={className}
      loading={lazy ? 'lazy' : 'eager'}
    />
  );
};

/**
 * Internal Link Component with SEO
 * Ensures proper link structure for crawlers
 */
export const SeoLink: React.FC<{
  href: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}> = ({ href, title, children, className = '', target, rel }) => {
  return (
    <a
      href={href}
      title={title}
      className={className}
      target={target}
      rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
    >
      {children}
    </a>
  );
};

/**
 * Breadcrumb Component with SEO Schema
 */
export const SeoBreadcrumb: React.FC<{
  items: Array<{ name: string; url?: string }>;
  className?: string;
}> = ({ items, className = '' }) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: (index + 1).toString(),
      name: item.name,
      item: item.url ? `${window.location.origin}${item.url}` : undefined
    }))
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [items]);

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.url ? (
              <a href={item.url} className="text-blue-600 hover:underline">
                {item.name}
              </a>
            ) : (
              <span className="text-gray-700">{item.name}</span>
            )}
            {index < items.length - 1 && <span className="mx-2 text-gray-400">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default PageSEO;

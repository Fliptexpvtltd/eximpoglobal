import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  canonical?: string;
  structuredData?: object;
}

export function SEO({
  title,
  description,
  keywords = 'B2B marketplace, international trade, export, import, wholesale, suppliers, buyers, trade platform',
  ogType = 'website',
  ogImage = 'https://eximpoglobal.net/og-image.jpg',
  canonical,
  structuredData,
}: SEOProps) {
  useEffect(() => {
    // Update title
    document.title = `${title} | EximpoGlobal - B2B Marketplace`;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Standard meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', 'Eximpo Global LLP');
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // Open Graph tags
    updateMetaTag('og:title', `${title} | EximpoGlobal`, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', ogType, true);
    updateMetaTag('og:url', canonical || window.location.href, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:site_name', 'EximpoGlobal', true);
    updateMetaTag('og:locale', 'en_US', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', `${title} | EximpoGlobal`);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical || window.location.href);

    // Structured Data (JSON-LD)
    if (structuredData) {
      let scriptTag = document.querySelector('script[type="application/ld+json"]');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(structuredData);
    }

    // Cleanup function
    return () => {
      // Optionally clean up or reset meta tags when component unmounts
    };
  }, [title, description, keywords, ogType, ogImage, canonical, structuredData]);

  return null; // This component doesn't render anything
}

// Helper function to generate Organization structured data
export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Eximpo Global LLP',
  url: 'https://eximpoglobal.net',
  logo: 'https://sin1.contabostorage.com/265cb5518b244ea2bdb6eef9784e1983:eximpo-bucket/brand/eximpo-global-llp-logo.svg',
  description: 'Your trusted B2B marketplace connecting buyers and suppliers worldwide for seamless international trade.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'H No: 6-640/1/2, Vimanapuri Colony, Quthbullapur',
    addressLocality: 'Hyderabad',
    addressRegion: 'Telangana',
    postalCode: '500055',
    addressCountry: 'IN',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+91-7386663696',
      contactType: 'customer service',
      email: 'contact@eximpoglobal.net',
      availableLanguage: ['English', 'Hindi'],
    },
    {
      '@type': 'ContactPoint',
      telephone: '+254-733336633',
      contactType: 'customer service',
      email: 'contact@eximpoglobal.net',
      availableLanguage: 'English',
    },
  ],
  sameAs: [
    'https://www.facebook.com/eximpoglobal',
    'https://www.twitter.com/eximpoglobal',
    'https://www.linkedin.com/company/eximpoglobal',
    'https://www.instagram.com/eximpoglobal',
  ],
});

// Helper function to generate WebSite structured data
export const getWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'EximpoGlobal',
  url: 'https://eximpoglobal.net',
  description: 'B2B marketplace connecting buyers and suppliers worldwide for seamless international trade.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://eximpoglobal.net?view=catalog&search={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
});

// Helper function to generate BreadcrumbList structured data
export const getBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

// Helper function to generate FAQPage structured data
export const getFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

// Helper function to generate Service structured data
export const getServiceSchema = (serviceName: string, description: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: serviceName,
  description: description,
  provider: getOrganizationSchema(),
  areaServed: 'Worldwide',
  serviceType: 'B2B Trade Services',
});

// Helper function to generate Product structured data
export const getProductSchema = (product: {
  name: string;
  description: string;
  image: string;
  price?: number | null; // Optional for products with negotiable pricing
  currency?: string;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  category: string;
  brand?: string;
  sku?: string;
  moq?: number;
  rating?: number;
  reviewCount?: number;
  supplierName?: string;
  origin?: string;
  certifications?: string[];
}) => {
  const baseSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: product.brand || product.supplierName || 'EximpoGlobal Verified Supplier',
    },
    ...(product.sku && { sku: product.sku }),
  };

  // Only add offers if price is available
  if (product.price && product.price > 0 && product.currency) {
    baseSchema.offers = {
      '@type': 'Offer',
      url: window.location.href,
      priceCurrency: product.currency,
      price: product.price,
      availability: `https://schema.org/${product.availability}`,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      seller: {
        '@type': 'Organization',
        name: product.supplierName || 'EximpoGlobal Verified Supplier',
      },
      ...(product.moq && {
        eligibleQuantity: {
          '@type': 'QuantitativeValue',
          value: product.moq,
          unitText: 'units',
        },
      }),
    };
  } else {
    // For products without price (negotiable/quote-based)
    baseSchema.offers = {
      '@type': 'Offer',
      url: window.location.href,
      availability: `https://schema.org/${product.availability}`,
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: 0,
        priceCurrency: product.currency || 'USD',
      },
      seller: {
        '@type': 'Organization',
        name: product.supplierName || 'EximpoGlobal Verified Supplier',
      },
      ...(product.moq && {
        eligibleQuantity: {
          '@type': 'QuantitativeValue',
          value: product.moq,
          unitText: 'units',
        },
      }),
    };
  }

  // Add rating if available
  if (product.rating && product.reviewCount) {
    baseSchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  // Add country of origin if available
  if (product.origin) {
    baseSchema.countryOfOrigin = {
      '@type': 'Country',
      name: product.origin,
    };
  }

  // Add certifications if available
  if (product.certifications && product.certifications.length > 0) {
    baseSchema.additionalProperty = product.certifications.map((cert) => ({
      '@type': 'PropertyValue',
      name: 'Certification',
      value: cert,
    }));
  }

  return baseSchema;
};

// Helper function to generate ItemList (Product Catalog) structured data
export const getProductListSchema = (products: Array<{
  name: string;
  url: string;
  image: string;
  price?: number | null;
  currency?: string;
}>) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: products.map((product, index) => {
    const item: any = {
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        image: product.image,
        url: product.url,
      },
    };

    // Only add offers if price is available
    if (product.price && product.price > 0 && product.currency) {
      item.item.offers = {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: product.currency,
      };
    }

    return item;
  }),
});

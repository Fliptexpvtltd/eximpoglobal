/**
 * SEO Service - Generates structured data and SEO metadata for products and content
 */

// Helper to convert product name to URL slug
const toSlug = (name) => (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Generate Product Schema (JSON-LD)
export const generateProductSchema = (product, supplierInfo, baseUrl = process.env.FRONTEND_URL || 'https://app.eximpoglobal.net') => {
  const productUrl = `${baseUrl}/products/${toSlug(product.name)}/${product.id}`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': productUrl,
    name: product.name,
    description: product.description || `High-quality ${product.name} from trusted supplier`,
    url: productUrl,
    image: [product.image || `${baseUrl}/default-product.jpg`],
    
    // Pricing information
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: product.currency || 'USD',
      // Use MOQ as base offer
      offers: [
        {
          '@type': 'Offer',
          url: productUrl,
          priceCurrency: product.currency || 'USD',
          price: product.price.toString(),
          priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          availability: 'https://schema.org/InStock',
          condition: 'https://schema.org/NewCondition',
          ...(product.moq && {
            eligibleQuantity: {
              '@type': 'PriceSpecification',
              priceCurrency: product.currency || 'USD',
              price: product.price.toString(),
              eligibleTransactionVolume: {
                '@type': 'PriceSpecification',
                priceCurrency: product.currency || 'USD',
                minPrice: product.moq.toString()
              }
            }
          })
        }
      ],
      ...(product.moq && { priceLowBound: product.price.toString() }),
      priceCurrency: product.currency || 'USD'
    },

    // Category and keywords
    category: product.category || 'Uncategorized',
    ...(product.hsCode && { identifier: product.hsCode }),
    
    // Supplier/Manufacturer information
    ...(supplierInfo && {
      manufacturer: {
        '@type': 'Organization',
        name: supplierInfo.name || 'Verified Supplier',
        url: `${baseUrl}/suppliers/${supplierInfo.id}`,
        ...(supplierInfo.logo && { logo: supplierInfo.logo }),
        areaServed: supplierInfo.origin || 'International'
      }
    }),

    // Brand information
    brand: {
      '@type': 'Brand',
      name: product.brand || supplierInfo?.name || 'Eximpo Brand'
    },

    // Aggregate rating if available
    ...(supplierInfo?.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: supplierInfo.rating.toString(),
        bestRating: '5',
        worstRating: '1',
        ratingCount: supplierInfo.reviewCount || '1'
      }
    }),

    // Certifications as properties
    ...(product.certifications && product.certifications.length > 0 && {
      certifications: product.certifications,
      award: product.certifications.slice(0, 3).map(cert => ({
        '@type': 'Award',
        name: cert
      }))
    }),

    // Additional properties
    ...(product.specifications && {
      additionalProperty: Object.entries(product.specifications).map(([name, value]) => ({
        '@type': 'PropertyValue',
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: value.toString()
      }))
    }),

    // Country of origin
    ...(product.origin && {
      countryOfOrigin: {
        '@type': 'Country',
        name: product.origin
      }
    }),

    // Shipping info if available
    shippingDetails: {
      '@type': 'OfferShippingDetails',
      shippingRate: {
        '@type': 'PriceSpecification',
        priceCurrency: product.currency || 'USD',
        price: '0'
      },
      shippingDestination: {
        '@type': 'ShippingDeliveryTime',
        businessDays: parseInt(product.leadTime) || 14
      }
    },

    // SKU and identifier
    ...(product.sku && { sku: product.sku }),
    
    datePublished: product.createdAt || new Date().toISOString(),
    dateModified: product.updatedAt || new Date().toISOString()
  };
};

// Generate Product Feed Schema (for multiple products)
export const generateProductListSchema = (products, baseUrl = process.env.FRONTEND_URL || 'https://app.eximpoglobal.net') => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Products',
    url: `${baseUrl}/products`,
    numberOfItems: products.length.toString(),
    itemListElement: products.slice(0, 100).map((product, index) => ({
      '@type': 'ListItem',
      position: (index + 1).toString(),
      url: `${baseUrl}/products/${toSlug(product.name)}/${product.id}`,
      name: product.name,
      image: product.image,
      description: product.description
    }))
  };
};

// Generate Supplier/Organization Schema
export const generateSupplierSchema = (supplier, baseUrl = process.env.FRONTEND_URL || 'https://app.eximpoglobal.net') => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: supplier.name,
    alternateName: supplier.companyName || supplier.name,
    url: `${baseUrl}/suppliers/${supplier.id}`,
    ...(supplier.logo && { logo: supplier.logo }),
    description: supplier.description || `${supplier.name} - Verified B2B Supplier on Eximpo Global`,
    
    // Contact information
    ...(supplier.email && {
      email: supplier.email,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Support',
        email: supplier.email,
        ...(supplier.phone && { telephone: supplier.phone })
      }
    }),

    // Address
    ...(supplier.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: supplier.address.street || '',
        addressLocality: supplier.address.city || '',
        addressProvince: supplier.address.state || '',
        postalCode: supplier.address.postalCode || '',
        addressCountry: supplier.country || ''
      }
    }),

    // Ratings
    ...(supplier.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: supplier.rating.toString(),
        bestRating: '5',
        worstRating: '1',
        ratingCount: supplier.reviewCount?.toString() || '1'
      }
    }),

    // Certifications
    ...(supplier.certifications && supplier.certifications.length > 0 && {
      award: supplier.certifications.map(cert => ({
        '@type': 'Award',
        name: cert
      }))
    }),

    // Years of experience
    ...(supplier.yearsInBusiness && {
      foundingDate: new Date(Date.now() - supplier.yearsInBusiness * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }),

    // Products
    ...(supplier.productCount && {
      numberOfEmployees: supplier.productCount.toString() // Using as proxy for scale
    })
  };
};

// Generate Breadcrumb Schema
export const generateBreadcrumbSchema = (breadcrumbs, baseUrl = process.env.FRONTEND_URL || 'https://app.eximpoglobal.net') => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: (index + 1).toString(),
      name: item.name,
      item: `${baseUrl}${item.url}`
    }))
  };
};

// Generate FAQPage Schema
export const generateFAQSchema = (faqs) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
};

// Generate LocalBusiness Schema (for company info)
export const generateLocalBusinessSchema = (baseUrl = process.env.FRONTEND_URL || 'https://app.eximpoglobal.net') => {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Eximpo Global LLP',
    url: baseUrl,
    logo: 'https://sin1.contabostorage.com/265cb5518b244ea2bdb6eef9784e1983:eximpo-bucket/brand/eximpo-global-llp-logo.svg',
    description: 'Leading B2B marketplace connecting global buyers and suppliers for seamless international trade',
    
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'B2B Marketplace Platform',
      addressLocality: 'International',
      addressCountry: 'Global'
    },

    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@eximpo.com',
      availableLanguage: ['en']
    },

    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '1000+'
    }
  };
};

// Generate SEO metadata for products
export const generateProductMetadata = (product, supplierInfo) => {
  const baseDescription = product.description || `High-quality ${product.name}`;
  
  return {
    title: `${product.name} - MOQ ${product.moq} | ${supplierInfo?.name || 'Supplier'} | Eximpo Global`,
    description: `${baseDescription.substring(0, 120)}... Shop at best prices. MOQ: ${product.moq} units. Certified supplier. Request quote today.`,
    keywords: [
      product.name,
      product.category,
      `${product.category} supplier`,
      `buy ${product.name}`,
      `${product.category} wholesale`,
      `${product.name} manufacturer`,
      `${product.name} distributor`,
      supplierInfo?.name,
      `${supplierInfo?.name} ${product.name}`,
      `${product.category} ${product.origin}`,
      ...product.certifications.slice(0, 3)
    ].filter(Boolean),
    ogTitle: `${product.name} - Buy Wholesale from ${supplierInfo?.name || 'Verified Supplier'}`,
    ogDescription: `Premium quality ${product.name} at best prices. MOQ: ${product.moq} units. Free quote within 24 hours.`,
    ogType: 'product'
  };
};

// Generate category page metadata
export const generateCategoryMetadata = (category, productCount = 0) => {
  return {
    title: `${category} Suppliers & Manufacturers | B2B Wholesale | Eximpo Global`,
    description: `Find verified ${category} suppliers and manufacturers worldwide. Browse ${productCount}+ products, compare prices, and source directly from producers on Eximpo Global.`,
    keywords: [
      category,
      `${category} suppliers`,
      `${category} manufacturers`,
      `${category} wholesale`,
      `buy ${category}`,
      `${category} distributor`,
      'B2B marketplace',
      'wholesale suppliers'
    ],
    ogTitle: `${category} Suppliers & Manufacturers | Eximpo Global`,
    ogDescription: `Connect with verified ${category} suppliers. ${productCount}+ products available. Get quotes instantly.`,
    ogType: 'website'
  };
};

// Generate supplier/company page metadata
export const generateSupplierMetadata = (supplier, productCount = 0) => {
  return {
    title: `${supplier.name} - ${supplier.productCount || productCount} Products | Verified Supplier | Eximpo Global`,
    description: `${supplier.description?.substring(0, 120) || `Verified B2B supplier on Eximpo Global`}. Export ${supplier.productCount || productCount} products. ISO certified. ${supplier.reviewCount || 0}+ reviews.`,
    keywords: [
      supplier.name,
      `${supplier.name} supplier`,
      supplier.companyName,
      supplier.origin,
      'verified supplier',
      'export',
      'B2B',
      ...supplier.certifications?.slice(0, 3) || []
    ],
    ogTitle: `${supplier.name} - Verified B2B Supplier | Eximpo Global`,
    ogDescription: `${supplier.description?.substring(0, 100) || 'Browse products from this verified supplier'}. Rating: ${supplier.rating || 'N/A'}/5`,
    ogType: 'business.business'
  };
};

// URL slug generator for SEO-friendly URLs
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .slice(0, 70); // Limit to 70 characters
};

// Generate canonical URL
export const getCanonicalUrl = (path, baseUrl = process.env.FRONTEND_URL || 'https://app.eximpoglobal.net') => {
  return `${baseUrl}${path}`.replace(/\/$/, '') || baseUrl;
};

// Generate robots.txt rules
export const generateRobotsRules = () => {
  return `User-agent: *
Allow: /
Allow: /products/
Allow: /categories/
Allow: /suppliers/

Disallow: /admin/
Disallow: /api/
Disallow: /auth/
Disallow: /dashboard/
Disallow: /seller/
Disallow: /buyer/
Disallow: /cart/
Disallow: /*?*sort=
Disallow: /*?*filter=

# Specific crawl delay
Crawl-delay: 1

# Sitemap
Sitemap: ${process.env.FRONTEND_URL || 'https://app.eximpoglobal.net'}/sitemap.xml`;
};

export default {
  generateProductSchema,
  generateProductListSchema,
  generateSupplierSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateLocalBusinessSchema,
  generateProductMetadata,
  generateCategoryMetadata,
  generateSupplierMetadata,
  generateSlug,
  getCanonicalUrl,
  generateRobotsRules
};

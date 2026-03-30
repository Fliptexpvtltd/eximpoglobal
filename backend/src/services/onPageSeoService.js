/**
 * On-Page SEO Service
 * Generates optimized meta tags and SEO metadata for all page types
 */

/**
 * Home Page SEO
 */
export const getHomePageSEO = (baseUrl = process.env.FRONTEND_URL || 'https://app.eximpoglobal.net') => {
  return {
    title: 'Eximpo Global - B2B Wholesale Marketplace for Import & Export',
    description: 'Connect with verified suppliers worldwide. Buy wholesale products directly from manufacturers. Import and export goods with confidence on Eximpo Global.',
    keywords: 'B2B marketplace, wholesale, import export, suppliers, manufacturers, global trade',
    canonical: `${baseUrl}/`,
    ogTitle: 'Eximpo Global - Global B2B Marketplace',
    ogDescription: 'Connect with verified suppliers worldwide for import and export trade',
    ogImage: `${baseUrl}/images/og-home.jpg`,
    ogUrl: `${baseUrl}/`,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Eximpo Global - B2B Wholesale Marketplace',
    twitterDescription: 'Import and export products directly from verified suppliers',
    twitterImage: `${baseUrl}/images/twitter-home.jpg`,
    h1: 'Find Verified Suppliers - Global B2B Marketplace',
    h2s: [
      'Browse Thousands of Products',
      'Connect with Trusted Suppliers',
      'Secure Payment & Logistics',
      'Global Trade Made Simple'
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Eximpo Global',
      url: baseUrl,
      description: 'Connect with verified suppliers worldwide for B2B trade',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}/catalog?search={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    },
    robots: 'index, follow',
    viewport: 'width=device-width, initial-scale=1.0'
  };
};

/**
 * Catalog/Products Listing Page SEO
 */
export const getCatalogPageSEO = (category = null, page = 1, baseUrl = process.env.FRONTEND_URL || 'https://app.eximpoglobal.net') => {
  const categoryName = category ? ` - ${category.charAt(0).toUpperCase() + category.slice(1)}` : '';
  const categoryDesc = category ? ` in ${category}` : '';
  
  return {
    title: `Browse Products${categoryName} | Eximpo Global`,
    description: `Explore our wide selection of wholesale products${categoryDesc}. Connect directly with suppliers and get competitive wholesale prices.`,
    keywords: `wholesale ${category || 'products'}, buy bulk, suppliers, import export${categoryName}`,
    canonical: `${baseUrl}/catalog${category ? `?category=${category}` : ''}${page > 1 ? `&page=${page}` : ''}`,
    ogTitle: `Shop Wholesale Products${categoryName} | Eximpo Global`,
    ogDescription: `Browse and buy directly from verified suppliers${categoryDesc}`,
    ogImage: `${baseUrl}/images/og-catalog.jpg`,
    ogUrl: `${baseUrl}/catalog`,
    ogType: 'website',
    twitterCard: 'summary',
    twitterTitle: `Browse Products${categoryName}`,
    twitterDescription: `Shop wholesale${categoryDesc} from verified suppliers`,
    h1: `Shop Wholesale Products${categoryName}`,
    h2s: [
      'Filter by Category',
      'Compare Suppliers',
      'Request Quotes',
      'Secure Checkout'
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `Catalog${categoryName}`,
      url: `${baseUrl}/catalog`,
      description: `Wholesale products${categoryDesc}`,
      mainEntity: {
        '@type': 'ItemCollection',
        name: `Products${categoryName}`,
        url: `${baseUrl}/catalog`
      }
    },
    robots: page === 1 ? 'index, follow' : 'noindex, follow',
    viewport: 'width=device-width, initial-scale=1.0'
  };
};

/**
 * Product Detail Page SEO
 */
const toSlug = (name) => (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const getProductPageSEO = (product, supplier, baseUrl = process.env.FRONTEND_URL || 'https://app.eximpoglobal.net') => {
  const productUrl = `${baseUrl}/products/${toSlug(product.name)}/${product.id}`;
  const rating = product.averageRating || 0;
  const reviewCount = product.reviewCount || 0;

  return {
    title: `${product.name} | Buy Wholesale from ${supplier?.name || 'Verified Supplier'} | Eximpo Global`,
    description: `${product.name}. Price: ${product.currency} ${product.price}. MOQ: ${product.moq} units. Buy directly from ${supplier?.name}. ${product.description?.substring(0, 100)}...`,
    keywords: `${product.name}, wholesale ${product.name}, ${product.category}, bulk purchase, supplier`,
    canonical: productUrl,
    ogTitle: `${product.name} - Buy Wholesale`,
    ogDescription: `${product.name} at ${product.currency}${product.price}. MOQ: ${product.moq} units.`,
    ogImage: product.image || `${baseUrl}/images/og-product.jpg`,
    ogUrl: productUrl,
    ogType: 'product',
    twitterCard: 'product',
    twitterTitle: product.name,
    twitterDescription: `Buy wholesale ${product.name}`,
    twitterImage: product.image,
    h1: product.name,
    h2s: [
      'Product Details',
      'Pricing & MOQ',
      'Supplier Information',
      'Reviews & Ratings',
      'Specifications',
      'Shipping Information'
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.image,
      brand: {
        '@type': 'Brand',
        name: supplier?.name || 'Eximpo Supplier'
      },
      manufacturer: {
        '@type': 'Organization',
        name: supplier?.name
      },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: product.currency,
        lowPrice: product.price,
        highPrice: product.price,
        offerCount: 1,
        availability: 'https://schema.org/InStock'
      },
      aggregateRating: rating > 0 ? {
        '@type': 'AggregateRating',
        ratingValue: rating,
        reviewCount: reviewCount,
        bestRating: 5,
        worstRating: 1
      } : undefined,
      seller: {
        '@type': 'Organization',
        name: supplier?.name,
        url: `${baseUrl}/suppliers/${supplier?.id}`
      }
    },
    robots: 'index, follow',
    viewport: 'width=device-width, initial-scale=1.0'
  };
};

/**
 * Category Page SEO
 */
export const getCategoryPageSEO = (category, productCount = 0, baseUrl = process.env.FRONTEND_URL || 'https://app.eximpoglobal.net') => {
  const categoryUrl = `${baseUrl}/categories/${category.toLowerCase().replace(/\s+/g, '-')}`;

  return {
    title: `${category} - Wholesale Products | Eximpo Global`,
    description: `Browse ${productCount} wholesale ${category} products from verified suppliers. Get competitive prices and connect directly with manufacturers.`,
    keywords: `wholesale ${category}, ${category} suppliers, bulk ${category}, buy ${category}`,
    canonical: categoryUrl,
    ogTitle: `${category} - Wholesale Products`,
    ogDescription: `Find the best ${category} products at wholesale prices`,
    ogImage: `${baseUrl}/images/categories/${category.toLowerCase()}.jpg`,
    ogUrl: categoryUrl,
    ogType: 'website',
    twitterCard: 'summary',
    h1: `Wholesale ${category} Products`,
    h2s: [
      'Top Suppliers',
      'Popular Products',
      'Price Range',
      'Filter & Sort',
      'Bulk Options'
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${category} Products`,
      url: categoryUrl,
      description: `Wholesale ${category} products`,
      numberOfItems: productCount
    },
    robots: 'index, follow',
    viewport: 'width=device-width, initial-scale=1.0'
  };
};

/**
 * Supplier Profile Page SEO
 */
export const getSupplierPageSEO = (supplier, productCount = 0, baseUrl = process.env.FRONTEND_URL || 'https://app.eximpoglobal.net') => {
  const supplierUrl = `${baseUrl}/suppliers/${supplier.id}`;
  const rating = supplier.averageRating || 0;
  const reviewCount = supplier.reviewCount || 0;

  return {
    title: `${supplier.name} - Verified B2B Supplier | Eximpo Global`,
    description: `${supplier.name} - Selling ${productCount} wholesale products. Rating: ${rating}/5 (${reviewCount} reviews). Certifications: ${supplier.certifications?.join(', ') || 'Verified Supplier'}. Contact now for wholesale deals.`,
    keywords: `${supplier.name}, supplier, manufacturer, wholesaler, ${supplier.category || 'products'}`,
    canonical: supplierUrl,
    ogTitle: `${supplier.name} - Verified Supplier`,
    ogDescription: `Wholesale supplier with ${productCount} products and ${rating}/5 rating`,
    ogImage: supplier.logo || `${baseUrl}/images/og-supplier.jpg`,
    ogUrl: supplierUrl,
    ogType: 'business.business',
    twitterCard: 'summary',
    h1: `${supplier.name} - Verified Supplier Profile`,
    h2s: [
      'About Us',
      'Our Products',
      'Certifications',
      'Shipping Information',
      'Company Details',
      'Customer Reviews'
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: supplier.name,
      url: supplierUrl,
      logo: supplier.logo,
      description: supplier.description || `${supplier.name} - Verified B2B Supplier on Eximpo Global`,
      aggregateRating: rating > 0 ? {
        '@type': 'AggregateRating',
        ratingValue: rating,
        reviewCount: reviewCount,
        bestRating: 5,
        worstRating: 1
      } : undefined,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Sales',
        email: supplier.email,
        availableLanguage: ['en']
      },
      sameAs: supplier.socialLinks || []
    },
    robots: 'index, follow',
    viewport: 'width=device-width, initial-scale=1.0'
  };
};

/**
 * Buyer/Profile Page SEO
 */
export const getProfilePageSEO = (baseUrl = process.env.FRONTEND_URL || 'https://app.eximpoglobal.net') => {
  return {
    title: 'My Account - Profile Settings | Eximpo Global',
    description: 'Manage your Eximpo Global account, profile settings, company details, and preferences. View your purchase history and saved suppliers.',
    keywords: 'profile, account, settings, purchase history, saved suppliers',
    canonical: `${baseUrl}/profile`,
    robots: 'noindex, follow',
    viewport: 'width=device-width, initial-scale=1.0'
  };
};

/**
 * Authentication Pages SEO (Login, Register)
 */
export const getAuthPageSEO = (pageType = 'login', baseUrl = process.env.FRONTEND_URL || 'https://app.eximpoglobal.net') => {
  const isLogin = pageType === 'login';
  
  return {
    title: isLogin ? 'Sign In to Your Account | Eximpo Global' : 'Create Your Eximpo Global Account | Eximpo Global',
    description: isLogin 
      ? 'Sign in to access your Eximpo Global account, purchase history, and saved suppliers.' 
      : 'Create a free account on Eximpo Global to connect with verified suppliers and start buying wholesale.',
    keywords: isLogin ? 'login, sign in, account' : 'sign up, register, create account',
    canonical: `${baseUrl}/${pageType}`,
    robots: 'noindex, follow',
    viewport: 'width=device-width, initial-scale=1.0'
  };
};

/**
 * Help & FAQ Page SEO
 */
export const getHelpPageSEO = (baseUrl = process.env.FRONTEND_URL || 'https://app.eximpoglobal.net') => {
  return {
    title: 'Help Center & FAQ | Eximpo Global',
    description: 'Get answers to frequently asked questions about buying, suppliers, shipping, payments, and more. Find help with your Eximpo Global account.',
    keywords: 'help, FAQ, frequently asked questions, support, how to, buying guide',
    canonical: `${baseUrl}/help`,
    ogTitle: 'Help & Support - Eximpo Global',
    ogDescription: 'Find answers to your questions about B2B trading',
    ogUrl: `${baseUrl}/help`,
    h1: 'Help Center & Frequently Asked Questions',
    h2s: [
      'Getting Started',
      'Buying Guide',
      'Suppliers',
      'Payment & Billing',
      'Shipping & Delivery',
      'Account & Security',
      'Disputes & Returns'
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How do I find suppliers on Eximpo Global?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Use our catalog search to find suppliers by product category or company name.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is it safe to buy from suppliers on Eximpo Global?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'All our suppliers are verified and their profiles include certifications and customer reviews.'
          }
        }
      ]
    },
    robots: 'index, follow',
    viewport: 'width=device-width, initial-scale=1.0'
  };
};

/**
 * Contact Page SEO
 */
export const getContactPageSEO = (baseUrl = process.env.FRONTEND_URL || 'https://app.eximpoglobal.net') => {
  return {
    title: 'Contact Us - Get in Touch | Eximpo Global',
    description: 'Have questions? Contact our team at Eximpo Global. We\'re here to help with your import and export needs.',
    keywords: 'contact, support, customer service, email, phone',
    canonical: `${baseUrl}/contact`,
    ogTitle: 'Contact Eximpo Global',
    ogDescription: 'Get in touch with our support team',
    ogUrl: `${baseUrl}/contact`,
    h1: 'Contact Us',
    h2s: [
      'Get in Touch',
      'Contact Information',
      'Business Hours',
      'Send us a Message'
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact Eximpo Global'
    },
    robots: 'index, follow',
    viewport: 'width=device-width, initial-scale=1.0'
  };
};

/**
 * About Page SEO
 */
export const getAboutPageSEO = (baseUrl = process.env.FRONTEND_URL || 'https://app.eximpoglobal.net') => {
  return {
    title: 'About Eximpo Global - B2B Marketplace for Global Trade',
    description: 'Learn about Eximpo Global. We connect verified suppliers with buyers worldwide for seamless import and export trade. Our mission is to simplify global B2B commerce.',
    keywords: 'about us, company, B2B marketplace, global trade, mission, vision',
    canonical: `${baseUrl}/about`,
    ogTitle: 'About Eximpo Global',
    ogDescription: 'Connecting global B2B traders and suppliers',
    ogUrl: `${baseUrl}/about`,
    h1: 'About Eximpo Global',
    h2s: [
      'Our Mission',
      'Our Vision',
      'Our Story',
      'Why Choose Us',
      'Our Values',
      'Team'
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About Eximpo Global'
    },
    robots: 'index, follow',
    viewport: 'width=device-width, initial-scale=1.0'
  };
};

/**
 * How It Works Page SEO
 */
export const getHowItWorksPageSEO = (baseUrl = process.env.FRONTEND_URL || 'https://app.eximpoglobal.net') => {
  return {
    title: 'How It Works - Buy & Sell on Eximpo Global',
    description: 'Learn how to use Eximpo Global. Step-by-step guide to finding suppliers, requesting quotes, making payments, and receiving shipments.',
    keywords: 'how it works, guide, steps, buying process, supplier process',
    canonical: `${baseUrl}/how-it-works`,
    ogTitle: 'How Eximpo Global Works',
    ogDescription: 'Simple steps to start trading on our platform',
    ogUrl: `${baseUrl}/how-it-works`,
    h1: 'How Eximpo Global Works',
    h2s: [
      'For Buyers',
      'For Suppliers',
      'Step 1: Browse',
      'Step 2: Connect',
      'Step 3: Negotiate',
      'Step 4: Pay Securely',
      'Step 5: Ship & Receive'
    ],
    robots: 'index, follow',
    viewport: 'width=device-width, initial-scale=1.0'
  };
};

/**
 * Search Results Page SEO
 */
export const getSearchPageSEO = (searchQuery, resultCount = 0, baseUrl = process.env.FRONTEND_URL || 'https://app.eximpoglobal.net') => {
  return {
    title: `Search Results for "${searchQuery}" | Eximpo Global`,
    description: `Found ${resultCount} results for "${searchQuery}". Browse suppliers and products matching your search on Eximpo Global.`,
    keywords: `${searchQuery}, search results`,
    canonical: `${baseUrl}/search?q=${encodeURIComponent(searchQuery)}`,
    robots: 'noindex, follow',
    viewport: 'width=device-width, initial-scale=1.0'
  };
};

/**
 * Get SEO metadata for any page by type
 */
export const getPageSEO = (pageType, pageData = {}, baseUrl = process.env.FRONTEND_URL || 'https://app.eximpoglobal.net') => {
  switch (pageType) {
    case 'home':
      return getHomePageSEO(baseUrl);
    case 'catalog':
      return getCatalogPageSEO(pageData.category, pageData.page, baseUrl);
    case 'product':
      return getProductPageSEO(pageData.product, pageData.supplier, baseUrl);
    case 'category':
      return getCategoryPageSEO(pageData.category, pageData.productCount, baseUrl);
    case 'supplier':
      return getSupplierPageSEO(pageData.supplier, pageData.productCount, baseUrl);
    case 'profile':
      return getProfilePageSEO(baseUrl);
    case 'login':
    case 'register':
      return getAuthPageSEO(pageType, baseUrl);
    case 'help':
      return getHelpPageSEO(baseUrl);
    case 'contact':
      return getContactPageSEO(baseUrl);
    case 'about':
      return getAboutPageSEO(baseUrl);
    case 'how-it-works':
      return getHowItWorksPageSEO(baseUrl);
    case 'search':
      return getSearchPageSEO(pageData.query, pageData.resultCount, baseUrl);
    default:
      return getHomePageSEO(baseUrl);
  }
};

export default {
  getHomePageSEO,
  getCatalogPageSEO,
  getProductPageSEO,
  getCategoryPageSEO,
  getSupplierPageSEO,
  getProfilePageSEO,
  getAuthPageSEO,
  getHelpPageSEO,
  getContactPageSEO,
  getAboutPageSEO,
  getHowItWorksPageSEO,
  getSearchPageSEO,
  getPageSEO
};

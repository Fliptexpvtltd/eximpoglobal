/**
 * Frontend SEO Utilities
 * Helpers for SEO-friendly URLs, meta tags, and structured data
 */

// Generate SEO-friendly slug from text
export const generateSlug = (text: string, maxLength: number = 70): string => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')           // Remove special characters
    .replace(/[\s_]+/g, '-')             // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, '')             // Remove leading/trailing hyphens
    .replace(/-+/g, '-')                 // Replace multiple hyphens with single
    .slice(0, maxLength);                // Limit length
};

// Generate product URL
export const getProductUrl = (product: any): string => {
  if (!product) return '/products';
  
  // If product already has a slug, use it
  if (product.slug) {
    return `/products/${product.category}/${product.slug}`;
  }
  
  // Generate slug from name and specs
  const slug = generateSlug(`${product.name}-${product.category}`);
  return `/products/${product.category}/${slug}`;
};

// Get old format URL (for backwards compatibility)
export const getProductLegacyUrl = (productId: string): string => {
  return `/products/${productId}`;
};

// Generate category URL
export const getCategoryUrl = (category: string): string => {
  const slug = generateSlug(category);
  return `/categories/${slug}`;
};

// Generate supplier URL
export const getSupplierUrl = (supplierId: string, supplierName?: string): string => {
  if (supplierName) {
    const slug = generateSlug(supplierName);
    return `/suppliers/${supplierId}/${slug}`;
  }
  return `/suppliers/${supplierId}`;
};

// Fetch SEO metadata for a product
export const fetchProductSEO = async (productId: string, useSlug: boolean = false) => {
  try {
    const endpoint = useSlug 
      ? `/api/seo/product/${productId}`
      : `/api/seo/product/${productId}`;
    
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error('Failed to fetch SEO metadata');
    
    const data = await response.json();
    return data.data?.seo;
  } catch (error) {
    console.error('SEO fetch error:', error);
    return null;
  }
};

// Fetch category SEO metadata
export const fetchCategorySEO = async (category: string) => {
  try {
    const response = await fetch(`/api/seo/category/${encodeURIComponent(category)}`);
    if (!response.ok) throw new Error('Failed to fetch category SEO');
    
    const data = await response.json();
    return data.data?.seo;
  } catch (error) {
    console.error('Category SEO fetch error:', error);
    return null;
  }
};

// Fetch supplier SEO metadata
export const fetchSupplierSEO = async (supplierId: string) => {
  try {
    const response = await fetch(`/api/seo/supplier/${supplierId}`);
    if (!response.ok) throw new Error('Failed to fetch supplier SEO');
    
    const data = await response.json();
    return data.data?.seo;
  } catch (error) {
    console.error('Supplier SEO fetch error:', error);
    return null;
  }
};

// Generate breadcrumb schema
export const generateBreadcrumbs = (
  category?: string,
  productName?: string
): Array<{ name: string; url: string }> => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' }
  ];

  if (category) {
    breadcrumbs.push({
      name: category,
      url: getCategoryUrl(category)
    });
  }

  if (productName) {
    breadcrumbs.push({
      name: productName,
      url: '#' // Current page
    });
  }

  return breadcrumbs;
};

// Open Graph meta tags helper
export const getOpenGraphTags = (product: any) => {
  const baseImage = product.image || `${window.location.origin}/default-product.jpg`;
  
  return {
    'og:title': `${product.name} | Eximpo Global`,
    'og:description': product.description?.substring(0, 160) || `Buy ${product.name}`,
    'og:image': baseImage,
    'og:url': window.location.href,
    'og:type': 'product',
    'og:site_name': 'Eximpo Global'
  };
};

// Twitter Card tags helper
export const getTwitterCardTags = (product: any) => {
  return {
    'twitter:card': 'summary_large_image',
    'twitter:title': `${product.name} | Eximpo Global`,
    'twitter:description': product.description?.substring(0, 200) || `Buy ${product.name}`,
    'twitter:image': product.image || `${window.location.origin}/default-product.jpg`,
    'twitter:site': '@eximpoglobal'
  };
};

// Parse product data from URL
export const parseProductUrl = (pathname: string) => {
  // Pattern: /products/[category]/[slug]
  const match = pathname.match(/^\/products\/([^/]+)\/(.+)$/);
  
  if (match) {
    return {
      category: decodeURIComponent(match[1]),
      slug: decodeURIComponent(match[2])
    };
  }
  
  // Pattern: /products/[id] (legacy)
  const legacyMatch = pathname.match(/^\/products\/([a-f0-9\-]+)$/);
  if (legacyMatch) {
    return {
      id: legacyMatch[1],
      isLegacy: true
    };
  }
  
  return null;
};

// Parse category URL
export const parseCategoryUrl = (pathname: string) => {
  // Pattern: /categories/[slug]
  const match = pathname.match(/^\/categories\/(.+)$/);
  
  if (match) {
    return {
      slug: decodeURIComponent(match[1])
    };
  }
  
  return null;
};

// Parse supplier URL
export const parseSupplierUrl = (pathname: string) => {
  // Pattern: /suppliers/[id] or /suppliers/[id]/[slug]
  const match = pathname.match(/^\/suppliers\/([^/]+)(?:\/(.+))?$/);
  
  if (match) {
    return {
      id: match[1],
      slug: match[2] ? decodeURIComponent(match[2]) : undefined
    };
  }
  
  return null;
};

// Validate meta tag limits
export const validateMetaTags = (seoData: any) => {
  const issues = [];
  
  if (seoData.metadata?.title?.length > 60) {
    issues.push(`Title too long: ${seoData.metadata.title.length} chars (max 60)`);
  }
  
  if (seoData.metadata?.description?.length > 160) {
    issues.push(`Description too long: ${seoData.metadata.description.length} chars (max 160)`);
  }
  
  if (!seoData.structuredData) {
    issues.push('Missing structured data');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
};

// Create canonical URL
export const getCanonicalUrl = (path: string): string => {
  const baseUrl = process.env.REACT_APP_BASE_URL || 'https://eximpoglobal.net';
  return `${baseUrl}${path}`.replace(/\/$/, '') || baseUrl;
};

// SEO-friendly text truncation
export const truncateForMeta = (text: string, maxLength: number, suffix: string = '...'): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

// Extract keywords from text
export const extractKeywords = (text: string, count: number = 5): string[] => {
  if (!text) return [];
  
  // Remove common words
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'is', 'are', 'am', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
    'from', 'as', 'by', 'with', 'of', 'up', 'about', 'into', 'through', 'during'
  ]);
  
  const words = text
    .toLowerCase()
    .split(/[\s,]+/)
    .filter(word => word.length > 3 && !stopWords.has(word));
  
  // Count frequency
  const frequency = new Map<string, number>();
  words.forEach(word => {
    frequency.set(word, (frequency.get(word) || 0) + 1);
  });
  
  // Sort by frequency
  return Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([word]) => word);
};

// Generate meta description from content
export const generateMetaDescription = (content: string, maxLength: number = 160): string => {
  if (!content) return '';
  
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, '');
  
  // Truncate to first sentence or max length
  let description = text.split(/[.!?]/)[0].trim();
  
  if (description.length > maxLength) {
    description = description.substring(0, maxLength - 3) + '...';
  }
  
  return description;
};

// SEO score calculator (0-100)
export const calculateSEOScore = (seoData: any): { score: number; tips: string[] } => {
  let score = 0;
  const tips: string[] = [];
  
  // Title (max 20 points)
  if (seoData.metadata?.title) {
    const titleLength = seoData.metadata.title.length;
    if (titleLength >= 30 && titleLength <= 60) {
      score += 20;
    } else if (titleLength > 0) {
      score += 10;
      tips.push(`Title length ${titleLength} - aim for 30-60 characters`);
    }
  } else {
    tips.push('Add a title tag');
  }
  
  // Description (max 20 points)
  if (seoData.metadata?.description) {
    const descLength = seoData.metadata.description.length;
    if (descLength >= 120 && descLength <= 160) {
      score += 20;
    } else if (descLength > 0) {
      score += 10;
      tips.push(`Description length ${descLength} - aim for 120-160 characters`);
    }
  } else {
    tips.push('Add a meta description');
  }
  
  // Keywords (max 15 points)
  if (seoData.metadata?.keywords) {
    const keywordCount = seoData.metadata.keywords.split(',').length;
    if (keywordCount >= 3 && keywordCount <= 5) {
      score += 15;
    } else if (keywordCount > 0) {
      score += 8;
      tips.push(`${keywordCount} keywords - aim for 3-5`);
    }
  } else {
    tips.push('Define target keywords');
  }
  
  // Structured data (max 20 points)
  if (seoData.structuredData) {
    score += 20;
  } else {
    tips.push('Add JSON-LD structured data');
  }
  
  // Open Graph (max 15 points)
  if (seoData.openGraph?.title && seoData.openGraph?.image) {
    score += 15;
  } else if (seoData.openGraph) {
    score += 8;
    tips.push('Complete Open Graph tags for social sharing');
  } else {
    tips.push('Add Open Graph tags');
  }
  
  // Canonical URL (max 10 points)
  if (seoData.canonical) {
    score += 10;
  } else {
    tips.push('Add canonical URL');
  }
  
  return {
    score: Math.min(100, score),
    tips
  };
};

export default {
  generateSlug,
  getProductUrl,
  getCategoryUrl,
  getSupplierUrl,
  fetchProductSEO,
  fetchCategorySEO,
  fetchSupplierSEO,
  generateBreadcrumbs,
  parseProductUrl,
  parseCategoryUrl,
  parseSupplierUrl,
  validateMetaTags,
  getCanonicalUrl,
  truncateForMeta,
  extractKeywords,
  generateMetaDescription,
  calculateSEOScore
};

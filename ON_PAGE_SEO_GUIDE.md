# On-Page SEO Implementation Guide

## Overview

This guide covers implementing on-page SEO across all pages of the Eximpo Global platform. On-page SEO ensures that each page is optimized for search engines and users through proper meta tags, heading structure, image optimization, and semantic content.

## Architecture

### Backend Services

#### 1. **On-Page SEO Service** (`backend/src/services/onPageSeoService.js`)
Generates page-specific SEO metadata for all page types.

**Available Page Types:**
- `home` - Homepage
- `catalog` - Product listing/catalog
- `product` - Individual product details
- `category` - Product category pages
- `supplier` - Supplier profile pages
- `profile` - User account/profile
- `login` - Login page
- `register` - Registration page
- `help` - Help/FAQ page
- `contact` - Contact page
- `about` - About page
- `how-it-works` - How it works page
- `search` - Search results page

**Metadata Returned for Each Page:**
- `title` - Page title (30-60 chars recommended)
- `description` - Meta description (120-160 chars recommended)
- `keywords` - Target keywords
- `canonical` - Canonical URL
- `ogTitle` - Open Graph title
- `ogDescription` - Open Graph description
- `ogImage` - Open Graph image
- `ogUrl` - Open Graph URL
- `ogType` - Open Graph type (website, product, business.business, etc.)
- `twitterCard` - Twitter card type (summary, summary_large_image, product)
- `twitterTitle` - Twitter title
- `twitterDescription` - Twitter description
- `twitterImage` - Twitter image
- `robots` - Robots meta tag (index/noindex, follow/nofollow)
- `h1` - Primary heading (should appear once per page)
- `h2s` - Secondary headings (array)
- `structuredData` - JSON-LD structured data for search engines
- `viewport` - Viewport meta tag

### Frontend Components

#### 2. **PageSEO Component** (`frontend/src/components/PageSEO.tsx`)
React component for managing all meta tags and structured data.

**Main Components:**

##### `<PageSEO />`
Sets all meta tags and structured data dynamically.

```tsx
import { PageSEO } from '@/components/PageSEO';

function ProductPage() {
  const seoData = {
    title: "Product Name | Eximpo Global",
    description: "Product description...",
    ogImage: "product-image.jpg",
    // ... other metadata
  };

  return (
    <PageSEO seoData={seoData}>
      <div>Your page content</div>
    </PageSEO>
  );
}
```

##### `<SeoHeading />`
Semantic heading component with proper H1-H6 structure.

```tsx
import { SeoHeading } from '@/components/PageSEO';

<SeoHeading level={1}>Main Title</SeoHeading>
<SeoHeading level={2}>Subtitle</SeoHeading>
```

##### `<SeoImage />`
Image component with proper alt text and lazy loading.

```tsx
<SeoImage 
  src="image.jpg" 
  alt="Descriptive alt text for accessibility"
  title="Image title"
  lazy={true}
/>
```

##### `<SeoLink />`
Semantic link component for internal and external links.

```tsx
<SeoLink href="/products/123" title="View product">
  Product Name
</SeoLink>
```

##### `<SeoBreadcrumb />`
Breadcrumb navigation with schema markup.

```tsx
<SeoBreadcrumb items={[
  { name: 'Home', url: '/' },
  { name: 'Products', url: '/catalog' },
  { name: 'Current Product' }
]} />
```

##### `usePageSEO` Hook
Manage page SEO metadata dynamically.

```tsx
const { seoMetadata, updateSEO } = usePageSEO(initialData);

// Update SEO when data changes
useEffect(() => {
  updateSEO({ 
    title: `New Title | Eximpo Global`,
    description: "New description"
  });
}, [productData]);
```

## API Endpoints

### On-Page SEO Endpoints

#### 1. Get Page SEO Metadata
```
GET /api/seo/page/:pageType
Query Parameters:
  - pageType: home, catalog, product, category, supplier, profile, login, register, help, contact, about, how-it-works, search
  - productId: (for product page)
  - category: (for category or catalog page)
  - supplierId: (for supplier page)
  - query: (for search page)
  - page: (for pagination on catalog page)

Response:
{
  "success": true,
  "pageType": "product",
  "seoData": {
    "title": "Product Name | Eximpo Global",
    "description": "...",
    "keywords": "...",
    "canonical": "https://app.eximpoglobal.net/products/123",
    "ogTitle": "...",
    "ogDescription": "...",
    "ogImage": "...",
    "ogUrl": "...",
    "ogType": "product",
    "twitterCard": "product",
    "twitterTitle": "...",
    "twitterDescription": "...",
    "twitterImage": "...",
    "robots": "index, follow",
    "h1": "Product Name",
    "h2s": ["Details", "Specifications", "Reviews"],
    "structuredData": { ... },
    "viewport": "width=device-width, initial-scale=1.0"
  }
}
```

#### 2. Get Heading Structure
```
GET /api/seo/headings/:pageType
Query Parameters:
  - productId, category, supplierId (for specific pages)

Response:
{
  "success": true,
  "pageType": "product",
  "headings": {
    "h1": ["Product Name"],
    "h2": ["Details", "Specifications", "Reviews"],
    "h3": [],
    "structure": [
      { "level": 1, "text": "Product Name" },
      { "level": 2, "text": "Details" },
      { "level": 2, "text": "Specifications" }
    ]
  }
}
```

#### 3. Audit Page SEO
```
GET /api/seo/audit/:pageType
Query Parameters:
  - productId, category, supplierId (for specific pages)

Response:
{
  "success": true,
  "pageType": "product",
  "audit": {
    "score": 85,
    "maxScore": 100,
    "issues": [
      "Title is too short (min 30 characters)"
    ],
    "warnings": [
      "Consider adding more H2 tags"
    ],
    "success": [
      "✓ Description length is optimal",
      "✓ Canonical URL defined",
      "✓ Open Graph tags complete"
    ]
  }
}
```

## Implementation Checklist

### For Every Page

- [ ] Set page title (30-60 characters)
- [ ] Set meta description (120-160 characters)
- [ ] Set canonical URL
- [ ] Add H1 tag (exactly one per page)
- [ ] Add relevant H2 and H3 tags
- [ ] Include Open Graph tags
- [ ] Include Twitter Card tags
- [ ] Add structured data (JSON-LD)
- [ ] Set proper robots meta tag
- [ ] Add alt text to all images
- [ ] Use semantic HTML elements
- [ ] Add breadcrumb navigation

### Page-Specific Implementations

#### Homepage
```tsx
import { PageSEO } from '@/components/PageSEO';
import { getHomePageSEO } from '@/services/onPageSeoService';

export function HomePage() {
  const seoData = getHomePageSEO();
  
  return (
    <PageSEO seoData={seoData}>
      <SeoHeading level={1}>{seoData.h1}</SeoHeading>
      <p>{seoData.description}</p>
      {seoData.h2s.map(h2 => <SeoHeading level={2}>{h2}</SeoHeading>)}
    </PageSEO>
  );
}
```

#### Product Page
```tsx
import { PageSEO } from '@/components/PageSEO';
import { useEffect, useState } from 'react';

export function ProductPage({ productId }) {
  const [seoData, setSeoData] = useState(null);

  useEffect(() => {
    fetch(`/api/seo/page/product?productId=${productId}`)
      .then(res => res.json())
      .then(data => setSeoData(data.seoData));
  }, [productId]);

  if (!seoData) return <div>Loading...</div>;

  return (
    <PageSEO seoData={seoData}>
      <SeoHeading level={1}>{seoData.h1}</SeoHeading>
      {/* Product content */}
    </PageSEO>
  );
}
```

#### Category Page
```tsx
export function CategoryPage({ category }) {
  const [seoData, setSeoData] = useState(null);

  useEffect(() => {
    fetch(`/api/seo/page/category?category=${category}`)
      .then(res => res.json())
      .then(data => setSeoData(data.seoData));
  }, [category]);

  return (
    <PageSEO seoData={seoData}>
      <SeoHeading level={1}>{seoData.h1}</SeoHeading>
      {/* Category content */}
    </PageSEO>
  );
}
```

## On-Page SEO Best Practices

### Title Tags
- Keep 30-60 characters
- Include primary keyword near the beginning
- Include brand name
- Make it compelling for clicks
- **Example:** "Pure Cotton Fabric - Wholesale prices | Eximpo Global"

### Meta Descriptions
- Keep 120-160 characters
- Include primary keyword
- Include call-to-action
- Make it unique per page
- **Example:** "Buy pure cotton fabric at wholesale prices directly from verified suppliers. MOQ: 100 meters. Fast shipping to 180+ countries."

### Headings
- Use exactly one H1 per page
- Use H1 for the main topic
- Use H2s for main sections
- Use H3s for subsections
- Don't skip heading levels (no H1 to H3)
- Include keywords naturally

### Image Optimization
- Use descriptive alt text (50-125 chars)
- Include target keyword in first image
- Use descriptive filenames
- Optimize file size (< 200KB for web)
- Use modern formats (WebP with fallbacks)
- **Example alt text:** "Pure cotton fabric roll in white color, 100% organic cotton"

### Structured Data
- Implement Product schema for products
- Implement BreadcrumbList for navigation
- Implement Organization schema for company info
- Implement FAQPage for help sections
- Test with Google's Structured Data Testing Tool

### Internal Linking
- Link relevant pages with descriptive anchor text
- Use keyword-rich anchor text
- Maintain good internal link structure
- Avoid excessive internal links (< 100 per page)

### URL Structure
- Use descriptive, readable URLs
- Include primary keyword
- Use hyphens between words
- Avoid using dates (unless necessary)
- **Good:** `/products/pure-cotton-fabric`
- **Bad:** `/products/?id=123&cat=456`

## Testing & Validation

### SEO Audit
Use the audit endpoint to check SEO quality:

```bash
curl "http://localhost:5000/api/seo/audit/product?productId=123"
```

**Scoring:**
- 90-100: Excellent
- 70-89: Good
- 50-69: Fair
- < 50: Poor

### Tools
1. **Google Search Console** - Submit sitemaps, monitor indexing
2. **Google Pagespeed Insights** - Check Core Web Vitals
3. **Lighthouse** - Audit performance and SEO
4. **Structured Data Testing Tool** - Validate JSON-LD
5. **Meta Tags Preview** - Test social sharing appearance

## Common Issues & Solutions

### Issue: Duplicate Content
**Solution:** Set canonical URLs properly
```tsx
canonical: `${baseUrl}/products/${productId}`
```

### Issue: Missing Meta Descriptions
**Solution:** Always include descriptions in SEO data
```tsx
description: `${product.name}. ${product.description.substring(0, 100)}...`
```

### Issue: Poor Heading Structure
**Solution:** Use SeoHeading component consistently
```tsx
<SeoHeading level={1}>Main Title</SeoHeading>
<SeoHeading level={2}>Subheading</SeoHeading>
```

### Issue: Unoptimized Images
**Solution:** Use SeoImage component with alt text
```tsx
<SeoImage 
  src="product.jpg" 
  alt="Product name color size" 
/>
```

## Monitoring & Reporting

### Key Metrics
- Organic traffic from each page type
- Click-through rate (CTR) from search results
- Average position in search results
- Page indexation status
- Core Web Vitals scores

### Monthly Tasks
- [ ] Check indexation status in Search Console
- [ ] Monitor Core Web Vitals
- [ ] Review and update page titles if needed
- [ ] Check for crawl errors
- [ ] Analyze organic traffic trends

## Production Deployment

1. **Test all SEO endpoints** before production
2. **Submit sitemaps** to Google Search Console
3. **Verify structured data** with Google's tools
4. **Monitor Core Web Vitals** in real-time
5. **Setup Google Analytics** for organic traffic tracking
6. **Create SEO dashboard** for monitoring

## Example: Complete Product Page with SEO

```tsx
import { PageSEO, SeoHeading, SeoImage, SeoLink, SeoBreadcrumb } from '@/components/PageSEO';
import { useEffect, useState } from 'react';

export function ProductDetailPage({ productId }) {
  const [seoData, setSeoData] = useState(null);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fetch SEO data
    fetch(`/api/seo/page/product?productId=${productId}`)
      .then(r => r.json())
      .then(d => setSeoData(d.seoData));

    // Fetch product data
    fetch(`/api/products/${productId}`)
      .then(r => r.json())
      .then(d => setProduct(d));
  }, [productId]);

  if (!seoData || !product) return <div>Loading...</div>;

  return (
    <PageSEO seoData={seoData}>
      {/* Breadcrumbs */}
      <SeoBreadcrumb items={[
        { name: 'Home', url: '/' },
        { name: 'Products', url: '/catalog' },
        { name: product.category, url: `/catalog?category=${product.category}` },
        { name: product.name }
      ]} />

      {/* Main heading */}
      <SeoHeading level={1}>{product.name}</SeoHeading>

      {/* Product image */}
      <SeoImage 
        src={product.image}
        alt={`${product.name} - ${product.origin} wholesale`}
        title={product.name}
      />

      {/* Sections matching h2s */}
      {seoData.h2s.includes('Product Details') && (
        <section>
          <SeoHeading level={2}>Product Details</SeoHeading>
          <p>{product.description}</p>
        </section>
      )}

      {seoData.h2s.includes('Pricing & MOQ') && (
        <section>
          <SeoHeading level={2}>Pricing & MOQ</SeoHeading>
          <p>Price: {product.currency} {product.price}</p>
          <p>MOQ: {product.moq} units</p>
        </section>
      )}

      {/* More sections... */}
    </PageSEO>
  );
}
```

## Support

For questions or issues:
- Check the SEO Implementation Guide in the project docs
- Run the audit endpoint for specific page issues
- Review the seoUtils.ts for frontend utilities
- Test endpoints with the API documentation

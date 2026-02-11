# On-Page SEO Implementation Checklist

## Quick Reference

### Environment Setup
- [ ] Verify `FRONTEND_URL=https://app.eximpoglobal.net` in .env
- [ ] Test backend SEO endpoints are accessible
- [ ] Verify React dependencies are installed

### API Endpoints Available
```
Backend endpoints (all public, no auth required):

SEO Metadata:
GET /api/seo/page/:pageType?[productId|category|supplierId|query]
GET /api/seo/headings/:pageType?[relevant params]
GET /api/seo/audit/:pageType?[relevant params]

Structured Data & Feeds:
GET /api/seo/product/:id
GET /api/seo/category/:category
GET /api/seo/supplier/:supplierId
GET /api/seo/products-list
GET /api/seo/feeds/merchant.xml
GET /api/seo/feeds/merchant.csv
GET /api/seo/sitemap/index.xml
GET /api/seo/sitemap/products.xml
GET /api/seo/sitemap/categories.xml
GET /api/seo/sitemap/suppliers.xml
GET /api/seo/sitemap/static.xml
```

---

## Page-by-Page Checklist

### ✅ Homepage

**Meta Tags:**
- [ ] Title: "Eximpo Global - B2B Wholesale Marketplace for Import & Export"
- [ ] Description: "Connect with verified suppliers worldwide. Buy wholesale products..."
- [ ] Keywords: "B2B marketplace, wholesale, import export, suppliers..."
- [ ] Canonical: https://app.eximpoglobal.net/
- [ ] robots: "index, follow"

**Heading Structure:**
- [ ] H1: "Find Verified Suppliers - Global B2B Marketplace" (main page header)
- [ ] H2s: "Browse Thousands of Products", "Connect with Trusted Suppliers", "Secure Payment", "Global Trade Made Simple"
- [ ] No H3s needed unless adding sub-sections

**Social Sharing:**
- [ ] ogTitle: "Eximpo Global - Global B2B Marketplace"
- [ ] ogDescription: "Connect with verified suppliers worldwide..."
- [ ] ogImage: https://app.eximpoglobal.net/images/og-home.jpg
- [ ] ogType: "website"
- [ ] twitterCard: "summary_large_image"

**Structured Data:**
- [ ] WebSite schema with SearchAction
- [ ] Organization schema
- [ ] LocalBusiness schema (if applicable)

**Implementation:**
```tsx
import { PageSEO, SeoHeading } from '@/components/PageSEO';
import { getHomePageSEO } from '@/services/onPageSeoService';

export function HomePage() {
  const seoData = getHomePageSEO();
  
  return (
    <PageSEO seoData={seoData}>
      <SeoHeading level={1}>{seoData.h1}</SeoHeading>
      {/* Content for each H2 */}
    </PageSEO>
  );
}
```

**Test:** `curl http://localhost:5000/api/seo/page/home`

---

### ✅ Product Catalog/Listing

**Meta Tags:**
- [ ] Title: "Browse Products | Eximpo Global" (or with category)
- [ ] Description: "Explore wholesale products. Connect with suppliers..."
- [ ] Keywords: "wholesale products, bulk purchase, suppliers..."
- [ ] robots: "index, follow" (for page 1)
- [ ] robots: "noindex, follow" (for page 2+ pagination)

**Heading Structure:**
- [ ] H1: "Shop Wholesale Products" (+ category if applicable)
- [ ] H2s: "Filter by Category", "Compare Suppliers", "Request Quotes", "Secure Checkout"

**Features:**
- [ ] Pagination meta tags (canonical for page 1, noindex for page 2+)
- [ ] Search filter state in URL
- [ ] Product count displayed

**Structured Data:**
- [ ] CollectionPage schema
- [ ] ItemCollection schema

**Implementation:**
```tsx
export function CatalogPage({ category, page = 1 }) {
  const [seoData, setSeoData] = useState(null);

  useEffect(() => {
    fetch(`/api/seo/page/catalog?category=${category}&page=${page}`)
      .then(r => r.json())
      .then(d => setSeoData(d.seoData));
  }, [category, page]);

  return (
    <PageSEO seoData={seoData}>
      <SeoHeading level={1}>{seoData.h1}</SeoHeading>
      {/* Product listing */}
    </PageSEO>
  );
}
```

**Test:** `curl "http://localhost:5000/api/seo/page/catalog?category=Textiles&page=1"`

---

### ✅ Product Detail Page

**Meta Tags:**
- [ ] Title: "Product Name | Buy from Supplier | Eximpo Global" (55-58 chars)
- [ ] Description: "Product name, price, MOQ, supplier info..." (120-160 chars)
- [ ] Keywords: "product name, bulk, supplier, wholesale..."
- [ ] Canonical: https://app.eximpoglobal.net/products/[id]
- [ ] robots: "index, follow"

**Heading Structure:**
- [ ] H1: Product Name (exact product name)
- [ ] H2s: "Product Details", "Pricing & MOQ", "Supplier Info", "Reviews", "Specifications", "Shipping"

**Images:**
- [ ] Main product image with alt text: "Product Name - Color - Size"
- [ ] Additional images with descriptive alt texts
- [ ] Supplier logo with alt text

**Social Sharing:**
- [ ] ogTitle: "Product Name - Buy Wholesale"
- [ ] ogDescription: "Product price, MOQ, supplier info"
- [ ] ogImage: Product image URL
- [ ] ogType: "product"
- [ ] twitterCard: "product"

**Structured Data:**
- [ ] Product schema with pricing, ratings, availability
- [ ] AggregateRating schema (if reviews exist)
- [ ] Breadcrumb schema
- [ ] Organization schema (for supplier)

**Review Handling:**
- [ ] Review schema markup if exists
- [ ] aggregateRating with rating value and review count

**Links:**
- [ ] Link to supplier profile
- [ ] Link to category page
- [ ] Related products links

**Implementation:**
```tsx
export function ProductDetailPage({ productId }) {
  const [seoData, setSeoData] = useState(null);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/seo/page/product?productId=${productId}`).then(r => r.json()),
      fetch(`/api/products/${productId}`).then(r => r.json())
    ]).then(([seoRes, productRes]) => {
      setSeoData(seoRes.seoData);
      setProduct(productRes);
    });
  }, [productId]);

  return (
    <PageSEO seoData={seoData}>
      <SeoBreadcrumb items={[
        { name: 'Home', url: '/' },
        { name: 'Products', url: '/catalog' },
        { name: product?.category || '' },
        { name: product?.name || '' }
      ]} />
      <SeoHeading level={1}>{product?.name}</SeoHeading>
      <SeoImage src={product?.image} alt={product?.name} />
      {/* Detailed content */}
    </PageSEO>
  );
}
```

**Test:** `curl "http://localhost:5000/api/seo/page/product?productId=123"`

---

### ✅ Product Category Page

**Meta Tags:**
- [ ] Title: "Category Name - Wholesale Products | Eximpo Global"
- [ ] Description: "Browse X wholesale products in category..."
- [ ] Keywords: "category, wholesale, products..."
- [ ] robots: "index, follow"

**Heading Structure:**
- [ ] H1: "Wholesale Category Name Products"
- [ ] H2s: "Top Suppliers", "Popular Products", "Price Range", "Filter & Sort", "Bulk Options"

**Features:**
- [ ] Product count displayed
- [ ] Supplier filters
- [ ] Price range filters
- [ ] Sorting options

**Structured Data:**
- [ ] CollectionPage schema with numberOfItems
- [ ] Breadcrumb schema

**Implementation:**
```tsx
export function CategoryPage({ category }) {
  const [seoData, setSeoData] = useState(null);

  useEffect(() => {
    fetch(`/api/seo/page/category?category=${category}`)
      .then(r => r.json())
      .then(d => setSeoData(d.seoData));
  }, [category]);

  return (
    <PageSEO seoData={seoData}>
      <SeoHeading level={1}>{seoData.h1}</SeoHeading>
      {/* Category content */}
    </PageSEO>
  );
}
```

**Test:** `curl "http://localhost:5000/api/seo/page/category?category=Textiles"`

---

### ✅ Supplier Profile Page

**Meta Tags:**
- [ ] Title: "Supplier Name - Verified B2B Supplier | Eximpo Global"
- [ ] Description: "Supplier name, products count, rating, certifications..."
- [ ] Keywords: "supplier name, manufacturer, wholesaler..."
- [ ] robots: "index, follow"

**Heading Structure:**
- [ ] H1: "Supplier Name - Verified Supplier Profile"
- [ ] H2s: "About Us", "Our Products", "Certifications", "Shipping", "Company Details", "Reviews"

**Logo & Images:**
- [ ] Company logo with alt text
- [ ] Supplier images with alt text

**Social Sharing:**
- [ ] ogTitle: "Supplier Name - Verified Supplier"
- [ ] ogDescription: "Supplier info, products, rating..."
- [ ] ogImage: Company logo or banner
- [ ] ogType: "business.business"

**Structured Data:**
- [ ] Organization schema with contact info
- [ ] AggregateRating (if reviews exist)
- [ ] ContactPoint schema
- [ ] BreadcrumbList

**Trust Signals:**
- [ ] Certification badges
- [ ] Customer reviews section
- [ ] Verification badges
- [ ] Years in business
- [ ] Number of products

**Implementation:**
```tsx
export function SupplierProfilePage({ supplierId }) {
  const [seoData, setSeoData] = useState(null);
  const [supplier, setSupplier] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/seo/page/supplier?supplierId=${supplierId}`).then(r => r.json()),
      fetch(`/api/suppliers/${supplierId}`).then(r => r.json())
    ]).then(([seoRes, supplierRes]) => {
      setSeoData(seoRes.seoData);
      setSupplier(supplierRes);
    });
  }, [supplierId]);

  return (
    <PageSEO seoData={seoData}>
      <SeoHeading level={1}>{supplier?.name}</SeoHeading>
      {/* Supplier profile content */}
    </PageSEO>
  );
}
```

**Test:** `curl "http://localhost:5000/api/seo/page/supplier?supplierId=123"`

---

### ✅ Search Results Page

**Meta Tags:**
- [ ] Title: 'Search Results for "query" | Eximpo Global'
- [ ] Description: "Found X results for 'query'..."
- [ ] robots: "noindex, follow" (don't index search results)

**Features:**
- [ ] Query parameter in URL preserved
- [ ] Result count displayed
- [ ] Filters on left sidebar
- [ ] Pagination if many results

**Structured Data:**
- [ ] SearchResultsPage schema (optional)

**Implementation:**
```tsx
export function SearchPage({ query, page = 1 }) {
  const [seoData, setSeoData] = useState(null);

  useEffect(() => {
    fetch(`/api/seo/page/search?query=${query}&page=${page}`)
      .then(r => r.json())
      .then(d => setSeoData(d.seoData));
  }, [query, page]);

  return (
    <PageSEO seoData={seoData}>
      <SeoHeading level={1}>Search Results for "{query}"</SeoHeading>
      {/* Results */}
    </PageSEO>
  );
}
```

**Test:** `curl "http://localhost:5000/api/seo/page/search?query=cotton"`

---

### ✅ Help/FAQ Page

**Meta Tags:**
- [ ] Title: "Help Center & FAQ | Eximpo Global"
- [ ] Description: "Get answers to FAQs about buying, suppliers, shipping..."
- [ ] robots: "index, follow"

**Heading Structure:**
- [ ] H1: "Help Center & Frequently Asked Questions"
- [ ] H2s: "Getting Started", "Buying Guide", "Suppliers", "Payment", "Shipping", "Account", "Disputes"

**Structured Data:**
- [ ] FAQPage schema with multiple Question/Answer items
- [ ] Each FAQ item should have Question and Answer properties

**FAQ Format:**
```
Question: "How do I find suppliers?"
Answer: "Use the catalog search to find suppliers by category..."

Question: "Is it safe to buy from suppliers?"
Answer: "All suppliers are verified..."
```

**Implementation:**
```tsx
export function HelpPage() {
  const seoData = getHelpPageSEO();
  
  const faqs = [
    {
      question: "How do I find suppliers?",
      answer: "Use our catalog search..."
    },
    // More FAQs...
  ];

  return (
    <PageSEO seoData={seoData}>
      <SeoHeading level={1}>{seoData.h1}</SeoHeading>
      {seoData.h2s.map(h2 => <SeoHeading level={2}>{h2}</SeoHeading>)}
      {/* FAQ items */}
    </PageSEO>
  );
}
```

**Test:** `curl http://localhost:5000/api/seo/page/help`

---

### ✅ Contact Page

**Meta Tags:**
- [ ] Title: "Contact Us - Get in Touch | Eximpo Global"
- [ ] Description: "Contact our team. Questions about import/export?"
- [ ] robots: "index, follow"

**Heading Structure:**
- [ ] H1: "Contact Us"
- [ ] H2s: "Get in Touch", "Contact Information", "Business Hours", "Send Message"

**Structured Data:**
- [ ] ContactPage schema
- [ ] Organization schema with contact details

**Contact Information:**
- [ ] Email address
- [ ] Phone number(s)
- [ ] Physical address
- [ ] Business hours
- [ ] Contact form

**Implementation:**
```tsx
export function ContactPage() {
  const seoData = getContactPageSEO();
  
  return (
    <PageSEO seoData={seoData}>
      <SeoHeading level={1}>{seoData.h1}</SeoHeading>
      {/* Contact form and info */}
    </PageSEO>
  );
}
```

**Test:** `curl http://localhost:5000/api/seo/page/contact`

---

### ✅ About Page

**Meta Tags:**
- [ ] Title: "About Eximpo Global - B2B Marketplace"
- [ ] Description: "Learn about Eximpo Global. Connecting suppliers..."
- [ ] robots: "index, follow"

**Heading Structure:**
- [ ] H1: "About Eximpo Global"
- [ ] H2s: "Our Mission", "Our Vision", "Our Story", "Why Choose Us", "Our Values", "Team"

**Content Sections:**
- [ ] Company history
- [ ] Mission statement
- [ ] Vision statement
- [ ] Core values
- [ ] Team bios
- [ ] Company achievements

**Structured Data:**
- [ ] AboutPage schema
- [ ] Organization schema

**Implementation:**
```tsx
export function AboutPage() {
  const seoData = getAboutPageSEO();
  
  return (
    <PageSEO seoData={seoData}>
      <SeoHeading level={1}>{seoData.h1}</SeoHeading>
      {/* About content */}
    </PageSEO>
  );
}
```

**Test:** `curl http://localhost:5000/api/seo/page/about`

---

### ✅ How It Works Page

**Meta Tags:**
- [ ] Title: "How It Works - Buy & Sell on Eximpo Global"
- [ ] Description: "Step-by-step guide to buying and selling..."
- [ ] robots: "index, follow"

**Heading Structure:**
- [ ] H1: "How Eximpo Global Works"
- [ ] H2s: "For Buyers", "For Suppliers", "Step 1: Browse", "Step 2: Connect", "Step 3: Negotiate", "Step 4: Pay", "Step 5: Ship"

**Visual Elements:**
- [ ] Step-by-step diagrams
- [ ] Icons for each step
- [ ] Timeline or flowchart

**Structured Data:**
- [ ] HowTo schema with steps
- [ ] BreadcrumbList

**Implementation:**
```tsx
export function HowItWorksPage() {
  const seoData = getHowItWorksPageSEO();
  
  const steps = [
    { number: 1, title: "Browse", description: "..." },
    { number: 2, title: "Connect", description: "..." },
    // More steps...
  ];

  return (
    <PageSEO seoData={seoData}>
      <SeoHeading level={1}>{seoData.h1}</SeoHeading>
      {steps.map(step => (
        <div key={step.number}>
          <SeoHeading level={2}>{step.title}</SeoHeading>
          {/* Step content */}
        </div>
      ))}
    </PageSEO>
  );
}
```

**Test:** `curl http://localhost:5000/api/seo/page/how-it-works`

---

### ⚠️ Auth Pages (Login/Register)

**Meta Tags:**
- [ ] robots: "noindex, follow" (don't index auth pages)
- [ ] Proper title for each page
- [ ] Description

**Why noindex?**
- Search engines shouldn't crawl auth pages
- Prevents duplicate content issues
- Focuses crawl budget on public pages

**Implementation:**
```tsx
export function LoginPage() {
  const seoData = getAuthPageSEO('login');
  
  return (
    <PageSEO seoData={seoData}>
      {/* Login form */}
    </PageSEO>
  );
}
```

**Test:** `curl http://localhost:5000/api/seo/page/login`

---

### ⚠️ Profile/Account Pages

**Meta Tags:**
- [ ] robots: "noindex, follow" (user-specific, don't index)

**Reason:**
- User-specific content
- Not useful for search engines
- Reduces duplicate content

---

## Global Optimizations

### All Pages Should Have:
- [ ] Responsive viewport meta tag
- [ ] Charset: UTF-8
- [ ] Language meta tag (en-US)
- [ ] Proper favicon
- [ ] Mobile-friendly design
- [ ] Fast load times (Core Web Vitals)

### Images Across Site:
- [ ] All images should have descriptive alt text
- [ ] Image file names should be descriptive
- [ ] Images should be optimized (< 200KB each)
- [ ] Use modern formats (WebP with fallback)
- [ ] Lazy loading for below-the-fold images

### Internal Linking:
- [ ] Navigate between related pages
- [ ] Use descriptive anchor text
- [ ] Link depth not more than 3 clicks
- [ ] No broken links
- [ ] No redirect chains

### Mobile Optimization:
- [ ] Mobile-first design
- [ ] Touch-friendly buttons (48x48px minimum)
- [ ] Readable font sizes (16px minimum)
- [ ] Fast mobile performance
- [ ] No intrusive interstitials

---

## Testing Checklist

### Before Publishing

- [ ] Run SEO audit on all page types
  ```bash
  curl "http://localhost:5000/api/seo/audit/product?productId=123"
  curl "http://localhost:5000/api/seo/audit/catalog"
  curl "http://localhost:5000/api/seo/audit/home"
  ```

- [ ] Validate structured data
  - Use Google's Structured Data Testing Tool
  - Check for errors and warnings

- [ ] Check meta tags rendering
  - View page source
  - All meta tags should be in <head>

- [ ] Test social sharing
  - Use OG preview tools
  - Share links on Twitter/Facebook
  - Check image and title rendering

- [ ] Validate heading structure
  - One H1 per page
  - Proper hierarchy (no skipped levels)
  - Content under each heading

- [ ] Test breadcrumbs
  - Display correctly
  - Links work properly
  - Schema markup present

---

## Monitoring

### Weekly Tasks
- [ ] Check Google Search Console for crawl errors
- [ ] Monitor indexation status
- [ ] Check Core Web Vitals scores
- [ ] Review 404 errors

### Monthly Tasks
- [ ] Analyze organic traffic by page type
- [ ] Update high-traffic pages with fresh content
- [ ] Monitor search rankings for target keywords
- [ ] Update outdated content
- [ ] Add new products/suppliers to feeds

### Tools to Monitor
- Google Search Console (indexation, queries)
- Google Analytics (traffic, behavior)
- Google PageSpeed Insights (Core Web Vitals)
- Google Merchant Center (feed status)
- Rank tracking tools (rankings)

---

## Quick Reference: Meta Tag Lengths

| Tag | Min | Max | Optimal |
|-----|-----|-----|---------|
| Title | 30 | 60 | 50-58 |
| Description | 120 | 160 | 150-160 |
| Keywords | - | - | 3-5 keywords |
| Alt text | 20 | 125 | 50-75 |
| Slug length | - | 75 | 40-50 |
| H1 length | - | - | 10-65 chars |

---

## Common Issues & Fixes

**Issue:** Meta tags not updating
**Fix:** Check PageSEO component is wrapping page content, inspect <head> in browser DevTools

**Issue:** No structured data showing
**Fix:** Verify JSON-LD script is in <head>, check for JSON syntax errors

**Issue:** Images not loading
**Fix:** Check image paths, verify src attribute, check browser Network tab for 404s

**Issue:** Heading structure failing audit
**Fix:** Ensure only one H1 per page, don't skip levels (no H1 to H3), use SeoHeading component

**Issue:** Low SEO score
**Fix:** Run audit endpoint, check returned issues, compare with guide above

---

## Support & Resources

**Files Created:**
- Backend: `src/services/onPageSeoService.js`
- Backend: `src/controllers/seoController.js` (updated)
- Backend: `src/routes/seo.js` (updated)
- Frontend: `src/components/PageSEO.tsx`
- Frontend: `src/utils/seoUtils.ts`
- Docs: `ON_PAGE_SEO_GUIDE.md`
- Docs: `ON_PAGE_SEO_CHECKLIST.md` (this file)

**API Endpoints:**
- GET /api/seo/page/:pageType
- GET /api/seo/headings/:pageType
- GET /api/seo/audit/:pageType

**Questions?**
1. Check the ON_PAGE_SEO_GUIDE.md for detailed information
2. Run the audit endpoint for your page type
3. Verify endpoint response matches expected format
4. Check browser DevTools for meta tag rendering

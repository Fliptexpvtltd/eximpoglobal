# Product SEO & Structured Data Implementation Guide

## ✅ What Has Been Implemented

### 1. **Structured Data Generation**

We've created comprehensive JSON-LD schema generators for:

- **Product Schema** - Complete product information with pricing, availability, ratings, certifications
- **Product List Schema** - For category and product listing pages
- **Organization/Supplier Schema** - For supplier profile pages
- **Breadcrumb Schema** - For navigation trails
- **FAQ Schema** - For knowledge base pages
- **Local Business Schema** - For company information

### 2. **Backend Services**

Created three main SEO services:

#### **seoService.js**
```
Functions:
- generateProductSchema() - Creates detailed Product JSON-LD
- generateProductListSchema() - Creates ItemList for product collections
- generateSupplierSchema() - Creates Organization schema for suppliers
- generateBreadcrumbSchema() - Creates navigation breadcrumbs
- generateFAQSchema() - Creates FAQ structured data
- generateLocalBusinessSchema() - Creates business information
- generateProductMetadata() - SEO titles and descriptions
- generateCategoryMetadata() - Category page metadata
- generateSupplierMetadata() - Supplier page metadata
- generateSlug() - URL-friendly slugs
- getCanonicalUrl() - Canonical URL generation
- generateRobotsRules() - robots.txt content
```

#### **merchantFeedService.js**
```
Functions:
- generateMerchantFeed() - XML feed for Google Shopping
- generateMerchantCSV() - CSV format for bulk upload
- Maps product categories to Google Product Taxonomy
```

#### **sitemapService.js**
```
Functions:
- generateProductSitemap() - Product URLs for crawlers
- generateCategorySitemap() - Category page URLs
- generateSupplierSitemap() - Supplier profile URLs
- generateStaticSitemap() - Home, about, contact pages
- generateSitemapIndex() - Master sitemap index
```

### 3. **API Endpoints**

All SEO data is accessible via RESTful API:

#### **Product SEO Endpoints**
```
GET /api/seo/product/:id           - Product with metadata and structured data
GET /api/seo/category/:category    - Category metadata and schema
GET /api/seo/supplier/:supplierId  - Supplier metadata and schema
GET /api/seo/products-list         - All products with ItemList schema
```

#### **Feed Endpoints**
```
GET /api/seo/feeds/merchant.xml    - Google Merchant Center XML feed
GET /api/seo/feeds/merchant.csv    - Google Merchant Center CSV feed
```

#### **Sitemap Endpoints**
```
GET /api/seo/sitemap/index.xml     - Sitemap index
GET /api/seo/sitemap/products.xml  - Product sitemaps
GET /api/seo/sitemap/categories.xml - Category sitemaps
GET /api/seo/sitemap/suppliers.xml - Supplier sitemaps
GET /api/seo/sitemap/static.xml    - Static page sitemaps
```

### 4. **SEO Features Included**

#### **Metadata Generation**
- Optimized titles (60 chars) with primary keyword
- Meta descriptions (160 chars) with benefits, price, MOQ, CTA
- Keywords (primary, long-tail, category-based)
- Open Graph tags for social sharing
- Twitter Card tags

#### **Structured Data**
- Product pricing and MOQ information
- Supplier/manufacturer details
- Certifications and awards
- Aggregate ratings and reviews
- Stock availability
- Product categories
- Breadcrumb navigation

#### **Feed Support**
- Google Merchant Center XML format
- CSV format for bulk updates
- Automatic field mapping
- Google Product Category taxonomy

#### **Sitemap Support**
- Dynamic sitemaps for all content types
- Automatic lastmod timestamps
- Image URLs in product sitemap
- Priority and changefreq indicators

---

## 🚀 Implementation Steps

### Step 1: Update Your Database Schema (Optional)

Add these optional fields to products table for enhanced SEO:

```sql
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_title VARCHAR(60);
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_description VARCHAR(160);
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_keywords TEXT;

CREATE INDEX idx_products_slug ON products(slug);
```

### Step 2: Update Product Listing Pages

Add SEO metadata to product catalog:

```tsx
import { SEO } from './components/SEO';

function Catalog() {
  const [products, setProducts] = useState([]);
  const [seoData, setSeoData] = useState(null);

  useEffect(() => {
    // Fetch products with SEO data
    const response = await fetch('/api/seo/products-list');
    const data = await response.json();
    
    setSeoData({
      metadata: {
        title: 'Buy Products from Verified Suppliers | Eximpo Global',
        description: 'Browse 10,000+ products from verified suppliers worldwide...',
        keywords: 'buy products, wholesale suppliers, B2B marketplace'
      },
      structuredData: data.structuredData
    });
    
    setProducts(data.products);
  }, []);

  return (
    <>
      <SEO 
        title={seoData?.metadata?.title}
        description={seoData?.metadata?.description}
        keywords={seoData?.metadata?.keywords}
        structuredData={seoData?.structuredData}
      />
      {/* Catalog content */}
    </>
  );
}
```

### Step 3: Update Product Detail Pages

Enhanced product pages with SEO:

```tsx
import { SEO } from './components/SEO';

async function ProductDetail({ productId }) {
  const response = await fetch(`/api/seo/product/${productId}`);
  const { product, seo } = await response.json();

  return (
    <>
      <SEO 
        title={seo.metadata.title}
        description={seo.metadata.description}
        keywords={seo.metadata.keywords}
        ogType="product"
        ogImage={product.image}
        canonical={seo.canonical}
        structuredData={seo.structuredData}
      />
      <h1>{product.name}</h1>
      {/* Product details */}
    </>
  );
}
```

### Step 4: Add Sitemaps to robots.txt

```txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /auth/
Disallow: /dashboard/

Sitemap: https://eximpoglobal.net/api/seo/sitemap/index.xml
```

### Step 5: Submit to Google

1. **Google Search Console**: https://search.google.com/search-console
   - Add sitemap: `https://eximpoglobal.net/api/seo/sitemap/index.xml`
   - Check coverage and indexing

2. **Google Merchant Center**: https://merchantcenter.google.com
   - Add product feed: `https://eximpoglobal.net/api/seo/feeds/merchant.xml`
   - Map product attributes
   - Enable Google Shopping

3. **Google Business Profile**: https://business.google.com
   - Claim or create business listing
   - Add products through Merchant Center

---

## 📊 SEO Optimization Guidelines

### Title Tag Optimization

**Formula**: `[Product Name] - MOQ [Quantity] | [Supplier] | Eximpo Global`

**Examples**:
```
❌ Poor: "Cotton Fabric"
✅ Good: "Pure White 100% Cotton Fabric - MOQ 50kg | Premium Grade | Eximpo"
✅ Better: "Cotton Fabric Suppliers - 50kg MOQ | Premium Grade | Indian Exporters"
```

**Tips**:
- Keep under 60 characters
- Include primary keyword first
- Include MOQ or volume info
- Include brand/supplier name
- Include geographic location if relevant

### Meta Description Optimization

**Formula**: `[Product benefit]. [Key specs]. [Price/MOQ]. [CTA]. | Eximpo Global`

**Example**:
```
Pure cotton fabric for textiles. 100% organic, certified sustainable. 
MOQ 50kg at $8/kg. Free samples available. Get quote in 24 hours. | Eximpo
```

**Tips**:
- Keep under 160 characters
- Include unique value proposition
- Include main keywords naturally
- Include CTA (Request Quote, Contact, Shop Now)
- Include pricing or MOQ if space allows

### Keyword Strategy

**For Each Product, Target**:
1. **Primary Keyword**: `[Product Type]`
   - "Cotton Fabric"
   
2. **Long-tail Keywords**: `[Product] + [Attribute]`
   - "White cotton fabric"
   - "100% pure cotton fabric"
   - "Organic cotton fabric"

3. **Commercial Keywords**: `[Product] + Action`
   - "Buy cotton fabric"
   - "Cotton fabric supplier"
   - "Cotton fabric wholesale"

4. **Intent-based Keywords**: `[Product] + Intent`
   - "Best cotton fabric"
   - "Cheapest cotton fabric"
   - "Cotton fabric MOQ"

5. **Geographic Keywords**: `[Product] + Location`
   - "Cotton fabric from India"
   - "Chinese cotton supplier"
   - "Premium cotton fabric manufacturer"

---

## 🔧 Advanced Configuration

### Custom Product Schema

You can customize schema generation by editing `/api/product` before storing:

```javascript
const productSchema = generateProductSchema(product, supplier, baseUrl);

// Add custom properties
productSchema.customProperty = 'value';
productSchema.offers.offers[0].priceValidUntil = '2026-12-31';
```

### Multiple Sitemaps

For large catalogs (>50,000 products), split into multiple sitemaps:

```javascript
// In sitemapService.js
const productsPerSitemap = 50000;
const totalSitemaps = Math.ceil(products.length / productsPerSitemap);

for (let i = 0; i < totalSitemaps; i++) {
  const chunk = products.slice(i * productsPerSitemap, (i + 1) * productsPerSitemap);
  // Generate individual sitemap
}
```

### Automatic Feed Updates

Schedule automatic feed generation:

```javascript
// Update Google Merchant Center feed hourly
const schedule = require('node-schedule');

schedule.scheduleJob('0 * * * *', async () => {
  const feed = await generateMerchantFeed();
  // Upload to Google Merchant Center API
});
```

---

## 📈 Monitoring & Analytics

### Key Metrics to Track

1. **Organic Traffic**
   - Total organic sessions
   - Organic users by device
   - Bounce rate
   - Avg session duration

2. **Search Rankings**
   - Position for target keywords
   - Click-through rate (CTR) from SERPs
   - Impressions

3. **Indexation**
   - Total indexed pages
   - Coverage status
   - Crawl errors

4. **Structured Data**
   - Rich snippet coverage
   - Stars displayed in SERPs
   - Valid structured data count

### Google Search Console Setup

1. Add property: `https://eximpoglobal.net`
2. Verify ownership (DNS or HTML file)
3. Submit sitemaps
4. Monitor in:
   - Coverage report
   - Performance report
   - Rich results (structured data)
   - Mobile usability

### Google Analytics Events

Track these events:

```javascript
// Product view
gtag('event', 'view_item', {
  items: [{
    item_id: product.id,
    item_name: product.name,
    item_category: product.category,
    price: product.price,
    quantity: product.moq
  }]
});

// Request quote
gtag('event', 'begin_checkout', {
  items: [{
    item_id: product.id,
    item_name: product.name,
    price: product.price
  }]
});

// Contact supplier
gtag('event', 'view_promotion', {
  promotion_name: 'supplier_contact',
  promotion_id: supplier.id
});
```

---

## ⚠️ Common Issues & Solutions

### Issue: Products Not Appearing in Google

**Solutions**:
1. Ensure `approval_status = 'approved'` in database
2. Check robots.txt is not blocking products
3. Verify sitemap is valid XML
4. Check Google Search Console for errors

### Issue: Rich Snippets Not Showing

**Solutions**:
1. Validate JSON-LD with https://validator.schema.org
2. Ensure product has rating/price
3. Check structured data in Search Console
4. Wait 2-3 weeks for Google to process

### Issue: Category Pages Not Ranking

**Solutions**:
1. Create unique content for each category
2. Add internal links from products to category
3. Create category-specific FAQs
4. Build backlinks to category pages

---

## 🎯 Next Steps

1. **Test URLs**: Visit endpoints to verify data
2. **Set up Google Search Console**: Monitor indexation
3. **Submit Sitemaps**: Let Google crawl all content
4. **Monitor Analytics**: Track rankings and traffic
5. **Optimize Descriptions**: Refine based on data
6. **Build Content**: Add blogs to support rankings
7. **Monitor Competition**: Check competitor strategies

---

## 📚 Resources

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org)
- [Structured Data Testing Tool](https://validator.schema.org)
- [Search Console Help](https://support.google.com/webmasters)
- [Merchant Center Help](https://support.google.com/merchants)
- [Google Product Taxonomy](https://www.google.com/basepages/producttype/taxonomy.en-US.txt)

---

**Implementation Status**: ✅ Complete
**Ready for Production**: Yes
**Last Updated**: February 11, 2026

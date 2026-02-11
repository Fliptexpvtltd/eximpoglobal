# URL Structure Migration Guide

## Current vs. Recommended URL Structure

### Current (Not SEO-Friendly)
```
/products/:id
Example: /products/550e8400-e29b-41d4-a716-446655440000
```

### Recommended (SEO-Friendly)
```
/category/subcategory/product-name-and-specs
Example: /textiles/fabrics/pure-cotton-white-100-percent-fabric
```

---

## Migration Strategy

### Phase 1: Setup (Week 1)

#### 1.1 Add Slug Field to Database

```sql
-- Add slug column to products table
ALTER TABLE products ADD COLUMN slug VARCHAR(255) UNIQUE;

-- Create index for fast lookups
CREATE INDEX idx_products_slug ON products(slug);

-- Backfill existing products with slugs
UPDATE products SET slug = 
  LOWER(REGEXP_REPLACE(
    CONCAT(
      category, '/', 
      name, '-', 
      REPLACE(description, ' ', '-')
    ), '[^a-z0-9\-/]', '', 'g'
  ))
WHERE slug IS NULL;
```

#### 1.2 Update Routes to Support Both URLs

```javascript
// backend/src/routes/products.js

// Keep existing ID-based route (for backwards compatibility)
router.get('/:id', getProductById);

// Add new slug-based routes
router.get('/p/:slug', getProductBySlug);

// Catch all categories
router.get('/:category/:subcategory/:slug', getProductBySlug);
router.get('/:category/:slug', getProductBySlug);
```

#### 1.3 Update Frontend Links

```tsx
// Function to generate SEO-friendly URL
const getProductUrl = (product) => {
  const slug = generateSlug(`${product.name}-${product.category}`);
  return `/products/${product.category}/${slug}`;
};

// Use in links
<Link to={getProductUrl(product)}>
  {product.name}
</Link>
```

---

### Phase 2: Setup Redirects (Week 1-2)

#### 2.1 Server-Side Redirects

```javascript
// Redirect old URLs to new ones
app.get('/products/:id', async (req, res) => {
  const product = await query(
    'SELECT slug, category FROM products WHERE id = $1',
    [req.params.id]
  );
  
  if (product.rows.length > 0) {
    const { slug, category } = product.rows[0];
    return res.redirect(301, `/products/${category}/${slug}`);
  }
  
  res.status(404).json({ error: 'Not found' });
});
```

#### 2.2 Nginx Rewrite Rules

```nginx
# In nginx.conf
server {
  # Nginx will cache redirects efficiently
  location ~ ^/products/([a-f0-9\-]+)$ {
    # Match UUID pattern and redirect
    return 301 /api/redirect/$1;
  }
  
  # Use backend to look up slug
  location /api/redirect/ {
    proxy_pass http://backend;
  }
}
```

#### 2.3 Google Search Console

After redirects are in place:
1. Go to Google Search Console
2. Property Settings → Change of Address
3. Enter old and new URLs
4. Google automatically updates index

---

### Phase 3: Implementation (Week 2-3)

#### 3.1 Add Slug Generation Function

```javascript
// backend/src/utils/slugifier.js

export const generateProductSlug = (product) => {
  const parts = [
    product.category?.toLowerCase().replace(/\s+/g, '-'),
    generateSlug(`${product.name}-${product.certifications?.[0] || ''}`),
  ].filter(Boolean);
  
  return parts.join('/');
};

export const generateSlug = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')         // Remove special chars
    .replace(/[\s_]+/g, '-')           // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, '')           // Remove leading/trailing hyphens
    .replace(/-+/g, '-')               // Replace multiple hyphens with single
    .slice(0, 100);                    // Max 100 chars
};

// Usage
const product = { name: 'Pure Cotton Fabric', category: 'Textiles', certifications: ['ISO-9001'] };
const slug = generateProductSlug(product); 
// Result: textiles/pure-cotton-fabric-iso-9001
```

#### 3.2 Update Product Creation

```javascript
// backend/src/controllers/productController.js

export const createProduct = async (req, res) => {
  const { name, category, ...productData } = req.body;
  
  // Generate slug
  const slug = generateProductSlug({ name, category });
  
  // Check for duplicates
  const existing = await query(
    'SELECT id FROM products WHERE slug = $1',
    [slug]
  );
  
  if (existing.rows.length > 0) {
    // Add number suffix if duplicate
    const slug2 = `${slug}-${Date.now()}`;
    productData.slug = slug2;
  } else {
    productData.slug = slug;
  }
  
  // Create with slug
  const result = await query(
    'INSERT INTO products (name, category, slug, ...) VALUES (...) RETURNING *',
    [name, category, productData.slug, ...]
  );
  
  res.json({ success: true, data: result.rows[0] });
};
```

#### 3.3 Update Product Queries

```javascript
// Get by slug instead of ID
export const getProductBySlug = async (req, res) => {
  const { category, slug } = req.params;
  
  let query_text = 'SELECT * FROM products WHERE slug = $1';
  let params = [slug];
  
  // Optionally verify category
  if (category) {
    query_text += ' AND category = $2';
    params.push(category);
  }
  
  const result = await query(query_text, params);
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.json({
    success: true,
    data: result.rows[0]
  });
};
```

---

### Phase 4: Frontend Update (Week 3-4)

#### 4.1 Update Product Link Component

```tsx
// frontend/src/utils/productUrl.ts

export const getProductUrl = (product: Product): string => {
  if (product.slug) {
    // Use slug if available
    return `/products/${product.category}/${product.slug}`;
  }
  
  // Fallback to ID (for products without slug)
  return `/products/${product.id}`;
};

export const getProductPath = (category: string, slug: string): string => {
  return `/products/${category}/${slug}`;
};
```

#### 4.2 Update Links Throughout App

```tsx
// Before
<Link to={`/products/${product.id}`}>

// After  
<Link to={getProductUrl(product)}>

// In search results, category pages, etc.
```

#### 4.3 Update Product Detail Routes

```tsx
// frontend/src/App.tsx

// Old route
"product-detail": {
  view: ProductDetail,
  params: { id: string }
}

// New route
"product-detail": {
  view: ProductDetail,
  params: { 
    category?: string,
    slug?: string,
    id?: string  // For backwards compatibility
  }
}

// Handle both old and new
function ProductDetail({ id, slug, category }) {
  const [product, setProduct] = useState(null);
  
  useEffect(() => {
    if (slug) {
      // New URL format
      fetch(`/api/products/${category}/${slug}`)
    } else if (id) {
      // Old URL format
      fetch(`/api/products/${id}`)
    }
  }, [id, slug, category]);
}
```

---

### Phase 5: Monitoring (Week 4+)

#### 5.1 Check Redirect Success

```bash
# Test old URL redirects
curl -I https://eximpoglobal.net/products/550e8400-e29b-41d4-a716-446655440000
# Should return 301 redirect

# Test new URL works
curl -I https://eximpoglobal.net/products/textiles/pure-cotton-fabric
# Should return 200
```

#### 5.2 Monitor in Google Search Console

1. **Coverage** - Check for crawl errors
2. **URL Inspection** - Check each new URL is indexed
3. **Performance** - Monitor CTR changes
4. **Mobile Usability** - Check for issues

#### 5.3 Analytics Tracking

```javascript
// Track traffic by URL type
gtag('event', 'page_view', {
  page_location: window.location.href,
  page_path: window.location.pathname,
  url_type: window.location.pathname.includes('/products/') ? 'seo' : 'legacy'
});
```

---

## Example Migration Scenarios

### Scenario 1: Single Category Product

**Before**: `https://eximpoglobal.net/products/550e8400-e29b-41d4-a716-446655440000`

**After**: `https://eximpoglobal.net/products/textiles/pure-cotton-white-fabric-100-percent`

### Scenario 2: Multi-Level Category

**Before**: `https://eximpoglobal.net/products/a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6`

**After**: `https://eximpoglobal.net/products/machinery/motors/industrial-electric-motor-3hp-220v`

### Scenario 3: Supply-Side Search

**Before**: `https://eximpoglobal.net/products?category=Textiles&search=cotton`

**After**: `https://eximpoglobal.net/products/textiles?search=cotton`

---

## Rollback Plan

If issues occur:

### 1. Keep Old Routes Active
```javascript
// Don't delete the old route handler
router.get('/old/:id', getProductById);  // Keep this
router.get('/new/:slug', getProductBySlug);  // Add this
```

### 2. Verify Redirect Chain
```
Old URL → Redirect 301 → New URL → Content
Make sure there's no chain longer than 1 redirect
```

### 3. Check Search Console
Monitor crawl errors and coverage drops. If major issues:
- Disable new route
- Update GSC
- Wait for Google to re-crawl

---

## Testing Checklist

- [ ] Database slug field added
- [ ] Slug generation function works correctly
- [ ] Old URLs return 301 redirects
- [ ] New URLs return 200
- [ ] Products accessible by slug
- [ ] Category pages link to correct URLs
- [ ] Internal links updated
- [ ] Google Search Console updated
- [ ] Monitoring set up
- [ ] Analytics tracking new URLs
- [ ] Staging environment tested
- [ ] Production redirects verified

---

## Timeline

| Phase | Duration | Tasks |
|-------|----------|-------|
| Phase 1 | 1 week | Database setup, dual URL support |
| Phase 2 | 1 week | Implement redirects, submit to GSC |
| Phase 3 | 1 week | Complete implementation, backfill slugs |
| Phase 4 | 1 week | Frontend updates, test thoroughly |
| Phase 5 | 4+ weeks | Monitor and optimize |

**Total**: 4 weeks to full implementation + ongoing monitoring


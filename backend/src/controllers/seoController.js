/**
 * SEO Controller
 * Handles SEO-related endpoints and structured data generation
 */

import { query } from '../config/database.js';
import {
  generateProductSchema,
  generateProductListSchema,
  generateSupplierSchema,
  generateProductMetadata,
  generateCategoryMetadata,
  generateSupplierMetadata,
  getCanonicalUrl
} from '../services/seoService.js';
import { generateProductSitemap, generateCategorySitemap, generateSupplierSitemap, generateStaticSitemap, generateSitemapIndex } from '../services/sitemapService.js';
import { generateMerchantFeed, generateMerchantCSV } from '../services/merchantFeedService.js';
import { getPageSEO } from '../services/onPageSeoService.js';

const BASE_URL = process.env.FRONTEND_URL || 'https://app.eximpoglobal.net';

// Get product with SEO metadata and structured data
export const getProductSEO = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch product with supplier information
    const result = await query(
      `SELECT p.*, u.company_name as supplier_name, u.id as supplier_id, u.country, u.rating as supplier_rating
       FROM products p
       JOIN users u ON p.supplier_id = u.id
       WHERE p.id = $1 AND p.approval_status = 'approved'`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const product = result.rows[0];
    const supplierInfo = {
      id: product.supplier_id,
      name: product.supplier_name,
      origin: product.country,
      rating: product.supplier_rating
    };

    // Generate structured data
    const productSchema = generateProductSchema(product, supplierInfo, BASE_URL);
    const metadata = generateProductMetadata(product, supplierInfo);
    const breadcrumbs = [
      { name: 'Home', url: '/' },
      { name: 'Products', url: '/products' },
      { name: product.category, url: `/products?category=${product.category}` },
      { name: product.name, url: `/products/${id}` }
    ];

    res.json({
      success: true,
      data: {
        product,
        seo: {
          metadata,
          structuredData: productSchema,
          breadcrumbs,
          canonical: getCanonicalUrl(`/products/${id}`, BASE_URL),
          openGraph: {
            title: metadata.ogTitle,
            description: metadata.ogDescription,
            type: metadata.ogType,
            image: product.image || `${BASE_URL}/default-product.jpg`,
            url: getCanonicalUrl(`/products/${id}`, BASE_URL)
          }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching product SEO:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
};

// Get category page SEO metadata
export const getCategorySEO = async (req, res) => {
  try {
    const { category } = req.params;

    // Count products in category
    const countResult = await query(
      'SELECT COUNT(*) FROM products WHERE category = $1 AND approval_status = \'approved\'',
      [category]
    );

    const productCount = parseInt(countResult.rows[0].count);
    const metadata = generateCategoryMetadata(category, productCount);
    const breadcrumbs = [
      { name: 'Home', url: '/' },
      { name: 'Products', url: '/products' },
      { name: category, url: `/products?category=${category}` }
    ];

    res.json({
      success: true,
      data: {
        category,
        productCount,
        seo: {
          metadata,
          breadcrumbs,
          canonical: getCanonicalUrl(`/categories/${category.toLowerCase().replace(/\s+/g, '-')}`, BASE_URL),
          openGraph: {
            title: metadata.ogTitle,
            description: metadata.ogDescription,
            type: metadata.ogType,
            url: getCanonicalUrl(`/categories/${category.toLowerCase().replace(/\s+/g, '-')}`, BASE_URL)
          }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching category SEO:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch category metadata' });
  }
};

// Get supplier page SEO metadata
export const getSupplierSEO = async (req, res) => {
  try {
    const { supplierId } = req.params;

    // Fetch supplier information
    const supplierResult = await query(
      `SELECT u.*, COUNT(p.id) as product_count
       FROM users u
       LEFT JOIN products p ON u.id = p.supplier_id
       WHERE u.id = $1 AND u.role = 'seller'
       GROUP BY u.id`,
      [supplierId]
    );

    if (supplierResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    const supplier = supplierResult.rows[0];
    const metadata = generateSupplierMetadata(supplier, parseInt(supplier.product_count));
    const breadcrumbs = [
      { name: 'Home', url: '/' },
      { name: 'Suppliers', url: '/suppliers' },
      { name: supplier.company_name || supplier.full_name, url: `/suppliers/${supplierId}` }
    ];

    res.json({
      success: true,
      data: {
        supplier,
        seo: {
          metadata,
          breadcrumbs,
          canonical: getCanonicalUrl(`/suppliers/${supplierId}`, BASE_URL),
          openGraph: {
            title: metadata.ogTitle,
            description: metadata.ogDescription,
            type: metadata.ogType,
            image: supplier.logo || `${BASE_URL}/default-logo.png`,
            url: getCanonicalUrl(`/suppliers/${supplierId}`, BASE_URL)
          }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching supplier SEO:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch supplier metadata' });
  }
};

// Generate product list with structured data
export const getProductsList = async (req, res) => {
  try {
    const { category, limit = 100 } = req.query;

    let queryText = `
      SELECT p.* FROM products p
      WHERE p.approval_status = 'approved' AND p.available = true
    `;
    const params = [];

    if (category) {
      queryText += ` AND p.category = $1`;
      params.push(category);
    }

    queryText += ` LIMIT $${params.length + 1}`;
    params.push(parseInt(limit));

    const result = await query(queryText, params);
    const schema = generateProductListSchema(result.rows, BASE_URL);

    res.json({
      success: true,
      data: {
        products: result.rows,
        structuredData: schema,
        count: result.rows.length
      }
    });
  } catch (error) {
    console.error('Error fetching products list:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products list' });
  }
};

// Generate Google Merchant Center feed
export const getMerchantFeed = async (req, res) => {
  try {
    const result = await query(
      `SELECT p.* FROM products p
       WHERE p.approval_status = 'approved' AND p.available = true
       LIMIT 1000`
    );

    const feedXML = generateMerchantFeed(result.rows, BASE_URL);

    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.set('Content-Disposition', 'attachment; filename="google-merchant-feed.xml"');
    res.send(feedXML);
  } catch (error) {
    console.error('Error generating merchant feed:', error);
    res.status(500).json({ success: false, message: 'Failed to generate merchant feed' });
  }
};

// Generate Google Merchant Center CSV feed
export const getMerchantCSV = async (req, res) => {
  try {
    const result = await query(
      `SELECT p.* FROM products p
       WHERE p.approval_status = 'approved' AND p.available = true
       LIMIT 1000`
    );

    const csvContent = generateMerchantCSV(result.rows, BASE_URL);

    res.set('Content-Type', 'text/csv; charset=utf-8');
    res.set('Content-Disposition', 'attachment; filename="google-merchant-feed.csv"');
    res.send(csvContent);
  } catch (error) {
    console.error('Error generating merchant CSV:', error);
    res.status(500).json({ success: false, message: 'Failed to generate CSV' });
  }
};

// Generate product sitemap
export const getProductSitemap = async (req, res) => {
  try {
    const result = await query(
      `SELECT id, name, images, updated_at, created_at FROM products
       WHERE approval_status = $1 AND available = $2
       ORDER BY updated_at DESC
       LIMIT 50000`,
      ['approved', true]
    );

    // Process products to extract first image
    const products = result.rows.map(product => ({
      ...product,
      image: Array.isArray(product.images) && product.images[0] ? product.images[0] : null
    }));

    const sitemapXML = generateProductSitemap(products, BASE_URL);

    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.send(sitemapXML);
  } catch (error) {
    console.error('Error generating product sitemap:', error);
    res.status(500).json({ success: false, message: 'Failed to generate product sitemap' });
  }
};

// Generate category sitemap
export const getCategorySitemap = async (req, res) => {
  try {
    const result = await query(
      `SELECT DISTINCT category FROM products
       WHERE approval_status = $1 AND available = $2
       ORDER BY category`,
      ['approved', true]
    );

    const categories = result.rows.map((row, index) => ({
      name: row.category,
      index
    }));

    const sitemapXML = generateCategorySitemap(categories, BASE_URL);

    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.send(sitemapXML);
  } catch (error) {
    console.error('Error generating category sitemap:', error);
    res.status(500).json({ success: false, message: 'Failed to generate category sitemap' });
  }
};

// Generate supplier sitemap
export const getSupplierSitemap = async (req, res) => {
  try {
    const result = await query(
      `SELECT u.id, u.updated_at, u.created_at FROM users u
       WHERE u.role = $1
       ORDER BY u.updated_at DESC
       LIMIT 10000`,
      ['seller']
    );

    const sitemapXML = generateSupplierSitemap(result.rows, BASE_URL);

    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.send(sitemapXML);
  } catch (error) {
    console.error('Error generating supplier sitemap:', error);
    res.status(500).json({ success: false, message: 'Failed to generate supplier sitemap' });
  }
};

// Generate master sitemap index
export const getSitemapIndex = async (req, res) => {
  try {
    const sitemapUrls = [
      `${BASE_URL}/api/seo/sitemap/products.xml`,
      `${BASE_URL}/api/seo/sitemap/categories.xml`,
      `${BASE_URL}/api/seo/sitemap/suppliers.xml`,
      `${BASE_URL}/api/seo/sitemap/static.xml`
    ];

    const sitemapIndexXML = generateSitemapIndex(sitemapUrls, BASE_URL);

    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.send(sitemapIndexXML);
  } catch (error) {
    console.error('Error generating sitemap index:', error);
    res.status(500).json({ success: false, message: 'Failed to generate sitemap index' });
  }
};

// Generate static pages sitemap
export const getStaticSitemap = async (req, res) => {
  try {
    const sitemapXML = generateStaticSitemap(BASE_URL);

    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.send(sitemapXML);
  } catch (error) {
    console.error('Error generating static sitemap:', error);
    res.status(500).json({ success: false, message: 'Failed to generate static sitemap' });
  }
};

// Get on-page SEO metadata for any page
export const getPageSEOMetadata = async (req, res) => {
  try {
    const { pageType } = req.params;
    const { category, page, productId, supplierId, query: searchQuery } = req.query;

    let seoData = {};

    // Fetch data based on page type
    if (pageType === 'product' && productId) {
      const result = await query(
        `SELECT p.*, u.company_name as supplier_name, u.id as supplier_id, u.country
         FROM products p
         JOIN users u ON p.supplier_id = u.id
         WHERE p.id = $1 AND p.approval_status = 'approved'`,
        [productId]
      );

      if (result.rows.length > 0) {
        const product = result.rows[0];
        seoData = getPageSEO('product', {
          product,
          supplier: {
            id: product.supplier_id,
            name: product.supplier_name,
            country: product.country
          }
        }, BASE_URL);
      }
    } else if (pageType === 'category' && category) {
      const countResult = await query(
        'SELECT COUNT(*) as count FROM products WHERE category = $1 AND approval_status = $2',
        [category, 'approved']
      );

      seoData = getPageSEO('category', {
        category,
        productCount: countResult.rows[0]?.count || 0
      }, BASE_URL);
    } else if (pageType === 'supplier' && supplierId) {
      const result = await query(
        `SELECT id, company_name, description, logo, average_rating, review_count,
                certifications, email FROM users WHERE id = $1 AND user_type = 'supplier'`,
        [supplierId]
      );

      if (result.rows.length > 0) {
        const supplier = result.rows[0];
        const productCountResult = await query(
          'SELECT COUNT(*) as count FROM products WHERE supplier_id = $1 AND approval_status = $2',
          [supplierId, 'approved']
        );

        seoData = getPageSEO('supplier', {
          supplier: {
            id: supplier.id,
            name: supplier.company_name,
            description: supplier.description,
            logo: supplier.logo,
            averageRating: supplier.average_rating,
            reviewCount: supplier.review_count,
            certifications: supplier.certifications,
            email: supplier.email
          },
          productCount: productCountResult.rows[0]?.count || 0
        }, BASE_URL);
      }
    } else if (pageType === 'catalog') {
      seoData = getPageSEO('catalog', {
        category,
        page: parseInt(page) || 1
      }, BASE_URL);
    } else if (pageType === 'search' && searchQuery) {
      const result = await query(
        `SELECT COUNT(*) as count FROM products 
         WHERE (name ILIKE $1 OR description ILIKE $1) AND approval_status = 'approved'`,
        [`%${searchQuery}%`]
      );

      seoData = getPageSEO('search', {
        query: searchQuery,
        resultCount: result.rows[0]?.count || 0
      }, BASE_URL);
    } else {
      // Get default page SEO
      seoData = getPageSEO(pageType, {}, BASE_URL);
    }

    res.json({
      success: true,
      pageType,
      seoData
    });
  } catch (error) {
    console.error('Error getting page SEO metadata:', error);
    res.status(500).json({ success: false, message: 'Failed to get SEO metadata' });
  }
};

// Get heading structure recommendations for a page
export const getHeadingStructure = async (req, res) => {
  try {
    const { pageType } = req.params;
    const { category, productId, supplierId } = req.query;

    let headings = {
      h1: [],
      h2: [],
      h3: [],
      structure: []
    };

    // Get heading recommendations based on page type
    const seoData = await (async () => {
      if (pageType === 'product' && productId) {
        const result = await query(
          `SELECT p.name, p.category, p.description FROM products p WHERE p.id = $1`,
          [productId]
        );
        return result.rows[0] ? getPageSEO('product', { product: result.rows[0] }, BASE_URL) : {};
      } else if (pageType === 'category' && category) {
        return getPageSEO('category', { category }, BASE_URL);
      } else {
        return getPageSEO(pageType, {}, BASE_URL);
      }
    })();

    if (seoData.h1) {
      headings.h1.push(seoData.h1);
      headings.structure.push({ level: 1, text: seoData.h1 });
    }

    if (seoData.h2s && Array.isArray(seoData.h2s)) {
      headings.h2 = seoData.h2s;
      seoData.h2s.forEach(h2 => {
        headings.structure.push({ level: 2, text: h2 });
      });
    }

    res.json({
      success: true,
      pageType,
      headings
    });
  } catch (error) {
    console.error('Error getting heading structure:', error);
    res.status(500).json({ success: false, message: 'Failed to get heading structure' });
  }
};

// SEO Audit endpoint - Check on-page SEO quality
export const auditPageSEO = async (req, res) => {
  try {
    const { pageType } = req.params;
    const { productId, category, supplierId } = req.query;

    let seoData = {};
    let audit = {
      score: 0,
      maxScore: 100,
      issues: [],
      warnings: [],
      success: []
    };

    // Get SEO data
    if (pageType === 'product' && productId) {
      const result = await query(
        `SELECT p.*, u.company_name as supplier_name FROM products p
         JOIN users u ON p.supplier_id = u.id WHERE p.id = $1`,
        [productId]
      );
      if (result.rows[0]) {
        seoData = getPageSEO('product', { product: result.rows[0], supplier: { name: result.rows[0].supplier_name } }, BASE_URL);
      }
    } else {
      seoData = getPageSEO(pageType, {}, BASE_URL);
    }

    // Audit checks
    let points = 0;
    const maxPoints = 100;

    // Title check (25 points)
    if (seoData.title) {
      if (seoData.title.length >= 30 && seoData.title.length <= 60) {
        points += 25;
        audit.success.push('✓ Title length is optimal (30-60 characters)');
      } else if (seoData.title.length < 30) {
        audit.issues.push('Title is too short (min 30 characters)');
      } else {
        audit.warnings.push('Title is too long (max 60 characters)');
        points += 15;
      }
    } else {
      audit.issues.push('Missing page title');
    }

    // Description check (25 points)
    if (seoData.description) {
      if (seoData.description.length >= 120 && seoData.description.length <= 160) {
        points += 25;
        audit.success.push('✓ Description length is optimal (120-160 characters)');
      } else if (seoData.description.length < 120) {
        audit.warnings.push('Description is too short (min 120 characters)');
        points += 15;
      } else {
        audit.warnings.push('Description is too long (max 160 characters)');
        points += 15;
      }
    } else {
      audit.issues.push('Missing meta description');
    }

    // H1 check (20 points)
    if (seoData.h1) {
      points += 20;
      audit.success.push('✓ H1 tag present');
    } else {
      audit.issues.push('Missing H1 tag');
    }

    // H2s check (10 points)
    if (seoData.h2s && seoData.h2s.length > 0) {
      points += 10;
      audit.success.push(`✓ ${seoData.h2s.length} H2 tags present`);
    } else {
      audit.warnings.push('Consider adding H2 tags for better structure');
    }

    // Keywords check (10 points)
    if (seoData.keywords) {
      points += 10;
      audit.success.push('✓ Keywords defined');
    } else {
      audit.warnings.push('Consider adding keywords for better SEO');
    }

    // Canonical URL check (5 points)
    if (seoData.canonical) {
      points += 5;
      audit.success.push('✓ Canonical URL defined');
    } else {
      audit.warnings.push('Consider adding canonical URL');
    }

    // Open Graph check (5 points)
    if (seoData.ogTitle && seoData.ogDescription && seoData.ogImage) {
      points += 5;
      audit.success.push('✓ Open Graph tags complete');
    } else {
      audit.warnings.push('Complete Open Graph tags for better social sharing');
    }

    audit.score = Math.round((points / maxPoints) * 100);

    res.json({
      success: true,
      pageType,
      audit
    });
  } catch (error) {
    console.error('Error auditing page SEO:', error);
    res.status(500).json({ success: false, message: 'Failed to audit page SEO' });
  }
};

export default {
  getProductSEO,
  getCategorySEO,
  getSupplierSEO,
  getProductsList,
  getMerchantFeed,
  getMerchantCSV,
  getProductSitemap,
  getCategorySitemap,
  getSupplierSitemap,
  getSitemapIndex,
  getStaticSitemap,
  getPageSEOMetadata,
  getHeadingStructure,
  auditPageSEO
};

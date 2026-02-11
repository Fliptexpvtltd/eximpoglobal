/**
 * SEO Routes
 * Handles all SEO-related endpoints including sitemaps, feeds, and structured data
 */

import express from 'express';
import {
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
} from '../controllers/seoController.js';

const router = express.Router();

// Product SEO endpoints
router.get('/product/:id', getProductSEO);
router.get('/category/:category', getCategorySEO);
router.get('/supplier/:supplierId', getSupplierSEO);
router.get('/products-list', getProductsList);

// Google Merchant Center feeds
router.get('/feeds/merchant.xml', getMerchantFeed);
router.get('/feeds/merchant.csv', getMerchantCSV);

// Sitemaps
router.get('/sitemap/index.xml', getSitemapIndex);
router.get('/sitemap/products.xml', getProductSitemap);
router.get('/sitemap/categories.xml', getCategorySitemap);
router.get('/sitemap/suppliers.xml', getSupplierSitemap);
router.get('/sitemap/static.xml', getStaticSitemap);

// On-page SEO endpoints
router.get('/page/:pageType', getPageSEOMetadata);
router.get('/headings/:pageType', getHeadingStructure);
router.get('/audit/:pageType', auditPageSEO);

export default router;

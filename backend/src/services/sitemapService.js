/**
 * Sitemap Generator Service
 * Generates XML sitemaps for SEO
 */

export const generateProductSitemap = (products, baseUrl = process.env.FRONTEND_URL || 'https://app.eximpoglobal.net') => {
  const toSlug = (name) => (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

  const urls = products.map(product => {
    return `
  <url>
    <loc>${baseUrl}/products/${toSlug(product.name)}/${product.id}</loc>
    <lastmod>${product.updatedAt || product.createdAt || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    ${product.image ? `<image:image><image:loc>${escapeXML(product.image)}</image:loc><image:title>${escapeXML(product.name)}</image:title></image:image>` : ''}
  </url>`;
  }).join('');

  const xmlFooter = '\n</urlset>';
  
  return xmlHeader + urls + xmlFooter;
};

export const generateCategorySitemap = (categories, baseUrl = process.env.FRONTEND_URL || 'https://app.eximpoglobal.net') => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  const urls = categories.map(category => {
    const slug = generateSlug(category.name);
    return `
  <url>
    <loc>${baseUrl}/categories/${slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }).join('');

  const xmlFooter = '\n</urlset>';
  
  return xmlHeader + urls + xmlFooter;
};

export const generateSupplierSitemap = (suppliers, baseUrl = process.env.FRONTEND_URL || 'https://app.eximpoglobal.net') => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  const urls = suppliers.map(supplier => {
    return `
  <url>
    <loc>${baseUrl}/suppliers/${supplier.id}</loc>
    <lastmod>${supplier.updatedAt || supplier.createdAt || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }).join('');

  const xmlFooter = '\n</urlset>';
  
  return xmlHeader + urls + xmlFooter;
};

export const generateStaticSitemap = (baseUrl = process.env.FRONTEND_URL || 'https://app.eximpoglobal.net') => {
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/catalog', priority: '0.9', changefreq: 'daily' },
    { url: '/sellers', priority: '0.8', changefreq: 'weekly' },
    { url: '/how-it-works', priority: '0.6', changefreq: 'monthly' },
    { url: '/about', priority: '0.6', changefreq: 'yearly' },
    { url: '/contact', priority: '0.6', changefreq: 'yearly' },
    { url: '/help', priority: '0.5', changefreq: 'monthly' },
    { url: '/blog', priority: '0.7', changefreq: 'weekly' }
  ];

  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  const urls = staticPages.map(page => {
    return `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }).join('');

  const xmlFooter = '\n</urlset>';
  
  return xmlHeader + urls + xmlFooter;
};

// Master sitemap index
export const generateSitemapIndex = (sitemapUrls, baseUrl = process.env.FRONTEND_URL || 'https://app.eximpoglobal.net') => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  const sitemaps = sitemapUrls.map(sitemapUrl => {
    return `
  <sitemap>
    <loc>${sitemapUrl}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`;
  }).join('');

  const xmlFooter = '\n</sitemapindex>';
  
  return xmlHeader + sitemaps + xmlFooter;
};

// URL slug generator
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 70);
};

// Escape XML special characters
const escapeXML = (str) => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

export default {
  generateProductSitemap,
  generateCategorySitemap,
  generateSupplierSitemap,
  generateStaticSitemap,
  generateSitemapIndex
};

/**
 * Google Merchant Center Feed Generator
 * Generates XML feed for Google Shopping integration
 */

export const generateMerchantFeed = (products, baseUrl = process.env.FRONTEND_URL || 'https://app.eximpoglobal.net') => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n<channel>\n';
  const channelInfo = `
  <title>Eximpo Global - B2B Marketplace Products</title>
  <link>${baseUrl}</link>
  <description>Buy wholesale products from verified suppliers on Eximpo Global B2B Marketplace</description>
  <language>en</language>
`;

  const items = products.map(product => {
    return `
  <item>
    <g:id>${product.id}</g:id>
    <title>${escapeXML(product.name)}</title>
    <description>${escapeXML(product.description || `High-quality ${product.name}`)}</description>
    <link>${baseUrl}/products/${product.id}</link>
    <g:image_link>${escapeXML(product.image || `${baseUrl}/default-product.jpg`)}</g:image_link>
    <g:price>${product.price} ${product.currency || 'USD'}</g:price>
    <g:availability>in_stock</g:availability>
    <g:brand>${escapeXML(product.brand || product.supplierName || 'Eximpo')}</g:brand>
    <g:product_type>${escapeXML(product.category)}</g:product_type>
    <g:google_product_category>${getGoogleProductCategory(product.category)}</g:google_product_category>
    ${product.moq ? `<g:unit_pricing_measure>${product.moq} units</g:unit_pricing_measure>` : ''}
    ${product.certifications && product.certifications.length > 0 ? `<g:condition>${product.certifications.join(', ')}</g:condition>` : '<g:condition>new</g:condition>'}
    <g:availability_date>${new Date().toISOString().split('T')[0]}</g:availability_date>
    ${product.hsCode ? `<g:sku>${product.hsCode}</g:sku>` : ''}
  </item>`;
  }).join('');

  const xmlFooter = '\n</channel>\n</rss>';
  
  return xmlHeader + channelInfo + items + xmlFooter;
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

// Map product categories to Google Product Categories
const getGoogleProductCategory = (category) => {
  const categoryMap = {
    'textiles': '5321',
    'machinery': '5764',
    'chemicals': '5381',
    'electronics': '5387',
    'metals': '5383',
    'food': '5499',
    'agriculture': '5192',
    'automotive': '5309',
    'cosmetics': '5393',
    'fashion': '5417',
    'furniture': '5467',
    'hardware': '5489',
    'packaging': '5527',
    'plastics': '5541',
    'rubber': '5597'
  };

  const normalizedCategory = category?.toLowerCase() || 'general';
  return categoryMap[normalizedCategory] || '5001'; // 5001 is general category
};

// CSV format for Google Merchant Center
export const generateMerchantCSV = (products, baseUrl = process.env.FRONTEND_URL || 'https://app.eximpoglobal.net') => {
  const headers = [
    'id',
    'title',
    'description',
    'link',
    'image_link',
    'price',
    'availability',
    'brand',
    'product_type',
    'google_product_category',
    'sku',
    'moq',
    'certifications',
    'shipping',
    'rating'
  ];

  const rows = products.map(product => [
    product.id,
    product.name,
    product.description || `High-quality ${product.name}`,
    `${baseUrl}/products/${product.id}`,
    product.image || `${baseUrl}/default-product.jpg`,
    `${product.price} ${product.currency || 'USD'}`,
    'in_stock',
    product.brand || product.supplierName || 'Eximpo',
    product.category,
    getGoogleProductCategory(product.category),
    product.hsCode || '',
    product.moq || '',
    product.certifications?.join(';') || '',
    'Variable',
    product.supplierRating || 'N/A'
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
};

export default {
  generateMerchantFeed,
  generateMerchantCSV
};

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy - needed when behind Nginx reverse proxy
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Import routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import rfqRoutes from './routes/rfqs.js';
import adminRoutes from './routes/admin.js';
import quoteRoutes from './routes/quotes.js';
import orderRoutes from './routes/orders.js';
import shipmentRoutes from './routes/shipments.js';
import supplierRoutes from './routes/suppliers.js';
import analyticsRoutes from './routes/analytics.js';
import uploadRoutes from './routes/uploads.js';

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/rfqs', rfqRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/uploads', uploadRoutes);

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Eximpo API v1.0',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      products: '/api/products/*',
      rfqs: '/api/rfqs/*',
      quotes: '/api/quotes/*',
      orders: '/api/orders/*',
      shipments: '/api/shipments/*',
      suppliers: '/api/suppliers/*',
      analytics: '/api/analytics/*',
      uploads: '/api/uploads/*'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API docs: http://localhost:${PORT}/api`);
});

export default app;

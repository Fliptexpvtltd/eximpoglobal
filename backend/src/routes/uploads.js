import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { createUploadMiddleware, getFileUrl, deleteFromStorage, testStorageConnection } from '../config/storage.js';

const router = express.Router();

// Test endpoint (for development)
router.get('/test-connection', async (req, res) => {
  try {
    const result = await testStorageConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Upload product images (multiple files)
router.post('/products/images',
  authMiddleware,
  createUploadMiddleware('image', 'images', 5),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }

      const uploadedFiles = req.files.map(file => ({
        url: file.location,
        key: file.key,
        size: file.size,
        mimetype: file.mimetype,
        originalname: file.originalname
      }));

      res.json({
        success: true,
        message: `${uploadedFiles.length} file(s) uploaded successfully`,
        files: uploadedFiles
      });
    } catch (error) {
      console.error('Product image upload error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to upload images'
      });
    }
  }
);

// Upload single product image
router.post('/products/image',
  authMiddleware,
  createUploadMiddleware('image', 'image', 1),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      res.json({
        success: true,
        message: 'Image uploaded successfully',
        file: {
          url: req.file.location,
          key: req.file.key,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      });
    } catch (error) {
      console.error('Image upload error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to upload image'
      });
    }
  }
);

// Upload RFQ documents
router.post('/rfqs/documents',
  authMiddleware,
  createUploadMiddleware('document', 'documents', 3),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }

      const uploadedFiles = req.files.map(file => ({
        url: file.location,
        key: file.key,
        name: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      }));

      res.json({
        success: true,
        message: `${uploadedFiles.length} document(s) uploaded successfully`,
        files: uploadedFiles
      });
    } catch (error) {
      console.error('Document upload error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to upload documents'
      });
    }
  }
);

// Upload certificates
router.post('/certificates',
  authMiddleware,
  createUploadMiddleware('certificate', 'certificates', 5),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }

      const uploadedFiles = req.files.map(file => ({
        url: file.location,
        key: file.key,
        name: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      }));

      res.json({
        success: true,
        message: `${uploadedFiles.length} certificate(s) uploaded successfully`,
        files: uploadedFiles
      });
    } catch (error) {
      console.error('Certificate upload error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to upload certificates'
      });
    }
  }
);

// Upload company logo
router.post('/company/logo',
  authMiddleware,
  createUploadMiddleware('image', 'logo', 1),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      res.json({
        success: true,
        message: 'Logo uploaded successfully',
        file: {
          url: req.file.location,
          key: req.file.key,
          size: req.file.size
        }
      });
    } catch (error) {
      console.error('Logo upload error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to upload logo'
      });
    }
  }
);

// Delete file
router.delete('/delete',
  authMiddleware,
  async (req, res) => {
    try {
      const { fileKey } = req.body;

      if (!fileKey) {
        return res.status(400).json({
          success: false,
          message: 'File key is required'
        });
      }

      await deleteFromStorage(fileKey);

      res.json({
        success: true,
        message: 'File deleted successfully'
      });
    } catch (error) {
      console.error('Delete file error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete file'
      });
    }
  }
);

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size exceeds limit'
    });
  }

  if (error.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      message: 'Too many files'
    });
  }

  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Unexpected field name'
    });
  }

  res.status(500).json({
    success: false,
    message: error.message || 'Upload failed'
  });
});

export default router;

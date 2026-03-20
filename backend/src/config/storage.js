import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import mime from 'mime-types';

// Configure AWS SDK to use proper endpoint
AWS.config.update({
  accessKeyId: process.env.CONTABO_ACCESS_KEY || '98d59d8c643a4403a2dc26a27b37b922',
  secretAccessKey: process.env.CONTABO_SECRET_KEY || 'DFFRGjxnKy1qygDs7W5iobjqMmyq11lZ',
  region: 'us-east-1', // Use standard region for S3-compatible storage
  s3ForcePathStyle: true,
  signatureVersion: 'v4'
});

// Configure Contabo Object Storage (S3-compatible)
const s3 = new AWS.S3({
  endpoint: process.env.CONTABO_ENDPOINT || 'https://sin1.contabostorage.com',
  accessKeyId: process.env.CONTABO_ACCESS_KEY || '98d59d8c643a4403a2dc26a27b37b922',
  secretAccessKey: process.env.CONTABO_SECRET_KEY || 'DFFRGjxnKy1qygDs7W5iobjqMmyq11lZ',
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
  sslEnabled: true,
  s3BucketEndpoint: false,
  // Fix for XML parsing error with Contabo
  s3DisableBodySigning: true,
  computeChecksums: false
});

// Use just the base bucket name for S3 operations
const BASE_BUCKET = process.env.CONTABO_BUCKET || 'iestorage';
const BUCKET_NAME = BASE_BUCKET;
const ACCESS_KEY = process.env.CONTABO_ACCESS_KEY || '98d59d8c643a4403a2dc26a27b37b922';

// File size limits (in bytes)
const FILE_SIZE_LIMITS = {
  image: 5 * 1024 * 1024, // 5MB
  document: 10 * 1024 * 1024, // 10MB
  default: 5 * 1024 * 1024 // 5MB
};

// Allowed file types
const ALLOWED_FILE_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
  ],
  certificate: ['application/pdf', 'image/jpeg', 'image/png']
};

// Generate unique filename
const generateFileName = (originalname) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = path.extname(originalname);
  const name = path.basename(originalname, ext).replace(/[^a-zA-Z0-9]/g, '-');
  return `${name}-${timestamp}-${random}${ext}`;
};

// File filter function
const fileFilter = (allowedTypes) => (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

// Create multer upload middleware for different file types
export const createUploadMiddleware = (type = 'image', fieldName = 'file', maxCount = 1) => {
  const allowedTypes = ALLOWED_FILE_TYPES[type] || ALLOWED_FILE_TYPES.image;
  const sizeLimit = FILE_SIZE_LIMITS[type] || FILE_SIZE_LIMITS.default;

  const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: BUCKET_NAME,
      metadata: (req, file, cb) => {
        cb(null, {
          fieldName: file.fieldname,
          originalName: file.originalname,
          uploadedBy: req.user?.id || 'anonymous',
          uploadedAt: new Date().toISOString()
        });
      },
      key: (req, file, cb) => {
        const folder = type === 'image' ? 'products' : 
                      type === 'document' ? 'documents' :
                      type === 'certificate' ? 'certificates' : 'uploads';
        const filename = generateFileName(file.originalname);
        cb(null, `${folder}/${filename}`);
      },
      contentType: multerS3.AUTO_CONTENT_TYPE
    }),
    fileFilter: fileFilter(allowedTypes),
    limits: {
      fileSize: sizeLimit,
      files: maxCount
    }
  });

  if (maxCount === 1) {
    return upload.single(fieldName);
  } else {
    return upload.array(fieldName, maxCount);
  }
};

// Upload directly to storage (for programmatic uploads)
export const uploadToStorage = async (buffer, filename, contentType, folder = 'uploads') => {
  try {
    const key = `${folder}/${generateFileName(filename)}`;
    
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      Metadata: {
        uploadedAt: new Date().toISOString()
      }
    };

    const result = await s3.upload(params).promise();
    
    return {
      success: true,
      url: result.Location,
      key: result.Key,
      bucket: result.Bucket
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

// Delete file from storage
export const deleteFromStorage = async (fileKey) => {
  try {
    await s3.deleteObject({
      Bucket: BUCKET_NAME,
      Key: fileKey
    }).promise();
    
    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

// Delete multiple files
export const deleteMultipleFromStorage = async (fileKeys) => {
  try {
    if (!fileKeys || fileKeys.length === 0) {
      return { success: true, deleted: 0 };
    }

    const objects = fileKeys.map(key => ({ Key: key }));
    
    await s3.deleteObjects({
      Bucket: BUCKET_NAME,
      Delete: { Objects: objects }
    }).promise();
    
    return { success: true, deleted: fileKeys.length };
  } catch (error) {
    console.error('Batch delete error:', error);
    throw new Error(`Failed to delete files: ${error.message}`);
  }
};

// Get file URL
export const getFileUrl = (fileKey) => {
  if (!fileKey) return null;
  
  // If it's already a full URL, return it
  if (fileKey.startsWith('http')) return fileKey;
  
  // Use standard S3-compatible URL format for Contabo
  return `https://sin1.contabostorage.com/${BUCKET_NAME}/${fileKey}`;
};

// Get signed URL for temporary access (optional, for private files)
export const getSignedUrl = (fileKey, expiresIn = 3600) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Expires: expiresIn
    };
    
    return s3.getSignedUrl('getObject', params);
  } catch (error) {
    console.error('Signed URL error:', error);
    return null;
  }
};

// Check if storage is configured
export const isStorageConfigured = () => {
  return !!(
    process.env.CONTABO_ACCESS_KEY &&
    process.env.CONTABO_SECRET_KEY &&
    process.env.CONTABO_BUCKET
  );
};

// Test storage connection
export const testStorageConnection = async () => {
  try {
    // Test by listing objects (headBucket might not work with Contabo)
    await s3.listObjectsV2({ 
      Bucket: BUCKET_NAME,
      MaxKeys: 1 
    }).promise();
    
    return { 
      success: true, 
      message: 'Storage connected successfully',
      bucket: BUCKET_NAME,
      endpoint: process.env.CONTABO_ENDPOINT
    };
  } catch (error) {
    console.error('Storage connection error:', error);
    return { 
      success: false, 
      message: `Storage connection failed: ${error.message || error.code || 'Unknown error'}`,
      details: error.code
    };
  }
};

export default {
  s3,
  BUCKET_NAME,
  createUploadMiddleware,
  uploadToStorage,
  deleteFromStorage,
  deleteMultipleFromStorage,
  getFileUrl,
  getSignedUrl,
  isStorageConfigured,
  testStorageConnection
};

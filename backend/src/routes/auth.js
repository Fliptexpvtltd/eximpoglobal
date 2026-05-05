import express from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController.js';
import { checkEmail } from '../controllers/emailCheckController.js';
import { googleSignIn, completeGoogleRegistration } from '../controllers/googleAuthController.js';
import { appleSignIn, completeAppleRegistration } from '../controllers/appleAuthController.js';
import { requestPasswordReset, resetPassword, verifyOTP } from '../controllers/passwordResetController.js';
import { 
  getUserStats, 
  getCompanyDetails, 
  updateCompanyDetails,
  getUserPreferences,
  updateUserPreferences
} from '../controllers/userProfileController.js';
import { authMiddleware } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validator.js';

const router = express.Router();

// Public routes
router.post('/check-email', checkEmail);
router.post('/register', validate(schemas.register), register);
router.post('/login', validate(schemas.login), login);

// Password reset routes (OTP-based)
router.post('/forgot-password', requestPasswordReset);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

// Google OAuth routes
router.post('/google/signin', googleSignIn);
router.post('/google/complete-registration', completeGoogleRegistration);

// Apple Sign In routes
router.post('/apple/signin', appleSignIn);
router.post('/apple/complete-registration', completeAppleRegistration);

// Protected routes
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.get('/profile/stats', authMiddleware, getUserStats);
router.get('/profile/company', authMiddleware, getCompanyDetails);
router.put('/profile/company', authMiddleware, updateCompanyDetails);

router.get('/profile/preferences', authMiddleware, getUserPreferences);
router.put('/profile/preferences', authMiddleware, updateUserPreferences);

export default router;

import express from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController.js';
import { checkEmail } from '../controllers/emailCheckController.js';
import { googleSignIn, completeGoogleRegistration, nativeGoogleSignIn } from '../controllers/googleAuthController.js';
import { requestPasswordReset, resetPassword, verifyOTP } from '../controllers/passwordResetController.js';
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
router.post('/google/native-signin', nativeGoogleSignIn);
router.post('/google/complete-registration', completeGoogleRegistration);

// Protected routes
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

export default router;

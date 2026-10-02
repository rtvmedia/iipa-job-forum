const router = require('express').Router();
const { register, login, getProfile, updateProfile, uploadResume, verifyEmail, resendVerification } = require('../controllers/authController');
const rateLimit = require('../utils/rateLimit');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', register);
router.post('/login',    login);
router.post('/verify-email', rateLimit({ windowMs: 15 * 60 * 1000, max: 30 }), verifyEmail);
router.post('/resend-verification', rateLimit({ windowMs: 60 * 60 * 1000, max: 10 }), resendVerification);
router.get('/profile',   authenticate, getProfile);
router.put('/profile',   authenticate, updateProfile);
router.post('/resume',   authenticate, upload.uploadResume.single('resume'), uploadResume);

module.exports = router;

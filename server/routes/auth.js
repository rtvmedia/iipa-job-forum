const router = require('express').Router();
const { register, login, getProfile, updateProfile, uploadResume } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', register);
router.post('/login',    login);
router.get('/profile',   authenticate, getProfile);
router.put('/profile',   authenticate, updateProfile);
router.post('/resume',   authenticate, upload.uploadResume.single('resume'), uploadResume);

module.exports = router;

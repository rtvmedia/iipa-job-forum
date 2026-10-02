const router = require('express').Router();
const rateLimit = require('../utils/rateLimit');
const { sendContactMessage } = require('../controllers/contactController');

router.post('/', rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: 'You have sent several messages recently. Please try again in a while.' }), sendContactMessage);

module.exports = router;

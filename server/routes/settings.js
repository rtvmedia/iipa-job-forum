const router = require('express').Router();
const { getSettings } = require('../controllers/adminController');

router.get('/', getSettings);

module.exports = router;

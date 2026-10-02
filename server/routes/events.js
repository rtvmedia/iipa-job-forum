const router = require('express').Router();
const { getEvents, getEventImage, getEventBanner } = require('../controllers/eventController');
router.get('/', getEvents);
router.get('/:id/image', getEventImage);
router.get('/:id/banner', getEventBanner);
module.exports = router;

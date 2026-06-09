const { Event } = require('../models');

const getEvents = async (req, res) => {
  try {
    const events = await Event.findAll({ where: { isActive: true }, order: [['eventDate', 'ASC']] });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getEvents };

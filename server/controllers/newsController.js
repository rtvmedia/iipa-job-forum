const { NewsPost } = require('../models');

const getNews = async (req, res) => {
  try {
    const news = await NewsPost.findAll({ where: { isActive: true }, order: [['createdAt', 'DESC']], limit: 20 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getNews };

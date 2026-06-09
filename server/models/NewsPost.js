const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NewsPost = sequelize.define('NewsPost', {
  id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title:     { type: DataTypes.STRING(250), allowNull: false },
  excerpt:   { type: DataTypes.TEXT },
  content:   { type: DataTypes.TEXT },
  imageUrl:  { type: DataTypes.STRING(300) },
  category:  { type: DataTypes.STRING(80) },
  isActive:  { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'news_posts', timestamps: true });

module.exports = NewsPost;

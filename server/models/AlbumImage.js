const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AlbumImage = sequelize.define('AlbumImage', {
  id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  albumId:  { type: DataTypes.INTEGER, allowNull: false },
  imageUrl: { type: DataTypes.STRING(300), allowNull: false },
  caption:  { type: DataTypes.STRING(200) },
}, { tableName: 'album_images', timestamps: true });

module.exports = AlbumImage;

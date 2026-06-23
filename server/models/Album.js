const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Album = sequelize.define('Album', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  eventId:     { type: DataTypes.INTEGER, allowNull: true },
  title:       { type: DataTypes.STRING(200), allowNull: false },
  coverImageUrl: { type: DataTypes.STRING(300) },
}, { tableName: 'albums', timestamps: true });

module.exports = Album;

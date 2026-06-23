const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SiteSetting = sequelize.define('SiteSetting', {
  id:             { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  headerLogoUrl:  { type: DataTypes.STRING(300) },
  footerLogoUrl:  { type: DataTypes.STRING(300) },
}, { tableName: 'site_settings', timestamps: true });

module.exports = SiteSetting;

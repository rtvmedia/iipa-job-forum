const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SiteSetting = sequelize.define('SiteSetting', {
  id:             { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  headerLogoUrl:  { type: DataTypes.TEXT('long') },
  footerLogoUrl:  { type: DataTypes.TEXT('long') },
  linkedinUrl:        { type: DataTypes.STRING(300) },
  seekerBarcodeUrl:   { type: DataTypes.TEXT('long') },
  seekerWhatsappUrl:  { type: DataTypes.STRING(300) },
  employerBarcodeUrl: { type: DataTypes.TEXT('long') },
  employerWhatsappUrl:{ type: DataTypes.STRING(300) },
}, { tableName: 'site_settings', timestamps: true });

module.exports = SiteSetting;

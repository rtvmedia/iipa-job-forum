const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Certification = sequelize.define('Certification', {
  id:                 { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:             { type: DataTypes.INTEGER, allowNull: false },
  certificateName:    { type: DataTypes.STRING(200), allowNull: false },
  issuingOrganization:{ type: DataTypes.STRING(200) },
  issueDate:          { type: DataTypes.DATEONLY },
  expiryDate:         { type: DataTypes.DATEONLY },
  credentialId:       { type: DataTypes.STRING(150) },
  credentialUrl:      { type: DataTypes.STRING(300) },
}, { tableName: 'certifications', timestamps: true });

module.exports = Certification;

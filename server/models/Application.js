const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Application = sequelize.define('Application', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  jobId:       { type: DataTypes.INTEGER, allowNull: false },
  seekerId:    { type: DataTypes.INTEGER, allowNull: false },
  status:      { type: DataTypes.ENUM('applied', 'shortlisted', 'interview', 'hired', 'rejected'), defaultValue: 'applied' },
  coverLetter: { type: DataTypes.TEXT },
  resumeUrl:   { type: DataTypes.STRING(300) },
  notes:       { type: DataTypes.TEXT },
}, { tableName: 'applications', timestamps: true });

module.exports = Application;

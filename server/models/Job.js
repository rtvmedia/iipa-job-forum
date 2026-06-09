const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Job = sequelize.define('Job', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  recruiterId:  { type: DataTypes.INTEGER, allowNull: false },
  title:        { type: DataTypes.STRING(200), allowNull: false },
  company:      { type: DataTypes.STRING(150), allowNull: false },
  location:     { type: DataTypes.STRING(100) },
  type:         { type: DataTypes.ENUM('full-time', 'part-time', 'contract', 'internship', 'remote'), defaultValue: 'full-time' },
  category:     { type: DataTypes.STRING(100) },
  description:  { type: DataTypes.TEXT },
  requirements: { type: DataTypes.TEXT },
  salaryMin:    { type: DataTypes.INTEGER },
  salaryMax:    { type: DataTypes.INTEGER },
  deadline:     { type: DataTypes.DATEONLY },
  isActive:     { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'jobs', timestamps: true });

module.exports = Job;

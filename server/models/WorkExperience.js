const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WorkExperience = sequelize.define('WorkExperience', {
  id:              { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:          { type: DataTypes.INTEGER, allowNull: false },
  company:         { type: DataTypes.STRING(150), allowNull: false },
  jobTitle:        { type: DataTypes.STRING(150), allowNull: false },
  employmentType:  { type: DataTypes.STRING(50) },
  location:        { type: DataTypes.STRING(150) },
  startDate:       { type: DataTypes.DATEONLY },
  endDate:         { type: DataTypes.DATEONLY },
  currentlyWorking:{ type: DataTypes.BOOLEAN, defaultValue: false },
  responsibilities:{ type: DataTypes.TEXT },
  achievements:    { type: DataTypes.TEXT },
}, { tableName: 'work_experiences', timestamps: true });

module.exports = WorkExperience;

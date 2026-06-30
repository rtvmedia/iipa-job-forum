const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:       { type: DataTypes.INTEGER, allowNull: false },
  title:        { type: DataTypes.STRING(200), allowNull: false },
  description:  { type: DataTypes.TEXT },
  technologies: { type: DataTypes.STRING(300) },
  projectUrl:   { type: DataTypes.STRING(300) },
  startDate:    { type: DataTypes.DATEONLY },
  endDate:      { type: DataTypes.DATEONLY },
}, { tableName: 'projects', timestamps: true });

module.exports = Project;

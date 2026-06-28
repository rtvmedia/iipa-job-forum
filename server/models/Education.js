const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Education = sequelize.define('Education', {
  id:             { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:         { type: DataTypes.INTEGER, allowNull: false },
  degree:         { type: DataTypes.STRING(150), allowNull: false },
  major:          { type: DataTypes.STRING(150) },
  institution:    { type: DataTypes.STRING(200), allowNull: false },
  country:        { type: DataTypes.STRING(100) },
  graduationYear: { type: DataTypes.STRING(10) },
  gpa:            { type: DataTypes.STRING(20) },
}, { tableName: 'educations', timestamps: true });

module.exports = Education;

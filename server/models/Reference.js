const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reference = sequelize.define('Reference', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:       { type: DataTypes.INTEGER, allowNull: false },
  name:         { type: DataTypes.STRING(150), allowNull: false },
  position:     { type: DataTypes.STRING(150) },
  company:      { type: DataTypes.STRING(150) },
  email:        { type: DataTypes.STRING(150) },
  phone:        { type: DataTypes.STRING(30) },
  relationship: { type: DataTypes.STRING(100) },
}, { tableName: 'references_list', timestamps: true });

module.exports = Reference;

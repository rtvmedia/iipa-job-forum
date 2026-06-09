const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fullName:     { type: DataTypes.STRING(150), allowNull: false },
  email:        { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password:     { type: DataTypes.STRING(255), allowNull: false },
  role:         { type: DataTypes.ENUM('seeker', 'recruiter'), allowNull: false },
  phone:        { type: DataTypes.STRING(30) },
  location:     { type: DataTypes.STRING(100) },
  headline:     { type: DataTypes.STRING(200) },
  bio:          { type: DataTypes.TEXT },
  avatarUrl:    { type: DataTypes.STRING(300) },
  isActive:     { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'users', timestamps: true });

module.exports = User;

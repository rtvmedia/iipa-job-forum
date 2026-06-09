const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title:       { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT },
  eventDate:   { type: DataTypes.DATE },
  location:    { type: DataTypes.STRING(150) },
  isOnline:    { type: DataTypes.BOOLEAN, defaultValue: false },
  registrationUrl: { type: DataTypes.STRING(300) },
  isActive:    { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'events', timestamps: true });

module.exports = Event;

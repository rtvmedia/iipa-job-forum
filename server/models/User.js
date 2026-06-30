const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fullName:     { type: DataTypes.STRING(150), allowNull: false },
  email:        { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password:     { type: DataTypes.STRING(255), allowNull: false },
  role:         { type: DataTypes.ENUM('seeker', 'recruiter', 'coordinator', 'admin'), allowNull: false },
  phone:        { type: DataTypes.STRING(30) },
  location:     { type: DataTypes.STRING(100) },
  headline:     { type: DataTypes.STRING(200) },
  bio:          { type: DataTypes.TEXT },
  avatarUrl:    { type: DataTypes.TEXT('long') },
  isActive:     { type: DataTypes.BOOLEAN, defaultValue: true },
  nationality:  { type: DataTypes.STRING(60), defaultValue: 'Indian' },
  approvalStatus: { type: DataTypes.ENUM('approved', 'pending', 'rejected'), defaultValue: 'approved' },
  resumeUrl:       { type: DataTypes.STRING(300) },
  companyName:     { type: DataTypes.STRING(150) },
  companyWebsite:  { type: DataTypes.STRING(200) },
  companyIndustry: { type: DataTypes.STRING(100) },
  companyAbout:    { type: DataTypes.TEXT },

  // Seeker profile depth
  currentJobTitle:    { type: DataTypes.STRING(150) },
  yearsOfExperience:  { type: DataTypes.STRING(20) },
  willingToRelocate:  { type: DataTypes.BOOLEAN, defaultValue: false },
  visaStatus:         { type: DataTypes.STRING(100) },
  skills:              { type: DataTypes.TEXT },          // comma-separated
  languages:           { type: DataTypes.TEXT },          // JSON string: [{language,reading,writing,speaking,proficiency}]
  websiteUrl:          { type: DataTypes.STRING(300) },
  linkedinProfile:     { type: DataTypes.STRING(300) },
  githubProfile:       { type: DataTypes.STRING(300) },
  portfolioUrl:        { type: DataTypes.STRING(300) },
  desiredJobTitle:     { type: DataTypes.STRING(150) },
  preferredLocations:  { type: DataTypes.STRING(300) },
  salaryExpectation:   { type: DataTypes.STRING(100) },
  noticePeriod:        { type: DataTypes.STRING(60) },
  workMode:            { type: DataTypes.STRING(30) },     // remote / hybrid / onsite
  profileViews:        { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'users', timestamps: true });

module.exports = User;

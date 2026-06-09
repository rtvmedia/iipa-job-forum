const sequelize = require('../config/database');
const User        = require('./User');
const Job         = require('./Job');
const Application = require('./Application');
const NewsPost    = require('./NewsPost');
const Event       = require('./Event');

// Associations
User.hasMany(Job,         { foreignKey: 'recruiterId', as: 'postedJobs' });
Job.belongsTo(User,       { foreignKey: 'recruiterId', as: 'recruiter' });

User.hasMany(Application, { foreignKey: 'seekerId',    as: 'applications' });
Application.belongsTo(User, { foreignKey: 'seekerId',  as: 'seeker' });

Job.hasMany(Application,  { foreignKey: 'jobId',       as: 'applications' });
Application.belongsTo(Job,{ foreignKey: 'jobId',       as: 'job' });

module.exports = { sequelize, User, Job, Application, NewsPost, Event };

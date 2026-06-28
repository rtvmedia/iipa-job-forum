const sequelize = require('../config/database');
const User        = require('./User');
const Job         = require('./Job');
const Application = require('./Application');
const NewsPost    = require('./NewsPost');
const Event       = require('./Event');
const Album       = require('./Album');
const AlbumImage  = require('./AlbumImage');
const SiteSetting = require('./SiteSetting');
const WorkExperience = require('./WorkExperience');
const Education      = require('./Education');
const Certification  = require('./Certification');
const SavedJob       = require('./SavedJob');

// Associations
User.hasMany(Job,         { foreignKey: 'recruiterId', as: 'postedJobs' });
Job.belongsTo(User,       { foreignKey: 'recruiterId', as: 'recruiter' });

User.hasMany(Job,         { foreignKey: 'coordinatorId', as: 'submittedJobs' });
Job.belongsTo(User,       { foreignKey: 'coordinatorId', as: 'coordinator' });

User.hasMany(Application, { foreignKey: 'seekerId',    as: 'applications' });
Application.belongsTo(User, { foreignKey: 'seekerId',  as: 'seeker' });

Job.hasMany(Application,  { foreignKey: 'jobId',       as: 'applications' });
Application.belongsTo(Job,{ foreignKey: 'jobId',       as: 'job' });

Event.hasOne(Album,        { foreignKey: 'eventId',    as: 'album' });
Album.belongsTo(Event,     { foreignKey: 'eventId',    as: 'event' });

Album.hasMany(AlbumImage,  { foreignKey: 'albumId',    as: 'images' });
AlbumImage.belongsTo(Album,{ foreignKey: 'albumId',    as: 'album' });

User.hasMany(WorkExperience, { foreignKey: 'userId', as: 'workExperiences' });
WorkExperience.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Education,    { foreignKey: 'userId', as: 'educations' });
Education.belongsTo(User,  { foreignKey: 'userId' });

User.hasMany(Certification,   { foreignKey: 'userId', as: 'certifications' });
Certification.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(SavedJob,     { foreignKey: 'userId', as: 'savedJobs' });
SavedJob.belongsTo(User,   { foreignKey: 'userId' });
Job.hasMany(SavedJob,      { foreignKey: 'jobId',  as: 'savedBy' });
SavedJob.belongsTo(Job,    { foreignKey: 'jobId',  as: 'job' });

module.exports = {
  sequelize, User, Job, Application, NewsPost, Event, Album, AlbumImage, SiteSetting,
  WorkExperience, Education, Certification, SavedJob,
};

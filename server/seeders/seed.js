require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Job, Application, NewsPost, Event } = require('../models');

async function seed() {
  await sequelize.sync({ force: true });
  console.log('Database synced.');

  const pass = await bcrypt.hash('password123', 10);

  const recruiter = await User.create({
    fullName: 'Ahmed Khan', email: 'recruiter@iipa.org', password: pass,
    role: 'recruiter', phone: '+92-300-1234567', location: 'Karachi',
    headline: 'Senior HR Manager at TechCorp',
  });

  const seeker = await User.create({
    fullName: 'Sara Ali', email: 'seeker@iipa.org', password: pass,
    role: 'seeker', phone: '+92-321-9876543', location: 'Lahore',
    headline: 'Full Stack Developer | 3 Years Experience',
    bio: 'Passionate developer with expertise in React and Node.js looking for exciting opportunities.',
  });

  const jobs = await Job.bulkCreate([
    { recruiterId: recruiter.id, title: 'Senior Frontend Developer', company: 'TechCorp Pakistan', location: 'Karachi', type: 'full-time', category: 'Technology', description: 'We are looking for a skilled Frontend Developer to join our growing team. You will be responsible for building and maintaining high-quality web applications.', requirements: '3+ years React experience, TypeScript, REST APIs', salaryMin: 150000, salaryMax: 250000, deadline: '2026-07-31' },
    { recruiterId: recruiter.id, title: 'Backend Node.js Engineer', company: 'TechCorp Pakistan', location: 'Remote', type: 'remote', category: 'Technology', description: 'Join our backend team to build scalable APIs and microservices using Node.js and PostgreSQL.', requirements: '2+ years Node.js, Express, SQL databases', salaryMin: 120000, salaryMax: 200000, deadline: '2026-07-15' },
    { recruiterId: recruiter.id, title: 'HR Business Partner', company: 'IIPA Group', location: 'Islamabad', type: 'full-time', category: 'Human Resources', description: 'Strategic HR role partnering with business leaders to drive people initiatives and talent management.', requirements: 'MBA HR or equivalent, 5+ years HR experience', salaryMin: 100000, salaryMax: 160000, deadline: '2026-08-15' },
    { recruiterId: recruiter.id, title: 'Digital Marketing Specialist', company: 'BrandBoost Ltd', location: 'Lahore', type: 'full-time', category: 'Marketing', description: 'Drive digital growth through SEO, social media, and paid campaigns.', requirements: 'Google Ads certified, SEO expertise, 2+ years', salaryMin: 80000, salaryMax: 130000, deadline: '2026-07-20' },
    { recruiterId: recruiter.id, title: 'Data Analyst', company: 'FinanceHub', location: 'Karachi', type: 'full-time', category: 'Finance', description: 'Analyze financial data and create actionable insights for business decisions.', requirements: 'Excel, Power BI, SQL, statistics background', salaryMin: 90000, salaryMax: 140000, deadline: '2026-07-25' },
    { recruiterId: recruiter.id, title: 'React Native Developer', company: 'MobileFirst', location: 'Remote', type: 'contract', category: 'Technology', description: 'Build cross-platform mobile applications for enterprise clients.', requirements: 'React Native, iOS/Android deployment, 2+ years', salaryMin: 100000, salaryMax: 180000, deadline: '2026-08-01' },
  ]);

  await Application.bulkCreate([
    { jobId: jobs[0].id, seekerId: seeker.id, status: 'shortlisted', coverLetter: 'I am very excited about this role and believe my React experience is a strong match.' },
    { jobId: jobs[1].id, seekerId: seeker.id, status: 'applied',     coverLetter: 'Backend development is my passion and I have 3 years of Node.js experience.' },
    { jobId: jobs[3].id, seekerId: seeker.id, status: 'interview',   coverLetter: 'I have been running digital campaigns for 2 years with proven ROI results.' },
  ]);

  await NewsPost.bulkCreate([
    { title: 'IIPA Job Forum Launches AI-Powered Matching', excerpt: 'Our new AI engine matches candidates to roles with 90% accuracy, reducing time-to-hire by 40%.', content: 'Full article content here...', category: 'Platform News' },
    { title: 'Top Skills Employers Are Looking For in 2026', excerpt: 'Cloud computing, AI literacy, and communication top the list of most in-demand skills this year.', content: 'Full article content here...', category: 'Career Tips' },
    { title: 'Partnering with 50+ Leading Companies in Pakistan', excerpt: 'IIPA Job Forum expands its employer network with 50 new company partnerships across all industries.', content: 'Full article content here...', category: 'Partnerships' },
    { title: 'Free Resume Review Workshop This July', excerpt: 'Join our certified HR professionals for a free online workshop to strengthen your resume and profile.', content: 'Full article content here...', category: 'Events' },
  ]);

  await Event.bulkCreate([
    { title: 'Career Fair 2026 – Karachi', description: 'Meet 30+ employers, attend workshops, and get on-the-spot interviews.', eventDate: '2026-07-20T09:00:00Z', location: 'Expo Centre Karachi', isOnline: false },
    { title: 'Resume & LinkedIn Masterclass', description: 'Online session with career coaches on building a standout professional profile.', eventDate: '2026-07-10T14:00:00Z', location: 'Online', isOnline: true },
    { title: 'Tech Hiring Day – Lahore', description: 'Tech companies hiring on the spot. Bring your CV and portfolio.', eventDate: '2026-08-05T10:00:00Z', location: 'Arfa Software Technology Park, Lahore', isOnline: false },
    { title: 'Soft Skills for the Modern Workplace', description: 'Webinar on communication, leadership, and team collaboration skills.', eventDate: '2026-07-15T16:00:00Z', location: 'Online', isOnline: true },
  ]);

  console.log('Seed complete. Demo accounts:');
  console.log('  Recruiter: recruiter@iipa.org / password123');
  console.log('  Seeker:    seeker@iipa.org / password123');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });

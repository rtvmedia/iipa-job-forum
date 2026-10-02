// Accepts linkedin.com/in/username, www.linkedin.com/in/username, https://www.linkedin.com/in/username
const LINKEDIN_RE = /^(https?:\/\/)?((www|[a-z]{2,3})\.)?linkedin\.com\/in\/[A-Za-z0-9\-_%.]+\/?(\?.*)?$/i;

const isValidLinkedIn = (v) => typeof v === 'string' && LINKEDIN_RE.test(v.trim());

const normalizeLinkedIn = (v) => {
  const t = String(v).trim();
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
};

const REFERRAL_SOURCES = [
  'IIPA Member', 'IIPA Event', 'LinkedIn', 'Facebook', 'Instagram', 'WhatsApp',
  'Google Search', 'Friend / Colleague', 'Employer / Recruiter', 'Job Fair', 'Website', 'Other',
];

module.exports = { isValidLinkedIn, normalizeLinkedIn, REFERRAL_SOURCES };

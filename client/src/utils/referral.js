// Mirrors server/utils/validators.js
export const LINKEDIN_RE = /^(https?:\/\/)?((www|[a-z]{2,3})\.)?linkedin\.com\/in\/[A-Za-z0-9\-_%.]+\/?(\?.*)?$/i;
export const isValidLinkedIn = (v) => LINKEDIN_RE.test(String(v || '').trim());
export const LINKEDIN_ERROR = 'Please enter a valid LinkedIn profile URL.';

export const REFERRAL_SOURCES = [
  'IIPA Member', 'IIPA Event', 'LinkedIn', 'Facebook', 'Instagram', 'WhatsApp',
  'Google Search', 'Friend / Colleague', 'Employer / Recruiter', 'Job Fair', 'Website', 'Other',
];

// Sources where a "Referred By" name makes sense; only IIPA Member also asks for a Member ID.
export const SOURCES_WITH_REFERRER = ['IIPA Member', 'IIPA Event', 'Friend / Colleague', 'Employer / Recruiter'];

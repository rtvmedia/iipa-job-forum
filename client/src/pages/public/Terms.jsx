import LegalPage from '../../components/LegalPage';
import useContactEmail from '../../hooks/useContactEmail';

const SECTIONS = [
  {
    title: 'Acceptance of these terms',
    body: ['By creating an account or using IIPA Jobs you agree to these Terms & Conditions and our Privacy Policy. If you do not agree, please do not use the platform.'],
  },
  {
    title: 'About the service',
    body: ['IIPA Jobs is an online platform that helps Indian professionals discover career opportunities in India and abroad and connects job seekers with employers and recruiters. We are a marketplace: we are not the employer for the jobs listed, we do not guarantee any job, interview or hiring outcome, and employment contracts are solely between employers and candidates.'],
  },
  {
    title: 'Eligibility and accounts',
    body: [
      { list: [
        'You must be at least 18 years old and legally able to enter into a contract.',
        'Provide accurate, current information and keep it up to date. Job seekers must provide their own LinkedIn profile link.',
        'Verify your email address when asked. One person may hold one account.',
        'Keep your password confidential and tell us promptly if you suspect unauthorised use. You are responsible for activity under your account.',
      ] },
    ],
  },
  {
    title: 'Job seekers',
    body: [
      'You confirm that the information, qualifications, experience and documents in your profile and CV are true and not misleading. By applying to a job you authorise us to share your profile, CV and application with that employer.',
    ],
  },
  {
    title: 'Employers and recruiters',
    body: [
      { list: [
        'Post only genuine vacancies that you are authorised to advertise, with accurate descriptions.',
        'Do not charge candidates any fee for applying, interviewing or being hired through IIPA Jobs.',
        'Do not discriminate unlawfully, and use candidate information only for recruitment purposes and in line with data protection laws.',
        'We may review, approve, edit, reject or remove job postings and accounts at our discretion, including to protect job seekers.',
      ] },
    ],
  },
  {
    title: 'Acceptable use',
    body: [
      'You agree not to:',
      { list: [
        'Post false, misleading, defamatory, discriminatory, obscene or unlawful content.',
        'Impersonate another person or organisation, or misrepresent your affiliation with IIPA.',
        'Scrape, copy or harvest data, send spam, or interfere with the security or operation of the platform.',
        'Upload malware or content that infringes anyone else’s rights.',
        'Use the platform to collect payments from job seekers or for any fraudulent purpose.',
      ] },
    ],
  },
  {
    title: 'Your content',
    body: ['You keep ownership of the content you submit (such as your profile, CV and job postings). You give IIPA Jobs a non-exclusive licence to store, display and share that content as needed to operate the service, including showing it to employers you apply to.'],
  },
  {
    title: 'Our intellectual property',
    body: ['The IIPA Jobs name, logo, design and software are owned by or licensed to us. You may not copy or reuse them without our written permission.'],
  },
  {
    title: 'Third-party links',
    body: ['The platform may link to other websites (for example iipa.co.in or an employer’s site). We do not control and are not responsible for their content or practices.'],
  },
  {
    title: 'Suspension and termination',
    body: ['We may suspend or close accounts, or remove content, that breach these terms or that we reasonably believe put others at risk. You may stop using the service and ask us to delete your account at any time.'],
  },
  {
    title: 'Disclaimers and limitation of liability',
    body: [
      'The platform is provided “as is” and “as available”. We do not guarantee that it will be uninterrupted or error-free, or that listings, employers or candidates are accurate or suitable. Please carry out your own checks before accepting an offer or sharing sensitive information, and never pay money to secure a job.',
      'To the extent permitted by law, IIPA Jobs is not liable for indirect or consequential loss, or for losses arising from dealings between job seekers and employers.',
    ],
  },
  {
    title: 'Governing law',
    body: ['These terms are governed by the laws of India, and the courts of India will have jurisdiction over any dispute, subject to any mandatory consumer protections that apply to you.'],
  },
  {
    title: 'Changes to these terms',
    body: ['We may update these terms from time to time. Continuing to use IIPA Jobs after a change means you accept the updated terms.'],
  },
];

export default function Terms() {
  const contactEmail = useContactEmail();
  return <LegalPage title="Terms & Conditions" updated="2 October 2026" sections={SECTIONS} contactEmail={contactEmail}
    intro="Please read these terms carefully before using IIPA Jobs." />;
}

import LegalPage from '../../components/LegalPage';
import useContactEmail from '../../hooks/useContactEmail';

const SECTIONS = [
  {
    title: 'Who we are',
    body: ['IIPA Jobs (“we”, “us”, “our”) is an online platform that helps Indian professionals discover career opportunities in India and abroad and connects them with employers and recruiters. This policy explains what personal information we collect, how we use it and the choices you have.'],
  },
  {
    title: 'Information we collect',
    body: [
      'Information you give us:',
      { list: [
        'Account details: your name, email address, password (stored only in encrypted form), phone number and city.',
        'Job seeker profile: professional title, work experience, education, certifications, skills, languages, projects, references, career preferences, nationality, visa status, LinkedIn and other profile links, your CV/resume and profile photo.',
        'How you heard about IIPA Jobs, and, where you choose to provide them, the name of the person who referred you and your IIPA Member ID.',
        'Employer details: company name, website, industry, description and the jobs you post.',
        'Applications you submit, including any cover letter, and messages you send us through the contact form.',
      ] },
      'Information collected automatically: your IP address and basic technical data needed to keep the service secure and to limit abuse, and a sign-in token stored in your browser so you stay signed in.',
    ],
  },
  {
    title: 'How we use your information',
    body: [
      { list: [
        'To create and manage your account and verify your email address.',
        'To show your profile and CV to employers and recruiters when you apply for their jobs, and to let employers manage the applications they receive.',
        'To recommend jobs, run searches and show you your saved jobs and application status.',
        'To respond to your enquiries and send service messages such as email verification.',
        'To keep the platform secure, prevent fraud and misuse, and comply with legal obligations.',
        'To understand how people found us (for example through an event or a member) so we can improve our outreach.',
      ] },
    ],
  },
  {
    title: 'Who can see your information',
    body: [
      'Employers and recruiters can see your profile details, CV and application when you apply to one of their jobs. Authorised IIPA Jobs administrators and coordinators can access account information as needed to run and moderate the platform.',
      'We use trusted service providers to operate the platform (for example web hosting and email delivery). They may process data only on our behalf and for these purposes.',
      'We do not sell your personal information. We may disclose information if required by law or to protect the rights, safety and security of our users and platform.',
    ],
  },
  {
    title: 'International opportunities',
    body: ['Because IIPA Jobs lists opportunities in India and abroad, employers who view your application may be located outside India. By applying to a job you ask us to share your application with that employer, wherever it is based.'],
  },
  {
    title: 'Cookies and browser storage',
    body: ['We use your browser’s local storage to keep you signed in and to remember basic preferences. We do not currently use advertising cookies. You can clear this storage at any time by signing out or clearing your browser data.'],
  },
  {
    title: 'How long we keep your data',
    body: ['We keep your information while your account is active and for as long as needed to provide the service or meet legal obligations. You can ask us to delete your account and personal data at any time (see “Your choices”).'],
  },
  {
    title: 'Security',
    body: ['We protect your data with measures such as encrypted password storage, secure (HTTPS) connections and access controls. No online service is completely secure, so please use a strong, unique password and keep it private.'],
  },
  {
    title: 'Your choices and rights',
    body: [
      { list: [
        'View and update your information at any time from My Profile.',
        'Ask us to correct or delete your personal data, or withdraw your consent, by emailing us.',
        'Ask which personal data we hold about you.',
      ] },
      'We handle such requests in line with applicable data protection laws, including India’s Digital Personal Data Protection Act, 2023.',
    ],
  },
  {
    title: 'Children',
    body: ['IIPA Jobs is intended for people aged 18 and over. We do not knowingly collect information from children.'],
  },
  {
    title: 'Changes to this policy',
    body: ['We may update this policy from time to time. The “Last updated” date above shows when it last changed; significant changes will be highlighted on the website.'],
  },
];

export default function Privacy() {
  const contactEmail = useContactEmail();
  return <LegalPage title="Privacy Policy" updated="2 October 2026" sections={SECTIONS} contactEmail={contactEmail}
    intro="Your privacy matters to us. Please read this policy together with our Terms & Conditions." />;
}

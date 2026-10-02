const { SiteSetting } = require('../models');
const { isMailConfigured, sendMail, escapeHtml, clean, FROM_ADDRESS } = require('../utils/mailer');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message, website } = req.body || {};

    // Honeypot: real users never see/fill this field. Pretend success so bots learn nothing.
    if (website) return res.json({ message: 'Message sent.' });

    const n = clean(name), e = clean(email), s = clean(subject), m = String(message || '').trim();
    if (!n || n.length > 100)                 return res.status(400).json({ message: 'Please enter your name.' });
    if (!EMAIL_RE.test(e) || e.length > 150)  return res.status(400).json({ message: 'Please enter a valid email address.' });
    if (!s || s.length > 150)                 return res.status(400).json({ message: 'Please enter a subject.' });
    if (m.length < 10 || m.length > 3000)     return res.status(400).json({ message: 'Your message must be between 10 and 3000 characters.' });

    const settings = await SiteSetting.findOne();
    const to = settings?.contactEmail || FROM_ADDRESS();

    if (!isMailConfigured())
      return res.status(503).json({ message: `Online messages are temporarily unavailable. Please email us directly at ${to}.` });

    await sendMail({
      to,
      replyTo: e,
      subject: `[IIPA Jobs contact] ${s}`,
      text: `From: ${n} <${e}>\nSubject: ${s}\n\n${m}`,
      html: `<p><strong>From:</strong> ${escapeHtml(n)} &lt;${escapeHtml(e)}&gt;</p><p><strong>Subject:</strong> ${escapeHtml(s)}</p><hr><p style="white-space:pre-wrap">${escapeHtml(m)}</p>`,
    });
    res.json({ message: 'Message sent.' });
  } catch (err) {
    console.error('Contact form send failed:', err.message);
    res.status(502).json({ message: 'We could not send your message right now. Please try again later or email us directly.' });
  }
};

module.exports = { sendContactMessage };

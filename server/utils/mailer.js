const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Outgoing mail is configured purely through environment variables so no credential lives in the repo.
//   SMTP_USER / SMTP_PASS   mailbox login (e.g. info@iipajobs.co.in) — REQUIRED to enable email features
//   SMTP_HOST / SMTP_PORT   default smtp.hostinger.com / 465
//   SMTP_SECURE             default true (set "false" for STARTTLS on 587)
//   SMTP_FROM               default info@iipajobs.co.in
//   APP_URL                 default https://iipajobs.co.in (used in verification links)
const FROM_ADDRESS = () => process.env.SMTP_FROM || 'info@iipajobs.co.in';
const APP_URL = () => (process.env.APP_URL || 'https://iipajobs.co.in').replace(/\/+$/, '');

const isMailConfigured = () => !!(process.env.SMTP_USER && process.env.SMTP_PASS);

let transporter;
const getTransporter = () => {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT || 465);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port,
      secure: (process.env.SMTP_SECURE ?? (port === 465 ? 'true' : 'false')) !== 'false',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
};

const clean = (s) => String(s ?? '').replace(/[\r\n]+/g, ' ').trim();
const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const sendMail = ({ to, subject, text, html, replyTo }) =>
  getTransporter().sendMail({
    from: `"IIPA Jobs" <${FROM_ADDRESS()}>`,
    to, subject: clean(subject), text, html,
    ...(replyTo ? { replyTo } : {}),
  });

// ----- email verification tokens: only a SHA-256 hash is stored; the raw token lives in the emailed link -----
const VERIFY_TTL_MS = 24 * 60 * 60 * 1000;
const hashToken = (t) => crypto.createHash('sha256').update(String(t)).digest('hex');
const newVerifyToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  return { token, hash: hashToken(token), expires: new Date(Date.now() + VERIFY_TTL_MS) };
};

const sendVerificationEmail = ({ to, fullName, token }) => {
  const link = `${APP_URL()}/verify-email?token=${token}`;
  const name = escapeHtml(fullName || 'there');
  return sendMail({
    to,
    subject: 'Verify your email address — IIPA Jobs',
    text: `Hello ${fullName || 'there'},\n\nWelcome to IIPA Jobs. Please verify your email address by opening this link (valid for 24 hours):\n\n${link}\n\nIf you did not create an account, you can ignore this email.\n\nIIPA Jobs\n${FROM_ADDRESS()}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#222">
      <h2 style="color:#1a237e;margin-bottom:4px">IIPA Jobs</h2>
      <p>Hello ${name},</p>
      <p>Welcome to IIPA Jobs. Please verify your email address to activate your account.</p>
      <p style="margin:24px 0"><a href="${link}" style="background:#0a66c2;color:#fff;padding:12px 24px;border-radius:24px;text-decoration:none;font-weight:bold">Verify my email</a></p>
      <p style="font-size:13px;color:#555">Or paste this link into your browser (valid for 24 hours):<br><a href="${link}">${link}</a></p>
      <p style="font-size:13px;color:#555">If you did not create an account, you can safely ignore this email.</p>
      <hr style="border:none;border-top:1px solid #eee"><p style="font-size:12px;color:#888">IIPA Jobs · ${FROM_ADDRESS()}</p></div>`,
  });
};

module.exports = {
  isMailConfigured, sendMail, escapeHtml, clean, FROM_ADDRESS,
  newVerifyToken, hashToken, sendVerificationEmail, VERIFY_TTL_MS,
};

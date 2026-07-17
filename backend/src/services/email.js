const nodemailer = require("nodemailer");
const { env } = require("../config/env");

let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: false,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

async function sendEmail({ to, subject, html }) {
  if (!env.SMTP_HOST) {
    console.log(`[email skipped] ${subject} -> ${to}`);
    return;
  }

  await getTransporter().sendMail({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}

module.exports = { sendEmail };

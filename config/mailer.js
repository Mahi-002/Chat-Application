const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendResetEmail = async (to, resetLink) => {
  try {
    await transporter.sendMail({
      to,
      from: 'no-reply@localserver.com',
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset</p>
             <p>Click this <a href="${resetLink}">link</a> to reset your password.</p>`,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

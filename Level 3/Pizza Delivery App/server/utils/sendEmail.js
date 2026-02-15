const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create transporter (connection to Gmail)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,        // smtp.gmail.com
    port: process.env.EMAIL_PORT,        // 587
    auth: {
      user: process.env.EMAIL_USER,      // your gmail
      pass: process.env.EMAIL_PASS       // app password
    }
  });

  // 2. Define email content
  const mailOptions = {
    from: `Pizza Delivery <${process.env.EMAIL_USER}>`,
    to: options.to,           // Recipient
    subject: options.subject, // Email subject
    html: options.html        // Email body (HTML)
  };

  // 3. Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
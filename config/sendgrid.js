const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY.trim());

const sendEmail = async ({ to, subject, text, html, attachments = [] }) => {
  const msg = {
    to,
    from: 'nguyenanhducdeveloper@gmail.com', // Địa chỉ đã xác thực
    subject,
    text,
    html,
    attachments,
  };
  await sgMail.send(msg);
};

module.exports = { sendEmail }; 
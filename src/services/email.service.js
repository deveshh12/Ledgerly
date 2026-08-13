require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Ledgerly" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = 'Welcome to Ledgerly — Your Account is Ready';

  const text = `Hi ${name},

Welcome to Ledgerly!

Your account has been successfully created. You can now securely manage your account and keep track of your transactions through Ledgerly.

We're glad to have you with us.

Best regards,
The Ledgerly Team`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; color: #333;">
      <h2 style="margin-bottom: 20px;">Welcome to Ledgerly!</h2>

      <p>Hi ${name},</p>

      <p>
        Your Ledgerly account has been <strong>successfully created</strong>.
      </p>

      <p>
        You can now securely manage your account and keep track of your
        transactions through Ledgerly.
      </p>

      <p>
        We're glad to have you with us.
      </p>

      <p style="margin-top: 30px;">
        Best regards,<br>
        <strong>The Ledgerly Team</strong>
      </p>

      <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;">

      <p style="font-size: 12px; color: #777;">
        This is an automated email. Please do not reply to this message.
      </p>
    </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendEmail,
  sendRegistrationEmail
};


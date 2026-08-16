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

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = 'Transaction Successful';

  const text = `Hi ${name},

  Your transaction has been successfully completed.

  Amount: ₹${amount}
  To Account: ${toAccount}

  Thank you for using Ledgerly.
  `;

    const html = `
      <h2>Transaction Successful</h2>
      <p>Hi ${name},</p>
      <p>Your transaction has been successfully completed.</p>

      <p><strong>Amount:</strong> ₹${amount}</p>
      <p><strong>To Account:</strong> ${toAccount}</p>

      <p>Thank you for using <strong>Ledgerly</strong>.</p>
    `;

    // Nodemailer transporter
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject,
      text,
      html
    });
}


async function sendTransactionFailedEmail(userEmail, name, amount, toAccount) {
  const subject = 'Transaction Failed';

  const text = `Hi ${name},

Unfortunately, your transaction could not be completed.

Transaction Details:
Amount: ₹${amount}
To Account: ${toAccount}


Please verify the transaction details and try again.

If you did not attempt this transaction, please contact Ledgerly support immediately.

Thank you,
Ledgerly Team
`;

  const html = `
    <h2>Transaction Failed</h2>

    <p>Hi ${name},</p>

    <p>
      Unfortunately, your transaction could not be completed.
    </p>

    <h3>Transaction Details</h3>

    <p><strong>Amount:</strong> ₹${amount}</p>
    <p><strong>To Account:</strong> ${toAccount}</p>
    

    <p>
      Please verify the transaction details and try again.
    </p>

    <p>
      If you did not attempt this transaction, please contact
      <strong>Ledgerly Support</strong> immediately.
    </p>

    <p>Thank you,<br><strong>Ledgerly Team</strong></p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject,
    text,
    html
  });
}



module.exports = {
  sendEmail,
  sendRegistrationEmail,
  sendTransactionEmail,
  sendTransactionFailedEmail
};


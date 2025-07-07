import Nodemailer from 'nodemailer';

const host = process.env.EMAIL_HOST;
const port = process.env.EMAIL_PORT;
const username = process.env.EMAIL_USERNAME;
const password = process.env.EMAIL_PASSWORD;

// console.log('Email service initialized with host:', host, 'and port:', port, 'using username:', username, 'and password:', password );

const sendEmail = async (email, subject, htmlContent) => {
  try {
    const transporter = Nodemailer.createTransport({
      host: host,
      port: port,
      secure: true,
      auth: {
        user: username,
        pass: password,
      },
      tls: {
        rejectUnauthorized: false,
      },
      debug: true,
      connectionTimeout: 30000,
      socketTimeout: 30000,
    });
    transporter.on('log', (info) => {
      console.log(info.message);
    });
    transporter.on('error', (error) => {
      console.error('Transporter error:', error);
    });
    if (!email || !subject) {
      throw new Error('Email and subject are required');
    }
    // console.log('Preparing to send email to:', email, 'with subject:', subject);

    const mailOptions = {
      from: `"Rahil Vahora" <no-reply@theonebranding.com>`, // Better email formatting
      to: email,
      subject: subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    if (!info || !info.response) {
      throw new Error('Email sending failed, no response received', info.message);
    }
    console.log('Email sent:', info.response);
  } catch (error) {
    throw new Error(`Email could not be sent: ${error.message}`);
  }
};

export default sendEmail;

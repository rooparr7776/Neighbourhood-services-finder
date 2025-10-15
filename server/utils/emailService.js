const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use Gmail as the email service, or use another service like SendGrid
    auth: {
        user: "rooparr7776@gmail.com", // Your email address here (Gmail or other)
        pass: "phtqdzzxlaytgwym", // Your email password or App-specific password
    },
});

// Send Email
const sendEmail = async (to, subject, text, html) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to: to, // Receiver address
        subject: subject, // Subject line
        text: text, // Plain text body
        html: html, // HTML body (can include HTML formatting)
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully');
    } catch (error) {
        console.error('❌ Error sending email:', error);
    }
};

module.exports = { sendEmail };

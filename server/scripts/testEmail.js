require('dotenv').config();
console.log(process.env.EMAIL_USER);  // Check if the email is being loaded correctly
console.log(process.env.EMAIL_PASS);  // Check if the password is being loaded correctly
const sendEmail = require('../utils/mail');

sendEmail.sendBookingConfirmation(
    'olivia28direction@gmail.com',
    'Test Email from Neighbourhood App',
    '<h2>Hello Olivia!</h2><p>This is a test email from your app 🚀</p>'
);


/*// testGmail.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rooparr7776@gmail.com',
        pass: 'phtqdzzxlaytgwym',  // Use the app password here
    },
});

const mailOptions = {
    from: 'rooparr7776@gmail.com',
    to: 'olivia28direction@gmail.com',
    subject: 'Test Email',
    text: 'This is a test email from Neighbourhood Services App',
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('Error:', error);
    } else {
        console.log('Email sent:', info.response);
    }
});
*/
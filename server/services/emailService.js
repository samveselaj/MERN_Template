const nodemailer = require('nodemailer');

async function sendEmail(clientEmail, subject, html) {
    try {
        const testAccount = await nodemailer.createTestAccount();

        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        const mailOptions = {
            from: testAccount.user,
            to: clientEmail,
            subject: subject,
            html: html,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error('Error sending email:', err);
    }
};

module.exports = { sendEmail };

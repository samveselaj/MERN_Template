const nodemailer = require('nodemailer');

async function sendEmail({ clientEmail, subject, html }, res) {
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
        if (info.rejected.length > 0) {
            return res.json({
                status: 'error',
                message: 'Email not sent',
            }).status(400);
        } else {
            return res.json({
                status: 'success',
                message: 'Email sent',
                previewEmailURL: nodemailer.getTestMessageUrl(info),
            }).status(200);
        }
    } catch (err) {
        return res.json({
            status: 'error',
            message: err.message,
        }).status(400);
    }
};

module.exports = { sendEmail };

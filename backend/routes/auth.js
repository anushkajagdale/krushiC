const express = require('express');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const router = express.Router();

// Twilio configuration
const twilioClient = twilio('TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN');

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', // Replace with your email
        pass: 'your-email-password' // Replace with your email password or app password
    }
});

// POST route for login
router.post('/login', async (req, res) => {
    try {
        const { email, phone } = req.body;

        if (!email || !phone) {
            return res.status(400).json({ error: 'Email and phone number are required' });
        }

        // Simulate login success (replace with actual authentication logic)
        const user = { email, phone };

        // Send email
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Login Successful - कृषी Connect',
            text: `Hello, you have successfully logged into कृषी Connect.`
        };

        await transporter.sendMail(mailOptions);

        // Send WhatsApp message
        await twilioClient.messages.create({
            from: 'whatsapp:+14155238886', // Twilio WhatsApp sandbox number
            to: `whatsapp:${phone}`,
            body: 'Hello, you have successfully logged into कृषी Connect.'
        });

        res.status(200).json({ message: 'Login successful. Email and WhatsApp message sent.' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Failed to process login' });
    }
});

module.exports = router;

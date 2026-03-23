require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const fs = require('fs');
// Validate required envs and support Docker secrets
let { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, RECEIVER_EMAIL } = process.env;

// If SMTP credentials are not set in env, try Docker secrets at /run/secrets
try {
    if ((!SMTP_USER || !SMTP_PASS) && fs.existsSync('/run/secrets')) {
        if (!SMTP_USER && fs.existsSync('/run/secrets/smtp_user')) {
            SMTP_USER = fs.readFileSync('/run/secrets/smtp_user', 'utf8').trim();
        }
        if (!SMTP_PASS && fs.existsSync('/run/secrets/smtp_password')) {
            SMTP_PASS = fs.readFileSync('/run/secrets/smtp_password', 'utf8').trim();
        }
    }
} catch (err) {
    console.warn('Could not read docker secrets:', err.message);
}

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !RECEIVER_EMAIL) {
    console.warn('Warning: SMTP environment variables (or RECEIVER_EMAIL) are not fully set. Check .env or docker secrets');
}

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT ? Number(SMTP_PORT) : undefined,
    secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
    }
});

app.get('/health', (req, res) => res.json({ ok: true }));

app.post('/api/discovery', async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            companyName,
            businessEmail,
            phoneNumber,
            serviceOfInterest
        } = req.body || {};

        // Require only firstName, businessEmail and phoneNumber. Service/company/name are optional.
        if (!firstName || !businessEmail || !phoneNumber) {
            return res.status(400).json({ error: 'Missing required fields: firstName, businessEmail and phoneNumber are required' });
        }

        const subject = `Discovery Call Request from ${firstName} ${lastName || ''}`;
        const text = `New discovery form submission:\n\nName: ${firstName} ${lastName || ''}\nCompany: ${companyName || '-'}\nEmail: ${businessEmail}\nPhone: ${phoneNumber}\nService: ${serviceOfInterest}\n`;

        const html = `<h2>New discovery form submission</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName || ''}</p>
      <p><strong>Company:</strong> ${companyName || '-'}</p>
      <p><strong>Email:</strong> ${businessEmail}</p>
      <p><strong>Phone:</strong> ${phoneNumber}</p>
      <p><strong>Service:</strong> ${serviceOfInterest}</p>
    `;

        const mailOptions = {
            from: `${firstName} ${lastName || ''} <${businessEmail}>`,
            to: RECEIVER_EMAIL,
            subject,
            text,
            html,
            replyTo: businessEmail
        };

        await transporter.sendMail(mailOptions);

        return res.json({ ok: true, message: 'Email sent' });
    } catch (err) {
        console.error('Error sending discovery email', err);
        return res.status(500).json({ error: 'Failed to send email' });
    }
});

app.listen(PORT, () => {
    console.log(`Mora backend listening on http://localhost:${PORT}`);
});

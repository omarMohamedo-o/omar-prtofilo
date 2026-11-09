export default async function handler(req, res) {
    try {
        if (req.method !== 'POST') {
            res.status(405).json({ error: 'Method not allowed' });
            return;
        }

        // Parse body (works when Vercel provides parsed body, or when test passes body)
        let data = req.body;
        if (!data) {
            if (typeof req.json === 'function') {
                data = await req.json();
            } else if (req._rawBody) {
                data = JSON.parse(req._rawBody);
            }
        }

        const { firstName, lastName, companyName, businessEmail, phoneNumber, serviceOfInterest } = data || {};
        if (!businessEmail || !firstName) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        const subject = `Discovery request from ${firstName} ${lastName || ''}`;
        const textBody = `New discovery request:\n\nName: ${firstName} ${lastName || ''}\nCompany: ${companyName || '—'}\nEmail: ${businessEmail}\nPhone: ${phoneNumber || '—'}\nService: ${serviceOfInterest || '—'}`;

        const htmlBody = `<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; background:#f4f4f6; margin:0; padding:20px; }
            .card { max-width:700px; margin:0 auto; background:#222; color:#ddd; border-radius:4px; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,0.12); }
            .header { background:#0b63b8; color:#fff; padding:22px 24px; text-align:center; font-size:20px; font-weight:700; }
            .body { padding:20px 24px; background:#2a2a2a; }
            .row { display:flex; gap:16px; align-items:flex-start; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.03); }
            .label { width:180px; color:#9fb4d9; font-weight:700; }
            .value { color:#fff; flex:1; word-break:break-word; }
            .footer { padding:14px 24px; background:#1d1d1d; color:#9aa6b2; font-size:12px; text-align:center; }
            @media (max-width:520px){ .label{width:120px} .card{margin:0 12px} }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="header">New Datasheet Request</div>
            <div class="body">
                <div class="row"><div class="label">Full Name:</div><div class="value">${(firstName || '') + (lastName ? ' ' + lastName : '') || '—'}</div></div>
                <div class="row"><div class="label">Email Address:</div><div class="value">${businessEmail || '—'}</div></div>
                <div class="row"><div class="label">Phone Number:</div><div class="value">${phoneNumber || '—'}</div></div>
                <div class="row"><div class="label">Company:</div><div class="value">${companyName || '—'}</div></div>
                <div class="row"><div class="label">Service / Datasheet:</div><div class="value">${serviceOfInterest || '—'}</div></div>
            </div>
            <div class="footer">This message was generated from the website enquiry form.</div>
        </div>
    </body>
</html>`;

        // TEST mode: do not attempt external network calls
        if (process.env.TEST_EMAIL_MODE === 'true' || process.env.TEST_EMAIL_MODE === '1') {
            console.log('TEST_EMAIL_MODE active — would send:', { subject, textBody });
            res.status(200).json({ ok: true, test: true });
            return;
        }

        function extractEmailAddress(value) {
            if (!value) return null;
            const raw = String(value).trim();
            const match = raw.match(/<([^>]+)>/);
            return (match ? match[1] : raw).trim();
        }

        function pickSmtpFromAddress() {
            const smtpUser = extractEmailAddress(process.env.SMTP_USER);
            const smtpFrom = extractEmailAddress(process.env.SMTP_FROM);

            if (smtpUser) return smtpUser;
            if (smtpFrom) return smtpFrom;

            return extractEmailAddress(process.env.FROM_EMAIL) || 'no-reply@example.com';
        }

        function pickSendGridFromAddress() {
            return extractEmailAddress(process.env.FROM_EMAIL)
                || extractEmailAddress(process.env.SMTP_FROM)
                || extractEmailAddress(process.env.SMTP_USER)
                || 'no-reply@example.com';
        }

        // Prefer SMTP when configured; fall back to SendGrid if SMTP is unavailable.
        const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
        const SENDGRID_FROM_EMAIL = pickSendGridFromAddress();
        const SMTP_FROM_EMAIL = pickSmtpFromAddress();
        const TO_EMAIL = (process.env.TO_EMAIL || process.env.RECEIVER_EMAIL || '').trim() || null;
        const SMTP_HOST = (process.env.SMTP_HOST || '').trim();
        const SMTP_HOST_IP = (process.env.SMTP_HOST_IP || '').trim();
        const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
        const SMTP_USER = process.env.SMTP_USER;
        const SMTP_PASS = process.env.SMTP_PASS;

        async function resolveSmtpHost(hostname) {
            const dns = await import('dns/promises');

            let lastErr = null;
            for (let attempt = 0; attempt < 3; attempt++) {
                try {
                    const result = await dns.lookup(hostname, { family: 4 });
                    if (result && result.address) return result.address;
                } catch (err) {
                    lastErr = err;
                }
            }

            throw lastErr || new Error(`DNS lookup failed for ${hostname}`);
        }

        if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
            if (!TO_EMAIL) {
                console.error('TO_EMAIL/RECEIVER_EMAIL not configured; cannot deliver discovery emails');
                res.status(500).json({ error: 'Server recipient not configured (TO_EMAIL/RECEIVER_EMAIL missing)' });
                return;
            }

            try {
                // Lazy import nodemailer
                const nodemailer = await import('nodemailer');

                const resolvedHost = SMTP_HOST_IP || await resolveSmtpHost(SMTP_HOST);
                const secure = SMTP_PORT === 465; // use SSL for 465
                const transporter = nodemailer.createTransport({
                    host: resolvedHost,
                    port: SMTP_PORT,
                    secure,
                    auth: {
                        user: SMTP_USER,
                        pass: SMTP_PASS,
                    },
                    tls: {
                        servername: SMTP_HOST,
                        rejectUnauthorized: false
                    },
                    connectionTimeout: 20000,
                    greetingTimeout: 20000,
                    socketTimeout: 30000
                });

                const mailOptions = {
                    from: SMTP_FROM_EMAIL,
                    to: TO_EMAIL,
                    subject,
                    text: textBody,
                    html: htmlBody,
                    replyTo: businessEmail || undefined,
                };

                const info = await transporter.sendMail(mailOptions);
                console.log('SMTP send info:', info && info.messageId ? info.messageId : info);
                res.status(200).json({ ok: true, sent_to: TO_EMAIL, messageId: info?.messageId || null });
                return;
            } catch (smtpErr) {
                console.error('SMTP send failed', smtpErr);
                if (!SENDGRID_API_KEY) {
                    res.status(502).json({ error: 'SMTP send failed', detail: String(smtpErr) });
                    return;
                }

                console.warn('SMTP failed, falling back to SendGrid');
            }
        }

        if (SENDGRID_API_KEY) {
            if (!TO_EMAIL) {
                console.error('TO_EMAIL not configured; cannot deliver discovery emails');
                res.status(500).json({ error: 'Server recipient not configured (TO_EMAIL missing)' });
                return;
            }

            const payload = {
                personalizations: [{ to: [{ email: TO_EMAIL }], subject }],
                from: { email: SENDGRID_FROM_EMAIL, name: 'Website' },
                reply_to: businessEmail ? { email: businessEmail, name: `${firstName} ${lastName || ''}`.trim() } : undefined,
                content: [
                    { type: 'text/plain', value: textBody },
                    { type: 'text/html', value: htmlBody }
                ]
            };

            const r = await fetch('https://api.sendgrid.com/v3/mail/send', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${SENDGRID_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!r.ok) {
                const body = await r.text().catch(() => '');
                console.error('SendGrid error', r.status, body);
                res.status(502).json({ error: 'Email provider error', status: r.status, body });
                return;
            }

            res.status(200).json({ ok: true, sent_to: TO_EMAIL, provider: 'sendgrid' });
            return;
        }

        // No provider configured
        // In local development, succeed so the form can be tested without real credentials.
        const isProduction = process.env.NODE_ENV === 'production';
        if (!isProduction) {
            console.warn('No email provider configured; returning success in development test mode');
            res.status(200).json({ ok: true, test: true, provider: 'none' });
            return;
        }

        console.error('No email provider configured (SENDGRID_API_KEY or SMTP credentials missing)');
        res.status(500).json({ error: 'Email provider not configured' });
    } catch (err) {
        console.error('discovery handler error', err);
        res.status(500).json({ error: err.message || 'Internal error' });
    }
}

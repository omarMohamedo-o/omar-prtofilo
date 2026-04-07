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

        // TEST mode: do not attempt external network calls
        if (process.env.TEST_EMAIL_MODE === 'true' || process.env.TEST_EMAIL_MODE === '1') {
            console.log('TEST_EMAIL_MODE active — would send:', { subject, textBody });
            res.status(200).json({ ok: true, test: true });
            return;
        }

        // Prefer SendGrid API when configured
        const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
        const FROM_EMAIL = process.env.FROM_EMAIL || process.env.SEND_FROM || 'no-reply@example.com';

        if (SENDGRID_API_KEY) {
            const payload = {
                personalizations: [{ to: [{ email: process.env.TO_EMAIL || FROM_EMAIL }], subject }],
                from: { email: FROM_EMAIL },
                content: [{ type: 'text/plain', value: textBody }]
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
                res.status(502).json({ error: 'Email provider error' });
                return;
            }

            res.status(200).json({ ok: true });
            return;
        }

        // No provider configured
        console.error('No email provider configured (SENDGRID_API_KEY missing)');
        res.status(500).json({ error: 'Email provider not configured' });
    } catch (err) {
        console.error('discovery handler error', err);
        res.status(500).json({ error: err.message || 'Internal error' });
    }
}

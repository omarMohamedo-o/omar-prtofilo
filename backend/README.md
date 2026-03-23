Mora Backend
===============

This small backend receives the discovery form submissions and forwards them via SMTP to your email.

Setup
------

1. Copy `.env.example` to `.env` and fill SMTP values and receiver email (the default receiver is your email):

```
cp .env.example .env
# edit .env and set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, RECEIVER_EMAIL
```

1. Install dependencies and start the server:

```bash
cd backend
npm install
npm run start
```

1. By default the server listens on port `3001`. The frontend posts to `http://localhost:3001/api/discovery`.

Notes
------

- Do NOT commit your real SMTP credentials. Use the `.env` and keep it out of source control.
- For Gmail you may need an App Password and to enable access for less-secure apps (or use OAuth2).
- You can set `REACT_APP_BACKEND_URL` in the frontend environment to override the backend URL.

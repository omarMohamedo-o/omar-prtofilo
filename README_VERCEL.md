Vercel deployment notes

This project can deploy the frontend on Vercel (static site):

1. What is deployed

- Only the `frontend` web app (Vite/React) should be deployed to Vercel.
- Backend services (MoraBot, mailer) remain in your Docker environment or other servers and are not deployed to Vercel in this repo.

1. How to configure Vercel

- In the Vercel project settings, set the following build:
  - Framework preset: Other (if not detected)
  - Build command: `npm run build` (run in `frontend` directory)
  - Output directory: `frontend/dist`

- Environment variables (set these in Vercel Project > Settings > Environment Variables):
  - `VITE_API_URL` — the public URL for your API gateway (e.g. `https://example.com/api`). This is required so the frontend can call the backend through the proxy.
  - `VITE_BACKEND_URL` — optional override if you prefer.

Additionally for the discovery mailer function:

- `SENDGRID_API_KEY` — (optional) SendGrid API key used by the serverless mailer. If not provided, the function will return an error unless `TEST_EMAIL_MODE` is enabled.
- `FROM_EMAIL` — email address used as the sender (default `no-reply@example.com`).
- `TO_EMAIL` — email address to receive discovery messages (defaults to `FROM_EMAIL`).
- `TEST_EMAIL_MODE` — set to `1` to enable safe test mode (function returns success without sending emails).

1. Mailer / Discovery form

- The discovery mailer in `frontend/mailer` cannot run on Vercel as a containerized Node worker.
- Recommended approach: Keep the mailer running in your Docker Compose deployment (accessible via your public nginx reverse proxy). Set `VITE_MAILER_URL` (or use `VITE_API_URL`) to point to the public host that forwards `/api/discovery` to the mailer.
- Alternative: move mailer to a serverless function (not included here). If you do, update `vercel.json` to add a function route.
- Alternative: move mailer to a serverless function (we added a basic one at `/api/discovery.js`). If you prefer to run mailer in Docker locally, keep `frontend-mailer` and nginx proxy — Vercel function only runs when deployed on Vercel.

1. Chatbot note

- MoraBot (chatbot) runs as a FastAPI service and often requires large models and server resources; Vercel is not suitable for hosting the model service in most cases.
- Keep the model and chat backend in your Docker deployment and expose it behind your API gateway so the Vercel frontend can reach it.

1. Ignored files

- This repo already ignores local Vercel runtime files (`.vercel/`), build caches, `dist/`, and secrets. See `.gitignore` and `.dockerignore` for details.

1. Quick deploy

- From the Vercel dashboard, import this Git repository and set the environment variables above.
- Or use the Vercel CLI from your machine (install `vercel`):

```bash
# from repo root
vercel --prod --confirm
```

Note: After deploying, open the site and test the API endpoints (chat, discovery). If the chat is unreachable, the frontend will show a graceful fallback message. If mailer requests fail, ensure your public nginx proxy is reachable by Vercel (CORS and SSL settings may apply).

SMTP Fallback and local preparation
----------------------------------

This project now includes an SMTP fallback for the Vercel serverless discovery function. The function prefers `SENDGRID_API_KEY` but will attempt to send via SMTP when `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASS` are configured.

Before running `vercel dev` or deploying, install server dependencies at the repo root so the function has `nodemailer` available:

```bash
# from repo root
npm install
```

Then run the local dev server (recommended) to verify the function behaviour:

```bash
vercel dev
```

Environment variables recap (all that may be used by the serverless function):

- `SENDGRID_API_KEY` (recommended) — SendGrid API key.
- `FROM_EMAIL` — sender address (e.g. <no-reply@yourdomain.com>).
- `TO_EMAIL` — destination for discovery emails (required).
- `TEST_EMAIL_MODE` — set to `1` to have the function return success without sending.
- `SMTP_HOST` — SMTP host (fallback).
- `SMTP_PORT` — SMTP port (optional, default 465).
- `SMTP_USER` — SMTP username.
- `SMTP_PASS` — SMTP password or app password.

If you want me to run a production deploy, I can guide you through the `vercel --prod` step or attempt it here if you provide CI/CLI access. Otherwise, after you deploy, paste the Vercel URL here and I will run a test POST against `/api/discovery` and confirm delivery logs.

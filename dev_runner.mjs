import http from 'http';
import { fileURLToPath } from 'url';
import path from 'path';

// Simple dev server to run the Vercel function locally for testing
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mod = await import(path.join(__dirname, 'api', 'discovery.js'));
const handler = (mod && mod.default) ? mod.default : null;

if (!handler) {
    console.error('Could not load discovery handler from api/discovery.js');
    process.exit(1);
}

const port = process.env.PORT ? Number(process.env.PORT) : 3071;

const server = http.createServer(async (req, res) => {
    // Provide a minimal Express/Vercel-like response shim
    const r = res;
    r.status = function (code) { r.statusCode = code; return r; };
    r.json = function (obj) {
        if (!r.getHeader('content-type')) r.setHeader('content-type', 'application/json');
        r.end(JSON.stringify(obj));
    };
    r.send = function (body) {
        if (typeof body === 'object') {
            if (!r.getHeader('content-type')) r.setHeader('content-type', 'application/json');
            r.end(JSON.stringify(body));
        } else {
            r.end(String(body));
        }
    };

    try {
        // Normalize path
        if (req.url.startsWith('/api/discovery')) {
            await handler(req, r);
        } else {
            r.statusCode = 404;
            r.setHeader('Content-Type', 'text/plain');
            r.end('Not found');
        }
    } catch (err) {
        console.error('Handler error', err);
        r.statusCode = 500;
        r.setHeader('Content-Type', 'application/json');
        r.end(JSON.stringify({ ok: false, error: String(err) }));
    }
});

server.listen(port, () => console.log(`dev_runner listening on http://127.0.0.1:${port}`));

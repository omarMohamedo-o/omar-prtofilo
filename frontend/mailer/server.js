import http from 'http';
import discoveryHandler from './discovery.js';

const PORT = Number(process.env.PORT || 8787);

function sendJson(res, statusCode, payload) {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
}

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

    if (req.method === 'GET' && url.pathname === '/health') {
        sendJson(res, 200, { status: 'ok' });
        return;
    }

    if (url.pathname !== '/discovery') {
        sendJson(res, 404, { error: 'Not found' });
        return;
    }

    let rawBody = '';
    for await (const chunk of req) {
        rawBody += chunk;
    }

    let body = undefined;
    if (rawBody) {
        try {
            body = JSON.parse(rawBody);
        } catch {
            sendJson(res, 400, { error: 'Invalid JSON body' });
            return;
        }
    }

    const reqForHandler = {
        method: req.method,
        body,
        _rawBody: rawBody,
        headers: req.headers,
    };

    const resForHandler = {
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(payload) {
            sendJson(res, this.statusCode || 200, payload);
        },
    };

    await discoveryHandler(reqForHandler, resForHandler);
});

server.listen(PORT, () => {
    console.log(`Discovery mailer listening on port ${PORT}`);
});

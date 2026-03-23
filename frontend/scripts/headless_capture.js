const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
    const outLog = '/tmp/headless_console.log';
    const outScreenshot = '/tmp/headless_page.png';
    const url = process.argv[2] || 'http://localhost:5173/';

    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    const logs = [];
    page.on('console', msg => {
        const text = `${msg.type().toUpperCase()}: ${msg.text()}`;
        logs.push(text);
        console.log(text);
    });

    page.on('pageerror', err => {
        const text = `PAGEERROR: ${err.message}`;
        logs.push(text);
        console.error(text);
    });

    page.on('response', res => {
        const status = res.status();
        if (status >= 400) {
            const text = `RESPONSE ${status} ${res.url()}`;
            logs.push(text);
            console.error(text);
        }
    });

    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
    } catch (e) {
        logs.push('GOTO_ERROR: ' + e.message);
        console.error('GOTO_ERROR:', e.message);
    }

    await page.screenshot({ path: outScreenshot, fullPage: true });
    fs.writeFileSync(outLog, logs.join('\n'));
    console.log('Saved screenshot to', outScreenshot);
    console.log('Saved console log to', outLog);

    await browser.close();
})();

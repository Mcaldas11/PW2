const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');

const PORT = 4000;
const HOST = 'localhost';

const publicDir = path.join(__dirname, 'public');
const messagesFilePath = path.join(publicDir, 'messages.txt');

if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

const htmlPage = `<html><body><form action='/message' method='POST'>
<input type='text' name='message' required>
<button type='submit'>Send</button>
</form></body></html>`;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (req.method === 'GET' && pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(htmlPage);
    } else if (req.method === 'POST' && pathname === '/message') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const parsedBody = querystring.parse(body);
            const message = parsedBody.message || '';

            fs.appendFile(messagesFilePath, message + '\n', (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error saving message');
                    return;
                }

                res.writeHead(302, { 'Location': '/' });
                res.end();
            });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, HOST, () => {
    console.log(`Server is running on: http://${HOST}:${PORT}`);
});
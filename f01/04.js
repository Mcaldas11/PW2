// node basic server
const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    const{method, url} = req;
    console.log(`Received ${method} request for ${url}`);

    switch (url) {
        case '/':
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Welcome to my server!');
            break;
        case '/about':
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('This is a Node.js server');
            break;
        case '/time':
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(new Date().toLocaleString());
            break;
        default:
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('404 Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
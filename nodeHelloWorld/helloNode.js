const http = require("http");
const HOST = process.env.HOSTNAME || "localhost";
const PORT = process.env.PORT || 3000;

const server = http.createServer((request, response) => {
  response.statusCode = 200;
  response.setHeader("Content-Type", "text/html");
  response.end("<h1>Hello World</h1>");
});

server.listen(PORT, HOST, () => {
  console.log(`Node server running on http://${HOST}:${PORT}/`);
});

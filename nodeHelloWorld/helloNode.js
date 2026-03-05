// import Node.js core module HTTP
const http = require("http");
const HOST = process.env.HOSTNAME || "localhost"; // local server
const PORT = process.env.PORT || 3000; // determine the port to listen to by checking the PORT variable first and providing it with a default value, if undefined


// create a web server instance
const server = http.createServer((request, response) => {
  response.statusCode = 200; // set HTTP status code for OK - SUCCESS
  response.setHeader("Content-Type", "text/html"); // set HTTP response header parameters
  response.end("<h1>Hello World</h1>"); // send a response back to client, adding the content as an argument
});


// listen for any incoming requests
server.listen(PORT, HOST, () => {
  // print message in server terminal
  console.log(`Node server running on http://${HOST}:${PORT}/`);
});

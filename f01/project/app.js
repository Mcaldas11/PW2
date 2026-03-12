const userService = require('./userService')
const http = require('http')

const server = http.createServer(async (req, res) => {
    const {method, url, headers} = req
    console.log(url)
    if(url == '/users'){
        let body = '';
        let data;
        switch (method) {
            case "POST":
                body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                    if (body.length > 1e6) req.socket.destroy();
                });
                body = JSON.parse(body)
                if (args.length < 3) {
                    console.error('USAGE: node app.js create <name> <email>')
                    process.exit(1)
                }
                try {
                    res.writeHead(200, {'Content-Type':'application/json'})
                    res.end(userService.create(body.name, body.email))
                } catch(err) {
                    console.error(err)
                    process.exit(1)
                }
                break;
            case "GET":
                try{
                     data = await userService.list()
                    console.log("dent response")
                    res.writeHead(200, {'Content-Type':'application/json'})
                    res.end(data)
                } catch (err){
                    console.error(err)
                    process.exit(1)
                }
                break;
            case "PUT":
                body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                    if (body.length > 1e6) req.socket.destroy();
                });
                body = JSON.parse(body)
                if(args.length < 3) {
                    console.error('USAGE: node app.js update <id> <email>')
                    process.exit(1)
                }
                try{
                    res.writeHead(200, {'Content-Type':'application/json'})
                    res.end(userService.update(Number(body.id), body.email))
                }catch(err) {
                    console.error(err)
                    process.exit(1)
                }
                break;
            case "DELETE":
                body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                    if (body.length > 1e6) req.socket.destroy();
                });
                body = JSON.parse(body)
                if(args.length < 2) {
                    console.error('USAGE: node app.js delete <id>')
                    process.exit(1)
                }
                try{
                    res.writeHead(200, {'Content-Type':'application/json'})
                    res.end(userService.delete(Number(body.id)))
                }catch(err){
                    console.error(err)
                    process.exit(1)
                }
                break;
            default:
                console.log('Commands:\nlist\n create <name> <email>\n update <id> <email>\n delete <id>')
                process.exit(1)
                break;
        }
    }else {
        res.writeHead(404, {'Content-Type': 'plain/text'})
        res.end('blabalnalnalna')
    }
})

const PORT = 3000;
const HOST = 'localhost'
server.listen(PORT , HOST , () => {
    console.log(`server is running on: http://${HOST}:${PORT}`)
});
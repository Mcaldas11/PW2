const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = 3000;
const HOST = 'localhost'

const server = http.createServer((req, res)=> {
    const parsedURL = new URL(req.url, `http://${req.headers.host}`)

    const requestedFile = path.join(__dirname, 'public', String(parsedURL.searchParams.get('file')))
    console.log(requestedFile)
    if (!requestedFile.startsWith(path.join(__dirname, 'public'))) { 
        res.writeHead(403, { 'Content-Type': 'text/html' });
        return res.end('<h1>403 Forbidden</h1>');
    }

    fs.readFile(requestedFile, (err, fileData) => {
        if(err){
            res.writeHead(404, {'Content-Type':'text/html'})
            return res.end('404 not found')
        }
        return res.end(fileData)
    })
})

server.listen(PORT , HOST , () => {
    console.log(`Server is running on: http://${HOST}:${PORT}`)
});
const http = require('http');
const httpProxy = require('http-proxy');
const port = 5000;

const proxy = httpProxy.createProxyServer();
const server = http.createServer((req, res) => {
    if(req.url.startsWith('/finder')) {
        console.log('Redirecting to finder service');
        proxy.web(req, res, { target: 'http://localhost:4000' });
    } else if(req.url.startsWith('/auth')) {
        console.log('Redirecting to auth service');
        proxy.web(req, res, { target: 'http://localhost:8000' });
    } else {
        console.log('Invalid path:', req.url);
        res.statusCode = 404;
        res.end("Invalid path");
    }
});

server.listen(port, () => {
    console.log(`Gateway listening at http://localhost:${port}`);
});
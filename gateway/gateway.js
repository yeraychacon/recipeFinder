const http = require("http");
const httpProxy = require("http-proxy");
const port = 5000;

const proxy = httpProxy.createProxyServer();
const server = http.createServer((req, res) => {
  if (req.url.startsWith("/finder")) {
    console.log("Redirecting to finder service: http://127.0.0.1:4000");
    proxy.web(req, res, { target: "http://127.0.0.1:4000" });
  } else if (req.url.startsWith("/auth")) {
    console.log("Redirecting to auth service: http://127.0.0.1:8000");
    proxy.web(req, res, { target: "http://127.0.0.1:8000" });
  } else {
    console.log("Invalid path:", req.url);
    res.statusCode = 404;
    res.end("Invalid path");
  }
});

server.listen(port, () => {
  console.log(`Gateway listening at http://localhost:${port}`);
});

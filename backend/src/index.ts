import * as httpProxy from 'http-proxy'
import * as http from 'http'

(async ()=> {
    const proxy = httpProxy.createProxyServer({
        // target: 'https://localhost:8443', // Replace with your target website
        target: 'https://host.docker.internal:8443', // Replace with your target website
        secure: false, // Disable certificate validation
        changeOrigin: true, // Important for proxying to different domains
        cookieDomainRewrite: 'host.docker.internal', // Rewrite cookie domains
    });

    proxy.on('error', function (err, req, res) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Proxy error');
    });

    // Create a simple HTTP server to handle incoming requests
    const server = http.createServer(function(req, res) {
        proxy.web(req, res);
    });

    server.listen(3000); // Choose a port for your proxy
})();

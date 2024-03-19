import http from 'http';

server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.statusCode(200);
  }
});

import http from 'http';

server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.statusCode(200);
    res.end();
  };
});

server.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});

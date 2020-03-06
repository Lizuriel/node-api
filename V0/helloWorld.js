var http = require('http');

var server = http.createServer(function(req, res) {
  res.writeHead(200);
  //res.writeHead(404)
  res.end('Salut tout le monde !');
});
server.listen(8080);
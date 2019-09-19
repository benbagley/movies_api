const http = require('http'),
      fs = require('fs'),
      url = require('url');

http.createServer((request, response) => {
  response.writeHead(200, {'content-type': 'text/plain'});
  response.end('Hello node!\n');
}).listen(8080);

console.log('This is my first server on port 8080');

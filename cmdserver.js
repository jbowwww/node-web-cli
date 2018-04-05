const inspect = require('util').inspect;
var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
// var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
var io = new (require('ws').Server)({ server: http });
const { spawn, exec } = require('child_process');

http.listen(8080); //listen to port 8080

function handler (req, res) { //create server
  fs.readFile(__dirname + '/public/index.html', function(err, data) { //read file index.html in public folder
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
      return res.end("404 Not Found");
    }
    res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
    res.write(data); //write data from index.html
    return res.end();
  });
}

function createMessage(message, type) {
    return JSON.stringify({
        ts: new Date(),
        type: type || 'stdout',
        message: message
    });
}

io.on('connection', function (socket) {// WebSocket Connection
	var lightvalue = 0; //static variable for current status
	console.log(`connection: socket=${inspect(socket._socket)}`)
	socket.on('message', function(data) { //get light switch status from client
    	console.log(`socket.on('message'): ${!data ? '(undef-'+(typeof data)+')' : data === '' ? '(emptystr)' : inspect(data)}`)
    	if (typeof data === 'string' && data !== '') {
			var proc = exec(data, { stdio: 'pipe' });
      		proc.stdout.on('data', data => socket.send(createMessage(data, 'stdout')));//JSON.stringify({ type: 'stdout', message: data })));
      		proc.stderr.on('data', data => socket.send(createMessage(data, 'stderr')));//JSON.stringify({ type: 'stderr', message: data })));
      		// proc.stdout.on('close', () => console.log('proc.stdout.on(\'close\')'));
		}
	});
});

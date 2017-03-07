
var Server = require('http').createServer
var Socketio = require('socket.io')
var SocketioClient = require('socket.io-client')

var http = Server().listen(9000)

var io = Socketio().attach(http)

io.on('connection', socket =>
{
	socket.on('request', data =>
	{
		console.log(data)

		socket.emit('done')
	})
})

var io_client = SocketioClient('ws://localhost:9000')

io_client.emit('request', { a: 'b' })

io_client.on('done', data =>
{
	console.log('done')
	console.log(data)

	process.exit()
})

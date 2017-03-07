
import { createServer as Server } from 'http'
import Socketio from 'socket.io'
import SocketioClient from 'socket.io-client'

import flyd from 'flyd'

var stream = flyd.stream

//

var http = Server().listen(9000)

var io = Socketio().attach(http)

//

function connections (io)
{
	var s = stream()

	io.on('connection', s)

	return s
}

flyd.on(socket =>
{
	socket.on('request', data =>
	{
		console.log(data)

		socket.emit('done')
	})
}
, connections(io))


var io_client = SocketioClient('ws://localhost:9000')

io_client.emit('request', { a: 'b' })

io_client.on('done', data =>
{
	console.log('done')
	console.log(data)

	process.exit()
})

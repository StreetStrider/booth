/* @flow */

import flyd from 'flyd'
var stream = flyd.stream

import * as servers from './lib/servers'
import client from  './lib/socketio-client'


var http = servers.http()
var io   = servers.socketio(http)

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


var io_client = client()

io_client.emit('request', { a: 'b' })

io_client.on('done', data =>
{
	console.log('done')
	console.log(data)

	process.exit()
})

io_client.on('connect_error', error =>
{
	console.log(error)
})

io_client.on('reconnect_attempt', reconnect =>
{
	console.log(reconnect)
})

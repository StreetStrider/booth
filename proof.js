/* @flow */

import flyd from 'flyd'
var stream = flyd.stream

import * as servers from './lib/servers'
import client from  './lib/socketio-client'

import Endpoint from './lib/Endpoint'


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


var client_endp = Endpoint(client())

client_endp.socket.emit('request', { a: 'b' })

client_endp.socket.on('done', data =>
{
	console.log('done')
	console.log(data)

	process.exit()
})

client_endp.socket.on('connect_error', error =>
{
	console.log(error)
})

client_endp.socket.on('reconnect_attempt', reconnect =>
{
	console.log(reconnect)
})

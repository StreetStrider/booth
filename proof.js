/* @flow */

import * as servers from './lib/servers'
import client from  './lib/socketio-client'

import Booth from './lib/Booth'
import Endpoint from './lib/Endpoint'


var http = servers.http()
var io   = servers.socketio(http)

var booth = Booth(io, (endp, socket) =>
{
	socket.on('request', data =>
	{
		console.log(data)

		socket.emit('done')
	})
})

console.log('socketio', !! booth.socketio)


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

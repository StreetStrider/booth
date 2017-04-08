/* @flow */

import { expect } from 'chai'

import * as servers from '../../lib/servers'
import client from  '../../lib/socketio-client'

import Booth from '../../Booth'
import Endpoint from '../../Endpoint'

describe('plain socket.io instance', () =>
{
	var port = 9000
	var io = servers.socketio(servers.http(port))

	it('works', () =>
	{
		var rs

		var client_endp = Endpoint(client(port))

		client_endp.socket.emit('request', { a: 'b', n: 1 })

		Booth(io, endpoint =>
		{
			var socket = endpoint.socket

			socket.on('request', data =>
			{
				expect(data).deep.eq({ a: 'b', n: 1 })

				++ data.n

				socket.emit('request-return', data)
			})

			socket.on('done', () =>
			{
				rs()
			})
		})

		client_endp.socket.on('request-return', data =>
		{
			expect(data).deep.eq({ a: 'b', n: 2 })

			client_endp.socket.emit('done')
		})

		return new Promise($rs =>
		{
			rs = $rs
		})
	})
})

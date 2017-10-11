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
		var rs1
		var rs2
		var rs3

		// eslint-disable-next-line max-statements-per-line
		var p2 = new Promise($rs => { rs2 = $rs })

		// eslint-disable-next-line max-statements-per-line
		var p3 = new Promise($rs => { rs3 = $rs })

		var client_endp = Endpoint(client(port))

		client_endp.socket.emit('request', { a: 'b', n: 1 })

		var booth = Booth(io, endpoint =>
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
				rs1(socket)
			})
		})

		var booth_noop = Booth(io)

		booth.clients.map(endpoint =>
		{
			rs2(endpoint)
		})

		booth_noop.clients.map(endpoint =>
		{
			rs3(endpoint)
		})

		client_endp.socket.on('request-return', data =>
		{
			expect(data).deep.eq({ a: 'b', n: 2 })

			client_endp.socket.emit('done')
		})

		// eslint-disable-next-line max-statements-per-line
		return (new Promise($rs => { rs1 = $rs }))
		.then(socket =>
		{
			return p2.then(endpoint =>
			{
				expect(socket).eq(endpoint.socket)

				return socket
			})
		})
		.then(socket =>
		{
			return p3.then(endpoint =>
			{
				expect(socket).eq(endpoint.socket)

				return socket
			})
		})
	})
})

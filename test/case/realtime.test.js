/* @flow */

import { expect } from 'chai'

import Promise from 'bluebird'

import flyd from 'flyd'
var stream = flyd.stream

import * as servers from '../../lib/servers'
import client from  '../../lib/socketio-client'

import Booth from '../../Booth'
import Endpoint from '../../Endpoint'

describe('Endpoint#realtime', () =>
{
	var port = 9002
	var io = servers.socketio(servers.http(port))

	it('works', () =>
	{
		var r1

		var rs1

		var client_endp = Endpoint(client(port))

		r1 = limit(client_endp.realtime('from-server'))
		.then(data =>
		{
			expect(data).deep.eq([ 1, 2, 3, 4, 5 ])
		})

		r1.then(() =>
		{
			var s = stream()

			client_endp.realtime.register('from-client', s)

			; [ 5, 4, 3, 2, 1, ':limit' ].forEach(s)
		})

		Booth(io, endp =>
		{
			var s = stream()

			endp.realtime.register('from-server', s)

			setTimeout(() =>
			{
				; [ 1, 2, 3, 4, 5, ':limit' ].forEach(s)
			})

			limit(endp.realtime('from-client'))
			.then(data =>
			{
				expect(data).deep.eq([ 5, 4, 3, 2, 1 ])

				rs1()
			})
		})

		return Promise.all(
		[
			r1,
			new Promise($rs => { rs1 = $rs }),
		])
		.then(() =>
		{
			return new Promise(rs =>
			{
				io.close(rs)
			})
		})
	})
})

function limit (stream)
{
	return new Promise(rs =>
	{
		var buffer = []

		stream.map(it =>
		{
			if (rs && (it !== ':limit'))
			{
				buffer.push(it)
			}
			else
			{
				if (rs)
				{
					rs(buffer)
					rs = null
				}
			}
		})
	})
}

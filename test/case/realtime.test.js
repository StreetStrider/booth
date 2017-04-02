/* @flow */

import { expect } from 'chai'

import Promise from 'bluebird'

import most from 'most'

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
		var rs2

		var client_endp = Endpoint(client(port))

		r1 = client_endp.realtime('from-server')
		.take(5)
		.reduce((memo, next) => memo.concat(next), [])
		.then(data =>
		{
			expect(data).deep.eq([ 1, 2, 3, 4, 5 ])
		})

		r1.then(() =>
		{
			var iter_client = most
			.from([ 5, 4, 3, 2, 1, 0, -1, -2, -3, -4 ])

			client_endp.realtime.register('from-client', iter_client)
		})

		Booth(io, endp =>
		{
			var iter = most
			.from([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ])
			.multicast()

			endp.realtime.register('from-server', iter)

			iter.drain().then(rs1)

			endp.realtime('from-client')
			.take(5)
			.reduce((memo, next) => memo.concat(next), [])
			.then(data =>
			{
				expect(data).deep.eq([ 5, 4, 3, 2, 1 ])

				rs2()
			})
		})

		return Promise.all(
		[
			r1,
			new Promise($rs => { rs1 = $rs }),
			new Promise($rs => { rs2 = $rs }),
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

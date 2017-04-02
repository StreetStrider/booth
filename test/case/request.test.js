/* @flow */

import { expect } from 'chai'

import * as servers from '../../lib/servers'
import client from  '../../lib/socketio-client'

import Booth from '../../Booth'
import Endpoint from '../../Endpoint'

describe('Endpoint#request', () =>
{
	var port = 9001
	var io = servers.socketio(servers.http(port))

	it('works', () =>
	{
		var r1

		var rs1
		var rs2
		var rs3

		var client_endp = Endpoint(client(port))

		r1 = client_endp.request('ask-server', { key: 'client' })
		.then(data =>
		{
			expect(data).deep.eq({ key_r: 'server' })
		})

		Booth(io, endp =>
		{
			endp.request.register('ask-server', data =>
			{
				expect(data).deep.eq({ key: 'client' })

				endp.request('ask-client', { key: 'server' })
				// eslint-disable-next-line max-nested-callbacks
				.then(data =>
				{
					expect(data).deep.eq({ key_r: 'client' })

					rs3()
				})

				rs1()

				return { key_r: 'server' }
			})
		})

		client_endp.request.register('ask-client', data =>
		{
			expect(data).deep.eq({ key: 'server' })

			rs2()

			return { key_r: 'client' }
		})

		return Promise.all(
		[
			r1,
			new Promise($rs => { rs1 = $rs }),
			new Promise($rs => { rs2 = $rs }),
			new Promise($rs => { rs3 = $rs }),
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

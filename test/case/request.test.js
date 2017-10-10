/* @flow */
/* global Class */
/* global Bluebird$TimeoutError */

import { expect } from 'chai'

import Promise from 'bluebird'
/* @flow-off */
var TimeoutError = (Promise.TimeoutError: Class<Bluebird$TimeoutError>)

import * as servers from '../../lib/servers'
import client from  '../../lib/socketio-client'

import Booth from '../../Booth'
import Endpoint from '../../Endpoint'

describe('Endpoint#request', () =>
{
	var port = 9001
	var io = servers.socketio(servers.http(port))

	it('works', function ()
	{
		this.timeout(7000)

		var r1
		var r2

		var rs1
		var rs2
		var rs3

		var rs4
		var rj4

		var client_endp = Endpoint(client(port))

		r1 = client_endp.request('ask-server', { key: 'client' })
		.then(data =>
		{
			expect(data).deep.eq({ key_r: 'server' })
		})

		r2 = client_endp.request('timeout-server')
		.then(() =>
		{
			throw new Error('expected timeout')
		})
		.catch(TimeoutError, () => {})

		Booth(io, endp =>
		{
			endp.request.register('ask-server', data =>
			{
				expect(data).deep.eq({ key: 'client' })

				endp.request('ask-client', { key: 'server' })
				.then(data =>
				{
					expect(data).deep.eq({ key_r: 'client' })

					rs3()
				})

				var t = endp.request('timeout-client')

				t.then(() =>
				{
					rj4(new Error('expected timeout'))
				}).catch(() => {})

				t.catch(TimeoutError, () =>
				{
					rs4()
				})

				rs1()

				return { key_r: 'server' }
			})

			endp.request.register('timeout-server', () =>
			{
				return Promise.delay(6000)
			})
		})

		client_endp.request.register('ask-client', data =>
		{
			expect(data).deep.eq({ key: 'server' })

			rs2()

			return { key_r: 'client' }
		})

		client_endp.request.register('timeout-client', () =>
		{
			return Promise.delay(6000)
		})

		return Promise.all(
		[
			r1,
			r2,
			new Promise($rs => { rs1 = $rs }),
			new Promise($rs => { rs2 = $rs }),
			new Promise($rs => { rs3 = $rs }),
			new Promise(($rs, $rj) => { [ rs4, rj4 ] = [ $rs, $rj ] }),
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

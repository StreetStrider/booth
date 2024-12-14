
import { Addr } from 'booth'

import type { Protocol } from 'booth'

import { Dispatch } from 'booth'
import { Endpoint } from 'booth'

import { once } from 'booth'
import { when } from 'booth'
import { request } from 'booth'

type Protocol_B = Protocol<'ping' | 'stat'>
type Protocol_E = Protocol<'pong' | 'stat'>

async function main ()
{
	const addr = Addr.Websocket(9000)

	const dispatch = Dispatch<Protocol_B, Protocol_E>(addr.for_dispatch())

	dispatch.on('ping', (_1, _2) => {})
	dispatch.on('ping', (data, endp) =>
	{
		data // $ExpectType string
		endp // $ExpectType Endpoint<Protocol_B, Protocol_E, Aux_Base>
	})
	dispatch.on('pong', (_1, _2) => {}) // $ExpectError
	dispatch.on('stat', (_1, _2) => {})
	dispatch.on('stat', null)           // $ExpectError

	dispatch.on(
	{
		stat () {},
		ping (data, endp)
		{
			data // $ExpectType string
			endp // $ExpectType Endpoint<Protocol_B, Protocol_E, Aux_Base>
		},
	})
	dispatch.on(
	{
		pong () {}, // $ExpectError
		stat () {},
	})

	const endp = Endpoint<Protocol_E, Protocol_B>(addr.for_endpoint())

	endp.send('ping')
	endp.send('pong')    // $ExpectError
	endp.send('stat')
	endp.send('stat', true) // $ExpectError

	endp.on('@connect', () => {})
	endp.on('ping', (_1, _2) => {}) // $ExpectError
	endp.on('pong', (_1, _2) => {})
	endp.on('pong', (data, endp) =>
	{
		data // $ExpectType string
		endp // $ExpectType Endpoint<Protocol_E, Protocol_B, Aux_Base>
	})
	endp.on('stat', (_1, _2) => {})
	endp.on('stat', null)           // $ExpectError

	endp.on(
	{
		'@connect': () => {},
		stat () {},
		pong (data, endp)
		{
			data // $ExpectType string
			endp // $ExpectType Endpoint<Protocol_E, Protocol_B, Aux_Base>
		},
	})
	endp.on(
	{
		ping () {}, // $ExpectError
		stat () {},
	})

	// *
	once(dispatch, 'ping', (data, endp) =>
	{
		data // $ExpectType string
		endp // $ExpectType Endpoint<Protocol_B, Protocol_E, Aux_Base>
	})

	once(dispatch, 'pong', (_1, _2) => {}) // $ExpectError

	once(endp, 'pong', (data, endp) =>
	{
		data // $ExpectType string
		endp // $ExpectType Endpoint<Protocol_E, Protocol_B, Aux_Base>
	})

	once(endp, 'ping', (_1, _2) => {}) // $ExpectError

	// *
	await when(dispatch, 'ping') // $ExpectType string
	await when(dispatch, 'ping', 1e3) // $ExpectType string

	await when(dispatch, 'pong') // $ExpectError

	await when(endp, 'pong') // $ExpectType string

	await when(endp, 'ping') // $ExpectError

	// *
	await request(endp, 'pong') // $ExpectType string
	await request(endp, 'pong', 'data') // $ExpectType string
	await request(endp, 'pong', 'data', 1e3) // $ExpectType string

	await request(endp, 'ping') // $ExpectError
}


import { Addr } from 'booth'

import { Protocol } from 'booth'

import { Booth } from 'booth'
import { Endpoint } from 'booth'

type Protocol_B = Protocol<'ping' | 'stat'>
type Protocol_E = Protocol<'pong' | 'stat'>

function main ()
{
	const addr = Addr.Websocket(9000)

	const booth = Booth<Protocol_B, Protocol_E>(addr.for_booth())

	booth.on('ping', (_1, _2) => {})
	booth.on('ping', (data, endp) =>
	{
		data // $ExpectType string
		endp // $ExpectType Endpoint<Protocol_B, Protocol_E, Aux>
	})
	booth.on('pong', (_1, _2) => {}) // $ExpectError
	booth.on('stat', (_1, _2) => {})
	booth.on('stat', null)           // $ExpectError

	booth.on(
	{
		stat () {},
		ping (data, endp)
		{
			data // $ExpectType string
			endp // $ExpectType Endpoint<Protocol_B, Protocol_E, Aux>
		},
	})
	booth.on(
	{
		pong () {}, // $ExpectError
		stat () {},
	})

	const endp = Endpoint<Protocol_E, Protocol_B>(addr.for_endpoint())

	endp.send('ping')
	endp.send('pong')    // $ExpectError
	endp.send('stat')
	endp.send('stat', 1) // $ExpectError

	endp.on('@connect', () => {})
	endp.on('ping', (_1, _2) => {}) // $ExpectError
	endp.on('pong', (_1, _2) => {})
	endp.on('pong', (data, endp) =>
	{
		data // $ExpectType string
		endp // $ExpectType Endpoint<Protocol_E, Protocol_B, Aux>
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
			endp // $ExpectType Endpoint<Protocol_E, Protocol_B, Aux>
		},
	})
	endp.on(
	{
		ping () {}, // $ExpectError
		stat () {},
	})
}

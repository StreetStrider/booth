
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
	booth.on('pong', (_1, _2) => {}) // $ExpectError
	booth.on('stat', (_1, _2) => {})
	booth.on('stat', null)           // $ExpectError
	booth.on('stat', (data, endp) =>
	{
		data // $ExpectType string
		endp // $ExpectType Endpoint<Protocol_Client_Defaults, Protocol<string>, Aux>
	})

	const endp = Endpoint<Protocol_E, Protocol_B>(addr.for_endpoint())

	endp.send('ping')
	endp.send('pong')    // $ExpectError
	endp.send('stat')
	endp.send('stat', 1) // $ExpectError

	endp.on('ping', (_1, _2) => {}) // $ExpectError
	endp.on('pong', (_1, _2) => {})
	endp.on('stat', (_1, _2) => {})
	endp.on('stat', null)           // $ExpectError
	endp.on('stat', (data, endp) =>
	{
		data // $ExpectType string
		endp // $ExpectType Endpoint<Protocol_Client_Defaults, Protocol<string>, Aux>
	})
}

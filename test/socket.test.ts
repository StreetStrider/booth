
import 'console-ultimate'

console.info('socket.test')

import { expect } from 'chai'

import type { Protocol } from 'booth'
import type { Endpoint } from 'booth/endpoint'

import { Dispatch } from 'booth'
import { Endpoint as Endp } from 'booth'
import { Addr } from 'booth'

import { Compose } from 'booth/midw/compose'
// import compose from 'booth/midw/compose'
import safe from 'booth/midw/safe'
import json from 'booth/midw/json'
import recoil from 'booth/midw/recoil'

import { Aof } from './kit.js'


var opens = 0
var connects = 0
var reconnects = 0
var closes = 0

var aof = Aof('socket', () =>
[
	[ 'open', 0 ],
	[ 'connect', 0 ],
	[ 1 ],
	[ 2 ],
	[ 3 ],
	[ 'close', 1 ],
	[ 'open', 1 ],
	[ 'reconnect', 0 ],
	[ 4, '>', 'Hello, World!' ],
	[ 5, '<', 'HELLO, WORLD!_hello, world!' ],
	[ 6, 'HELLO, WORLD!_hello, world!' ],
	[ 7, '>', 'request' ],
	[ 8, 'REQUEST' ],
	[ 9, '>', { json: true } ],
	[ 10, [ 'a', 'b', 'c' ] ],
	[ 'error', { name: 'expected-error' } ],
	[ 'close', 2 ],
],
() =>
{
	dispatch.close()

	expect(opens).eq(2)
	expect(connects).eq(1)
	expect(reconnects).eq(1)
	expect(closes).eq(2)
})

var addr = Addr.Websocket(9000)
console.log('WS', ...addr.view())

setTimeout(() =>
{
	endp.send('ok')
})


type Protocol_B = Protocol<'ok' | 'try' | 'hello' | 'expected-error' | 'req' | 'json'>
type Protocol_E = Protocol<'ok' | 'hello' | 'expected-error' | 'req' | 'json'>


/*
 * Dispatch(options: wss options)
 * .on(event, handler)
 * .on({ event: handler })
 */
var
dispatch = Dispatch<Protocol_B, Protocol_E>(addr.for_dispatch())
dispatch.on(
{
	ok (_, endp)
	{
		aof.track(1)

		endp.send('ok')
	},
	try (_, endp)
	{
		aof.track(3)

		/* forces reconnect: */
		endp.close()
	},
	hello (data, endp)
	{
		aof.track(4, '>', data)

		data = (data.toUpperCase() + '_' + data.toLowerCase())

		endp.send('hello', data)

		aof.track(5, '<', data)
	},
	'expected-error': Compose(safe(expected_error)).over(function foo$ ()
	{
		endp.close()

		throw new Error('foo')
	}),
	req: Compose(recoil('req')).over((data: string) =>
	{
		aof.track(7, '>', data)

		return new Promise(rs =>
		{
			setTimeout(() => rs(data.toUpperCase()))
		})
	}),
	json: Compose(recoil('json')).pipe(json()).over((data: string) =>
	{
		aof.track(9, '>', data)

		return [ 'a', 'b', 'c' ]
	}),
	'@error' ()
	{
		expect.fail()
	},
})

function expected_error (info: any)
{
	// aof.track('error', info.meta)
	aof.track('error', { name: 'expected-error' })

	expect(info).an('object')
	expect(info.error instanceof Error).eq(true)
	// expect(info.meta).deep.eq({ name: 'expected-error' })

	expect(info.args[0]).eq('Hello, World!')

	expect(info.fn).a('function')
	expect(info.fn.name).eq('foo$')
}


/*
 * Endpoint(uri: string (ws options))
 * .on(event, handler)
 * .on({ event: handler })
 */
var
endp = Endp<Protocol_E, Protocol_B>(addr.for_endpoint())
endp.on(
{
	'@open' (/* _, endp */)
	{
		aof.track('open', opens)

		opens++
	},
	'@connect' ()
	{
		aof.track('connect', connects)

		connects++
	},
	ok (/* data, endp */)
	{
		aof.track(2)

		endp.send('try')
	},
	'@reconnect' (_, endp)
	{
		aof.track('reconnect', reconnects)

		reconnects++

		endp.send('hello', 'Hello, World!')
	},
	hello (data, endp)
	{
		aof.track(6, data)

		endp.send('req', 'request')
	},
	req (data, endp)
	{
		aof.track(8, data)

		endp.send('json', '{"json":true}')
	},
	json: Compose(json({ dump: false })).over((data: string, endp: Endpoint) =>
	{
		aof.track(10, data)

		endp.send('expected-error', 'Hello, World!')
	}),
	'@close' (/* _, endp */)
	{
		closes++

		aof.track('close', closes)

		if (closes === 2)
		{
			aof.end_check()
		}
	},
	'@error' ()
	{
		expect.fail()
	},
})

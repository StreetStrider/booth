
console.info('socket.test')

import console from 'console-ultimate'

import { expect } from 'chai'

import { Booth } from '..'
import { Endpoint } from '..'
import { Addr } from '..'

import compose from '../midw/compose'
import safe from '../midw/safe'
import json from '../midw/json'
import recoil from '../midw/recoil'

var addr = Addr.Websocket(9000)

console.log('WS', ...addr.view())

var errors = 0

var buffer = []
function track (...args)
{
	var [ n ] = args

	buffer.push(n)
	console.log(...args)
}

/*
 * Booth(options: wss options)
 * .on(event, handler)
 * .on({ event: handler })
 */
var
booth = Booth(addr.for_booth())
booth.on(
{
	ok (_, endp)
	{
		track(1)
		endp.send('ok')
	},
	try (_, endp)
	{
		track(3)
		/* forces reconnect: */
		endp.close()
	},
	hello (data, endp)
	{
		track(5, data)
		expect(data).eq('Hello, World!')

		data = data.toUpperCase() + '_' + data.toLowerCase()

		endp.send('hello', data)
		track(6, data)
	},
	...compose('expected-error', safe(expected_error), function foo$ ()
	{
		throw new Error('foo')
	}),
	...compose('req', recoil(), (data) =>
	{
		track(8, data)
		expect(data).eq('request')

		return new Promise(rs =>
		{
			setTimeout(() => rs(data.toUpperCase()))
		}
		, 0)
	}),
	...compose('json', recoil(), json(), (data) =>
	{
		track(10, data)
		expect(data).deep.eq({ json: true })
		return [ 'a', 'b', 'c' ]
	}),
	'@error' (e)
	{
		console.error('WS/Booth', e.message)
		console.error(e.error)
		process.exit(1)
	},
})

function expected_error (info)
{
	console.info(info.error)
	errors++

	expect(info).an('object')
	expect(info.error instanceof Error).eq(true)
	expect(info.meta).deep.eq({ name: 'expected-error' })

	expect(info.args[0]).eq('Hello, World!')

	expect(info.fn).a('function')
	expect(info.fn.name).eq('foo$')
}


var opens = 0
var connects = 0
var reconnects = 0
var closes = 0

/*
 * Endpoint(uri: string (ws options))
 * .on(event, handler)
 * .on({ event: handler })
 */
var
endp = Endpoint(addr.for_endpoint())
endp.on(
{
	'@open' (/* _, endp */)
	{
		opens++
	},
	'@connect' ()
	{
		connects++
	},
	ok (/* data, endp */)
	{
		track(2)

		endp.send('try')
	},
	'@reconnect' (_, endp)
	{
		reconnects++

		track(4)
		endp.send('hello', 'Hello, World!')
		endp.send('expected-error', 'Hello, World!')
	},
	hello (data, endp)
	{
		track(7, data)
		expect(data).eq('HELLO, WORLD!_hello, world!')

		endp.send('req', 'request')
	},
	req (data, endp)
	{
		track(9, data)
		expect(data).eq('REQUEST')

		endp.send('json', '{"json":true}')
	},
	...compose('json', json({ dump: false }), (data, endp) =>
	{
		track(11, data)
		expect(data).deep.eq([ 'a', 'b', 'c' ])

		endp.close()

		setTimeout(() =>
		{
			expect(opens).eq(2)
			expect(connects).eq(1)
			expect(reconnects).eq(1)
			expect(closes).eq(2)

			expect(errors).eq(1)

			expect(buffer).deep.eq([ 1, 2, 3, 'END 3', 4, 5, 6, 7, 8, 9, 10, 11, 'END 11' ])

			booth.close()
		}
		, 1e3)
	}),
	'@close' (/* _, endp */)
	{
		closes++

		switch (closes)
		{
		case 1: track('END 3', '\n'); break
		case 2: track('END 11', '\n'); break
		default: expect.fail()
		}
	},
	'@error' (e)
	{
		console.error('WS/Endpoint', e.message)
		console.error(e.error)
		process.exit(1)
	},
})
endp.send('ok')

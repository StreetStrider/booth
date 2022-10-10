/* eslint max-statements: [ 2, 27 ] */

console.info('buffer.test')

import console from 'console-ultimate'

import { expect } from 'chai'

import { Booth } from '..'
import { Endpoint } from '..'
import { Addr } from '..'

import { Aof } from './kit'


var aof = Aof('buffer', () =>
[
	[ 1, 'abc' ],
	[ 2, 'ABC' ],
],
() =>
{
	endp.close()
	booth.close()
})

var addr = Addr.Websocket(9000)
console.log('WS', ...addr.view())


var
booth = Booth(addr.for_booth())
booth.on(
{
	/*
	'@message' (data, endp)
	{
	},
	*/
	'@binary' (data, endp)
	{
		expect(data instanceof Buffer).eq(true)

		data = data.toString()
		aof.track(1, data)

		data = data.toUpperCase()
		data = Buffer.from(data)

		endp.send(data)
	},
	'@error' ()
	{
		expect.fail()
	},
})


var
endp = Endpoint(addr.for_endpoint())
endp.on(
{
	'@open' (_, endp)
	{
		endp.send(Buffer.from('abc'))
	},
	'@binary' (data)
	{
		expect(data instanceof Buffer).eq(true)

		data = data.toString()
		aof.track(2, data)

		aof.end_check()
	},
	'@error' ()
	{
		expect.fail()
	},
})

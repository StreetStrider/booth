/* eslint max-statements: [ 2, 27 ] */

import 'console-ultimate'

console.info('buffer.test')

import { expect } from 'chai'

import { Dispatch } from 'booth'
import { Endpoint } from 'booth'
import { Addr } from 'booth'

import { Aof } from './kit.js'


var aof = Aof('buffer', () =>
[
	[ 1, 'abc' ],
	[ 2, 'ABC' ],
],
() =>
{
	endp.close()
	dispatch.close()
})

var addr = Addr.Websocket(9000)
console.log('WS', ...addr.view())


var
dispatch = Dispatch(addr.for_dispatch())
dispatch.on(
{
	/*
	'@message' (data, endp)
	{
	},
	*/
	'@binary' ($data, { endp })
	{
		expect($data instanceof Buffer).eq(true)

		let data: any = $data.toString()

		aof.track(1, data)
		data = data.toUpperCase()

		endp.send(Buffer.from(data))
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
	'@open' (_, { endp })
	{
		endp.send(Buffer.from('abc'))
	},
	'@binary' (data)
	{
		expect(data instanceof Buffer).eq(true)

		aof.track(2, data.toString())

		aof.end_check()
	},
	'@error' ()
	{
		expect.fail()
	},
})

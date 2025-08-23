
import 'console-ultimate'

console.info('recv.test')

import { expect } from 'chai'

import type { Protocol } from 'booth'
import type { Endpoint } from 'booth/endpoint'

import { Dispatch } from 'booth'
import { Endpoint as Endp } from 'booth'
import { Addr } from 'booth'

import Compose from 'booth/midw/compose'
import safe from 'booth/midw/safe'
import json from 'booth/midw/json'
import recoil from 'booth/midw/recoil'

import { Aof } from './kit.js'


var aof = Aof('recv', () =>
[
	[ [ 'E', '@@booth:0.16' ] ],
	[ [ 'B', '@ok:' ] ],
	[ 1 ],
	[ [ 'E', '@ok:' ] ],
	[ 2 ],
],
() =>
{
	dispatch.close()
})

var addr = Addr.Websocket(9000)
console.log('WS', ...addr.view())

setTimeout(() =>
{
	endp.send('ok')
})


type Protocol_B = Protocol<'ok'>
type Protocol_E = Protocol<'ok'>


var
dispatch = Dispatch<Protocol_B, Protocol_E>(addr.for_dispatch())
dispatch.on(
{
	ok (_, { endp })
	{
		aof.track(1)

		endp.send('ok')
	},
	'@recv' (msg)
	{
		aof.track([ 'B', msg ])
	},
	'@error' ()
	{
		expect.fail()
	},
})


/*
 * Endpoint(uri: string (ws options))
 * .on(event, handler)
 * .on({ event: handler })
 */
var
endp = Endp<Protocol_E, Protocol_B>(addr.for_endpoint())
endp.on(
{
	ok (_, { endp })
	{
		aof.track(2)
		endp.close()
	},
	'@recv' (msg)
	{
		aof.track([ 'E', msg ])
	},
	'@error' ()
	{
		expect.fail()
	},
	'@close' ()
	{
		aof.end_check()
	},
})

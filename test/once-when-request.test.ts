/* eslint max-statements: [ 2, 27 ] */

import 'console-ultimate'

console.info('once-when-request.test')

import { expect } from 'chai'

import type { Protocol } from 'booth'

import { Dispatch } from 'booth'
import { Endpoint } from 'booth'
import { Addr } from 'booth'

import { once } from 'booth'
import { when } from 'booth'
import { request } from 'booth'

import Compose from 'booth/midw/compose'
import recoil from 'booth/midw/recoil'

import delay from '../_/delay.js'

import { Aof } from './kit.js'


type Protocol_B = Protocol<'req' | 'req_slow'>
type Protocol_E = Protocol<'req' | 'req_slow'>


var aof = Aof('once-when-request', () =>
[
	[ 1, 'OK 110' ],
	[ 1, 'OK 110' ],
	[ 1, 'OK 111' ],
	[ 1, 'OK 112' ],

	[ 2, 'OK 120' ],
	[ 2, 'OK 120' ],
	[ 2, 'OK 121' ],
	[ 2, 'OK 122' ],

	[ 3, 'Timeout' ],

	[ 4, 'OK 140' ],
	[ 4, 'OK 141' ],
	[ 4, 'OK 142' ],

	[ 5, 'Timeout' ],
],
() =>
{
	endp.close()
	dispatch.close()
})

var addr = Addr.Websocket(9000)
console.log('WS', ...addr.view())


var
dispatch = Dispatch<Protocol_B, Protocol_E>(addr.for_dispatch())
dispatch.on(
{
	req: Compose(recoil()).over(data =>
	{
		return `OK ${ +data + 100 }`
	}),

	req_slow: Compose(recoil()).over(async (data) =>
	{
		await delay(250)
		return `OK ${ +data + 100 }`
	}),

	'@error' ()
	{
		expect.fail()
	},
})


var
endp = Endpoint<Protocol_E, Protocol_B>(addr.for_endpoint())
endp.on(
{
	async '@open' (_, { endp })
	{
		endp.send('req', 10)
		once(endp, 'req', (data) =>
		{
			aof.track(1, data)
		})

		// endp.send('req', 0) // sent by prev
		aof.track(1, await when(endp, 'req'))

		endp.send('req', 11)
		aof.track(1, await when(endp, 'req', Infinity))

		endp.send('req', 12)
		aof.track(1, await when(endp, 'req', 10e3))

		endp.send('req_slow', 20)
		once(endp, 'req_slow', (data) =>
		{
			aof.track(2, data)
		})

		// endp.send('req_slow', 0) // sent by prev
		aof.track(2, await when(endp, 'req_slow'))

		endp.send('req_slow', 21)
		aof.track(2, await when(endp, 'req_slow', Infinity))

		endp.send('req_slow', 22)
		aof.track(2, await when(endp, 'req_slow', 10e3))

		try
		{
			endp.send('req_slow', 0)
			aof.track('x', await when(endp, 'req_slow', 100))
		}
		catch (e: any)
		{
			aof.track(3, e.message)
		}

		await when(endp, 'req_slow', Infinity) // skip

		aof.track(4, await request(endp, 'req_slow', 40))
		aof.track(4, await request(endp, 'req_slow', 41, Infinity))
		aof.track(4, await request(endp, 'req_slow', 42, 10e3))

		try
		{
			aof.track('x', await request(endp, 'req_slow', 0, 100))
		}
		catch (e: any)
		{
			aof.track(5, e.message)
		}

		aof.end_check()
	},
	'@error' ()
	{
		expect.fail()
	},
})

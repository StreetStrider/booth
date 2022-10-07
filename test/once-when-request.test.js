
console.info('once-when-request.test')

import console from 'console-ultimate'

import delay from 'aux.js/async/delay'

import { expect } from 'chai'

import { Booth } from '..'
import { Endpoint } from '..'
import { Addr } from '..'

import { once } from '..'
import { when } from '..'

import compose from '../midw/compose'
// import safe from '../midw/safe'
// import json from '../midw/json'
import recoil from '../midw/recoil'

import { Aof } from './kit'


var aof = Aof('once-when-request', () =>
[
	[ 1, 'OK' ],
	[ 2, 'OK' ],
	[ 3, 'OK' ],
	[ 4, 'OK' ],
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
	...compose('req', recoil(), () =>
	{
		return 'OK'
	}),

	...compose('req_slow', recoil(), async () =>
	{
		await delay(500)
		return 'OK'
	}),

	'@error' ()
	{
		expect.fail()
	},
})


var
endp = Endpoint(addr.for_endpoint())
endp.on(
{
	async '@open' (_, endp)
	{
		endp.send('req')
		once(endp, 'req', (data) =>
		{
			aof.track(1, data)
		})

		endp.send('req')
		aof.track(2, await when(endp, 'req'))

		endp.send('req_slow')
		once(endp, 'req_slow', (data) =>
		{
			aof.track(3, data)
		})

		endp.send('req_slow')
		aof.track(4, await when(endp, 'req_slow'))

		aof.end_check()
	},
	'@error' ()
	{
		expect.fail()
	},
})
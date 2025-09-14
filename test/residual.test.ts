
// import Why from 'why-is-node-running'

import 'console-ultimate'

console.info('residual.test')

// import { expect } from 'chai'

// import { once } from 'node:events'
// import { execSync as exec } from 'node:child_process'
// import { spawn } from 'node:child_process'

import type { Protocol } from 'booth'
// import type { Endpoint } from 'booth/endpoint'

import { Residual } from 'booth'
// import { Endpoint as Endp } from 'booth'
import { Addr } from 'booth'

// import Events from '../_/Events.js'

// import when from '../_/when.js'
// import delay from '../_/delay.js'
// import random from '../_/random.js'
// import { timeout } from '../_/timeout.js' /* TODO: */

// import logthru from '../_/logthru.js'

import { Aof } from './kit.js'


var aof = Aof('residual', () =>
[
	[ 'connect', 1 ],
	[ 'connect', 2 ],
	[ 3 ],
	[ 4 ],
],
() =>
{
	residual.close()
})


var addr = Addr.Websocket(9000)
console.log('WS', ...addr.view())


// TODO: reconnect() as a method?

type Protocol_B = Protocol<'ping'>
type Protocol_E = Protocol<'pong'>


var residual = Residual({ addr, server, client })


// endp = Endp<Protocol_E, Protocol_B>(addr.for_endpoint())
/*
endp.on(
{
	'@error' (...args)
	{
		console.log(...args)
		process.exit()
	}
})
//*/

function server (wss: any)
{
	wss.on('@connect', () =>
	{
		aof.track('connect', 1)
	})

	wss.on('foo', (_: any, { endp }: any) =>
	{
		aof.track(3)

		endp.send('bar')

		setTimeout(() =>
		{
			aof.end()
			process.exit()
		})
	})
}

function client (endp: any)
{
	endp.on('@connect', () =>
	{
		aof.track('connect', 2)

		endp.send('foo')
	})
	endp.on('bar', () =>
	{
		aof.track(4)

		aof.end_check()
	})
}

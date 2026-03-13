
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


import { Aof } from './kit.js'
import { testing_executable } from './kit.js'


var aof = Aof('residual', () =>
[
	[ 'listening' ],
	[ 'open', 'server' ],
	[ 'connect', 'server' ],
	[ 'open', 'client', 1 ],
	[ 'connect', 'client', 1 ],
	[ 'ping' ],
	[ 'pong' ],
	[ 'close', 'client', 1 ],
	[ 'open', 'server' ],
	[ 'connect', 'server' ],
	[ 'open', 'client', 2 ],
	[ 'reconnect', 'client', 2 ],
	[ 'ping' ],
	[ 'pong' ],
	[ 'close', 'client', 2 ]
],
() =>
{
	residual.close()
})


var addr = Addr.Websocket(9009)
console.log('WS', ...addr.view())


type Protocol_B = Protocol<'ping'>
type Protocol_E = Protocol<'pong'>


var residual = Residual(
{
	addr,
	exe: testing_executable(),
	logthru: true,
	Server,
	Client,
})


// endp = Endp<Protocol_E, Protocol_B>(addr.for_endpoint())


function Server (wss: any)
{
	console.log('SERVER')

	wss.on('@listening', () =>
	{
		aof.track('listening')
	})

	wss.on('@open', () =>
	{
		aof.track('open', 'server')
	})

	wss.on('@connect', () =>
	{
		aof.track('connect', 'server')
	})

	wss.on('ping', (_: any, { endp }: any) =>
	{
		aof.track('ping')

		endp.send('pong')

		/*
		setTimeout(() =>
		{
			console.info('OK')

			aof.end()
		})//*/
	})

	wss.on('do-close', (_: any, { endp }: any) =>
	{
		endp.close()
	})

	wss.on('do-quit', (_: any, { endp }: any) =>
	{
		// console.debug('do-quit')
		endp.close()
		// residual.close()

		//*
		setTimeout(() =>
		{
			console.info('OK')

			aof.end()
		})//
	})
}

function Client (endp: any)
{
	var n = 0

	endp.on('@upstart', (child: any) =>
	{
		/* should not fire */
		aof.track('upstart')
	})
	endp.on('@open', () =>
	{
		n++
		aof.track('open', 'client', n)
	})
	endp.on('@connect', () =>
	{
		aof.track('connect', 'client', n)

		endp.send('ping')
	})
	//*
	endp.on('@reconnect', () =>
	{
		aof.track('reconnect', 'client', n)

		endp.send('ping')
	})//*/
	endp.on('pong', () =>
	{
		aof.track('pong')

		if (n === 1)
		{
			endp.send('do-close')
		}
		if (n === 2)
		{
			endp.send('do-quit')
		}
	})
	endp.on('@close', () =>
	{
		aof.track('close', 'client', n)

		if (n === 2)
		{
			// endp.send('do-quit')
			endp.close()

			aof.end_check()
		}
	})
}

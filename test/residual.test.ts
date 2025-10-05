
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
import { testing_executable } from './kit.js'


var aof = Aof('residual', () =>
[
	[ 'listening' ],
	[ 'open', 1 ],
	[ 'connect', 1 ],
	[ 'open', 2 ],
	[ 'connect', 2 ],
	[ 'ping' ],
	[ 'pong' ],
],
() =>
{
	residual.close()
})


var addr = Addr.Websocket(9000)
console.log('WS', ...addr.view())


type Protocol_B = Protocol<'ping'>
type Protocol_E = Protocol<'pong'>


var residual = Residual(
{
	addr,
	exe: testing_executable(),
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
		aof.track('open', 1)
	})

	wss.on('@connect', () =>
	{
		aof.track('connect', 1)
	})

	wss.on('ping', (_: any, { endp }: any) =>
	{
		aof.track('ping')

		endp.send('pong')

		setTimeout(() =>
		{
			console.log('OK')

			aof.end()
		})
	})

	wss.on('do-close', (_: any, { endp }: any) =>
	{
		endp.close()
	})

	wss.on('do-quit', (_: any, { endp }: any) =>
	{
		residual.close()
	})
}

function Client (endp: any)
{
	endp.on('@open', () =>
	{
		aof.track('open', 2)
	})
	endp.on('@connect', () =>
	{
		aof.track('connect', 2)

		endp.send('ping')
	})
	endp.on('pong', () =>
	{
		aof.track('pong')

		endp.send('do-close')
	})
	endp.on('@close', () =>
	{
		aof.end_check()
	})
}

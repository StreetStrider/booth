
// import Why from 'why-is-node-running'

import 'console-ultimate'

console.info('residual.test')

// import { expect } from 'chai'

import { once } from 'node:events'
import { execSync as exec } from 'node:child_process'
import { spawn } from 'node:child_process'

import type { Protocol } from 'booth'
import type { Endpoint } from 'booth/endpoint'

import { Dispatch } from 'booth'
import { Endpoint as Endp } from 'booth'
import { Addr } from 'booth'

import Events from '../_/Events.js'

import when from '../_/when.js'
import delay from '../_/delay.js'
import random from '../_/random.js'
import { timeout } from '../_/timeout.js' /* TODO: */

import logthru from '../_/logthru.js'

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


var Id = 1

function Residual
(
{
	addr,
	server,
	client,
}: any
)
	: any
{
	if (is_residual())
	{
		logthru('app_example')

		var wss = Dispatch(addr.for_dispatch())

		var ready: any = capture(server, wss)
		.then(async () =>
		{
			await when(wss, '@listening')

			process.send!('@residual')
		})
		.then(() => wss)

		var close = function close ()
		{
			wss.close()
		}

		return { ready, close }
	}


	var endp: any
	var events = Events()

	var ok = false

	var retries = 0
	var retries_max = 2


	async function main ()
	{
		await attempt(connect_and_ping)

		for (;;)
		{
			if (ok) break
			retries++

			if (retries > retries_max) break
			// console.info('retry:', retries, 'max:', retries_max)

			if (retries > 1)
			{
				await delay(random(1, 5) * 100./* ms */)
			}

			// await attempt(upstart)
			await upstart()
			await attempt(connect_and_ping)
		}

		if (! ok)
		{
			throw new Error(`unable_to_residual (retries: ${ retries_max })`)
		}

		// TODO: single process mode?
	}

	async function connect_and_ping ()
	{
		await connect()
		await ping()

		ok = true
		retries = 0
	}

	async function connect ()
	{
		/* @ts-expect-error */
		endp = Endp(addr.for_endpoint(), { should_reconnect: false }, { events })

		var id = Id++

		var on_connect = when(endp, '@connect')
		var on_error   = when(endp, '@error').then(e =>
		{
			if (e.error.code !== 'ECONNREFUSED')
			{
				console.warn('uncommon reconnect error', e)
			}
			throw e
		})

		await Promise.race([ on_connect, on_error ])
	}

	async function ping ()
	{
		var rs = await when(endp, '@recv', 100./* ms */)

		if (typeof rs !== 'string')
		{
			throw new Error('not_a_booth')
		}
		if (! rs.match(/^@@booth:/))
		{
			throw new Error('not_a_booth')
		}
	}

	async function upstart ()
	{
		var exe = 'tsx' // process.execPath
		var argv =
		[
			process.argv[1],
			'--residual',
		]
		var options =
		{
			// stdio: 'ignore',
			stdio: [ 'ignore', 'ignore', 'ignore', 'ipc' ] as any,
			detached: true,
		} as const

		var child = spawn(exe, argv, options)

		try
		{
			var spawned = once(child, 'message')

			var [ msg ] = await Promise.race([ spawned, timeout(5e3) ])

			if (msg !== '@residual')
			{
				throw new Error('not_a_residual')
			}
		}
		catch (e)
		{
			child.kill();
		}

		/* child.stdout.pipe(process.stdout) */
		/* child.stderr.pipe(process.stderr) */

		child.channel?.unref()
		child.unref()

		return child
	}

	async function attempt (fn: any, fn_recover: any = noop)
	{
		if (ok) return

		try
		{
			await fn()
		}
		catch (e)
		{
			ok = false

			// try
			// {
			// 	await fn_recover(e)
			// }
			// catch (e)
			// {
			// 	console.log('Unrecoverable:', e)
			// }
		}
	}

	function reconnect ()
	{
		if (! ok) return
		ok = false

		main()
	}

	// TODO:
	// events.on('close', reconnect)

	var ready: any = main()
	.then(() => client && capture(client, endp))
	.then(() =>
	{
		/* instantly opened when under Residual Endpoint */
		events.emit('@connect', void 0, { endp })
	})
	.then(() => endp)

	var close = function close ()
	{
		endp?.close()
	}

	return { ready, close }
}


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


function is_residual ()
{
	return process.argv.includes('--residual')
}

async function capture (fn: any, ...args: any)
{
	return fn(...args)
}

async function kill_residual ()
{
	// exec("pkill -f '\\-\\-residual' || true", { stdio: 'inherit' })
	// await delay(1000)
}

function noop () {}

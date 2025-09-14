/* eslint max-statements: [ 1, 21 ] */

import { once }  from 'node:events'
import { spawn } from 'node:child_process'

// import type { Protocol } from 'booth'
// import type { Endpoint } from 'booth/endpoint'

import Dispatch from './Dispatch.js'
import Endpoint from './Endpoint.js'

import Events from './_/Events.js'

import when from './_/when.js'
import delay from './_/delay.js'
import random from './_/random.js'
import { timeout } from './_/timeout.js' /* TODO: */

import logthru from './_/logthru.js'


export default function Residual ({ addr, server, client, })
{
	if (process.argv.includes('--residual'))
	{
		logthru('app_example')

		var wss = Dispatch(addr.for_dispatch())

		var ready = capture(server, wss)
		.then(async () =>
		{
			await when(wss, '@listening')

			process.send('@residual')
		})
		.then(() => wss)

		var close = function close ()
		{
			wss.close()
		}

		return { ready, close }
	}


	var endp
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
		endp = Endpoint(addr.for_endpoint(), { should_reconnect: false }, { events })

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
			stdio: [ 'ignore', 'ignore', 'ignore', 'ipc' ],
			detached: true,
		}

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
		catch
		{
			child.kill()
		}

		/* child.stdout.pipe(process.stdout) */
		/* child.stderr.pipe(process.stderr) */

		child.channel?.unref()
		child.unref()

		return child
	}

	async function attempt (fn)
	{
		if (ok) return

		try
		{
			await fn()
		}
		catch
		{
			ok = false
		}
	}

	/*
	function reconnect ()
	{
		if (! ok) return
		ok = false

		main()
	}
	*/

	// TODO:
	// events.on('close', reconnect)

	var ready = main()
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


async function capture (fn, ...args)
{
	return fn(...args)
}

/* eslint max-statements: [ 1, 23 ] */

import { once }  from 'node:events'
import { spawn } from 'node:child_process'

import Dispatch from './Dispatch.js'
import Endpoint from './Endpoint.js'

import Events from './_/Events.js'

import when from './_/when.js'
import delay from './_/delay.js'
import random from './_/random.js'
import { Timeouted } from './_/timeout.js'

import logthru from './_/logthru.js'


var defaults =
{
	name: 'app_example',
	exe: process.execPath,
	Server () {},
	Client () {},
	retries_max: 2,
	timeout: 5e3,
}


export default function Residual (options)
{
	options = { ...defaults, ...options }

	var addr = options.addr

	if (process.argv.includes('--residual'))
	{
		logthru(options.name)

		var wss = Dispatch(addr.for_dispatch())

		var Server = options.Server

		Promise.resolve().then(() =>
		{
			Server?.(wss)
		})
		.then(() => when(wss, '@listening'))
		.then(() => process.send('@listening'))
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


	async function main ()
	{
		await attempt(connect_and_ping)

		for (;;)
		{
			if (ok) break
			retries++

			if (retries > options.retries_max) break
			/* console.info('retry:', retries, 'max:', options.retries_max) */

			if (retries > 1)
			{
				await delay(random(1, 5) * 100./* ms */)
			}

			await attempt(upstart)
			await attempt(connect_and_ping)
		}

		if (! ok)
		{
			throw new Error(`unable_to_residual (retries: ${ options.retries_max })`)
		}

		/* TODO: fallback in single process mode */
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
		var argv =
		[
			process.argv[1], /* TODO: test deno compile, provide option */
			'--residual',
		]
		var spawn_options =
		{
			stdio: [ 'ignore', 'ignore', 'ignore', 'ipc' ],
			detached: true,
		}

		var child = spawn(options.exe, argv, spawn_options)

		try
		{
			var spawned = once(child, 'message')
			var [ msg ] = await Timeouted(spawned, options.timeout)

			if (msg !== '@listening')
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

	var Client = options.Client

	var ready = main()
	.then(() => Client?.(endp))
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

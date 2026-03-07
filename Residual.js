/* eslint max-statements: [ 1, 23 ] */

import { once }  from 'node:events'
import { spawn } from 'node:child_process'

import Dispatch from './Dispatch.js'
import Endpoint from './Endpoint.js'

import Events from './_/Events.js'

import when from './_/when.js'
import delay from './_/delay.js'
import random from './_/random.js'
import { Timeouted as Timeout } from './_/timeout.js'
import { race } from './_/timeout.js'

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

	if (process.argv.includes('--residual'))
	{
		return Server(options)
	}
	else
	{
		return Client(options)
	}
}


//::
function Server (options)
{
	logthru(options.name)

	var wss = Dispatch(options.addr.for_dispatch())

	var ready = Promise.resolve().then(() =>
	{
		var Server = options.Server
		Server?.(wss)
	})
	.then(() => when(wss, '@listening'))
	.then(() => process.send('@listening'))
	.then(() => wss)

	function close ()
	{
		wss.close()
	}

	return { ready, close }
}


//::
function Client (options)
{
	var endp
	var events = Events()

	var ok = false
	var retries = 0


	async function main ()
	{
		await progress(connect_and_ping)

		while (! ok)
		{
			retries++
			if (retries > options.retries_max) break

			//*
			console.debug('retry:', retries, 'max:', options.retries_max) //*/

			if (retries > 1)
			{
				await delay(random(1, 5) * 100./* ms */)
			}

			await progress(upstart)
			await progress(connect_and_ping)
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
		endp = Endpoint(options.addr.for_endpoint(), { should_reconnect: false }, { events })

		var on_connect = when(endp, '@connect')

		var on_error = when(endp, '@error')
		var timer = on_error.timer
		on_error = on_error.then(e =>
		{
			if (e.error.code !== 'ECONNREFUSED')
			{
				console.warn('uncommon reconnect error', e)
			}
			throw e
		})
		on_error.timer = timer

		await race(on_connect, on_error)
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
		console.info('UPSTART')
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
			var [ msg ] = await Timeout(spawned, options.timeout)

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

	async function progress (fn)
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
	// NOTE: reconnect will require carefully determining "leader"
	// NOTE: consider implementing watchdog on the residual side instead
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
		events.emit('@open',    void 0, { endp })
		events.emit('@connect', void 0, { endp })
	})
	.then(() => endp)

	function close ()
	{
		endp?.close()
	}

	return { ready, close }
}

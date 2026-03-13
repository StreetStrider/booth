/* eslint max-statements: [ 1, 23 ] */

import { once }  from 'node:events'
import { spawn } from 'node:child_process'

import Dispatch from './Dispatch.js'
import Endpoint from './Endpoint.js'

import logthru from './_/logthru.js'

import Events from './_/Events.js'

import when from './_/when.js'
import delay from './_/delay.js'
import random from './_/random.js'
import { Timeouted } from './_/timeout.js'
import { when_connected } from './_/when-status.js'
import { when_closed } from './_/when-status.js'


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
		wss?.close()
		wss = null
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


	async function setup ()
	{
		await progress(open_and_ping)

		while (! ok)
		{
			retries++
			if (retries > options.retries_max) break

			/*
			console.debug('retry:', retries, 'max:', options.retries_max) //*/

			if (retries > 1)
			{
				await delay(random(1, 5) * 100./* ms */)
				await progress(open_and_ping)
			}

			await progress(upstart)
			await progress(open_and_ping)
		}


		if (! ok)
		{
			throw new Error(`unable_to_residual (retries: ${ options.retries_max })`)
		}
		/* TODO: fallback in single process mode */
	}

	async function open_and_ping ()
	{
		// console.log(111, endp?.status())
		await (endp && when_closed(endp))
		// console.log(222, endp?.status())
		await open()
		await ping()

		ok = true
		retries = 0
	}

	async function open ()
	{
		if (! endp)
		{
			var endp_options =
			{
				should_reconnect: false,
				should_cleanup: false,
			}

			endp = Endpoint(options.addr.for_endpoint(), endp_options, { events })
		}
		else
		{
			endp.open()
		}

		await when_connected(endp)
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

		events.emit('@upstart', void 0, { endp })
		/* return child */
	}

	async function progress (fn) /* eslint-disable-line complexity */
	{
		if (ok) return

		try
		{
			await fn()
		}
		catch (e)
		{
			ok = false

			if (e?.error?.code === 'ECONNREFUSED') return
			if (e?.message === 'Timeout') return

			console.error('PROGRESS', e)
		}
	}

	//*
	// TODO: reconnect
	// NOTE: reconnect will require carefully determining "leader"
	// NOTE: consider implementing watchdog on the residual side instead
	function reconnect ()
	{
		if (! ok) return
		if (! endp) return

		ok = false

		setup()//.then(console.info, console.error)
	}

	events.on('@close', reconnect)
	//*/

	var Client = options.Client

	var ready = setup()
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
		endp = null
	}

	return { ready, close }
}

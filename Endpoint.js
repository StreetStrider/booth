/* @flow */
/* global Booth$Socket */
/* global $Promisable */
/* global Bluebird$Promise */
/* global flyd$Stream */

; type Booth$Endpoint$Request$Handler = (data: any) => $Promisable<any>


; type Booth$Endpoint$Request =
{
	(name: string, data?: any): Bluebird$Promise<any>,
	register (name: string, handler: Booth$Endpoint$Request$Handler): void,
}

; type Booth$Request$Awaiters<Key> =
{
	[id: Key]: [ Function, Function ], // [ rj, rs ]
}

; type Booth$Request$Handlers =
{
	[name: string]: (data: any) => Bluebird$Promise<any>,
}


; export type Booth$Stream = flyd$Stream<any>

; type Booth$Endpoint$Realtime =
{
	(name: string): Booth$Stream,
	dispatch (name: string, data: any): void,
	register (name: string, stream: Booth$Stream): void,
}


; export type Booth$Endpoint =
{
	socket:   Booth$Socket,

	request:  Booth$Endpoint$Request,
	realtime: Booth$Endpoint$Realtime,

	release: () => void,
}

;

import Promise from 'bluebird'
var method = Promise.method

import flyd from 'flyd'
var stream = flyd.stream
var on = flyd.on

import Seq from './lib/seq'
import  ns from './lib/ns-booth'

import keys from './lib/keys'

var timeout = 5 * 1000

export default function Endpoint (socket: Booth$Socket): Booth$Endpoint
{
	var endpoint = {}

	var instance = Math.random().toString(36).slice(-5).toUpperCase()

	endpoint.socket = socket

	endpoint.release = () =>
	{
		$request_awaiters = {}
		$request_handlers = {}
		socket.removeAllListeners(ns(keys.request))
		socket.removeAllListeners(ns(keys.request_return))
		socket.removeAllListeners(ns(keys.realtime))
	}

	//
	var seq = Seq()
	var $request_awaiters: Booth$Request$Awaiters<string> = {}

	endpoint.request = (name, data) =>
	{
		var id = `${ seq() }.${ instance }`

		socket.emit(ns(keys.request), [ name, id, data ])

		return new Promise((rs, rj) =>
		{
			$request_awaiters[id] = [ rj, rs ]
		})
		.timeout(timeout)
		.finally(() =>
		{
			delete $request_awaiters[id]
		})
	}

	var $request_handlers: Booth$Request$Handlers = {}

	endpoint.request.register = (name, handler) =>
	{
		$request_handlers[name] = method(handler)
	}

	socket.on(ns(keys.request), (tuple) =>
	{
		if (! Array.isArray(tuple)) return
		if (tuple.length < 3) return

		var [ name, id, data ] = tuple
		if (typeof name !== 'string') return

		if (name in $request_handlers)
		{
			$request_handlers[name](data)
			.timeout(timeout)
			.then(
			resp =>
			{
				socket.emit(ns(keys.request_return), [ 1, id, resp ])
			},
			resp =>
			{
				socket.emit(ns(keys.request_return), [ 0, id, resp ]) // TODO resp?
			})
		}
	})

	socket.on(ns(keys.request_return), (tuple) =>
	{
		if (! Array.isArray(tuple)) return
		if (tuple.length < 3) return

		var [ state, id, data ] = tuple
		if (typeof state !== 'number') return

		if (id in $request_awaiters)
		{
			if ((state === 0) || (state === 1))
			{
				$request_awaiters[id][state](data)
			}
		}
	})


	//
	endpoint.realtime = (name) =>
	{
		var s = stream()
		var nsname = ns(keys.realtime, name)

		socket.on(nsname, s)
		on(end => end && socket.removeListener(nsname, s), s.end)
		socket.once('disconnect', () => s.end(true))

		return s
	}

	endpoint.realtime.dispatch = (name, data) =>
	{
		socket.emit(ns(keys.realtime, name), data)
	}

	endpoint.realtime.register = (name, stream) =>
	{
		on(data => endpoint.realtime.dispatch(name, data), stream)
	}

	return endpoint
}

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

import tup3 from './lib/tup3'

var timeout = 5 * 1000

export default function Endpoint (socket: Booth$Socket): Booth$Endpoint
{
	var seq = Seq()

	var instance = Math.random().toString(36).slice(-5).toUpperCase()

	var awaiters: Booth$Request$Awaiters<string> = {}
	var handlers: Booth$Request$Handlers         = {}


	var endpoint =
	{
		socket,
		request,
		realtime,
	}


	socket.once('disconnect', () =>
	{
		awaiters = {}
		handlers = {}
		socket.removeAllListeners(ns(keys.request))
		socket.removeAllListeners(ns(keys.request_return))
		socket.removeAllListeners(ns(keys.realtime))
	})


	/* .request */
	function request (name, data)
	{
		var id = `${ seq() }.${ instance }`

		socket.emit(ns(keys.request), [ name, id, data ])

		return new Promise((rs, rj) =>
		{
			awaiters[id] = [ rj, rs ]
		})
		.timeout(timeout)
		.finally(() =>
		{
			delete awaiters[id]
		})
	}

	request.register = (name, handler) =>
	{
		handlers[name] = method(handler)
	}

	socket.on(ns(keys.request),
		tup3('string', (name: string, id: string, data: any) =>
	{
		if (name in handlers)
		{
			handlers[name](data)
			.timeout(timeout)
			.then(
			resp =>
			{
				socket.emit(ns(keys.request_return), [ 1, id, resp ])
			},
			resp =>
			{
				/* TODO guard resp?: */
				socket.emit(ns(keys.request_return), [ 0, id, resp ])
			})
		}
	}))

	socket.on(ns(keys.request_return),
		tup3('number', (state: number, id: string, data: any) =>
	{
		if (id in awaiters)
		{
			if ((state === 0) || (state === 1))
			{
				awaiters[id][state](data)
			}
		}
	}))
	/* - */


	/* #realtime */
	function realtime (name)
	{
		var s = stream()
		var nsname = ns(keys.realtime, name)

		socket.on(nsname, s)
		on(end => end && socket.removeListener(nsname, s), s.end)
		socket.once('disconnect', () => s.end(true))

		return s
	}

	realtime.dispatch = (name, data) =>
	{
		socket.emit(ns(keys.realtime, name), data)
	}

	realtime.register = (name, stream) =>
	{
		on(data => endpoint.realtime.dispatch(name, data), stream)
	}
	/* - */

	return endpoint
}

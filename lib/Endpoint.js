/* @flow */
/* global Booth$Socket */
/* global $Promisable */
/* global Bluebird$Promise */

; type Booth$Endpoint$Request$Handler = (data: any) => $Promisable<any>

; type Booth$Endpoint$Request =
{
	(name: string, data?: any): Bluebird$Promise<any>,
	register (name: string, handler: Booth$Endpoint$Request$Handler): void,
}

; type Booth$Request$Rs<Key> =
{
	[id: Key]: [ Function, Function ], // [ rj, rs ]
}

; type Booth$Request$Handlers =
{
	[name: string]: (data: any) => Bluebird$Promise<any>,
}


; type Booth$Endpoint$Realtime =
{
	(name: string): any, // here realtime
	register (name: string): any, // TODO connect realtime
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

import Seq from './seq'
import  ns from './ns-booth'

import keys from './keys'

var timeout = 60 * 1000

export default function Endpoint (socket: Booth$Socket): Booth$Endpoint
{
	var endpoint = {}

	endpoint.socket = socket

	endpoint.release = () =>
	{
		$request_rs = {}
		$request_handlers = {}
		socket.removeAllListeners(ns(keys.request))
		socket.removeAllListeners(ns(keys.request_return))
	}

	//
	var seq = Seq()
	var $request_rs: Booth$Request$Rs<number> = {}

	endpoint.request = (name, data) =>
	{
		var id: number = seq()

		socket.emit(ns(keys.request), [ name, id, data ])

		return new Promise((rs, rj) =>
		{
			$request_rs[id] = [ rj, rs ]
		})
		.timeout(timeout)
		.finally(() =>
		{
			delete $request_rs[id]
		})
	}

	var $request_handlers: Booth$Request$Handlers = {}

	endpoint.request.register = (name, handler) =>
	{
		$request_handlers[name] = method(handler)
	}

	socket.on(ns(keys.request), ([ name, id, data ]) =>
	{
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

	socket.on(ns(keys.request_return), ([ state, id, data ]) =>
	{
		if (id in $request_rs)
		{
			if ((state === 0) || (state === 1))
			{
				$request_rs[id][state](data)
			}
		}
	})


	//
	endpoint.realtime = (name) =>
	{
		console.log(name)
		return 'most-stream'
	}

	endpoint.realtime.register = (name) =>
	{
		console.log(name)
		return 'most-stream push?'
	}

	// endpoint.realtime.duplex?
	// multiplexer?

	return endpoint
}

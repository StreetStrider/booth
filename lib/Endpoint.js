/* @flow */
/* global Booth$Socket */

; type Booth$Endpoint$Request =
{
	(name: string, data?: any): void,
	register (name: string, handler: Function): void,
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
}

;

export default function Endpoint (socket: Booth$Socket): Booth$Endpoint
{
	var endpoint = {}

	endpoint.socket = socket

	endpoint.request = (name, data) =>
	{
		console.log(name, data)
	}

	endpoint.request.register = (name, handler) =>
	{
		console.log(name, handler)
	}

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

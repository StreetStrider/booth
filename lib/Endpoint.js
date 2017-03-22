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
	request:  Booth$Endpoint$Request,
	realtime: Booth$Endpoint$Realtime,
}

;

export default function Endpoint (socket: Booth$Socket): Booth$Endpoint
{
	console.log(socket)

	var endpoint = {}

	endpoint.request = (name: string, data?: any) =>
	{
		console.log(name, data)
	}

	endpoint.request.register = (name: string, handler: Function) =>
	{
		console.log(name, handler)
	}

	endpoint.realtime = (name: string) =>
	{
		console.log(name)
		return 'most-stream'
	}

	endpoint.realtime.register = (name: string) =>
	{
		console.log(name)
		return 'most-stream push?'
	}

	// endpoint.realtime.duplex?
	// multiplexer?

	return endpoint
}

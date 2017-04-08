/* @flow */
/* global Booth$Socketio */

import type { Booth$Endpoint } from './Endpoint'

export type Booth$Constructor =
(
	endpoint: Booth$Endpoint
)
=> void;

export type Booth$Booth =
{
	socketio: Booth$Socketio
}

;

import Endpoint from './Endpoint'


export default function Booth
(
	socketio: Booth$Socketio,
	make: Booth$Constructor
)
	: Booth$Booth
{
	var booth = {}

	booth.socketio = socketio

	socketio.on('connection', socket =>
	{
		var endpoint = Endpoint(socket)

		socket.once('disconnect', endpoint.release)

		make(endpoint)
	})

	return booth
}

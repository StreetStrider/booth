/* @flow */
/* global Booth$Socket */
/* global Booth$Socketio */

import type { Booth$Endpoint } from './Endpoint'

export type Booth$Constructor =
(
	endpoint: Booth$Endpoint,
	socket:   Booth$Socket
)
=> void;

export type Booth$Booth = any

;

import Endpoint from './Endpoint'


export default function Booth
(
	socketio: Booth$Socketio,
	make: Booth$Constructor
)
	: Booth$Booth
{
	socketio.on('connection', socket =>
	{
		var endpoint = Endpoint(socket)

		make(endpoint, socket)
	})

	return {}
}

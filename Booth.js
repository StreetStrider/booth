/* @flow */
/* global flyd$Stream */
/* global Booth$Socketio */

import type { Booth$Endpoint } from './Endpoint'

export type Booth$Constructor =
(
	endpoint: Booth$Endpoint,
)
=> void;

export type Booth$Clients = flyd$Stream<Booth$Endpoint>;

export type Booth$Booth =
{
	socketio: Booth$Socketio,
	clients:  Booth$Clients,
}

;

import flyd from 'flyd'
var stream = flyd.stream

import Endpoint from './Endpoint'

var noop = () => {}


export default function Booth
(
	socketio: Booth$Socketio,
	make: Booth$Constructor = noop
)
	: Booth$Booth
{
	/* @flow-off */
	var clients: Booth$Clients = stream()

	var booth =
	{
		socketio,
		clients,
	}

	socketio.on('connection', socket =>
	{
		var endpoint = Endpoint(socket)

		socket.once('disconnect', endpoint.release)

		make(endpoint)

		clients(endpoint)
	})

	return booth
}

/* @flow */
/* global net$Server */
/* global Booth$Socketio */

import { createServer as Server } from 'http'
import Socketio from 'socket.io'


export var port = 9000
export var path = '/realtime'

export function http ()
{
	return Server().listen(port)
}

export function socketio (http: net$Server): Booth$Socketio
{
	return Socketio()
	.path(path)
	.serveClient(false)
	.attach(http)
}

/* @flow */

import SocketioClient from 'socket.io-client'

import { port, path } from './servers'

export default function socketio ()
{
	return SocketioClient(`ws://localhost:${port}`, { path })
}

/* @flow */

import SocketioClient from 'socket.io-client'

import { path } from './servers'

export default function socketio (port: number)
{
	return SocketioClient(`ws://localhost:${port}`, { path })
}

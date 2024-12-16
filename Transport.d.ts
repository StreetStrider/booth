/* eslint max-len: 0 */

import WebSocket = require('ws')

import { TypedEventTarget } from 'typescript-event-target'

export type TypedArray = (Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array)
export type PayloadBinary = (ArrayBuffer | Blob | TypedArray | DataView)
export type Payload = (string | PayloadBinary)


export type Events = TypedEventTarget<
{
	open:    void,
	close:   void,
	error:   WebSocket.ErrorEvent,
	message: { data: Payload },
}>

export interface Transport extends Events
{
	capabilities?:
	{
		binary?: boolean,
	},

	send (payload: PayloadBinary): void,
	close (): void,
}

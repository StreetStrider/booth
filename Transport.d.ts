/* eslint max-len: 0 */
// import type { EventEmitter } from 'node:events'

import WebSocket = require('ws')

import type { TypedEmitter } from 'tiny-typed-emitter'

export type TypedArray = (Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array)
export type PayloadBinary = (ArrayBuffer | Blob | TypedArray | DataView)
export type Payload = (string | PayloadBinary)

export type Events =
{
	open:    () => void,
	close:   () => void,
	error:   (event: WebSocket.ErrorEvent) => void,
	message: (event: { data: Payload }) => void,
}

export interface Transport extends TypedEmitter<Events>
{
	capabilities?:
	{
		binary?: boolean,
	},

	send (payload: PayloadBinary): void,
	close (): void,
}

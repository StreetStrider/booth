/* eslint max-len: 0 */
// import type { EventEmitter } from 'node:events'

// type Data = string | Buffer | ArrayBuffer | Buffer[];
// export type TypedArray = (Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array)
// export type PayloadBinary = (ArrayBuffer | Blob | TypedArray | DataView)
// import type { BufferLike } from 'ws'
// import type { ErrorEvent } from '@types/ws'
// import WebSocket = require('ws')

export type Binary_Send = (Buffer | ArrayBuffer | DataView | ArrayBufferView | Uint8Array | SharedArrayBuffer)
export type Binary_Recv = (Buffer | ArrayBuffer | Buffer[])

import type { TypedEmitter } from 'tiny-typed-emitter'

export type Payload = (string | Binary_Recv)

export type Events =
{
	open:    () => void,
	close:   () => void,
	error:   (event: Error) => void,
	message: (event: { data: Payload, type?: string }) => void,
}

export interface Transport extends TypedEmitter<Events>
{
	capabilities?:
	{
		binary?: boolean,
		reconnect?: boolean,
	},

	send (payload: string): void,
	close (): void,
}

export type TransportBinary = Transport
&
{
	capabilities:
	{
		binary: true,
	},

	send (payload: Binary_Send): void,
}

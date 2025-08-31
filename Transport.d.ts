/* eslint max-len: 0 */

// import type { EventEmitter } from 'node:events'
// import type { TypedEmitter } from 'tiny-typed-emitter'

// type Data = string | Buffer | ArrayBuffer | Buffer[];
// export type TypedArray = (Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array)
// export type PayloadBinary = (ArrayBuffer | Blob | TypedArray | DataView)
// import type { BufferLike } from 'ws'
// import type { ErrorEvent } from '@types/ws'
// import type * as WebSocket from 'ws'


export type Binary_Send = (Buffer | ArrayBuffer | DataView | ArrayBufferView | Uint8Array | SharedArrayBuffer)
export type Binary_Recv = (Buffer | ArrayBuffer | Buffer[])

import type { TypedEventTarget } from 'typescript-event-target'

export type Payload = (string | Binary_Recv)

export type Events =
{
	open:    Event,
	close:   Event, /* TODO: CloseEvent */
	error:   Event,
	message: MessageEvent,
}

export interface Transport extends TypedEventTarget<Events>
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

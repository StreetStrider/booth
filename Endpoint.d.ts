
// import type { ClientRequestArgs } from 'node:http'
import WebSocket = require('ws')

import type { Transport } from './Transport.js'
import type { BinarySend } from './Transport.js'
import type { BinaryRecv } from './Transport.js'

export type Kind = string
export type Data = string

/* TODO: proper combination */
export type Protocol <Keys extends Kind = Kind> = Record<Keys, string>
export type Protocol_Core =
{
	'@connect':   void,
	'@reconnect': void,

	'@binary': BinaryRecv,

	'@open':  void,
	'@close': void,
	'@error': WebSocket.ErrorEvent,
}
export type Protocol_All <In> = (In & Protocol_Core)


export type Handler <Endp extends Endpoint<any, any, any> = Endpoint, Data = string>
	= (data: Data, endp: Endp) => void

export type Handler_Composition <Endp extends Endpoint = Endpoint>
	= { [ key: string ]: Handler<Endp, string> }


export type Aux_Base = Record<string, unknown>


export type Disposer = () => void


export interface Endpoint
<
	In  extends Protocol = Protocol,
	Out extends Protocol = Protocol,
	Aux extends Aux_Base = Aux_Base,
>
{
	on <Key extends keyof Protocol_All<In>>
		(map: { [ K in Key ]?: Handler<this, Protocol_All<In>[K]> })
			: Disposer,

	on <Key extends keyof In>
		(key: Key, handler: Handler<this, In[Key]>)
			: Disposer,

	on <Key extends keyof Protocol_Core>
		(key: Key, handler: Handler<this, Protocol_Core[Key]>)
			: Disposer,

	send <Kind extends keyof Out>
		(kind: Kind, data?: string extends Out[Kind] ? (Out[Kind] | number) : Out[Kind])
			: void,

	send (data: BinarySend): void,

	close (): void,

	aux: Aux,
}


export default function Endpoint
<
	In  extends Protocol = Protocol,
	Out extends Protocol = Protocol,
	Aux extends Aux_Base = Aux_Base,
>
(
	// ws: WebSocket | WebSocket.ClientOptions | ClientRequestArgs | string
	transport: ((() => Transport) | string),
)
	:
Endpoint<In, Out, Aux>

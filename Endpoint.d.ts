
import type { ClientRequestArgs } from 'http'
import WebSocket = require('ws')

import type { PayloadBinary } from './Transport.js'

export type Kind = string
export type Data = string

export type Protocol <Keys extends Kind = Kind> = Record<Keys, string>
export type Protocol_Client_Defaults =
{
	'@connect':   void,
	'@reconnect': void,

	'@binary': PayloadBinary,

	'@open':  void,
	'@close': void,
	'@error': WebSocket.ErrorEvent,
}


export type Handler <Endp extends Endpoint = Endpoint, Data>
	= (data: Data, endp: Endp) => void

export type Handler_Composition <Endp extends Endpoint = Endpoint>
	= { [ key: string ]: Handler<Endp, string> }


export type Aux = Record<string, unknown>
export type Aux_Base = Aux


export type Disposer = () => void


export interface Endpoint
<
	In  extends Protocol = Protocol,
	Out extends Protocol = Protocol,
	Aux extends Aux_Base = Aux_Base,
>
{
	on <Key extends keyof (In & Protocol_Client_Defaults)>
		(map: { [ K in Key ]?: Handler<this, (In & Protocol_Client_Defaults)[K]> })
			: Disposer,

	on <Key extends keyof In>
		(key: Key, handler: Handler<this, In[Key]>)
			: Disposer,

	on <Key extends keyof Protocol_Client_Defaults>
		(key: Key, handler: Handler<this, Protocol_Client_Defaults[Key]>)
			: Disposer,

	send <Kind extends keyof Out>
		(kind: Kind, data?: string extends Out[Kind] ? (Out[Kind] | number) : Out[Kind])
			: void,

	send (data: PayloadBinary): void,

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
	ws: WebSocket | WebSocket.ClientOptions | ClientRequestArgs | string
)
	:
Endpoint<In, Out, Aux>

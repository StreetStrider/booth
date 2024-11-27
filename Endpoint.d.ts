
import type { ClientRequestArgs } from 'http'
import WebSocket = require('ws')


export type Kind = string
export type Data = string

export type Protocol <Keys extends Kind = Kind> = { [ key in Keys ]: true }
export type Protocol_Client_Defaults =
{
	'@connect':   true,
	'@reconnect': true,

	'@open':  true,
	'@close': true,
	'@error': true,
}


export type Handler <Endp extends Endpoint = Endpoint>
	= (data: Data, endp: Endp) => void

export type Handler_Composition <Endp extends Endpoint = Endpoint>
	= { [ key: string ]: Handler<Endp> }


export type Aux = { [ key: string ]: unknown }
export type Aux_Base = Aux


export type Disposer = () => void


export interface Endpoint
<
	In  extends Protocol = Protocol,
	Out extends Protocol = Protocol,
	Aux extends Aux_Base = Aux_Base,
>
{
	on (map: Partial<{ [ key in keyof (In & Protocol_Client_Defaults) ]: Handler<this> }>)
		: Disposer,

	on <Key extends keyof (In & Protocol_Client_Defaults)>
		(key: Key, handler: Handler<this>)
			: Disposer,

	send <Kind extends keyof Out>
		(kind: Kind, data?: Data)
			: void,

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

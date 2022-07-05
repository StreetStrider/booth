
import { ClientRequestArgs } from 'http'
import WebSocket = require('ws')

export type Kind = string
export type Data = string

export type Protocol = { [ key: Kind ]: Handler }

export type Handler = (data: Data, endp: Endpoint) => void
export type Handler_Composition = { [ key: string ]: Handler }

export type Protocol_Client_Defaults =
{
	'@connect':   Handler,
	'@reconnect': Handler,

	'@open':  Handler,
	'@close': Handler,
	'@error': Handler,
}

export type Aux = { [ key: string ]: unknown }
type Aux_Base = Aux

export type Disposer = () => void


export type Endpoint
<
	In  extends Protocol = Protocol_Client_Defaults,
	Out extends Protocol = Protocol,
	Aux extends Aux_Base = Aux_Base,
>
	=
{
	on (map: Partial<In & Protocol_Client_Defaults>)
		: Disposer,

	on <Key extends keyof (In & Protocol_Client_Defaults)>
		(key: Key, handler: (In & Protocol_Client_Defaults)[Key])
			: Disposer,

	send <Kind extends keyof Out>
		(kind: Kind, data?: Data)
			: void,

	close (): void,

	aux: Aux,
}


export default function Endpoint
<
	In  extends Protocol = Protocol_Client_Defaults,
	Out extends Protocol = Protocol,
	Aux extends Aux_Base = Aux_Base,
>
(
	ws: WebSocket | WebSocket.ClientOptions | ClientRequestArgs | string
)
	:
Endpoint<In, Out, Aux>

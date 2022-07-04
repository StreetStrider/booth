
import { ClientRequestArgs } from 'http'
import WebSocket = require('ws')

export type T_Handler <In = string, Out = void> = (data: In, endp: T_Endpoint<T_Protocol, T_Protocol, T_Aux>) => Out

export type T_Protocol = { [key: string]: T_Handler }
export type T_Protocol_In =
{
	'@connect':   T_Handler,
	'@reconnect': T_Handler,

	'@open':  T_Handler,
	'@close': T_Handler,
	'@error': T_Handler,
}

export type T_Aux = { [key: string]: unknown }

export type T_Disposer = () => void


export type T_Endpoint
<
	In  extends T_Protocol = T_Protocol,
	Out extends T_Protocol = T_Protocol,
	Aux extends T_Aux      = T_Aux,
>
	=
{
	on (map: Partial<In & T_Protocol_In>): T_Disposer;
	on <Key extends keyof (In & T_Protocol_In)> (key: Key, handler: (In & T_Protocol_In)[Key]): T_Disposer;
	send <Kind extends keyof Out> (kind: Kind, data?: Parameters<Out[Kind]>[0]): void;
	close (): void;
	aux: Aux;
}


export default function Endpoint
<
	In  extends T_Protocol = T_Protocol,
	Out extends T_Protocol = T_Protocol,
	Aux extends T_Aux      = T_Aux,
>
(
	ws: WebSocket | WebSocket.ClientOptions | ClientRequestArgs | string
)
	:
T_Endpoint<In, Out, Aux>
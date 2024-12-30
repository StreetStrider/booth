
// import type { ClientRequestArgs } from 'node:http'
import WebSocket = require('ws')

import type { Disposer } from '@streetstrider/emitter'

import type { Transport }  from './Transport.js'
import type { Binary_Send } from './Transport.js'
import type { Binary_Recv } from './Transport.js'

/* TODO: combination set subtract */
export type Protocol <Keys extends string = string>
	= Record<Keys, string>

export type Protocol_Core =
{
	'@connect':   void,
	'@reconnect': void,

	'@binary': Binary_Recv,

	'@open':  void,
	'@close': void,
	'@error': WebSocket.ErrorEvent,
}

export type Protocol_All <In>
	= (In & Protocol_Core)


export type Handler
<
	Data /* not extends */ = string,
	Endp extends Endpoint<any, any, any> = Endpoint
>
	= (data: Data, endp: Endp) => void

export type Handler_Composition
<
	Data extends Record<string, any> = Record<string, string>,
	Endp extends Endpoint<any, any, any> = Endpoint
>
	= { [ Key in keyof Data ]: Handler<Data[Key], Endp> }


export type Aux_Base = Record<string, unknown>


export type Endpoint_Protocol_In <Endp extends Endpoint<any, any, any>>
	= Endp extends Endpoint<infer In, any, any> ? In : never


export interface Endpoint
<
	In  extends Protocol = Protocol,
	Out extends Protocol = Protocol,
	Aux extends Aux_Base = Aux_Base,
>
{
	on <Key extends keyof Protocol_All<In>>
		(map: { [ K in Key ]?: Handler<Protocol_All<In>[K], this> })
			: Disposer,

	on <Key extends keyof In>
		(key: Key, handler: Handler<In[Key], this>)
			: Disposer,

	on <Key extends keyof Protocol_Core>
		(key: Key, handler: Handler<Protocol_Core[Key], this>)
			: Disposer,

	send <Kind extends keyof Out>
		(kind: Kind, data?: string extends Out[Kind] ? (Out[Kind] | number) : Out[Kind])
			: void,

	send (data: Binary_Send): void,

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

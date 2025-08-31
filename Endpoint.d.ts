
/* import type { ClientRequestArgs } from 'node:http' */
import type * as WebSocket from 'ws'

import type { Disposer } from '@streetstrider/emitter'

import type { Transport }   from './Transport.js'
import type { Binary_Send } from './Transport.js'
import type { Payload }     from './Transport.js'
import type { Binary_Recv } from './Transport.js'


export type Meta
<
	Key, // TODO: extends string,
	Msg  = string,
	Data = string,
	Endp extends Endpoint<any, any, any> = Endpoint
>
	=
{
	key: Key,

	msg:  Msg,
	data: Data,

	endp: Endp,
}

export type With_Meta
<
	Key, // TODO: extends string,
	Data,
	Endp extends Endpoint<any, any, any> = Endpoint
>
	= Data extends void
	? { endp: Endp }
	:
		Key extends '@binary'
		? Meta<Key, Data,   Data, Endp>
		: Meta<Key, string, Data, Endp>


export type Handler
<
	Key, // TODO: extends string,
	Data = string,
	Endp extends Endpoint<any, any, any> = Endpoint
>
	= (data: Data, meta: With_Meta<Key, Data, Endp>) => void

export type Handler_Composition
<
	Data extends Record<string, any> = Record<string, string>,
	Endp extends Endpoint<any, any, any> = Endpoint
>
	= { [ Key in keyof Data ]: Handler<Key, Data[Key], Endp> }


export type Aux_Base = Record<string, unknown>


/* TODO: combination set subtract */
export type Protocol <Keys extends string = string>
	= Record<Keys, string>

export type Protocol_Core =
{
	'@connect':   void,
	'@reconnect': void,

	'@recv':   Payload,
	'@binary': Binary_Recv,

	'@open':  void,
	'@close': void,
	'@error': WebSocket.ErrorEvent,
}

export type Protocol_All <In>
	= (In & Protocol_Core)


export type Mixed_String <S>
	= string extends S ? (S | number) : S


export interface Endpoint
<
	In  extends Protocol = Protocol,
	Out extends Protocol = Protocol,
	Aux extends Aux_Base = Aux_Base,
>
{
	on <Key extends keyof Protocol_All<In>>
		(map: { [ K in Key ]?: Handler<K, Protocol_All<In>[K], this> })
			: Disposer,

	on <Key extends keyof In>
		(key: Key, handler: Handler<Key, In[Key], this>)
			: Disposer,

	on <Key extends keyof Protocol_Core>
		(key: Key, handler: Handler<Key, Protocol_Core[Key], this>)
			: Disposer,

	send <Key extends keyof Out>
		(key: Key, data?: Mixed_String<Out[Key]>)
			: void,

	send (data: Binary_Send): void,

	close (): void,

	aux: Aux,
}


export type Options =
{
	should_reconnect: boolean,
	reconnect_interval: number,
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
	options?: Partial<Options>,
)
	:
Endpoint<In, Out, Aux>

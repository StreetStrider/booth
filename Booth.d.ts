
import WebSocket = require('ws')

import { T_Endpoint } from './Endpoint'
import { T_Protocol } from './Endpoint'
import { T_Protocol_In } from './Endpoint'
import { T_Aux } from './Endpoint'
import { T_Disposer } from './Endpoint'

export type T_Room
<
	In  extends T_Protocol_In,
	Out extends T_Protocol,
	Aux extends T_Aux,
>
	=
{
	join  (endp: T_Endpoint<In, Out, Aux>): void;
	leave (endp: T_Endpoint<In, Out, Aux>): void;

	has (endp: T_Endpoint<In, Out, Aux>): boolean;

	send <Kind extends keyof Out> (kind: Kind, data?: Parameters<Out[Kind]>[0]): void;
	each (fn: (endp: T_Endpoint<In, Out, Aux>) => void): void;
}

export type T_Rooms
<
	In  extends T_Protocol_In,
	Out extends T_Protocol,
	Aux extends T_Aux,
>
	=
{
	get (name: string): T_Room<In, Out, Aux>;
	list (): string[];
	has (name: string): boolean;
	remove (name: string): void;

	send <Kind extends keyof Out> (name: string, kind: Kind, data?: Parameters<Out[Kind]>[0]): void;

	join_if_any (name: string, endp: T_Endpoint<In, Out, Aux>): void;
	leave_every (endp: T_Endpoint<In, Out, Aux>): void;
}


export type T_Booth
<
	In  extends T_Protocol_In,
	Out extends T_Protocol,
	Aux extends T_Aux,
>
	=
{
	on (map: Partial<In>): T_Disposer;
	on <Key extends keyof In> (key: Key, handler: In[Key]): T_Disposer;
	close (): void;
	rooms: T_Rooms<In, Out, Aux>;
}


export default function Booth
<
	In  extends T_Protocol_In,
	Out extends T_Protocol,
	Aux extends T_Aux,
>
(
	wss: WebSocket.Server | WebSocket.ServerOptions
)
	:
T_Booth<In, Out, Aux>

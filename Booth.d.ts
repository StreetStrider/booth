
import WebSocket = require('ws')

import { Data } from './Endpoint'
import { Endpoint } from './Endpoint'
import { Protocol } from './Endpoint'
import { Aux as Aux_Base } from './Endpoint'
import { Disposer } from './Endpoint'

export type Room
<
	In  extends Protocol,
	Out extends Protocol,
	Aux extends Aux_Base,
>
	=
{
	join  (endp: Endpoint<In, Out, Aux>): void;
	leave (endp: Endpoint<In, Out, Aux>): void;

	has (endp: Endpoint<In, Out, Aux>): boolean;

	send <Kind extends keyof Out> (kind: Kind, data?: Data): void;
	each (fn: (endp: Endpoint<In, Out, Aux>) => void): void;
}

export type Rooms
<
	In  extends Protocol,
	Out extends Protocol,
	Aux extends Aux_Base,
>
	=
{
	get (name: string): Room<In, Out, Aux>;
	list (): string[];
	has (name: string): boolean;
	remove (name: string): void;

	send <Kind extends keyof Out> (name: string, kind: Kind, data?: Data): void;

	join_if_any (name: string, endp: Endpoint<In, Out, Aux>): void;
	leave_every (endp: Endpoint<In, Out, Aux>): void;
}


export type Booth
<
	In  extends Protocol,
	Out extends Protocol,
	Aux extends Aux_Base,
>
	=
{
	on: Endpoint<In, Out, Aux>['on'];
	close (): void;
	rooms: Rooms<In, Out, Aux>;
}


export default function Booth
<
	In  extends Protocol,
	Out extends Protocol,
	Aux extends Aux_Base,
>
(
	wss: WebSocket.Server | WebSocket.ServerOptions
)
	:
Booth<In, Out, Aux>

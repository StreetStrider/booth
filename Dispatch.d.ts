
import WebSocket = require('ws')

import type { Data } from './Endpoint.js'
import type { Endpoint } from './Endpoint.js'
import type { Protocol } from './Endpoint.js'
import type { Aux_Base } from './Endpoint.js'


export type Room
<
	In  extends Protocol = Protocol,
	Out extends Protocol = Protocol,
	Aux extends Aux_Base = Aux_Base,
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
	In  extends Protocol = Protocol,
	Out extends Protocol = Protocol,
	Aux extends Aux_Base = Aux_Base,
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


export type Dispatch
<
	In  extends Protocol = Protocol,
	Out extends Protocol = Protocol,
	Aux extends Aux_Base = Aux_Base,
>
	=
{
	on: Endpoint<In, Out, Aux>['on'];
	close (): void;
	rooms: Rooms<In, Out, Aux>;
}


export default function Dispatch
<
	In  extends Protocol = Protocol,
	Out extends Protocol = Protocol,
	Aux extends Aux_Base = Aux_Base,
>
(
	wss: WebSocket.Server | WebSocket.ServerOptions
)
	:
Dispatch<In, Out, Aux>

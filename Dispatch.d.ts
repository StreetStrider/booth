
import type * as WebSocket from 'ws'

import type { Endpoint } from './Endpoint.js'
import type { Protocol } from './Endpoint.js'
import type { Aux_Base } from './Endpoint.js'


export type Protocol_Core_Dispatch =
{
	'@listening': void,
}

export type Protocol_All <In>
	= (In & Protocol_Core_Dispatch)

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

	send: Endpoint<In, Out, Aux>['send'],
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

	send: Endpoint<In, Out, Aux>['send'],

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
	on: Endpoint<Protocol_All<In>, Out, Aux>['on'];
	close (): void;
	rooms: Rooms<Protocol_All<In>, Out, Aux>;
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

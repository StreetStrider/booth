
import type { ServerOptions } from 'ws'


export interface Addr
{
	for_dispatch (): ServerOptions;
	for_endpoint (): string;
	view ():
	readonly
	[
		ReturnType<this['for_dispatch']>,
		ReturnType<this['for_endpoint']>,
	];
}


export  function Websocket <Port extends number> (port: Port): Websocket<Port>
export interface Websocket <Port extends number> extends Addr
{
	readonly port: Port;
	for_dispatch (): { port: Port };
}

export  function Unix <Path extends string> (path: Path): Unix<Path>
export interface Unix <Path extends string> extends Addr
{
	readonly path: Path;
	for_dispatch (): { path: Path };
}

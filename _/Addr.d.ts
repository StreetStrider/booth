
export function Websocket <Port extends number> (port: Port): Websocket<Port>

export type Websocket <Port extends number> =
{
	readonly port: Port;
	for_dispatch (): { port: Port };
	for_endpoint (host?: string): string;
	view ():
	readonly
	[
		ReturnType<Websocket<Port>['for_dispatch']>,
		ReturnType<Websocket<Port>['for_endpoint']>,
	];
}

export function Unix <Path extends string> (path: Path): Unix<Path>

export type Unix <Path extends string> =
{
	readonly path: Path;
	for_dispatch (): { path: Path };
	for_endpoint (): string;
	view ():
	readonly
	[
		ReturnType<Unix<Path>['for_dispatch']>,
		ReturnType<Unix<Path>['for_endpoint']>,
	];
}

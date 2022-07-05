
export function Websocket <Port extends number> (port: Port): Websocket<Port>

export type Websocket <Port extends number> =
{
	readonly port: Port;
	for_booth (): { port: Port };
	for_endpoint (host: string): string;
	view ():
	[
		ReturnType<Websocket<Port>['for_booth']>,
		ReturnType<Websocket<Port>['for_endpoint']>,
	];
}

export function Unix <Path extends string> (path: Path): Unix<Path>

export type Unix <Path extends string> =
{
	readonly path: Path;
	for_booth (): { path: Path };
	for_endpoint (): string;
	view ():
	[
		ReturnType<Unix<Path>['for_booth']>,
		ReturnType<Unix<Path>['for_endpoint']>,
	];
}

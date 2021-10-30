
export function Websocket <Port extends number> (port: Port): T_Websocket<Port>

export type T_Websocket <Port extends number> =
{
	readonly port: Port;
	for_booth (): { port: Port };
	for_endpoint (host: string): string;
	view ():
	[
		ReturnType<T_Websocket<Port>['for_booth']>,
		ReturnType<T_Websocket<Port>['for_endpoint']>,
	];
}

export function Unix <Path extends string> (path: Path): T_Unix<Path>

export type T_Unix <Path extends string> =
{
	readonly path: Path;
	for_booth (): { path: Path };
	for_endpoint (): string;
	view ():
	[
		ReturnType<T_Unix<Path>['for_booth']>,
		ReturnType<T_Unix<Path>['for_endpoint']>,
	];
}


// type Data = string | Buffer | ArrayBuffer | Buffer[]

export type Event =
{
	data: string,
	// type: string,
	// target: WebSocket,
}

export type Listener = (event: Event) => void

export type Transport =
{
	send (data: string): void,
	addEventListener (name: string, fn: Listener): void,
	close (): void,
}

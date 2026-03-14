
import type { Endpoint } from '../Endpoint.js'


export type Options =
{
	timeout?: number,
}


export function when_connected (endp: Endpoint<any, any, any>): Promise<void>
// export function when_closed (endp: Endpoint<any, any, any>): Promise<void>

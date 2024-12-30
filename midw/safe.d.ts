
import type { Endpoint } from '../Endpoint.js'
import type { Handler } from '../Endpoint.js'
import type { Meta } from './compose.js'
import type { Middleware } from './compose.js'

export type Descr =
{
	error: unknown,
	meta: Meta,
	args: unknown[],
	fn: unknown,
}

export type Reporter = (descr: Descr) => void

export default function
<
	In = string,
	Endp extends Endpoint = Endpoint
>
(fn_report?: Reporter)
	: Middleware<Handler<In, Endp>, Handler<void, Endp>, Endp> // TODO:


import type { Endpoint } from '../Endpoint.js'

import type { Meta } from './compose.js'
import type { Transformer } from './compose.js'
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
	T extends Transformer<any, any, Endp>,
	Endp extends Endpoint<any, any, any>
>
(fn_report?: Reporter)
	: Middleware<T, T, Endp>

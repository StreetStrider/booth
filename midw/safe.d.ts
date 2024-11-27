
import type { Meta } from './compose.js'
import type { Middleware_Eq } from './compose.js'

export type Descr =
{
	error: unknown,
	meta: Meta,
	args: unknown[],
	fn: unknown,
}

export type Reporter = (descr: Descr) => void

export default function <In = string, Out = void> (fn_report?: Reporter): Middleware_Eq<In, Out>

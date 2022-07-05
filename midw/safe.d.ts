
import { Meta } from './compose'
import { Middleware_Id } from './compose'

export type Descr =
{
	error: unknown,
	meta: Meta,
	args: unknown[],
	fn: unknown,
}

export type Reporter = (descr: Descr) => void

export default function <In, Out> (fn_report: Reporter): Middleware_Id<In, Out>

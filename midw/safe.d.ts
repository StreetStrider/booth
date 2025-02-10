
import type { Meta } from '../Endpoint.js'

import type { Transformer } from './compose.js'
import type { Middleware }  from './compose.js'


export type Descr =
{
	fn:    unknown,
	error: unknown,
	data:  unknown,
	meta:  Meta<string>,
}

export type Reporter = (descr: Descr) => void


export default function
<
	T  extends Transformer<any, any, MT>,
	MT extends Meta<any, any, any, any>
>
(fn_report?: Reporter)
	: Middleware<T, T, MT>

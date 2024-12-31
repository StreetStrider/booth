
import type { Endpoint } from '../Endpoint.js'

import type { Transformer } from './compose.js'
import type { Middleware }  from './compose.js'


export default function
<
	T extends Transformer<any, any, Endp>,
	Endp extends Endpoint<any, any, any>
>
(name: string)
	: T extends Transformer<infer In, any, Endp> ?
		Middleware<T, Transformer<In, void, Endp>, Endp> : never

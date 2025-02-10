
import type { Meta } from '../Endpoint.js'

import type { Transformer } from './compose.js'
import type { Middleware }  from './compose.js'


export default function
<
	T  extends Transformer<any, any, MT>,
	MT extends Meta<any, any, any, any>
>
()
	: T extends Transformer<infer In, any, MT> ?
		Middleware<T, Transformer<In, void, MT>, MT> : never


import type { Meta } from '../Endpoint.js'

import type { Transformer } from './compose.js'
import type { Middleware }  from './compose.js'


export type Options =
{
	load: boolean,
	dump: boolean,
}


// (1).
declare function json
<
	T  extends Transformer<any, any, MT>,
	MT extends Meta<any, any, any, any>
>
(options: { dump: false })
	: T extends Transformer<any, infer Out, MT> ?
		Middleware<T, Transformer<string, Out, MT>, MT> : never


// (2).
declare function json
<
	T  extends Transformer<any, any, MT>,
	MT extends Meta<any, any, any, any>
>
(options?: { load: false })
	: T extends Transformer<infer In, any, MT> ?
		Middleware<T, Transformer<In, string, MT>, MT> : never


// (2).
declare function json
<
	T  extends Transformer<any, any, MT>,
	MT extends Meta<any, any, any, any>
>
(options: { load: false })
	: Middleware<T, Transformer<string, string, MT>, MT>


export default json


import type { Endpoint } from '../Endpoint.js'

import type { Transformer } from './compose.js'
import type { Middleware } from './compose.js'


export type Options =
{
	load: boolean,
	dump: boolean,
}


// (1).
declare function json
<
	T extends Transformer<any, any, Endp>,
	Endp extends Endpoint<any, any, any>
>
(options: { dump: false })
	: T extends Transformer<any, infer Out, Endp> ?
		Middleware<T, Transformer<string, Out, Endp>, Endp> : never


// (2).
declare function json
<
	T extends Transformer<any, any, Endp>,
	Endp extends Endpoint<any, any, any>
>
(options?: { load: false })
	: T extends Transformer<infer In, any, Endp> ?
		Middleware<T, Transformer<In, string, Endp>, Endp> : never


// (2).
declare function json
<
	T extends Transformer<any, any, Endp>,
	Endp extends Endpoint<any, any, any>
>
(options: { load: false })
	: Middleware<T, Transformer<string, string, Endp>, Endp>


export default json

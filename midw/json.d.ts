/* eslint max-len: 0 */
/* eslint-disable */ // TODO:

import type { Handler } from '../Endpoint.js'
import type { Middleware }  from './compose.js'

export type Options =
{
	load: boolean,
	dump: boolean,
}

// declare function json <In, Out, End> (options:  { dump: false }):  Middleware<Handler<In, Out>, Handler<string, Out>, Endp>
// declare function json <In, Out, End> (options:  { load: false }):  Middleware<Handler<In, Out>, Handler<In, string>, Endp>
// declare function json <In, Out, End> (options?: Partial<Options>): Middleware<Handler<In, Out>, Handler<string, string>, Endp>

declare function json (v?: any): any // TODO:

export default json

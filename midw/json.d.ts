/* eslint max-len: 0 */

import type { Transformer } from './compose.js'
import type { Middleware }  from './compose.js'

export type Options =
{
	load: boolean,
	dump: boolean,
}

declare function json <In, Out> (options:  { dump: false }):  Middleware<Transformer<In, Out>, Transformer<string, Out>>
declare function json <In, Out> (options:  { load: false }):  Middleware<Transformer<In, Out>, Transformer<In, string>>
declare function json <In, Out> (options?: Partial<Options>): Middleware<Transformer<In, Out>, Transformer<string, string>>

export default json

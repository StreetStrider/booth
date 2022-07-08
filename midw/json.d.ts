
import { Transformer } from './compose'
import { Middleware }  from './compose'

export type Options =
{
	load: boolean,
	dump: boolean,
}

declare function json <In, Out> (options:  { dump: false }):  Middleware<Transformer<In, Out>, Transformer<string, Out>>
declare function json <In, Out> (options:  { load: false }):  Middleware<Transformer<In, Out>, Transformer<In, string>>
declare function json <In, Out> (options?: Partial<Options>): Middleware<Transformer<In, Out>, Transformer<string, string>>

export default json


import type { Aux_Base } from '../Endpoint.js'
import type { Protocol } from '../Endpoint.js'
import type { Protocol_All } from '../Endpoint.js'
import type { Endpoint } from '../Endpoint.js'
import type { Mixed_String } from '../Endpoint.js'


export default function
<
	In  extends Protocol = Protocol,
	Out extends Protocol = Protocol,
	Aux extends Aux_Base = Aux_Base,
	Key extends keyof Out = string, // TODO: key intersection if possible
>
(
	endpoint: Endpoint<In, Out, Aux>,
	key: Key,
	data?: Mixed_String<Out[Key]>,
	timeout?: number,
)
	: Promise<Key extends keyof Protocol_All<In> ? Protocol_All<In>[Key] : never>

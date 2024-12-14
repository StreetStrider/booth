
import type { Data } from '../Endpoint.js'
import type { Aux_Base } from '../Endpoint.js'
import type { Protocol } from '../Endpoint.js'
import type { Protocol_All } from '../Endpoint.js'
import type { Endpoint } from '../Endpoint.js'

import type { Dispatch } from '../Dispatch.js'

export default function
<
	In  extends Protocol = Protocol,
	Out extends Protocol = Protocol,
	Aux extends Aux_Base = Aux_Base,
>
(
	endpoint: Endpoint<In, Out, Aux>,
	key: keyof Protocol_All<In>,
	timeout?: number,
)
	: Promise<Data>

export default function
<
	In  extends Protocol = Protocol,
	Out extends Protocol = Protocol,
	Aux extends Aux_Base = Aux_Base,
>
(
	dispatch: Dispatch<In, Out, Aux>,
	key: keyof Protocol_All<In>,
	timeout?: number,
)
	: Promise<Data>

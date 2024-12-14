
import type { Disposer } from '@streetstrider/emitter'

import type { Handler } from '../Endpoint.js'
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
	Key extends keyof Protocol_All<In>,
>
(
	endpoint: Endpoint<In, Out, Aux>,
	key: Key,
	fn: Handler<Endpoint<In, Out, Aux>, Protocol_All<In>[Key]>,
)
	: Disposer

export default function
<
	In  extends Protocol = Protocol,
	Out extends Protocol = Protocol,
	Aux extends Aux_Base = Aux_Base,
	Key extends keyof Protocol_All<In>,
>
(
	dispatch: Dispatch<In, Out, Aux>,
	key: Key,
	fn: Handler<Endpoint<In, Out, Aux>, Protocol_All<In>[Key]>,
)
	: Disposer

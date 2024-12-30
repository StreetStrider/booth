
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
	Key extends keyof Protocol_All<In> = string,
>
(
	endpoint: Endpoint<In, Out, Aux>,
	key: Key,
	fn: Handler<Protocol_All<In>[Key], Endpoint<In, Out, Aux>>,
)
	: Disposer

export default function
<
	In  extends Protocol = Protocol,
	Out extends Protocol = Protocol,
	Aux extends Aux_Base = Aux_Base,
	Key extends keyof Protocol_All<In> = string,
>
(
	dispatch: Dispatch<In, Out, Aux>,
	key: Key,
	fn: Handler<Protocol_All<In>[Key], Endpoint<In, Out, Aux>>,
)
	: Disposer

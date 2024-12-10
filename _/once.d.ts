
import type { Disposer } from '@streetstrider/emitter'

import type { Handler } from '../Endpoint.js'
import type { Aux_Base } from '../Endpoint.js'
import type { Protocol } from '../Endpoint.js'
import type { Protocol_Client_Defaults } from '../Endpoint.js'
import type { Endpoint } from '../Endpoint.js'

import type { Booth } from '../Booth.js'

export default function
<
	In  extends Protocol = Protocol,
	Out extends Protocol = Protocol,
	Aux extends Aux_Base = Aux_Base,
	Key extends keyof (In & Protocol_Client_Defaults),
>
(
	endpoint: Endpoint<In, Out, Aux>,
	key: Key,
	fn: Handler<Endpoint<In, Out, Aux>, (In & Protocol_Client_Defaults)[Key]>,
)
	: Disposer

export default function
<
	In  extends Protocol = Protocol,
	Out extends Protocol = Protocol,
	Aux extends Aux_Base = Aux_Base,
	Key extends keyof (In & Protocol_Client_Defaults),
>
(
	booth: Booth<In, Out, Aux>,
	key: Key,
	fn: Handler<Endpoint<In, Out, Aux>, (In & Protocol_Client_Defaults)[Key]>,
)
	: Disposer

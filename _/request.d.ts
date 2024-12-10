
import type { Data } from '../Endpoint.js'
import type { Aux_Base } from '../Endpoint.js'
import type { Protocol } from '../Endpoint.js'
import type { Protocol_Client_Defaults } from '../Endpoint.js'
import type { Endpoint } from '../Endpoint.js'


export default function
<
	In  extends Protocol = Protocol,
	Out extends Protocol = Protocol,
	Aux extends Aux_Base = Aux_Base,
>
(
	endpoint: Endpoint<In, Out, Aux>,
	key: keyof (In & Protocol_Client_Defaults),
	data?: Data | number,
	timeout?: number,
)
	: Promise<Data>

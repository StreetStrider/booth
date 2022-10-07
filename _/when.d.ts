
import { Data } from '../Endpoint'
import { Aux_Base } from '../Endpoint'
import { Protocol } from '../Endpoint'
import { Protocol_Client_Defaults } from '../Endpoint'
import { Endpoint } from '../Endpoint'

import { Booth } from '../Booth'

export default function
<
	In  extends Protocol = Protocol,
	Out extends Protocol = Protocol,
	Aux extends Aux_Base = Aux_Base,
>
(
	endpoint: Endpoint<In, Out, Aux>,
	key: keyof (In & Protocol_Client_Defaults),
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
	booth: Booth<In, Out, Aux>,
	key: keyof (In & Protocol_Client_Defaults),
	timeout?: number,
)
	: Promise<Data>


import { T_Handler } from '../Endpoint'

export default function <In, Out> ():
	(fn: T_Handler<In, Out>)

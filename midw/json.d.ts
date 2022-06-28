
import { T_Handler } from '../Endpoint'
import { T_Endpoint } from '../Endpoint'
import { T_Protocol } from '../Endpoint'
import { T_Aux } from '../Endpoint'

export type Options =
{
	load: boolean,
	dump: boolean,
}

declare function json <In>  (fn :T_Handler<In, string>, options: { dump: false }): T_Handler<string, string>
declare function json <Out> (fn :T_Handler<string, Out>, options: { load: false }): T_Handler<string, string>
declare function json <In, Out> (fn :T_Handler<In, Out>, options: Partial<Options>): T_Handler<string, string>

export default json

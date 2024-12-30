/* eslint max-len: 0 */

import type { Endpoint } from '../Endpoint.js'
import type { Endpoint_Protocol_In } from '../Endpoint.js'
// import type { Handler } from '../Endpoint.js'
// import type { Handler_Composition } from '../Endpoint.js'


export type Product <T> = (Promise<T> | T)

export type Transformer
<
	In  = string,
	Out = void,
	Endp extends Endpoint<any, any, any> = Endpoint,
>
	= (input: In, endp: Endp) => Product<Out> /* TODO: meta */


export type Middleware
<
	In   extends Transformer<any, any, Endp>,
	Out  extends Transformer<any, any, Endp>,
	Endp extends Endpoint<any, any, any> = Endpoint,
>
	= (fn: In) => Out


type Middleware_In
<
	M extends Middleware<any, any, Endp>,
	Endp extends Endpoint<any, any, any>
>
	= M extends Middleware<infer In, any, any> ? In : never

type Middleware_Out
<
	M extends Middleware<any, any, Endp>,
	Endp extends Endpoint<any, any, any>
>
	= M extends Middleware<infer In, any, any> ? In : never


export type Compose
<
	M extends Middleware<any, any, Endp>,
	Endp extends Endpoint<any, any, any> = Endpoint,
>
	=
{
	pipe <M2 extends Middleware<any, Middleware_In<M, Endp>, Endp>> (midw: M2)
		: Compose<
			Middleware<
				Middleware_In<M2, Endp>,
				Middleware_Out<M, Endp>,
				Endp
			>,
			Endp
		>,

	over <H extends Middleware_In<M, Endp>> (handler: H)
		: Middleware_Out<M, Endp>,

	over
	<
		HS extends Record<
			keyof Endpoint_Protocol_In<Endp>,
			Middleware_In<M, Endp>
		>
	>
		(handlers: HS)
			: { [ Key in keyof HS ]: Middleware_Out<M, Endp> },
}


export default function Compose
<
	M extends Middleware<any, any, Endp>,
	Endp extends Endpoint<any, any, any> = Endpoint,
>
	(midw: M): Compose<M, Endp>


// TODO: meta
export type Meta =
{
	name: string,
}

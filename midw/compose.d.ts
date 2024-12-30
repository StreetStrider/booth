/* eslint max-len: 0 */
/* eslint-disable */ // TODO:

import type { Endpoint } from '../Endpoint.js'
import type { Endpoint_Protocol_In } from '../Endpoint.js'
import type { Handler } from '../Endpoint.js'
import type { Handler_Composition } from '../Endpoint.js'

// export type { Handler }
// export type { Handler_Composition }

export type Product <T> = (Promise<T> | T)

export type Transformer
<
	In  = string,
	Out = void,
	Endp extends Endpoint = Endpoint,
>
	= (input: In, endp: Endp) => Product<Out> /* TODO: meta */

export type Middleware1
<
	In   extends Transformer<any, any, Endp>,
	Out  extends Transformer<any, any, Endp>,
	Endp extends Endpoint = Endpoint,
>
	= (fn: In) => Out

/*
// export type Middleware_Eq <In, Out>
// 	= Middleware<Transformer<In, Out>, Transformer<In, Out>>
*/

export type Middleware <_1 = any, _2 = any, _3 = any> = any

type Middleware_In
<
	M extends Middleware1<any, any, Endp>,
	Endp extends Endpoint<any, any, any>
>
	= M extends Middleware1<infer In, any, any> ? In : never

type Middleware_Out
<
	M extends Middleware1<any, any, Endp>,
	Endp extends Endpoint<any, any, any>
>
	= M extends Middleware1<infer In, any, any> ? In : never

export type Compose
<
	M extends Middleware1<any, any, Endp>,
	Endp extends Endpoint<any, any, any> = Endpoint,
>
	=
{
	// pipe: any,
	// over: any,

	pipe <M2 extends Middleware1<any, Middleware_In<M, Endp>, Endp>> (midw: M2)
		: Compose<
			Middleware1<
				Middleware_In<M2, Endp>,
				Middleware_Out<M, Endp>,
				Endp
			>,
			Endp
		>,

	// pipe <Mid> (midw: Middleware<Transformer<MI, MO, Endp>, Transformer<MO, Endp>, Endp>)
		// : Compose<In, MO, Endp>,

	// over <MO> (midw: Middleware<Handler<Out, Endp>, Handler<MO, Endp>, Endp>)
		// : Handler<In, Endp>,

	// over <MOs extends Record<Out, any>> (reg: MOs)
		// : 

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


export function Compose
<
	M extends Middleware1<any, any, Endp>,
	Endp extends Endpoint<any, any, any> = Endpoint,
>
	(midw: M): Compose<M, Endp>


//
export type Meta =
{
	name: string,
}

declare function compose (mw1: Middleware<any, any>, hn: Handler): Handler_Composition
declare function compose (mw1: Middleware<any, any>, hn: Handler): Handler_Composition

declare function compose (name: string, mw1: Middleware<any, any>, hn: Handler): Handler_Composition
declare function compose (meta: Meta, mw1: Middleware<any, any>, hn: Handler): Handler_Composition

declare function compose (mw1: Middleware<any, any>, mw2: Middleware<any, any>, hn: Handler): Handler_Composition
declare function compose (mw1: Middleware<any, any>, mw2: Middleware<any, any>, hn: Handler): Handler_Composition

declare function compose (name: string, mw1: Middleware<any, any>, mw2: Middleware<any, any>, hn: Handler): Handler_Composition
declare function compose (meta: Meta, mw1: Middleware<any, any>, mw2: Middleware<any, any>, hn: Handler): Handler_Composition

declare function compose (mw1: Middleware<any, any>, mw2: Middleware<any, any>, mw3: Middleware<any, any>, hn: Handler): Handler_Composition
declare function compose (mw1: Middleware<any, any>, mw2: Middleware<any, any>, mw3: Middleware<any, any>, hn: Handler): Handler_Composition

declare function compose (name: string, mw1: Middleware<any, any>, mw2: Middleware<any, any>, mw3: Middleware<any, any>, hn: Handler): Handler_Composition
declare function compose (meta: Meta, mw1: Middleware<any, any>, mw2: Middleware<any, any>, mw3: Middleware<any, any>, hn: Handler): Handler_Composition

export default compose


export const compose_every: any // TODO: any

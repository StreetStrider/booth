
import type { Endpoint } from '../Endpoint.js'
import type { Meta } from '../Endpoint.js'


export type Product <T> = (Promise<T> | T)

export type Transformer
<
	In  = string,
	Out = void,
	MT  extends Meta<any, any, any, any> = Meta<string>
>
	= (input: In, meta: MT) => Product<Out>


export type Middleware
<
	In  extends Transformer<any, any, MT>,
	Out extends Transformer<any, any, MT>,
	MT  extends Meta<any, any, any, any> = Meta<string>
>
	= (fn: In) => Out


type Middleware_In
<
	M  extends Middleware<any, any, MT>,
	MT extends Meta<any, any, any, any> = Meta<string>
>
	= M extends Middleware<infer In, any, any> ? In : never

type Middleware_Out
<
	M  extends Middleware<any, any, MT>,
	MT extends Meta<any, any, any, any> = Meta<string>
>
	= M extends Middleware<infer In, any, any> ? In : never


type Endpoint_Protocol_In <Endp extends Endpoint<any, any, any>>
	= Endp extends Endpoint<infer In, any, any> ? In : never

type Meta_Protocol_In <MT extends Meta<any, any, any, any>>
	= MT extends Meta<any, any, any, infer Endp>
	? Endpoint_Protocol_In<Endp>
	: never


export type Compose
<
	M  extends Middleware<any, any, MT>,
	MT extends Meta<any, any, any, any> = Meta<string>
>
	=
{
	pipe <M2 extends Middleware<any, Middleware_In<M, MT>, MT>> (midw: M2)
		: Compose<
			Middleware<
				Middleware_In<M2, MT>,
				Middleware_Out<M, MT>,
				MT
			>,
			MT
		>,

	over <H extends Middleware_In<M, MT>> (handler: H)
		: Middleware_Out<M, MT>,

	over
	<
		HS extends Record<
			keyof Meta_Protocol_In<MT>,
			Middleware_In<M, MT>
		>
	>
		(handlers: HS)
			: { [ Key in keyof HS ]: Middleware_Out<M, MT> },
}


export default function Compose
<
	M  extends Middleware<any, any, MT>,
	MT extends Meta<any, any, any, any> = Meta<string>
>
	(midw: M): Compose<M, MT>

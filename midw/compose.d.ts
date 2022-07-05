
import { Endpoint } from '../Endpoint'
import { Handler } from '../Endpoint'
import { Handler_Composition } from '../Endpoint'

export type Promising <T> = T | Promise<T>

export type Transformer <In, Out> = (input: In, endp: Endpoint) => Promising<Out>

export type Meta =
{
	name: string,
}

export type Middleware
	<In extends Transformer<any, any>, Out extends Transformer<any, any>>
	=
		(fn: In) => Out

export type Middleware_Id <In, Out>
	= Middleware<Transformer<In, Out>, Transformer<In, Out>>


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

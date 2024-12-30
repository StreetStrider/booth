/* eslint complexity: [ 1, 8 ] */
/* eslint max-statements: [ 1, 21 ] */

// TODO: rate limiting recoil
// TODO: id-based request-response (turnaround)


export function Compose ($composition = [])
{
	$composition = [].concat($composition)

	function pipe (midw)
	{
		return Compose([ ...$composition, midw ])
	}

	function over (handler)
	{
		if (typeof handler === 'object')
		{
			return pipe_reg(handler)
		}
		if (typeof handler === 'function')
		{
			return result([ ...$composition, handler ])
		}
	}

	function pipe_reg (reg)
	{
		reg = { ...reg }

		for (var key in reg)
		{
			var midw = reg[key]

			reg[key] = result([ ...$composition, midw ])
		}

		return reg
	}

	function result ($composition)
	{
		var L  = $composition.length
		var fn = $composition[L - 1]

		for (var n = (L - 1); n; n--)
		{
			var midw = $composition[n - 1]

			fn = midw(fn)
		}

		return fn
	}

	return {
		pipe,
		over,
	}
}


//
export default function compose (...handlers)
{
	if (! handlers.length) { throw new TypeError('no_handlers') }

	var first = handlers[0]
	var last  = handlers[handlers.length - 1]

	if (typeof first === 'string')
	{
		var meta = { name: first }
		handlers = handlers.slice(1)
	}
	else if (typeof first === 'object')
	{
		var meta = { ...first }
		handlers = handlers.slice(1)
	}
	else
	{
		var meta = {}
	}
	if (! meta.name)
	{
		meta.name = last.name
	}

	if (! meta.name) { throw new TypeError('no_name') }

	var L = handlers.length
	if (! L) { throw new TypeError('no_handlers') }

	for (var n = (L - 1); n; n--)
	{
		var next = handlers[n - 1]
		last = next(last, meta)
	}

	return { [meta.name]: last }
}


export function compose_every (...handlers)
{
	if (! handlers.length) { throw new TypeError('no_handlers') }

	var object = handlers.pop()

	if (typeof object !== 'object') { throw new TypeError('no_object_to_apply') }
	object = { ...object }

	for (var key in object)
	{
		object[key] = compose(key, ...handlers, object[key])[key]
	}

	return object
}

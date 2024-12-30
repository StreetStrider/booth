/* eslint complexity: [ 1, 8 ] */
/* eslint max-statements: [ 1, 21 ] */

// TODO: rate limiting recoil
// TODO: id-based request-response (turnaround)


export default function Compose ($composition = [])
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

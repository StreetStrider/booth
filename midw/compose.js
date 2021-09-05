/* eslint complexity: [ 2, 8 ] */


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

/* eslint complexity: [ 2, 6 ] */


var defaults =
{
	name: null,
	reporter (error, name /*, fn */)
	{
		console.error('booth/safe:', 'error in', name)
		console.log(error)
	},
}

export default function safe (options, fn)
{
	if (typeof options === 'function')
	{
		fn = options
		options = { ...defaults }
	}
	else if (typeof options === 'string')
	{
		options = { ...defaults, name: options }
	}
	else
	{
		options = { ...options }
	}

	var name = ''
	if (options.name)
	{
		name = options.name

		if (fn.name)
		{
			name = `${ name } (fn ${ fn.name })`
		}
	}
	else if (fn.name)
	{
		name = `fn ${ name }`
	}

	var { reporter } = options

	return async (...args) =>
	{
		try
		{
			await fn(...args)
		}
		catch (error)
		{
			reporter(error, name, fn)
		}
	}
}


import { prefix } from './util/respond'


export default function request (name)
{
	var next = nextid()

	return (data) =>
	{
		var id = next()

		return [ name, `${ prefix.request }${ id }:${ data }` ]
	}
}

function nextid ()
{
	var id = 0

	return () =>
	{
		id = (id + 1)

		return `${ id }_${ string_random() }`
	}
}

function string_random ()
{
	return Math.random().toString(32).slice(2, (2 + 5))
}

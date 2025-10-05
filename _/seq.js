

export default function Seq (values)
{
	var $store = new Set(values)


	function add (value)
	{
		if (has(value)) throw new ReferenceError

		$store.add(value)

		return value
	}

	function remove (value)
	{
		if (! has(value)) throw new ReferenceError

		$store.delete(value)

		return value
	}

	function clear ()
	{
		$store.clear()
	}


	function has (value)
	{
		return $store.has(value)
	}


	function each (fn)
	{
		for (var value of $store)
		{
			fn(value)
		}
	}

	function * iterator ()
	{
		yield * $store
	}


	return {
		add,
		remove,
		clear,

		has,
		get is_empty () { return (! $store.size) },
		get size () { return $store.size },

		each,
		[Symbol.iterator]: iterator,
		keys: iterator,
	}
}

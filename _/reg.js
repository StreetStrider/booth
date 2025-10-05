

export default function Reg (values, initializer = NotFound)
{
	if (typeof values === 'function')
	{
		initializer = values
		values = void 0
	}

	var $store = new Map(values)


	function get (key)
	{
		if (has(key))
		{
			return $store.get(key)
		}

		return set(key, initializer(key))
	}


	function set (key, value)
	{
		if (has(key)) throw new ReferenceError

		$store.set(key, value)
		return value
	}

	function remove (key)
	{
		if (! has(key)) throw new ReferenceError

		var value = $store.get(key)
		$store.remove(key)
		return value
	}

	function clear ()
	{
		$store.clear()
	}


	function has (key)
	{
		return $store.has(key)
	}


	function * iterator ()
	{
		yield * $store
	}


	function each (fn)
	{
		for (var [ key, value ] of $store)
		{
			fn(value, key)
		}
	}

	function over (key, fn)
	{
		if (has(key))
		{
			fn($store.get(key), key)
		}
	}


	return {
		get,

		set,
		remove,
		clear,

		has,
		get is_empty () { return (! $store.size) },
		get size () { return $store.size },

		keys ()    { return $store.keys() },
		values ()  { return $store.values() },
		entries () { return $store.entries() },
		[Symbol.iterator]: iterator,

		each,
		over,
	}
}


function NotFound ()
{
	throw new ReferenceError
}

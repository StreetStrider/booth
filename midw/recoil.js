

export default function recoil ()
{
	return (fn) =>
	{
		return async (data, meta) =>
		{
			var r = await fn(data, meta)
			if (r === void 0) return

			var key = meta?.key
			if (typeof key !== 'string') throw new ReferenceError('recoil: no_meta_key')

			meta.endp.send(key, r)
		}
	}
}

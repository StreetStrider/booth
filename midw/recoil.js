

export default function recoil (name)
{
	return (fn, meta) =>
	{
		return async (data, endp) =>
		{
			var r = await fn(data, endp)

			if (r !== void 0)
			{
				endp.send(name ?? meta?.name, r)
				// endp.send(name, r) // TODO:
			}
		}
	}
}

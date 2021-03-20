

export default function recoil ()
{
	return (fn, meta) =>
	{
		return async (data, endp) =>
		{
			var r = await fn(data, endp)

			if (r !== void 0)
			{
				endp.send(meta.name, r)
			}
		}
	}
}

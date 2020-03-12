

export default function recoil (name, fn)
{
	return async (data, endp) =>
	{
		var result = await fn(data)

		if (result === void 0) { return }

		endp.send(name, result)
	}
}

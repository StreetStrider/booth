


export default function delay (ms, options)
{
	return new Promise(rs =>
	{
		ms ??= 0
		var timer = setTimeout(() => rs(), ms)

		if (options?.unref)
		{
			timer?.unref?.()
		}

		timer = null
	})
}

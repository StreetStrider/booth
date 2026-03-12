/* global Deno */
/* eslint complexity: [ 1, 7 ] */


export default function delay (ms, options)
{
	return new Promise(rs =>
	{
		ms ??= 0
		var timer = setTimeout(() => rs(), ms)

		if (options?.unref)
		{
			timer?.unref?.()

			if (typeof Deno !== 'undefined')
			{
				Deno.unrefTimer(timer)
			}
		}

		timer = null
	})
}



export default function delay (ms = 0)
{
	var timer
	var p = new Promise(rs =>
	{
		timer = setTimeout(() => rs(), ms)//?.unref?.()
	})

	p.timer = timer

	return p
}

// unref can be moved to Timeout and turned into (unref + clearTimeout)
// but unref mostly relevant for node, not browser

export default function delay (ms = 0)
{
	var timer
	var p = new Promise(rs =>
	{
		timer = setTimeout(() => rs(), ms)/* ?.unref?.() */
	})

	p.timer = timer

	return p
}

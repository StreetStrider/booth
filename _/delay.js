

export default function delay (ms = 0)
{
	return new Promise(rs =>
	{
		setTimeout(() => rs(), ms)
	})
}

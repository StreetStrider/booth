

export default function delay (ms)
{
	return new Promise(rs =>
	{
		setTimeout(() => rs(), ms)
	})
}



export default function wait (emitter, key)
{
	return new Promise(rs =>
	{
		var ds = emitter.on(key, data =>
		{
			ds()
			rs(data)
		})
	})
}

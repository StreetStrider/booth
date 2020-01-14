

export default function safe (fn)
{
	return async () =>
	{
		try
		{
			await fn()
		}
		catch (e)
		{
			console.log('booth/safe:', 'error during', fn.name, fn)
			console.error(e)
		}
	}
}

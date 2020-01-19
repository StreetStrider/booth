

export default function safe (fn)
{
	return async (...args) =>
	{
		try
		{
			await fn(...args)
		}
		catch (e)
		{
			console.log('booth/safe:', 'error during', fn.name, fn)
			console.error(e)
		}
	}
}



export default function safe (fn, fn_report = error)
{
	return async (...args) =>
	{
		try
		{
			await fn(...args)
		}
		catch (e)
		{
			fn_report(e, fn)
		}
	}
}


function error (e, fn)
{
	console.error('booth/safe:', 'error during', '`' + fn.name + '`', fn)
	console.log(e)
}

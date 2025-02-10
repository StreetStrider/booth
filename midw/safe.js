

export default function safe (fn_report = report_default)
{
	return (fn) =>
	{
		return async (data, meta) =>
		{
			try
			{
				return await fn(data, meta)
			}
			catch (error)
			{
				fn_report({ fn, error, data, meta })
			}
		}
	}
}


export function report_default ({ /* fn, */ error, data, meta })
{
	console.error('booth/safe:', meta.key)
	console.error('data:', data)
	console.error(error)
}

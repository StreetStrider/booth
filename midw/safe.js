

export default function safe (fn_report = report_default)
{
	return (fn /*, meta */) =>
	{
		return async (...args) =>
		{
			try
			{
				return await fn(...args)
			}
			catch (error)
			{
				fn_report({ error, /* meta, */ args, fn })
			}
		}
	}
}


export function report_default ({ error, /* meta, */ args })
{
	// console.error('booth/safe:', meta.name)
	console.error('arg:', args[0])
	console.error(error)
}

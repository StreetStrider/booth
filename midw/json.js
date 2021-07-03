
var load = JSON.parse
var dump = JSON.stringify


export default function json ()
{
	return (fn /*, meta */) =>
	{
		return async (data, endp) =>
		{
			return dump(await fn(load(data), endp))
		}
	}
}

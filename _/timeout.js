
import delay from './delay.js'


export function timeout (ms)
{
	return delay(ms).then(() => { throw new TimeoutError })
}


export class TimeoutError extends Error
{
	message = 'Timeout'
}

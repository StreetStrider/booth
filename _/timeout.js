
import delay from './delay.js'


export function Timeouted (promise, timeout = 0)
{
	return Promise.race([ promise, Timeout(timeout) ])
}


export function Timeout (ms = 0)
{
	return delay(ms, { unref: true })
	.then(() => { throw new TimeoutError })
}


export class TimeoutError extends Error
{
	message = 'Timeout'
}

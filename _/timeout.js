
import delay from './delay.js'


export function Timeouted (promise, timeout = 0)
{
	var tp = Timeout(timeout)
	var timer = tp.timer

	var p = Promise.race([ promise, tp ])
	.finally(() => clearTimeout(tp.timer))

	p.timer = timer

	return p
}


export function Timeout (ms = 0)
{
	var p = delay(ms)
	var timer = p.timer

	p = p.then(() => { throw new TimeoutError })
	p.timer = timer

	return p
}


export class TimeoutError extends Error
{
	message = 'Timeout'
}

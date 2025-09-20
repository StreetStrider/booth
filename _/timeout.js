
import delay from './delay.js'


export function Timeouted (promise, timeout = 0)
{
	var tp = Timeout(timeout)

	var p = race(promise, tp)
	p.timer = tp.timer

	return p
}


export function race (left, right)
{
	return Promise.race([ left, right ])
	.finally(() =>
	{
		clearTimeout(left.timer)
		clearTimeout(right.timer)
	})
}


function Timeout (ms = 0)
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


var dump = JSON.stringify
var load = JSON.parse

import { join } from 'path'
import { openSync as open } from 'fs'
import { closeSync as close } from 'fs'
import { readFileSync as read } from 'fs'
import { writeFileSync as write } from 'fs'

import { expect } from 'chai'

export const tmp = '/tmp/booth'

export function Aof (name, fn_result, fn_end)
{
	var file = open(logname(name), 'ax')

	var t = setTimeout(() =>
	{
		expect.fail(`Aof ${ name } does not finish`)
	}
	, 5e3)

	function track (...log)
	{
		write(file, `${ dump(log) }\n`)
	}

	function end_check ()
	{
		end()
		expect(view()).deep.eq(fn_result())
	}

	function end ()
	{
		close(file)
		clearTimeout(t)
		fn_end && fn_end()
	}

	function view ()
	{
		var
		text = read(logname(name), 'utf-8')
		text = text.split('\n')
		text = text.slice(0, -1)
		text = text.map(load)
		return text
	}

	function end_fail (...args)
	{
		close(file)

		console.warn(view())

		expect.fail(...args)
	}

	function logname (name)
	{
		return join(tmp, name + '.txt')
	}

	return {
		track,
		view,
		end,
		end_check,
		end_fail,
	}
}

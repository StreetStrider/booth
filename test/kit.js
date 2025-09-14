
var dump = JSON.stringify
var load = JSON.parse

import { join } from 'node:path'
import { openSync as open } from 'node:fs'
import { closeSync as close } from 'node:fs'
import { readFileSync as read } from 'node:fs'
import { writeFileSync as write } from 'node:fs'

import { expect } from 'chai'


export function is_node ()
{
	return process.execPath.match('/bin/node')
}

export function is_deno ()
{
	return process.execPath.match('/bin/deno')
}


function runtime ()
{
	if (is_node())
	{
		return 'node'
	}
	if (is_deno())
	{
		return 'deno'
	}

	throw new TypeError('unknown_runtime')
}


export const tmp = '/tmp/booth'

export function Aof (name, fn_result, fn_end)
{
	name = (name + '_' + runtime())

	var file = open(logname(name), 'a')

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
		fn_end?.()
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

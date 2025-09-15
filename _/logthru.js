
/* import type { Writable } from 'node:stream' */

import { mkdirSync as mkdir } from 'node:fs'
import { appendFile as append } from 'node:fs'

import { inspect } from 'node:util'

import Tmp from './tmp.js'

import strip from 'strip-ansi'


export default function logthru (name, stdout = process.stdout, stderr = process.stderr)
{
	var tmp = Tmp(name)
	var logname = tmp('log.txt')

	mkdir(tmp(), { recursive: true })

	var ts = (new Date).toISOString().slice(0, 10)

	append(logname, `${ ts }:\n`, () => {})

	stream_patch(logname, stdout)
	stream_patch(logname, stderr)

	log_toplevel_error(logname, 'uncaughtException')
	log_toplevel_error(logname, 'unhandledRejection')
}


function stream_patch (filename, stream)
{
	var $write = stream.write.bind(stream)

	// function write (chunk: any, callback?: Function): boolean
	// function write (chunk: any, encoding: BufferEncoding, callback?: Function): boolean
	// function write (...args: unknown[]): boolean
	function write (...args)
	{
		var r = $write(...args)

		if (typeof args.at(-1) === 'function')
		{
			args.pop()
		}

		var [ chunk, encoding = null ] = args

		if (typeof chunk === 'string')
		{
			chunk = strip(chunk)
		}

		append(filename, chunk, { encoding }, () => {})

		return r
	}

	stream.write  = write
	stream.$write = $write
}


function log_toplevel_error (filename, type) /* : ('unhandledRejection' | 'uncaughtException') */
{
	process.on(type, (e) =>
	{
		var repr_text = inspect(e,
		{
			colors: false,
			breakLength: 120,
		})

		append(filename, `${ type }\n`, () => {})
		append(filename, `${ repr_text }\n`, () => {})

		/*
		if (dev or not residual) // TODO: --residual ?
		{
			var repr_term = inspect(e,
			{
				breakLength: 120,
			})

			process.stdout.$write(repr_term)
		}
		*/
	})
}

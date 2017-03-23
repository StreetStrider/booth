/* @flow */

export default function nsbooth (...eventname: string[])
{
	return '@booth/' + eventname.join('/')
}

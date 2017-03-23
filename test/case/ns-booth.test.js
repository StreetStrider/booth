/* @flow */

import ns_booth from '../../lib/ns-booth'

import { expect } from 'chai'

describe('ns-booth', () =>
{
	it('works', () =>
	{
		expect(ns_booth()).eq('@booth/')
		expect(ns_booth('a')).eq('@booth/a')
		expect(ns_booth('A')).eq('@booth/A')
		expect(ns_booth('a/b')).eq('@booth/a/b')
		expect(ns_booth('a-b')).eq('@booth/a-b')
	})

	it('works chunked', () =>
	{
		expect(ns_booth()).eq('@booth/')
		expect(ns_booth('a', 'b', 'c')).eq('@booth/a/b/c')
		expect(ns_booth('A', 'a')).eq('@booth/A/a')
		expect(ns_booth('a/b', 'c')).eq('@booth/a/b/c')
		expect(ns_booth('a-b', 'c')).eq('@booth/a-b/c')
	})
})

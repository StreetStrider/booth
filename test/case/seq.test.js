/* @flow */

import { expect } from 'chai'

import Seq from '../../lib/seq'

describe('Seq', () =>
{
	it('goes sequential', () =>
	{
		var seq = Seq()

		expect(seq()).eq(1)
		expect(seq()).eq(2)
		expect(seq()).eq(3)
	})
})

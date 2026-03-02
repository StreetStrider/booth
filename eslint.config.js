
import node from 'outlander/node'
import globals from 'outlander/globals'
import typescript from 'outlander/typescript'


export default
[
	...node,

	{
		languageOptions:
		{
			globals:
			{
				...globals.node,
			},
		},
	},

	{
		files: [ '**/*.js' ],
	},
	{
		ignores: [ 'release/**', 'gulpfile.cjs' ],
	},

	...typescript,

	{
		rules:
		{
			'complexity': [ 1, 6 ],
			'require-await': 2,
		},
	},

	{
		files: [ '**/*.d.ts' ],

		rules:
		{
			'node/no-missing-import': 0,
			'node/no-unpublished-import': 0,
		}
	},
]

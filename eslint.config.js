
import node from 'outlander/node'
import globals from 'outlander/globals'


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
]

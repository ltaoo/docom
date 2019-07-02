module.exports = {
	components: {
		button: {
			demo: {
				basic: () => import('@root/src/components/button/demo/basic.md')
			},
			index: () => import('@root/src/components/button/index.md')
		},
		index: () => import('@root/src/components/index.md'),
		input: {
			index: () => import('@root/src/components/input/index.md')
		}
	},
	develop: {
		branch: () => import('@root/docs/develop/branch.md'),
		index: () => import('@root/docs/develop/index.md'),
		test: () => import('@root/docs/develop/test.md')
	}
}
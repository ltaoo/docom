const utils = require('./utils');

describe('utils', () => {
    it('format config', () => {
        const config = {
            files: ['**/*.md'],
            modules: {
                develop: {
                    title: '开发文档',
                    path: './docs/develop',
                },
            },
        };

        const result = utils.format(config);

        expect(result).toEqual({
            entryType: 'react',
            files: ['**/*.md'],
            modules: [
                {
                    key: 'develop',
                    title: '开发文档',
                    path: './docs/develop',
                    absolutePath: '/Users/ltaoo/Documents/fake-bisheng/packages/docom-core/docs/develop',
                },
            ],
            output: '_docom',
            title: 'Docom',
            plugins: [],
            hooks: {},
        });
    });

    describe('filesToTreeStructure', () => {
        it('one level dirs', () => {
            const files = [
                'docs/develop/index.md',
                'docs/develop/test.md',
                'docs/develop/branch.md',
            ];
            const sources = ['./docs/develop'];

            const result = utils.filesToTreeStructure(files, sources);
            expect(result).toEqual({
                docs: {
                    develop: {
                        index: 'docs/develop/index.md',
                        test: 'docs/develop/test.md',
                        branch: 'docs/develop/branch.md',
                    },
                },
            });
        });
        it('rec dirs', () => {
            const files = [
                'docs/develop/index.md',
                'docs/develop/test.md',
                'docs/develop/branch.md',
                'src/components/index.md',
                'src/components/button/index.md',
                'src/components/button/demo/index.md',
                'src/components/input/index.md',
            ];
            const sources = ['./docs/develop', './src/components'];

            const result = utils.filesToTreeStructure(files, sources);
            expect(result).toEqual({
                docs: {
                    develop: {
                        index: 'docs/develop/index.md',
                        test: 'docs/develop/test.md',
                        branch: 'docs/develop/branch.md',
                    },
                },
                src: {
                    components: {
                        index: 'src/components/index.md',
                        button: {
                            index: 'src/components/button/index.md',
                            demo: {
                                index: 'src/components/button/demo/index.md',
                            },
                        },
                        input: {
                            index: 'src/components/input/index.md',
                        },
                    },
                },
            });
        });
    });

    it('getLastFileTree', () => {
        const moduleConfig = {
            key: 'develop',
            title: '开发文档',
            path: './docs/develop',
            absolutePath: '/Users/ltaoo/Documents/fake-bisheng/docs/develop',
        };
        const files = ['index.md', 'test.md', 'branch.md'];

        const result = utils.getLastFileTree(moduleConfig, files);

        expect(result).toEqual({
            develop: {
                index: 'docs/develop/index.md',
                test: 'docs/develop/test.md',
                branch: 'docs/develop/branch.md',
            },
        });
    });

    it('addRootAlias', () => {
        const modules = {
            develop: {
                index: 'docs/develop/index.md',
                test: 'docs/develop/test.md',
                branch: 'docs/develop/branch.md',
            },
        };
        const prefix = '@root/';

        const result = utils.addRootAlias(modules, prefix);

        expect(result).toEqual({
            develop: {
                index: '@root/docs/develop/index.md',
                test: '@root/docs/develop/test.md',
                branch: '@root/docs/develop/branch.md',
            },
        });
    });

    it('addPlaceholder', () => {
        const modules = {
            develop: {
                index: 'docs/develop/index.md',
                test: 'docs/develop/test.md',
                branch: 'docs/develop/branch.md',
            },
        };

        const result = utils.addPlaceholder(utils.addRootAlias(modules, '@root/'));

        expect(result).toEqual({
            develop: {
                index: '{{@root/docs/develop/index.md}}',
                test: '{{@root/docs/develop/test.md}}',
                branch: '{{@root/docs/develop/branch.md}}',
            },
        });
    });

    it('createImportsContent', () => {
        const modules = {
            develop: {
                index: '{{@root/docs/develop/index.md}}',
                test: '{{@root/docs/develop/test.md}}',
                branch: '{{@root/docs/develop/branch.md}}',
            },
        };
        const expectResult = `module.exports = {
  "develop": {
    "index": () => import('@root/docs/develop/index.md'),
    "test": () => import('@root/docs/develop/test.md'),
    "branch": () => import('@root/docs/develop/branch.md')
  }
}`;

        const result = utils.createImportsContent(modules);

        expect(result).toEqual(expectResult);
    });

    it('normalizeFilePath', () => {
        const config = {
            files: ['**/*.md'],
            modules: {
                develop: {
                    title: '开发文档',
                    path: './docs/develop',
                },
                components: {
                    title: '組件',
                    path: './src/components',
                },
            },
        };
        const filename = 'src/components/index.md';

        const formatedConfig = utils.format(config);
        const result = utils.normalizeFilePath(filename, formatedConfig.modules);

        expect(result).toBe('components/index.md');
    });

    it('mergeSameNameKey', () => {
        const a = {
            foo: 2,
            bar: 'bar',
        };
        const b = {
            foo: 5,
        };

        const result = utils.mergeSameNameKey(a, b);

        expect(result).toEqual({
            foo: [2, 5],
            bar: ['bar'],
        });
    });
});

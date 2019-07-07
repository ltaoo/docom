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
            files: ['**/*.md'],
            modules: [
                {
                    key: 'develop',
                    title: '开发文档',
                    path: './docs/develop',
                    absolutePath: '/Users/ltaoo/Documents/fake-bisheng/docs/develop',
                },
            ],
        })
    });

    it('filesToTreeStructure', () => {
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
  develop: {
    index: () => import('@root/docs/develop/index.md'),
    test: () => import('@root/docs/develop/test.md'),
    branch: () => import('@root/docs/develop/branch.md')
  }
}`;

        const result = utils.createImportsContent(modules);

        expect(result).toEqual(expectResult);
    });
});
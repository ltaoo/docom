const fs = require('fs');
const path = require('path');

const marktwain = require('mark-twain');
const log = require('debug')('core:log');

const walkFileTree = require('./walkFileTree');
const normalizeFilePath = require('./normalizeFilePath');
const touch = require('./touch');

/**
 * 生成 source.json 文件
 * @param {Modules} fileTree
 * @param {FormattedDocomConfig} config
 */
function createSourceFile(modules, config) {
    const cwd = process.cwd();
    const content = modules.map((module) => {
        const { files } = module;
        return walkFileTree(files)((relativePath) => {
            const absolutePath = path.resolve(cwd, relativePath);
            // @TODO 这里应该很耗性能，不仅要读取文件，还要解析。需要优化
            const fileContent = fs.readFileSync(absolutePath, 'utf-8');
            let markdownData = marktwain(fileContent);
            markdownData.meta.realpath = relativePath;
            markdownData.meta.filename = normalizeFilePath(relativePath, module);

            // 可以对 markdown data 做修改
            const { plugins, paths } = config;
            plugins.forEach(([plugin, opt = {}]) => {
                if (plugin === undefined) {
                    return;
                }
                log('plugin', plugin);
                log('plugin search path', paths.theme, paths.entry);
                const util = require(require.resolve(plugin, {
                    paths: [
                        paths.theme,
                        paths.entry,
                    ],
                }));
                const { hooks } = util;
                if (hooks && hooks.modifyMarkdownData) {
                    markdownData = hooks.modifyMarkdownData(markdownData, {
                        ...config,
                        ...opt,
                    });
                }
            });
            if (config.lazyload) {
                delete markdownData.content;
            }
            return markdownData;
        });
    }).reduce((files, fileTree) => ({
        ...files,
        ...fileTree,
    }), {});
    fs.mkdir(path.resolve(cwd, '.docom'), () => {
        touch(path.resolve(cwd, '.docom/source.json'), JSON.stringify(content));
    });
}

module.exports = createSourceFile;

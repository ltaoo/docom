const fs = require('fs');
const path = require('path');

const { addPlaceholder, addRootAlias } = require('./index');
const touch = require('./touch');

/**
 * 生成 imports.js 文件的内容
 * // @TODO: 不用正则实现
 * @param {FileTree} fileTree
 * @return {string}
 */
function createImportsContent(fileTree) {
    const text = JSON.stringify(fileTree, null, '  ')
    // .replace(/"/g, '')
        .replace(/\{\{(.*)\}\}/g, (match, p) => `() => import('${p}')`)
        .replace(/"(\(.*\))"/g, (match, p) => p);
    return `module.exports = ${text}`;
}

/**
 * 创建 imports.js 文件
 * @param {FileTree} fileTree
 */
function createImportsFile(modules) {
    const sources = modules.map((module) => {
        const { files } = module;
        const source = addPlaceholder(
            addRootAlias(files, '@root/'),
        );
        return source;
    }).reduce((imports, source) => ({
        ...imports,
        ...source,
    }), {});
    // @TODO: .docom 文件夹在初始化的时候创建
    fs.mkdir(path.resolve(process.cwd(), '.docom'), () => {
        const content = createImportsContent(sources);
        touch(path.resolve(process.cwd(), '.docom/imports.js'), content);
    });
}

module.exports = createImportsFile;

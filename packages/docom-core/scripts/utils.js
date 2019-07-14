/* eslint-disable no-param-reassign */
const fs = require('fs');
const path = require('path');

const marktwain = require('mark-twain');
const R = require('ramda');
const glob = require('glob');
const _ = require('lodash');
const JsonML = require('jsonml.js/lib/utils');

const constants = require('../constants');

const {
    DEFAULT_CONFIG,
} = constants;

/**
 * 对 docom config 校验
 * @param {DocomConfig} conf
 * @return {DocomConfig}
 */
function validateConfig(conf) {
    if (conf.theme === undefined) {
        return '[error] 请配置 theme';
    }
    return false;
}

/**
 * 处理配置项
 * @param {DocomConfig} conf
 * @return {FormattedDocomConfig}
 */
function format(conf) {
    const { modules } = conf;
    return Object.assign({}, DEFAULT_CONFIG, {
        ...conf,
        modules: Object.keys(modules).map((key) => {
            const module = modules[key];
            return {
                ...module,
                key,
                absolutePath: path.resolve(module.path),
            };
        }),
    });
}

const globConfig = {
    ignore: ['**/node_modules/**'],
    onlyFiles: true,
    unique: true,
    nocase: true,
    matchBase: true,
};

/**
 * 从项目中递归获取指定文件
 * @param {string} module
 * @param {Array<string>} files
 * @return {Array<string>}
 */
function collectFiles(module, files) {
    const { path: modulePath } = module;
    const searchPath = path.resolve(modulePath);
    return glob.sync(files, { ...globConfig, cwd: searchPath });
}

function toMatch(conf) {
    const { modules } = conf;
    const patterns = modules.map((module) => {
        const modulePath = module.path;
        return modulePath;
    });
    return patterns;
}

function getPropPath(filename, sources) {
    return sources.reduce(
        f => f,
        // (f, source) => f.replace(source.path, source.key),
        filename.replace(new RegExp(`${path.extname(filename)}$`), ''),
    ).replace(/^\.?(?:\\|\/)+/, '').split('/');
}

/**
 *
 * @param {Array<Filename>} filenames
 * @param {*} sources
 * @return {FileTree}
 */
function filesToTreeStructure(filenames, sources) {
    const cleanedSources = sources.map(source => source.replace(/^\.?(?:\\|\/)/, ''));
    return filenames.reduce((subFilesTree, filename) => {
        const params = getPropPath(filename, cleanedSources);
        const propLens = R.lensPath(params);
        // const lastFilename = `{{path.resolve(filename).replace(process.cwd(), '@root')}}`;
        // 第一个参数是 a.b.c 第二个参数是 value，第三个参数是要写的对象
        return R.set(propLens, filename, subFilesTree);
    }, {});
}

/**
 * @param {ModuleConfig} module
 * @param {Array<FileName>} files - glob 查找到的文件名
 * @return {Modules}
 */
function getLastFileTree(module, files) {
    const { key, path: modulePath } = module;
    const removedPrefixModulePath = path.join(modulePath);
    const prefixedFiles = files
        .map(file => path.join(removedPrefixModulePath, file));

    const fileTree = filesToTreeStructure(prefixedFiles, [removedPrefixModulePath]);
    const modulePaths = removedPrefixModulePath.split(path.sep).join('.');
    return {
        [key]: _.get(fileTree, modulePaths),
    };
}

/**
 * 根据配置项中的 modules 遍历出 md 文件
 * interface Modules {
 *   [module: string]: Module;
 * }
 * interface Module {
 *   title: string;
 *   path: string;
 * }
 * interface FileTree {
 *   [moduleName: string]: Files;
 * }
 * interface Files {
 *   [fileName: string]: RelativePath;
 * }
 * @param {Modules} modules - 配置项中的 modules
 * @param {Array<string>} files - 配置项中的 files
 * @return {FileTree}
 */
function getFileTree(modules, files) {
    return modules
        .map((module) => {
            const searchedFiles = collectFiles(module, files);
            return getLastFileTree(module, searchedFiles);
        })
        .reduce((allFiles, module) => ({ ...allFiles, ...module }), {});
}

/**
 * 递归处理 md 文件路径
 * @param {FileTree} fileTree
 * @param {function} action - 处理 md 路径的方式
 * @return {ProcessedFileTree}
 */
function processRelativePath(fileTree) {
    function foo(tree, callback, file) {
        if (typeof tree === 'string') {
            return callback(tree, file);
        }
        return Object.keys(tree)
            .map((key) => {
                const module = tree[key];
                return {
                    [key]: foo(module, callback, key),
                };
            })
            .reduce((files, pathname) => ({
                ...files,
                ...pathname,
            }), {});
    }
    return action => foo(fileTree, action);
}

/**
 * 给路径增加前缀
 * @param {FileTree} fileTree
 * @param {string} prefix
 * @return {FileTree}
 */
function addRootAlias(fileTree, prefix) {
    return processRelativePath(fileTree)(relativePath => prefix + relativePath);
}

/**
 * @param {FileTree} fileTree
 * @return {FileTree}
 */
function addPlaceholder(fileTree) {
    return processRelativePath(fileTree)(relativePath => `{{${relativePath}}}`);
}

/**
 * 生成文件
 * @param {string} file - 要创建的文件名
 * @param {string} raw - 写入的文件内容
 */
const touch = (file, raw) => new Promise(async (resolve, reject) => {
    const content = raw;
    const stream = fs.createWriteStream(file);
    stream.write(content, 'utf-8');
    stream.on('finish', () => resolve());
    stream.on('error', err => reject(err));
    stream.end();
});

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
function createImportsFile(fileTree) {
    const source = addPlaceholder(addRootAlias(fileTree, '@root/'));
    // @TODO: .docom 文件夹在初始化的时候创建
    fs.mkdir(path.resolve(process.cwd(), '.docom'), () => {
        const content = createImportsContent(source);
        touch(path.resolve(process.cwd(), '.docom/imports.js'), content);
    });
}

/**
 *
 * @param {string} pathname
 * @return {string}
 */
function removePrefixPath(pathname) {
    return pathname.replace(/^\.\//g, '');
}

/**
 *
 * @param {string} filepath
 * @param {Array<string>} sources
 */
function normalizeFilePath(filepath, sources) {
    const source = sources.find((s) => {
    // @TODO 可能有平台差异
        const pathname = removePrefixPath(s.path);
        return filepath.indexOf(pathname) > -1;
    });
    if (source === undefined) {
        return filepath;
    }
    return filepath.replace(removePrefixPath(source.path), source.key);
}

/**
 * 从 markdown 中解析 hr 并添加 description
 * @param {MarkdownData} markdownData
 * @return {MarkdownData}
 */
function getDescription(markdownData) {
    const { content } = markdownData;
    const result = { ...markdownData };
    const contentChildren = JsonML.getChildren(content);
    const dividerIndex = contentChildren.findIndex(node => JsonML.getTagName(node) === 'hr');

    if (dividerIndex >= 0) {
        result.description = ['section']
            .concat(contentChildren.slice(0, dividerIndex));
        result.content = [
            JsonML.getTagName(content),
            JsonML.getAttributes(content) || {},
        ].concat(contentChildren.slice(dividerIndex + 1));
    }

    return result;
}

/**
 * 生成 source.json 文件
 * @param {FileTree} fileTree
 * @param {FormattedDocomConfig} config
 */
function createSourceFile(fileTree, config) {
    const cwd = process.cwd();
    const content = processRelativePath(fileTree)((relativePath) => {
        const absolutePath = path.resolve(cwd, relativePath);
        // @TODO 这里应该很耗性能，不仅要读取文件，还要解析。需要优化
        const markdownData = marktwain(fs.readFileSync(absolutePath, 'utf-8'));
        markdownData.meta.realpath = relativePath;
        markdownData.meta.filename = normalizeFilePath(relativePath, config.modules);

        // 可以对 markdown data 做修改
        const { plugins } = config;
        plugins.forEach(([plugin, opt]) => {
            if (plugin === undefined) {
                return;
            }
            const util = require(require.resolve(plugin, {
                paths: [
                    config.paths.theme,
                    config.paths.entry,
                ],
            }));
            const { hooks } = util;
            if (hooks && hooks.modifyMarkdownData) {
                hooks.modifyMarkdownData(markdownData, opt);
            }
        });
        delete markdownData.content;
        return markdownData;
    });
    fs.mkdir(path.resolve(cwd, '.docom'), () => {
        touch(path.resolve(cwd, '.docom/source.json'), JSON.stringify(content));
    });
}

function intersectionKeys(a, b) {
    return a.filter(key => b.includes(key));
}
function differenceKeys(a, b) {
    return a.concat(b).filter(v => !a.includes(v) || !b.includes(v));
}
/**
 * 合并两个对象的同名键对应的值为数组
 * @example
 *  const a = { foo: 'a' };
 *  const b = { foo: 'b' };
 *  const result = mergeSameNameKey(a, b);
 *  result === {
 *      foo: ['a', 'b'],
 *  };
 * @param {Object} a
 * @param {Object} b
 */
function mergeSameNameKey(a, b) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    // 获取交集
    const commonKeys = intersectionKeys(aKeys, bKeys);
    // 获取差集
    const aRestKeys = differenceKeys(aKeys, commonKeys);
    const bRestKeys = differenceKeys(bKeys, commonKeys);

    const result = {};
    commonKeys.forEach((key) => {
        result[key] = [a[key], b[key]];
    });
    aRestKeys.forEach((key) => {
        result[key] = [a[key]];
    });
    bRestKeys.forEach((key) => {
        result[key] = [b[key]];
    });
    return result;
}
/**
 * 将多个 hooks 合并
 * @param  {...any} hooksGroup
 */
function mergeHooks(...hooksGroup) {
    return hooksGroup.reduce((group, hooks) => mergeSameNameKey(group, hooks), {});
}
function mergePlugins(...pluginsGroup) {
    return pluginsGroup.reduce((group, plugins) => group.concat(plugins), []);
}

module.exports = {
    validateConfig,
    format,
    toMatch,
    filesToTreeStructure,
    getFileTree,
    getLastFileTree,
    createImportsFile,
    addRootAlias,
    addPlaceholder,
    createImportsContent,
    createSourceFile,
    normalizeFilePath,
    getDescription,
    mergeSameNameKey,
    mergeHooks,
    mergePlugins,
};

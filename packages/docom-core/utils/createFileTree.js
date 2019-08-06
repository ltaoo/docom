const path = require('path');

const R = require('ramda');
const _ = require('lodash');

const collectFiles = require('./collectFiles');
const { isDirectory, cleanDotPrefix } = require('./index');

function removeExt(filename) {
    return filename.replace(new RegExp(`${path.extname(filename)}$`), '');
}
/**
 * @param {string} filename
 * @return {Array<string>}
 */
function splitFilename(filename) {
    const filenameWithoutExt = removeExt(filename);
    return filenameWithoutExt.replace(/^\.?(?:\\|\/)+/, '').split('/');
}

/**
 *
 * @param {Array<string>} filenames
 * @param {*} sources
 * @return {FileTree}
 */
function filesToTreeStructure(filenames, sources, module) {
    // const cleanedModulePath = cleanDotPrefix(module.path);
    return filenames.reduce((subFilesTree, filename) => {
        const arr = splitFilename(filename);
        const paths = R.lensPath(arr);
        if (isDirectory(module.path)) {
            return R.set(paths, filename, subFilesTree);
        }
        return {
            [module.key]: module.path,
        };
    }, {});
}

/**
 * glob 遍历后，把得到的 markdown 文件名和路径拼起来
 * @param {ModuleConfig} module
 * @param {Array<FileName>} files - glob 查找到的文件名
 * @return {Modules}
 */
function createTreeFromModule(module, files) {
    const { key, path: modulePath } = module;
    const cleanedModulePath = cleanDotPrefix(modulePath);
    const prefixedFiles = isDirectory(modulePath)
        ? files.map(file => path.join(cleanedModulePath, file))
        : files;
    const fileTree = filesToTreeStructure(
        prefixedFiles,
        [cleanedModulePath],
        module,
    );
    if (isDirectory(modulePath)) {
        const paths = cleanedModulePath.split(path.sep).join('.');
        return {
            [key]: _.get(fileTree, paths),
        };
    }
    return fileTree;
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
 * @param {Array<string>} patterns - 配置项中的 files
 * @return {FileTree}
 */
function createFileTree(modules, patterns) {
    return modules
        .map((module) => {
            const searchedFiles = collectFiles(module, patterns);
            return {
                ...module,
                files: createTreeFromModule(module, searchedFiles),
            };
        });
    // .reduce((files, module) => ({
    //     ...files,
    //     ...module.files,
    // }), {});
}

module.exports = createFileTree;

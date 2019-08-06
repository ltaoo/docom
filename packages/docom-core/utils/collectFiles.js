const path = require('path');

const glob = require('glob');

const { hasSuffix } = require('./index');

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
    if (!hasSuffix(modulePath)) {
        const searchPath = path.resolve(modulePath);
        return glob.sync(files, { ...globConfig, cwd: searchPath });
    }
    return [modulePath];
}

module.exports = collectFiles;

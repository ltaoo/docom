const path = require('path');

const walkFileTree = require('./walkFileTree');
/**
 * 给路径增加前缀
 * @param {FileTree} fileTree
 * @param {string} prefix
 * @return {FileTree}
 */
function addRootAlias(fileTree, prefix) {
    return walkFileTree(fileTree)(relativePath => prefix + relativePath);
}

/**
 * @param {FileTree} fileTree
 * @return {FileTree}
 */
function addPlaceholder(fileTree) {
    return walkFileTree(fileTree)(relativePath => `{{${relativePath}}}`);
}

function hasSuffix(filepath) {
    const ext = path.extname(filepath);
    if (ext !== '' && ext !== undefined) {
        return true;
    }
    return false;
}

function isDirectory(filepath) {
    if (!hasSuffix(filepath)) {
        return true;
    }
    return false;
}

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

function toMatch(conf) {
    const { modules } = conf;
    const patterns = modules.map((module) => {
        const modulePath = module.path;
        return modulePath;
    });
    return patterns;
}

function cleanDotPrefix(filepath) {
    return filepath.replace(/^\.?(?:\\|\/)/, '');
}

module.exports = {
    addPlaceholder,
    addRootAlias,
    isDirectory,
    hasSuffix,
    validateConfig,
    toMatch,
    cleanDotPrefix,
};

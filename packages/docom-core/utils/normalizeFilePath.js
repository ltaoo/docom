const path = require('path');

const debug = require('debug')('core:log');
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
function normalizeFilePath(filepath, module) {
    debug('normalize file path', filepath, module);
    return filepath.split(path.sep).join('/').replace(removePrefixPath(module.path), module.key);
}

module.exports = normalizeFilePath;

const DEFAULT_ENTRY_TYPE = 'react';
// const DEFAULT_THEME = 'docom-theme-one';

/**
 * interface Module {
 *      title: string;
 *      path: string;
 * }
 * interface Modules {
 *      [module: string]: Module;
 * }
 * interface Plugin
 * interface DocomConfig {
 *      title: string;
 *      subtitle: string;
 *      logo: string;
 *      output: string;
 *      files: Array<string>;
 *      entryType: string;
 *      modules: Modules;
 *      plugins: Array<Plugin>;
 *      hooks: Hooks;
 *      // @TODO 支持 ignore
 * }
 */
const DEFAULT_CONFIG = {
    title: 'Docom',
    files: ['**/*.md'],
    // theme: DEFAULT_THEME,
    entryType: DEFAULT_ENTRY_TYPE,
    output: '_docom',
    plugins: [],
    hooks: {},
};

const DOCOM_CORE_MODULE = 'docom-core';
const NODE_MODULES = 'node_modules';
const ENTRY_PREFIX = 'docom-entry-';
const ENTRY_INDEX_DEFAULTL_FILE_NAME = 'index.js';

module.exports = {
    DEFAULT_ENTRY_TYPE,
    DEFAULT_CONFIG,
    DOCOM_CORE_MODULE,
    NODE_MODULES,
    ENTRY_PREFIX,
    ENTRY_INDEX_DEFAULTL_FILE_NAME,
};

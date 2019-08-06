const path = require('path');

const context = require('./context');
const babelConfigFacotry = require('../config/babelConfig');
const pathsFactory = require('../config/paths');
const {
    format,
    mergeHooks,
    mergePlugins,
} = require('./utils');
const createFileTree = require('../utils/createFileTree');
const createSourceFile = require('../utils/createSourceFile');
const createImportsFile = require('../utils/createImportsFile');

const DEFAULT_DOCOM_CONFIG_FILENAME = 'docom.config';

function readConfigs() {
    const docomConfig = require(path.resolve(process.cwd(), DEFAULT_DOCOM_CONFIG_FILENAME));
    const formattedConfig = format(docomConfig);
    const paths = pathsFactory({ config: formattedConfig, from: 'start' });

    const { theme, entry } = paths;
    const themeConfig = require(path.resolve(theme, 'theme.config'));
    const entryConfig = require(path.resolve(entry, 'entry.config'));

    return {
        docomConfig: formattedConfig,
        themeConfig,
        entryConfig,
        paths,
    };
}

module.exports = () => {
    const {
        docomConfig,
        themeConfig,
        entryConfig,
        paths,
    } = readConfigs();
    context.set('docomConfig', docomConfig);
    context.set('themeConfig', themeConfig);
    context.set('entryConfig', entryConfig);
    context.set('paths', paths);

    if (themeConfig === undefined) {
        console.log('主题中必须包含 theme.config.js 文件');
        process.exit(1);
    }
    const {
        hooks: docomHooks,
        plugins: docomPlugins,
    } = docomConfig;
    const {
        hooks: entryHooks,
        plugins: entryPlugins,
    } = entryConfig;
    const {
        hooks: themeHooks,
        plugins: themePlugins,
    } = themeConfig;

    const mergedHooks = mergeHooks(docomHooks, entryHooks, themeHooks);
    context.set('hooks', mergedHooks);
    const mergedPlugins = mergePlugins(docomPlugins, entryPlugins, themePlugins);
    context.set('plugins', mergedPlugins);

    const babelConfig = babelConfigFacotry({ isEnvProduction: false });
    context.set('babel', babelConfig);

    const hooks = mergedHooks;
    const modulesWithFileTree = createFileTree(
        docomConfig.modules,
        docomConfig.files,
    );
    createSourceFile(modulesWithFileTree, {
        babelConfig,
        lazyload: docomConfig.lazyload,
        paths,
        plugins: mergedPlugins,
    });
    if (docomConfig.lazyload) {
        createImportsFile(modulesWithFileTree, {
            paths,
            plugins: mergedPlugins,
        });
    }

    return {
        paths,
        hooks,
        docomConfig,
    };
};

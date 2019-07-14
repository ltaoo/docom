/**
 * @file 資源定位
 * 要明確需要的依賴到底在哪裡
 * - projectRoot
 *    - node_modules
 *        - docom-core
 *        - docom-theme-one
 *        - docom-entry-react
 *        - docom-xx
 * 以及，要知道 webpack 是怎麼尋找依賴的
 * 通過 alias，可以簡單處理 theme 和 imports 的定位
 */
const path = require('path');
const fs = require('fs');
const url = require('url');

const DEFAULT_ENTRY_TYPE = 'react';
// const DEFAULT_THEME = 'docom-theme-one';
const DEFAULT_CONFIG = {
    // theme: DEFAULT_THEME,
    entryType: DEFAULT_ENTRY_TYPE,
};

const DOCOM_CORE_MODULE = 'docom-core';
const NODE_MODULES = 'node_modules';
const ENTRY_PREFIX = 'docom-entry-';
const ENTRY_INDEX_DEFAULTL_FILE_NAME = 'index.js';

// 執行命令行的目錄，一般都是自己的項目根目錄
const projectRoot = fs.realpathSync(process.cwd());
const projectNodeModulesPath = path.resolve(projectRoot, NODE_MODULES);
// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const docomCoreModulePath = fs.realpathSync(path.join(projectNodeModulesPath, DOCOM_CORE_MODULE));
const resolveCore = relativePath => path.resolve(docomCoreModulePath, relativePath);
const resolveProject = relativePath => path.resolve(projectRoot, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(inputPath, needsSlash) {
    const hasSlash = inputPath.endsWith('/');
    if (hasSlash && !needsSlash) {
        return inputPath.substr(0, inputPath.length - 1);
    } if (!hasSlash && needsSlash) {
        return `${inputPath}/`;
    }
    return inputPath;
}

const getPublicUrl = appPackageJson => envPublicUrl || require(appPackageJson).homepage;

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
    const publicUrl = getPublicUrl(appPackageJson);
    const servedUrl = envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
    return ensureSlash(servedUrl, true);
}

const moduleFileExtensions = [
    'web.mjs',
    'mjs',
    'web.js',
    'js',
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'json',
    'web.jsx',
    'jsx',
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
    const extension = moduleFileExtensions.find(ext => fs.existsSync(resolveFn(`${filePath}.${ext}`)));

    if (extension) {
        return resolveFn(`${filePath}.${extension}`);
    }

    return resolveFn(`${filePath}.js`);
};

module.exports = () => {
    const basePaths = {
        appPath: projectRoot,
        dotenv: resolveProject('.env'),
        appBuild: resolveProject('_docom'),
        appPublic: resolveCore('public'),
        appHtml: resolveCore('public/index.html'),
        appPackageJson: resolveProject('package.json'),
        appTsConfig: resolveProject('tsconfig.json'),
        appJsConfig: resolveProject('jsconfig.json'),
        yarnLockFile: resolveProject('yarn.lock'),
        testsSetup: resolveModule(resolveProject, 'src/setupTests'),
        proxySetup: resolveProject('src/setupProxy.js'),
        babelrc: resolveCore('.babelrc'),
        publicUrl: getPublicUrl(resolveProject('package.json')),
        servedPath: getServedPath(resolveProject('package.json')),
        // node_modules
        docomCoreNodeModules: resolveCore(NODE_MODULES),
        appNodeModules: path.resolve(DOCOM_CORE_MODULE, NODE_MODULES),
        appSrc: projectRoot,
        moduleFileExtensions,
    };
    if (Object.keys(docom.config).length === 0) {
        return basePaths;
    }
    const mergedConfig = Object.assign({}, DEFAULT_CONFIG, docom.config);
    docom.config = mergedConfig;

    const entryModule = ENTRY_PREFIX + mergedConfig.entryType;
    const entryModulePath = path.resolve(projectNodeModulesPath, entryModule);
    const entryIndex = path.resolve(entryModulePath, ENTRY_INDEX_DEFAULTL_FILE_NAME);
    const themePath = path.resolve(projectNodeModulesPath, mergedConfig.theme);
    return Object.assign(basePaths, {
        theme: themePath,
        entryModule: entryModulePath,
        appIndexJs: entryIndex,
    });
};

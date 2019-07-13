const path = require('path');
const fs = require('fs');
const url = require('url');

const DEFAULT_ENTRY_TYPE = 'react';
const DEFAULT_THEME = 'docom-theme-one';
const DEFAULT_CONFIG = {
  theme: DEFAULT_THEME,
  entryType: DEFAULT_ENTRY_TYPE,
};

const DOCOM_CORE_MODULE = 'docom-core';
const NODE_MODULES = 'node_modules';
const ENTRY_PREFIX = 'docom-entry-';
const ENTRY_INDEX_DEFAULTL_FILE_NAME = 'index.js';

const projectRoot = process.cwd();
const projectNodeModulesPath = path.resolve(projectRoot, NODE_MODULES);
// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const bishengDirectory = fs.realpathSync(
  path.join(projectNodeModulesPath, DOCOM_CORE_MODULE)
);
const resolveBishengApp = relativePath => path.resolve(bishengDirectory, relativePath);
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(inputPath, needsSlash) {
  const hasSlash = inputPath.endsWith('/');
  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${inputPath}/`;
  } else {
    return inputPath;
  }
}

const getPublicUrl = appPackageJson =>
  envPublicUrl || require(appPackageJson).homepage;

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
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
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

module.exports = ({ from }) => {
  console.log(from, docom.config);
  const mergedConfig = Object.assign({}, DEFAULT_CONFIG, docom.config);

  const entryModule = ENTRY_PREFIX + mergedConfig.entryType;
  const entryModulePath = path.resolve(projectNodeModulesPath, entryModule);
  const entryIndex = path.resolve(entryModulePath, ENTRY_INDEX_DEFAULTL_FILE_NAME);
  const themePath = path.resolve(projectNodeModulesPath, mergedConfig.theme);
  console.log(themePath);
  return {
    dotenv: resolveApp('.env'),
    theme: themePath,
    appPath: projectRoot,
    appBuild: resolveBishengApp('build'),
    appPublic: resolveBishengApp('public'),
    appHtml: resolveBishengApp('public/index.html'),
    entryModule: entryModulePath,
    appIndexJs: entryIndex,
    appPackageJson: resolveApp('package.json'),
    appSrc: projectRoot,
    appTsConfig: resolveApp('tsconfig.json'),
    appJsConfig: resolveApp('jsconfig.json'),
    yarnLockFile: resolveApp('yarn.lock'),
    testsSetup: resolveModule(resolveApp, 'src/setupTests'),
    proxySetup: resolveApp('src/setupProxy.js'),
    appNodeModules: resolveApp('node_modules'),
    publicUrl: getPublicUrl(resolveApp('package.json')),
    servedPath: getServedPath(resolveApp('package.json')),
    moduleFileExtensions: moduleFileExtensions,
  };
};

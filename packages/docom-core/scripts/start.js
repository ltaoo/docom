// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
    throw err;
});

require('../config/env');

const debug = require('debug')('core:log');
const fs = require('fs');
const path = require('path');
const chalk = require('react-dev-utils/chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
// const clearConsole = require('react-dev-utils/clearConsole');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const {
    choosePort,
    createCompiler,
    prepareProxy,
    prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');
const openBrowser = require('react-dev-utils/openBrowser');

const babelConfigFacotry = require('../config/babelConfig');
const pathsFactory = require('../config/paths');
const configFactory = require('../config/webpack.config');
const createDevServerConfig = require('../config/webpackDevServer.config');
const {
    validateConfig,
    format,
    getFileTree,
    createImportsFile,
    createSourceFile,
    mergeHooks,
    mergePlugins,
} = require('./utils');

const DEFAULT_DOCOM_CONFIG_FILENAME = 'docom.config';

/**
 * interface Command = 'dev' | 'build' | 'deploy';
 * interface Argv {
 *      _: Array<Command>;
 *      // 如果参数有值，就是 argv[opt]
 *      [opt: string]: boolean | string;
 *      '$0': string;
 * }
 * @param {Argv} argv
 */
module.exports = (argv) => {
    debug('CLI Options:', argv);
    const docomConfig = require(path.resolve(process.cwd(), DEFAULT_DOCOM_CONFIG_FILENAME));
    if (validateConfig(docomConfig)) {
        process.exit(1);
    }
    const formattedConfig = format(docomConfig);
    const paths = pathsFactory({ config: formattedConfig, from: 'start' });

    const { theme, entry } = paths;
    const themeConfig = require(path.resolve(theme, 'theme.config'));
    const entryConfig = require(path.resolve(entry, 'entry.config'));
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
    const mergedPlugins = mergePlugins(docomPlugins, entryPlugins, themePlugins);

    const babelConfig = babelConfigFacotry({ isEnvProduction: false });
    docom.config = {
        ...formattedConfig,
        babelConfig,
        hooks: mergedHooks,
        plugins: mergedPlugins,
        paths,
    };

    const hooks = mergedHooks;

    const fileTree = getFileTree(formattedConfig.modules, formattedConfig.files);
    createSourceFile(fileTree, docom.config);
    createImportsFile(fileTree, docom.config);

    const useYarn = fs.existsSync(paths.yarnLockFile);
    const isInteractive = process.stdout.isTTY;

    // Warn and crash if required files are missing
    if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
        process.exit(1);
    }

    // Tools like Cloud9 rely on this.
    const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
    const HOST = process.env.HOST || '0.0.0.0';
    if (process.env.HOST) {
        console.log(
            chalk.cyan(
                `Attempting to bind to HOST environment variable: ${chalk.yellow(
                    chalk.bold(process.env.HOST),
                )}`,
            ),
        );
        console.log(
            'If this was unintentional, check that you haven\'t mistakenly set it in your shell.',
        );
        console.log(
            `Learn more here: ${chalk.yellow('https://bit.ly/CRA-advanced-config')}`,
        );
        console.log();
    }

    // We require that you explicitly set browsers and do not fall back to
    // browserslist defaults.
    const { checkBrowsers } = require('react-dev-utils/browsersHelper');
    checkBrowsers(paths.appPath, isInteractive)
        // We attempt to use the default port but if it is busy, we offer the user to
        // run on a different port. `choosePort()` Promise resolves to the next free port.
        .then(() => choosePort(HOST, DEFAULT_PORT))
        .then((port) => {
            if (port == null) {
                // We have not found a port.
                return;
            }
            const config = configFactory('development');
            config.resolve.alias.react = path.resolve(paths.entryModule, 'node_modules/react');
            config.resolve.alias['react-dom'] = path.resolve(paths.entryModule, 'node_modules/react-dom');
            if (hooks.beforeCompile) {
                hooks.beforeCompile.forEach((hook) => {
                    hook(config, docom);
                });
            }
            docom.config.webpackConfig = config;
            const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
            const appName = require(paths.appPackageJson).name;
            const useTypeScript = fs.existsSync(paths.appTsConfig);
            const urls = prepareUrls(protocol, HOST, port);
            debug('port:', urls);
            /* eslint-disable no-use-before-define */
            const devSocket = {
                warnings: warnings => devServer.sockWrite(devServer.sockets, 'warnings', warnings),
                errors: errors => devServer.sockWrite(devServer.sockets, 'errors', errors),
            };
            // Create a webpack compiler that is configured with custom messages.
            const compiler = createCompiler({
                appName,
                config,
                devSocket,
                urls,
                useYarn,
                useTypeScript,
                webpack,
            });
            // Load proxy config
            const proxySetting = require(paths.appPackageJson).proxy;
            const proxyConfig = prepareProxy(proxySetting, paths.appPublic);
            // Serve webpack assets generated by the compiler over a web server.
            const serverConfig = createDevServerConfig(
                proxyConfig,
                urls.lanUrlForConfig,
            );
            const devServer = new WebpackDevServer(compiler, serverConfig);
            // Launch WebpackDevServer.
            devServer.listen(port, HOST, (err) => {
                if (err) {
                    return console.log(err);
                }
                if (isInteractive) {
                    // clearConsole();
                }

                // We used to support resolving modules according to `NODE_PATH`.
                // This now has been deprecated in favor of jsconfig/tsconfig.json
                // This lets you use absolute paths in imports inside large monorepos:
                if (process.env.NODE_PATH) {
                    console.log(
                        chalk.yellow(
                            'Setting NODE_PATH to resolve modules absolutely has been deprecated in favor of setting baseUrl in jsconfig.json (or tsconfig.json if you are using TypeScript) and will be removed in a future major release of create-react-app.',
                        ),
                    );
                    console.log();
                }

                console.log(chalk.cyan('Starting the development server...\n'));
                openBrowser(urls.localUrlForBrowser);
            });

            ['SIGINT', 'SIGTERM'].forEach((sig) => {
                process.on(sig, () => {
                    devServer.close();
                    process.exit();
                });
            });
        })
        .catch((err) => {
            if (err && err.message) {
                console.log(err.message);
            }
            process.exit(1);
        });
};

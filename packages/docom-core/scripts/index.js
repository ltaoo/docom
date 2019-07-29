const yargs = require('yargs');

// 必須放到 require('start') 前面
const docom = {
    config: {},
};
Object.defineProperty(global, 'docom', {
    enumerable: true,
    writable: false,
    value: docom,
});

module.exports = {
    cli: () => yargs
        .command(
            'dev', 'initialize docom dev server', () => {
            }, (argv) => {
                if (argv.verbose) {
                    process.env.DEBUG = 'core:*,plugin:*';
                }
                const dev = require('./start');
                dev(argv);
            },
        )
        .option('config', {
            alias: 'c',
        })
        .option('verbose', {
            alias: 'v',
            type: 'boolean',
            default: false,
        })
        .command(
            'build', 'bundle', () => {
            }, (argv) => {
                const build = require('./build');
                build(argv);
            },
        )
        .option('config', {
            alias: 'c',
        })
        .option('verbose', {
            alias: 'v',
            default: false,
        })
        .argv,
};

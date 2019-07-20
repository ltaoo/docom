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

const dev = require('./start');
const build = require('./build');

module.exports = {
    cli: () => yargs
        .command(
            'dev', 'initialize docom dev server', () => {
            }, (argv) => {
                dev(argv);
            },
        )
        .option('config', {
            alias: 'c',
        })
        .option('verbose', {
            alias: 'v',
            default: false,
        })
        .command(
            'build', 'bundle', () => {
            }, (argv) => {
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

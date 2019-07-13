const yargs = require('yargs');

const dev = require('./start');

module.exports = {
    cli: () => {
        return yargs
            .command('dev', 'initialize docom dev server', (yargs) => {
            }, (argv) => {
                dev();
            })
            .option('verbose', {
                alias: 'v',
                default: false,
            })
            .argv;
    },
};

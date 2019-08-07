const path = require('path');

const constants = require('../constants');

const {
    DEFAULT_CONFIG,
} = constants;

/**
 * 处理配置项
 * @param {DocomConfig} conf
 * @return {FormattedDocomConfig}
 */
function format(conf) {
    const { modules } = conf;
    return Object.assign({}, DEFAULT_CONFIG, {
        ...conf,
        modules: Object.keys(modules).map((key) => {
            const module = modules[key];
            return {
                ...module,
                key,
                absolutePath: path.resolve(module.path),
            };
        }),
    });
}

module.exports = format;

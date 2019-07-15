const marktwain = require('mark-twain');
// const loaderUtils = require("loader-utils");

const stringify = require('./stringify');

module.exports = (content) => {
    // const options = loaderUtils.getOptions(this);
    const markdownData = marktwain(content);
    const { config } = docom;

    // 可以对 markdown data 做修改
    const { plugins } = config;
    plugins.forEach(([plugin, opt]) => {
        if (plugin === undefined) {
            return;
        }
        const util = require(require.resolve(plugin, {
            paths: [
                config.paths.theme,
                config.paths.entry,
            ],
        }));
        const { hooks } = util;
        if (hooks && hooks.modifyMarkdownData) {
            hooks.modifyMarkdownData(markdownData, {
                ...docom,
                ...opt,
            });
        }
    });

    const output = `module.exports = ${stringify(markdownData)};`;
    return output;
};

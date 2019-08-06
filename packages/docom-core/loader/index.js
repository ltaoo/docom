const marktwain = require('mark-twain');

const stringify = require('./stringify');
const context = require('../scripts/context');

module.exports = function loader(content) {
    const filepath = this.resourcePath;
    const config = context.get('docomConfig');
    const babelConfig = context.get('babel');
    const plugins = context.get('plugins');
    const paths = context.get('paths');
    const module = config.modules.find(m => filepath.includes(m.absolutePath));
    const filename = filepath.replace(module.absolutePath, module.key);
    let markdownData = marktwain(content);
    markdownData.meta.filename = filename;

    // 可以对 markdown data 做修改
    plugins.forEach(([plugin, opt]) => {
        if (plugin === undefined) {
            return;
        }
        const util = require(require.resolve(plugin, {
            paths: [
                paths.theme,
                paths.entry,
            ],
        }));
        const { hooks } = util;
        if (hooks && hooks.modifyMarkdownData) {
            markdownData = hooks.modifyMarkdownData(markdownData, {
                babelConfig,
                ...opt,
            });
        }
    });

    const output = `module.exports = ${stringify(markdownData)};`;
    return output;
};

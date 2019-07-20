const marktwain = require('mark-twain');

const stringify = require('./stringify');

module.exports = function loader(content) {
    const filepath = this.resourcePath;
    const module = docom.config.modules.find(m => filepath.includes(m.absolutePath));
    const filename = filepath.replace(module.absolutePath, module.key);
    let markdownData = marktwain(content);
    markdownData.meta.filename = filename;
    const { config } = docom;

    // 可以对 markdown data 做修改
    const { plugins } = config;
    plugins.forEach(([plugin, opt]) => {
        if (plugin === undefined) {
            return;
        }
        // @TODO: 增加 log 展示加载了哪些 plugin
        // console.log(plugin, [config.paths.theme, config.paths.entry]);
        const util = require(require.resolve(plugin, {
            paths: [
                config.paths.theme,
                config.paths.entry,
            ],
        }));
        const { hooks } = util;
        if (hooks && hooks.modifyMarkdownData) {
            markdownData = hooks.modifyMarkdownData(markdownData, {
                ...docom,
                ...opt,
            });
        }
    });

    const output = `module.exports = ${stringify(markdownData)};`;
    return output;
};

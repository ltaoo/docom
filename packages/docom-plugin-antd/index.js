const path = require('path');
const processDoc = require('./process-doc');
const processDemo = require('./process-demo');

module.exports = {
    hooks: {
        modifyMarkdownData: (markdownData, {
            babelConfig = { presets: [], plugins: [] },
            noPreview,
        }, isBuild) => {
            // console.log(markdownData.meta.filename, babelConfig);
            const isDemo = /\/demo$/i.test(path.dirname(markdownData.meta.filename));
            if (isDemo) {
                return processDemo({
                    markdownData,
                    isBuild,
                    noPreview,
                    babelConfig: {
                        presets: babelConfig.presets,
                        plugins: babelConfig.plugins,
                    },
                });
            }
            return processDoc(markdownData);
        },
    },
};

/* eslint-disable no-param-reassign */
const transformer = require('./transformer');

function transform(markdownData, { config }) {
    const { content } = markdownData;
    const {
        lang = 'jsx',
        babelConfig,
        noreact,
    } = config;
    const { presets, plugins } = babelConfig;
    // ignore customized content
    if (Array.isArray(content)) {
        markdownData.content = content.map((node) => {
            const tagName = node[0];
            const attr = node[1];
            if (tagName === 'pre' && attr && attr.lang === lang) {
                const code = node[2][1];
                const processedCode = transformer(code, { presets, plugins }, noreact);
                return {
                    __BISHENG_EMBEDED_CODE: true,
                    code: processedCode,
                };
            }
            return node;
        });
    }

    return markdownData;
}

module.exports = {
    hooks: {
        modifyMarkdownData(markdownData, config) {
            transform(markdownData, config);
        },
    },
};

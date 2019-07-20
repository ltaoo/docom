const utils = require('./utils');

module.exports = {
    hooks: {
        modifyMarkdownData(markdownData, opts) {
            return utils.toc(markdownData, opts);
        },
    },
};

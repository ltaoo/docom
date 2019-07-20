const utils = require('./utils');

module.exports = {
    hooks: {
        modifyMarkdownData(markdownData) {
            return utils.getDescription(markdownData);
        },
    },
};

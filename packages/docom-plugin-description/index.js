const utils = require('./utils');

module.exports = {
    hooks: {
        modifyMarkdownData(markdownData) {
            utils.getDescription(markdownData);
        },
    },
};

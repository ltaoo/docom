const marktwain = require('mark-twain');
// const loaderUtils = require("loader-utils");

// const plugin = require('./plugin');
const stringify = require('./stringify');

module.exports = (content) => {
    // const options = loaderUtils.getOptions(this);
    const markdown = marktwain(content);
    const output = `module.exports = ${stringify(markdown)};`;
    return output;
}

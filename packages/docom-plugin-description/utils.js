const JsonML = require('jsonml.js/lib/utils');
/**
 * 从 markdown 中解析 hr 并添加 description
 * @param {MarkdownData} markdownData
 * @return {MarkdownData}
 */
function getDescription(markdownData) {
    const { content } = markdownData;
    const result = { ...markdownData };
    const contentChildren = JsonML.getChildren(content);
    const dividerIndex = contentChildren.findIndex(node => JsonML.getTagName(node) === 'hr');

    if (dividerIndex >= 0) {
        result.description = ['section']
            .concat(contentChildren.slice(0, dividerIndex));
        result.content = [
            JsonML.getTagName(content),
            JsonML.getAttributes(content) || {},
        ].concat(contentChildren.slice(dividerIndex + 1));
    }

    return result;
}

module.exports = {
    getDescription,
};

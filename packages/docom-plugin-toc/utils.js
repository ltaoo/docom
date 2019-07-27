/* eslint-disable no-param-reassign */
const JsonML = require('jsonml.js/lib/utils');

function isHeading(tagName) {
    return /^h[1-6]$/i.test(tagName);
}

function toc(markdownData, config) {
    const maxDepth = config.maxDepth || 6;

    const listItems = JsonML.getChildren(markdownData.content).filter((node) => {
        const tagName = JsonML.getTagName(node);
        return isHeading(tagName) && +tagName.charAt(1) <= maxDepth;
    }).map((node) => {
        const tagName = JsonML.getTagName(node);
        const headingNodeChildren = JsonML.getChildren(node);
        const headingText = headingNodeChildren.map((headingNode) => {
            if (JsonML.isElement(headingNode)) {
                if (JsonML.hasAttributes(headingNode)) {
                    return headingNode[2] || '';
                }
                return headingNode[1] || '';
            }
            return headingNode;
        }).join('');
        const headingTextId = headingText.trim().replace(/\s+/g, '-');
        return [
            'li', [
                'a',
                {
                    className: `bisheng-toc-${tagName}`,
                    href: `#${headingTextId}`,
                    title: headingText,
                },
            ].concat(config.keepElem ? headingNodeChildren : [headingText]),
        ];
    });

    markdownData.toc = ['ul'].concat(listItems);
    return markdownData;
}

module.exports = {
    toc,
};

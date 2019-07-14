module.exports = {
    hooks: {
        modifyMarkdownData(markdownData) {
            return {
                name: 'foo',
                ...markdownData,
            };
        },
    },
};

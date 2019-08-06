/**
 * 递归处理 md 文件路径
 * @param {FileTree} fileTree
 * @param {function} action - 处理 md 路径的方式
 * @return {ProcessedFileTree}
 */
function walkFileTree(fileTree) {
    function foo(tree, callback, file) {
        if (typeof tree === 'string') {
            return callback(tree, file);
        }
        return Object.keys(tree)
            .map((key) => {
                const module = tree[key];
                return {
                    [key]: foo(module, callback, key),
                };
            })
            .reduce((files, pathname) => ({
                ...files,
                ...pathname,
            }), {});
    }
    return action => foo(fileTree, action);
}

module.exports = walkFileTree;

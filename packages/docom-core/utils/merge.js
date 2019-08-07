function intersectionKeys(a, b) {
    return a.filter(key => b.includes(key));
}
function differenceKeys(a, b) {
    return a.concat(b).filter(v => !a.includes(v) || !b.includes(v));
}
/**
 * 合并两个对象的同名键对应的值为数组
 * @example
 *  const a = { foo: 'a' };
 *  const b = { foo: 'b' };
 *  const result = mergeSameNameKey(a, b);
 *  result === {
 *      foo: ['a', 'b'],
 *  };
 * @param {Object} a
 * @param {Object} b
 */
function mergeSameNameKey(a, b) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    // 获取交集
    const commonKeys = intersectionKeys(aKeys, bKeys);
    // 获取差集
    const aRestKeys = differenceKeys(aKeys, commonKeys);
    const bRestKeys = differenceKeys(bKeys, commonKeys);

    const result = {};
    commonKeys.forEach((key) => {
        if (Array.isArray(a[key])) {
            result[key] = a[key].concat(b[key]);
            return;
        }
        if (Array.isArray(b[key])) {
            result[key] = b[key].concat(a[key]);
            return;
        }
        result[key] = [a[key], b[key]];
    });
    aRestKeys.forEach((key) => {
        if (Array.isArray(a[key])) {
            result[key] = a[key];
            return;
        }
        result[key] = [a[key]];
    });
    bRestKeys.forEach((key) => {
        if (Array.isArray(b[key])) {
            result[key] = b[key];
            return;
        }
        result[key] = [b[key]];
    });
    return result;
}
/**
 * 将多个 hooks 合并
 * @param  {...any} hooksGroup
 * @param {Hooks} group
 */
function mergeHooks(...hooksGroup) {
    return hooksGroup.reduce((group, hooks) => mergeSameNameKey(group, hooks), {});
}
function mergePlugins(...pluginsGroup) {
    return pluginsGroup.reduce((group, plugins) => group.concat(plugins), []);
}

module.exports = {
    mergeHooks,
    mergePlugins,
};

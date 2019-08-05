const path = require('path');

module.exports = {
    title: 'E5',
    subtitle: 'https://gw.alipayobjects.com/zos/rmsportal/DkKNubTaaVsKURhcVGkh.svg',
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    theme: 'docom-theme-antd',
    files: ['**/*.md'],
    modules: {
        index: {
            title: '首页',
            path: 'index.md',
        },
        components: {
            title: '組件',
            path: './src/components',
        },
        develop: {
            title: '开发说明',
            path: './docs/develop',
        },
    },
    hooks: {
        beforeCompile(webpackConfig) {
            /* eslint-disable no-param-reassign */
            webpackConfig.resolve.alias.antd = path.resolve('./node_modules/antd');
        },
    },
    plugins: [],
};

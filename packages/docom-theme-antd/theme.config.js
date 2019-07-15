module.exports = {
    categoryOrder: {
        'Ant Design': 0,
        原则: 1,
        Principles: 1,
        视觉: 2,
        Visual: 2,
        模式: 3,
        Patterns: 3,
        其他: 6,
        Other: 6,
        Components: 100,
    },
    // 控制左侧菜单
    typeOrder: {
        General: 0,
        Layout: 1,
        Navigation: 2,
        'Data Entry': 3,
        'Data Display': 4,
        Feedback: 5,
        Other: 6,
        通用: 0,
        布局: 1,
        导航: 2,
        数据录入: 3,
        数据展示: 4,
        反馈: 5,
        其他: 6,
    },
    plugins: [
        ['docom-plugin-toc', {
            maxDepth: 6,
        }],
        ['docom-plugin-react'],
    ],
    hooks: {
        beforeCompile(webpackConfig) {
            /* eslint-disable no-param-reassign */
            webpackConfig.module.rules = webpackConfig.module.rules.map((rule) => {
                if (rule.oneOf) {
                    rule.oneOf = rule.oneOf.map((r) => {
                        if (
                            r.loader
                            && r.loader.indexOf('bable-loader')
                            && Object.prototype.toString.call(r.test).includes('RegExp')
                            && r.options
                            && r.options.plugins
                        ) {
                            r.options.plugins.push([require.resolve('@babel/plugin-proposal-class-properties')]);
                        }
                        return r;
                    });
                }
                return rule;
            });
            const lessRule = {
                test: /\.(less|css)$/,
                use: [
                    { loader: require.resolve('style-loader') },
                    { loader: require.resolve('css-loader') },
                    {
                        loader: require.resolve('less-loader'),
                        options: {
                            javascriptEnabled: true,
                        },
                    },
                ],
            };
            // @TODO 不能靠 index 定位
            webpackConfig.module.rules[2].oneOf.splice(4, 0, lessRule);
        },
    },
};

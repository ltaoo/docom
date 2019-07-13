module.exports = {
    hooks: {
        beforeCompile(webpackConfig) {
            webpackConfig.module.rules = webpackConfig.module.rules.map(rule => {
                if (rule.oneOf) {
                    rule.oneOf = rule.oneOf.map(r => {
                        if (
                            r.loader
                            && r.loader.indexOf('bable-loader')
                            && Object.prototype.toString.call(r.test).includes('RegExp')
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
            webpackConfig.module.rules[2].oneOf.splice(4, 0, lessRule);
            // return webpackConfig;
        },
    },
};

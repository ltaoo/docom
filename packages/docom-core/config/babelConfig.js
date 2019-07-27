module.exports = ({ isEnvProduction }) => ({
    customize: require.resolve(
        'babel-preset-react-app/webpack-overrides',
    ),
    presets: [
        [require.resolve('@babel/preset-react')],
        [require.resolve('@babel/preset-env')],
    ],
    plugins: [
        [
            require.resolve('babel-plugin-named-asset-import'),
            {
                loaderMap: {
                    svg: {
                        ReactComponent: '@svgr/webpack?-svgo,+ref![path]',
                    },
                },
            },
        ],
    ],
    // This is a feature of `babel-loader` for webpack (not Babel itself).
    // It enables caching results in ./node_modules/.cache/babel-loader/
    // directory for faster rebuilds.
    // cacheDirectory: true,
    cacheCompression: isEnvProduction,
    compact: isEnvProduction,
});

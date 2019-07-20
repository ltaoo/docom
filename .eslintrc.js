module.exports = {
    extends: 'eslint-config-airbnb',
    env: {
        browser: true,
    },
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 6,
        ecmaFeatures: {
            jsx: true,
            impliedStrict: true,
        },
        sourceType: 'module',
    },
    plugins: [
        'react',
    ],
    globals: {
        describe: 'readonly',
        expect: 'readonly',
        it: 'readonly',
        docom: 'readonly',
    },
    // settings: {
    //     'import/resolver': {
    //         webpack:{
    //             config: 'packages/docom-core/config/webpack.config.js',
    //         },
    //     },
    // },
    rules: {
        indent: [2, 4],
        'no-console': [0],
        'react/jsx-filename-extension': [0],
        'react/jsx-indent': [0, 4, { props: 4 }],
        'react/jsx-indent-props': [2, 4],
        'react/prop-types': [0],
        'react/forbid-prop-types': [1],
        'import/no-extraneous-dependencies': [0],
        'import/no-unresolved': [2, {
            ignore: ['@root', '@theme'],
        }],
        'consistent-return': 0,
        'global-require': 0,
        'import/no-dynamic-require': 0,
        'no-underscore-dangle': 0,
        'max-len': 0,
    }
};
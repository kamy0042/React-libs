const path = require('path');

module.exports = {
    stories: ['../front/dev/components/**/*.stories.js'],
    addons: [
        {
            name: '@storybook/preset-typescript',
            options: {
            tsLoaderOptions: {
                configFile: path.resolve(__dirname, './tsconfig.json'),
            },
                forkTsCheckerWebpackPluginOptions: {
                    colors: true,
            },
                include: [path.resolve(__dirname, '../front/dev/components')],
                transpileManager: true,
            },
        },
        '@storybook/addon-actions', 
        '@storybook/addon-links',
        '@storybook/addon-knobs'
    ],
    webpackFinal: async config => {
        // do mutation to the config
        config.module.rules[0].use[0].options.presets = [
            require.resolve("@babel/preset-react"),
            require.resolve("@babel/preset-env"),
            require.resolve("@emotion/babel-preset-css-prop")
        ];

        config.module.rules.push({
            test: /\.(ts|tsx)$/,
            loader: require.resolve("babel-loader"),
            options: {
                presets: [
                    "@babel/preset-env" ,
                    "@babel/preset-typescript" ,
                    "@babel/preset-react" ,
                    "@emotion/babel-preset-css-prop"
                ]
            }
        });

        config.resolve.extensions.push(".ts", ".tsx");

        return config;
    },
};

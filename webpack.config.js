const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const ImageminMozjpeg = require('imagemin-mozjpeg');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const globule = require('globule');
const path = require('path');

const outputPath = path.resolve(__dirname, './dist');
const entries = globule.find({src: ['*.tsx','*.ts','*.js'], srcBase: 'src', prefixBase: true, matchBase:true });
const getDistDir = (entry) => entry
    .replace(/src\//g, '')
    .replace('.js', '').replace('.ts', '')
    .replace('.tsx', '');
const getSrc = (entry) => `./${entry}`;

/*
 * エントリーポイントを自動生成
 * webpackによって各JSをバンドルし、各ページで読み込む１つのJSファイルを生成しています。
 * generateEntryによって、pages内のファイルを元にバンドルの起点となるエントリーポイントを自動で設定します。
 */
const generateEntry = (entries) => (key) => (value) => entries.reduce( (obj, entry) => {
    obj[key(entry)] = value(entry);
    return obj
}, {});


/*
 * ローカルサーバー用のHTMLを自動生成
 * webpack-html-pluginによって、ローカルサーバーでの確認に必要なHTMLを自動生成します
 * npm run dev 時のみ実行されます
 */
const generateTemp = (entries) => (distDir) => {
    const temp = {
        filename: '',
        script: '',
        template: './__dev-server-templates__/common.html',
        inject:false,
        minify: false,
    }

    return entries.map(entry => {
        const option = {
            ...temp,
            filename:`${distDir(entry)}.html`,
            script:`/js/${distDir(entry)}.js`,
        }
        return new HtmlWebpackPlugin(option)
    })
}


const config = {
    entry: generateEntry(entries)(getDistDir)(getSrc),

    output: {
        filename: '[name].js',
        path:`${outputPath}/js`
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use:[
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                [ "@babel/preset-env",  {
                                    targets: {
                                        ie: '11'
                                    },
                                    useBuiltIns: 'usage',
                                    corejs: { version: 3, proposals: true },
                                    debug: true
                                }],
                                "@babel/preset-typescript" ,
                                "@babel/preset-react" ,
                                "@emotion/babel-preset-css-prop"
                            ],
                            plugins: [
                                "@babel/proposal-class-properties",
                                "@babel/proposal-object-rest-spread"
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                [ "@babel/preset-env",  {
                                    targets: {
                                        ie: '11'
                                    },
                                    useBuiltIns: 'usage',
                                    corejs: { version: 3, proposals: true },
                                    debug: true
                                }],
                                "@babel/preset-react"
                            ],
                        }
                    }
                ]
            },
            {
                test: /\.(gif|png|jpg|eot|wof|woff|ttf|svg)$/,
                loader: 'file-loader',
                options: {
                    name: './front/dev/assets/img/[name].[ext]'
                }
            }
        ]
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },

    plugins:[
        new CleanWebpackPlugin(),

        new CopyWebpackPlugin([{
            from: 'front/dev/assets/img',
            to:`${outputPath}/assets/img`
        }]),
        new ImageminPlugin({
            test: /\.(jpe?g|png|gif|svg)$/i,
            pngquant: {
                quality: '65-80'
            },
            plugins: [
                ImageminMozjpeg({
                    quality: 70,
                    progressive: true
                })
            ]
        }),
    ]
};

module.exports = (env, argv) => {

    if (argv.mode === 'development') {

        config.devtool = 'inline-source-map'

        config.devServer = {
            inline: true,
            stats: { colors: true },
            contentBase:outputPath,
            open: true
        }

        config.plugins = [...generateTemp(entries)(getDistDir)]
    }

    return config
}

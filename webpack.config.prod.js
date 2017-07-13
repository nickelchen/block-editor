const { resolve  } = require('path');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');


module.exports = {
    context: resolve(__dirname, './app'),
    entry: [
        'react-hot-loader/patch',
        'webpack-dev-server/client?http://localhost:9000',
        'webpack/hot/only-dev-server',
        './index.js',
    ],
    output: {
        filename: 'bundle.js',
        path: resolve(__dirname, 'dist'),
        publicPath: '/'
    },

    devtool: 'inline-source-map',

    devServer: {
        hot: true,
        contentBase: resolve(__dirname, 'dist'),
        publicPath: '/',
        port: 9000
    },

    module: {
        rules: [
            { test: /\.json$/i, loader: 'json' },
            { test: /\.html$/i, loader: 'html' },
            { test: /\.(woff|woff2)(?:\?.*|)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
            { test: /\.ttf(?:\?.*|)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
            { test: /\.eot(?:\?.*|)?$/, loader: 'file'},
            { test: /\.svg(?:\?.*|)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'},
            { test: /\.(jpe?g|png|gif)(?:\?.*|)$/i, loader: 'file' },
            { test: /\.css$/, use: [ 'style-loader', 'css-loader?modules', ] },
            { test: /\.scss$/, use: [ 'style-loader', 'css-loader?modules', 'sass-loader' ] },
            // { test: /\.scss$/, loader: ExtractTextPlugin.extract({ fallback: 'style', use: 'css!sass' }) },
            { test: /\.js*$/, loader: 'babel-loader', exclude: [/(node_modules)/] },
        ],
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
    ]

};

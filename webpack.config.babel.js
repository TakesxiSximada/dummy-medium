// -*- coding: utf-8 -*-
import 'babel-polyfill';
import path from 'path';
import webpack from 'webpack';

const DEBUG = !process.argv.includes('--release');
const VERBOSE = process.argv.includes('--verbose');

export default {
    cache: DEBUG,
    debug: DEBUG,
    entry: {
        main: path.join(__dirname, 'src/js/main.js'),
    },
    stats: {
        colors: true,
        reasons: DEBUG,
        hash: VERBOSE,
        timings: true,
        chunks: VERBOSE,
        chunkModules: VERBOSE,
        cached: DEBUG,
        cachedAssets: DEBUG,
    },
    output: {
        path: path.join(__dirname, 'dst'),
        filename: '/js/[name].js',
    },
    module: {
        preLoaders: [
            {
                test: /\.tag.pug$/,
                loader: 'riotjs-loader',
                query: { template: 'pug' },
                exclude: /(node_modules|bower_components)/,
            },
            {
                test: /\.tag$/,
                loader: 'riotjs-loader',
                query: { type: 'none' },
                exclude: /(node_modules|bower_components)/,
            },
        ],
        loaders: [
            {
                test: /\.(js)$/,
                loader: 'babel',
                exclude: /(node_modules|bower_components)/,
            },
            {
                test: /\.(html)$/,
                loader: 'file?name=[path][name].[ext]',
                exclude: /(node_modules|bower_components)/,
            },
        ],
    },
    resolve: {
        extentions: ['', '.js', '.tag', '.tag.pug'],
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.ProvidePlugin({
            riot: 'riot',
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dst'),
        inline: true,
        host: 'localhost',
        port: 8080,
        publicPath: '/',
        outputPath: '/',
        filename: '/js/[name].js',
        watchOptions: undefined,
        watchDelay: undefined,
        hot: false,
        stats: {
            cached: false,
            cachedAssets: false,
            colors: { level: 1, hasBasic: true, has256: false, has16m: false }
        },
        clientLogLevel: 'info'
    },
}

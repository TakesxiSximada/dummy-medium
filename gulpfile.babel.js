// - [x] pug -[pug]-> html
// - [x] styl -[stylus]-> css
// - [ ] js -[babel]-[webpack]-> js

//    - srcで渡ってきたファイルをentryとしてentryの名称のまま出力
//    - es6で記述可能
//    - es6で記述可能

// - [ ] tag -[riot]-[babel]-[webpack]-> js (tag)
// - [x] json -> json
const DEBUG = !process.argv.includes('--release');


const path = require('path');
const gulp = require('gulp');
const gutil = require('gulp-util');
const pug = require('gulp-pug');
// const riot = require('gulp-riot');
const babel = require('gulp-babel');
const watch = require('gulp-watch');
const stylus = require('gulp-stylus');
// const named = require('vinyl-named');
// const webpack = require('webpack-stream');
const cdnizer = require("gulp-cdnizer");
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');

const browserSync = require('browser-sync').create();
const outputDir = path.join(__dirname, 'dst');
const webpack_config = require('./webpack.config.babel.js');

const revision = process.env.GIT_COMMIT_HASH
const cdnBase = DEBUG ? '' : '//my.cdn.host/' + revision


// function special_naming(file){
//     var res = path.parse(path.relative(file.base, file.path));
//     return path.join(res.dir, res.name);
// }

function watching(name, files) {
    return () => {
        watch(files, () => {
            gulp.start(name);
        });
    }
}

gulp.task('pug', () => {
    gulp.src([
        './src/**/*.pug',
        '!./src/**/_*.pug',
        '!./src/js/**/*',
    ]).pipe(
        pug({pretty: true})
    ).pipe(
        cdnizer({
            defaultCDNBase: cdnBase,
            allowRev: true,
            allowMin: true,
            files: [
                '**/*.{js,css,svg,png,jpg}',
            ]
        })
    ).pipe(
        gulp.dest(outputDir)
    )

    // if(!DEBUG) {
    //     task = task.pipe(
    //         cdnizer({
    //             defaultCDNBase: '//my.cdn.host/base',
    //             allowRev: true,
    //             allowMin: true,
    //             files: [
    //                 '**/*.{js,css,svg,png,jpg}',
    //             ]
    //         })
    //     )
    // }
    // task.pipe(
    //     gulp.dest(outputDir)
    // )

});
gulp.task('watch-pug', watching('pug', [
    './src/**/*.pug',
    '!./src/**/*.tag.pug',
    '!./src/js/**/*',
]));


gulp.task('stylus', () => {
    gulp.src([
        './src/**/*.styl',
        '!./src/**/_*.styl',
        '!./src/js/**/*',
    ]).pipe(
        stylus()
    ).pipe(
        gulp.dest(outputDir)
    )
});
gulp.task('watch-stylus', watching('stylus', ['./src/**/*.styl']));


// gulp.task('svg', () => {
//     gulp.src([
//         './src/**/*.svg',
//         '!./src/**/_*.svg',
//     ]).pipe(
//         gulp.dest(outputDir)
//     )
// });
// gulp.task('watch-svg', watching('svg', ['./src/**/*.svg']));


// gulp.task('js', () => {
//     gulp.src([
//         './src/**/*.js',
//         './src/**/*.tag.pug',
//         '!./src/**/_*.js',
//         '!./src/**/_*.tag.pug',
//     ]).pipe(
//         named(special_naming)
//     ).pipe(
//         webpack(webpack_config.default)
//     ).pipe(
//         babel()
//     ).pipe(
//         gulp.dest(outputDir)
//     )
// });
// gulp.task('watch-js', watching('js', [
//     './src/**/*.js',
//     './src/**/*.styl',
//     './src/**/*.tag',
//     './src/**/*.tag.pug',
// ]));


// gulp.task('json', () => {
//     gulp.src([
//         './src/**/*.json',
//         '!./src/**/_*.json',
//     ]).pipe(
//         gulp.dest(outputDir)
//     )
// });
// gulp.task('watch-json', watching('json', ['./src/**/*.json']));


gulp.task('png', () => {
    gulp.src([
        './src/**/*.png',
        '!./src/**/_*.png',
    ]).pipe(
        gulp.dest(outputDir)
    )
});
gulp.task('watch-png', watching('png', ['./src/**/*.png']));

gulp.task('reload', () => {
    watch(outputDir, browserSync.reload);
});


gulp.task('server', () => {
    browserSync.init({
        server: {
            baseDir: outputDir,
        },
    });
});



gulp.task('webpack', (callback) => {
    let options = webpack_config.default
    webpack(options, (callback) => {
        console.log('[Webpack] Compiled!!')
    });
})

gulp.task('watch-webpack', (callback) => {
    let options = webpack_config.default
    options.watch = true
    webpack(options, (callback) => {
        console.log('[Webpack] Compiled!!')
    });
})


gulp.task('webpack-dev-server', (callback) => {
    webpack_config.default.entry = {
        main: [
            path.join(__dirname, 'node_modules/webpack-dev-server/client/index.js') + '?http://localhost:8080',
            webpack_config.default.entry.main,
        ]
    }
    webpack_config.default.output = { path: '/', filename: '/js/[name].js' }
    let compiler = webpack(webpack_config.default)
    let options = webpack_config.default.devServer
    let protocol = options.https ? "https" : "http";
    new webpackDevServer(compiler, options)
        .listen(8080, 'localhost', (err) => {
	          var uri = protocol + "://" + options.host + ":" + options.port + "/";
	          if(!options.inline)
		            uri += "webpack-dev-server/";

	          if(err) throw err;
	          console.log(" " + uri);
	          console.log("webpack result is served from " + options.publicPath);
	          if(typeof options.contentBase === "object")
		            console.log("requests are proxied to " + options.contentBase.target);
	          else
		            console.log("content is served from " + options.contentBase);
	          if(options.historyApiFallback)
		            console.log("404s will fallback to %s", options.historyApiFallback.index || "/index.html");
	          if(options.open)
		            open(uri);
        })
})

gulp.task('watch', [
    'build',
    'png',
    'reload',
    'server',
    'watch-pug',
    'watch-png',
    'watch-stylus',
    'watch-webpack',
]);


gulp.task('build', [
    'pug',
    'stylus',
    'webpack',
]);

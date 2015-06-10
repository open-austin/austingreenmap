var gulp = require('gulp');
var connect = require('gulp-connect');

var gprint = require('gulp-print');
var gutil = require('gulp-util');

gulp.task('browserify', function() {
    // https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
    // http://christianalfoni.github.io/javascript/2014/08/15/react-js-workflow.html

    var watchify = require('watchify');
    var browserify = require('browserify');
    var babelify = require('babelify');
    var stringify = require('stringify');
    var source = require('vinyl-source-stream');

    var transformES6 = function(file) {
      return babelify(file, {
        optional: [
          'es7.objectRestSpread',
          'es7.classProperties'
        ]
      });
    };

    var watcher = watchify(browserify({
        entries: ['./client/js/main.js'],
        debug: true,
        extension: ['.jsx'],
        transform: [
            transformES6,
            stringify({
                extensions: ['.svg'],
                minify: true,
            }
        )],
        cache: {},
        packageCache: {},
        fullPaths: true,
    }));

    watcher.on('log', gutil.log);

    function logBabelError(err) {
        // format error https://github.com/zertosh/errorify/issues/4
        var message = [err.message, err.codeFrame].join('\n\n');
        console.log(message);
    }


    watcher.on('update', function() {
        watcher.bundle()
            .on('error', logBabelError)
            .pipe(source('main.js'))
            .pipe(gulp.dest('./build/js/'))
            .pipe(gprint())
            .pipe(connect.reload());
    });

    return watcher
        .bundle()
        .on('error', logBabelError)
        .pipe(source('main.js'))
        .pipe(gulp.dest('./build/js/'))
        .pipe(gprint());
});

gulp.task('clean', function () {
    var gclean = require('gulp-clean');

    return gulp.src('build/', {read: false})
        .pipe(gclean());
});

gulp.task('styles', function () {
    var sass = require('gulp-sass');
    var postcss = require('gulp-postcss');
    var sourcemaps = require('gulp-sourcemaps');
    var autoprefixer = require('autoprefixer-core');
    var autoprefix = autoprefixer({browsers: ['last 2 version']});

    gulp.src('client/scss/main.scss')
        .pipe(sass())
        .pipe(postcss([autoprefix]))
        .pipe(gulp.dest('build/css/'))
        .pipe(gprint())
        .pipe(connect.reload());
});

gulp.task('copy-html', function(){
    gulp.src('client/*.html')
        .pipe(gulp.dest('build/'))
        .pipe(gprint());
});

gulp.task('copy-data', function() {
    var symlink = require('gulp-symlink');

    return gulp.src('data')
      .pipe(symlink('build/data'));
});

gulp.task('watch', function() {
    gulp.watch('client/scss/**/*.scss', [ 'styles' ]);
    gulp.watch('client/*.html', [ 'copy-html' ]);
});

gulp.task('webserver', function() {
    connect.server({
        livereload: true,
        root: 'build',
        host: '0.0.0.0',
        port: 1234,
    });
});

gulp.task('build', ['clean', 'styles', 'browserify', 'copy-html', 'copy-data']);
gulp.task('default', ['build', 'webserver', 'watch']);
gulp.task('frontend', ['clean', 'copy-html', 'styles', 'webserver', 'watch']);

var gulp = require('gulp');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var gprint = require('gulp-print');
var clean = require('gulp-clean');
var gprint = require('gulp-print');
var symlink = require('gulp-symlink');

var connect = require('gulp-connect');
var wait = require('gulp-wait');

var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var browserify = require('browserify');
var reactify = require('reactify');
var stringify = require('stringify');
var babelify = require('babelify');


var ROOT = __dirname + '/build';

var reactifyES6 = function(file) {
  return babelify(file, {
    optional: [
      'es7.objectRestSpread',
      'es7.classProperties'
    ]
  });
};

// https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
// http://christianalfoni.github.io/javascript/2014/08/15/react-js-workflow.html
gulp.task('browserify', function() {
    var watcher = watchify(browserify({
        entries: ['./client/js/main.js'],
        debug: true,
        extension: ['.jsx'],
        transform: [
            reactifyES6,
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

    return watcher.on('update', function() {
            var updateStart = Date.now();
            watcher.bundle()
                .pipe(source('main.js'))
                .pipe(gulp.dest('./build/js/'))
                .pipe(gprint())
                .pipe(connect.reload());
        })
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('./build/js/'))
        .pipe(gprint());
});

gulp.task('clean', function () {
    return gulp.src('build/', {read: false})
        .pipe(clean());
});

gulp.task('styles', function () {
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

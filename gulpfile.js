var gulp = require('gulp');
var connect = require('gulp-connect');

var gprint = require('gulp-print');
var gutil = require('gulp-util');

function logBabelError(err) {
    // format error https://github.com/zertosh/errorify/issues/4
    var message = [err.message, err.codeFrame].join('\n\n');
    console.log(message);
}

function transformES6(file) {
    var babelify = require('babelify');

    return babelify(file, {
        optional: [
            'es7.objectRestSpread',
            'es7.classProperties',
            'es7.decorators',
        ]
    });
}

gulp.task('watch-js', function() {
    // https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
    // http://christianalfoni.github.io/javascript/2014/08/15/react-js-workflow.html

    var watchify = require('watchify');
    var browserify = require('browserify');
    var stringify = require('stringify');
    var source = require('vinyl-source-stream');

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

gulp.task('build-js', function() {
    var browserify = require('browserify');
    var stringify = require('stringify');
    var source = require('vinyl-source-stream');

    return browserify({
            entries: ['./client/js/main.js'],
            debug: false,
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
        })
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

gulp.task('copy-images', function() {
    var symlink = require('gulp-symlink');

    return gulp.src('client/images')
        .pipe(symlink('build/images'));
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

gulp.task('deploy-gh-pages', function() {
    var ghPages = require('gulp-gh-pages');

    return gulp.src('./build/**/**/*.*')
        .pipe(ghPages({message: 'Deploy to gh-pages :deciduous_tree: ' + new Date()}));
});

// (ohgodwhy)
// Watch tasks should depend on suppress-errors - it will force all stream pipes to print but not crash on error
gulp.task('suppress-errors', function(){
    function monkeyPatchPipe(o){
        while(!o.hasOwnProperty('pipe')){
            o = Object.getPrototypeOf(o);
            if(!o){
                return;
            }
        }
        var originalPipe = o.pipe;
        var newPipe = function(){
            var result = originalPipe.apply(this, arguments);

            if(!result.pipe['monkey patched for suppress-errors']){
                monkeyPatchPipe(result);
            }

            return result.on('error', function (err) {
                gutil.log(gutil.colors.yellow(err));
                gutil.beep();
                this.emit('end');
            });
        };
        newPipe['monkey patched for suppress-errors'] = true;
        o.pipe = newPipe;
    }
    monkeyPatchPipe(gulp.src(""));
});

gulp.task('inject-cordova', function() {
    var htmlreplace = require('gulp-html-replace');

    return gulp.src('./build/index.html')
        .pipe(htmlreplace({
            'cordova': '<script src="cordova.js"></script>',
        }))
        .pipe(gulp.dest('./build/'));
});

gulp.task('build', ['styles', 'build-js', 'copy-html', 'copy-data', 'copy-images']);
gulp.task('default', ['suppress-errors', 'clean', 'styles', 'copy-html', 'copy-data', 'copy-images', 'webserver', 'watch', 'watch-js']);
gulp.task('frontend', ['clean', 'copy-html', 'styles', 'webserver', 'watch']);

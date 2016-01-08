var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var colorLighten = require('less-color-lighten');
var concat = require('gulp-concat');
var eslint = require('gulp-eslint');
var gulp = require('gulp');
var gutil = require('gulp-util');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var replace = require('gulp-replace');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var webpack = require('webpack');

var config = require('../.build.config');
var packageInfo = require('../package');
var webpackConfig = require('../.webpack.config');

var development = process.env.NODE_ENV === 'development';

function browserSyncReload () {
  if (development) {
    browserSync.reload();
  }
}

gulp.task('docs:browsersync', function () {
  browserSync.init({
    open: false,
    port: 4200,
    server: {
      baseDir: config.dirs.docs.dist
    },
    socket: {
      domain: 'localhost:4200'
    }
  });
});

// Create a function so we can use it inside of webpack's watch function.
function eslintFn() {
  return gulp.src([config.files.docs.srcJS])
    .pipe(eslint())
    .pipe(eslint.formatEach('stylish', process.stderr));
};
gulp.task('docs:eslint', eslintFn);

gulp.task('docs:html', function () {
  return gulp.src(config.files.docs.srcHTML)
    .pipe(gulp.dest(config.dirs.docs.dist))
    .on('end', browserSyncReload);
});

gulp.task('docs:less', function () {
  return gulp.src(config.files.docs.srcCSS, {read: true}, {ignorePath: 'src'})
    .pipe(sourcemaps.init())
    .pipe(less({
      paths: [config.dirs.docs.cssSrc], // @import paths
      plugins: [colorLighten]
    }))
    .on('error', function (err) {
        gutil.log(err);
        this.emit('end');
    })
    .pipe(autoprefixer())
    .pipe(concat(config.files.docs.distCSS))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('.'))
    .pipe(browserSync.stream());
});

gulp.task('docs:minify-css', ['docs:less'], function () {
  return gulp.src(config.files.docs.distCSS)
    .pipe(minifyCSS())
    .pipe(gulp.dest(config.dirs.docs.distCSS));
});

gulp.task('docs:minify-js', ['docs:replace-js-strings'], function () {
  return gulp.src(config.files.docs.distJS)
    .pipe(uglify({
      mangle: true,
      compress: true
    }))
    .pipe(gulp.dest(config.dirs.docs.distJS));
});

function replaceJsStringsFn() {
  return gulp.src(config.files.docs.distJS)
    .pipe(replace('@@VERSION', packageInfo.version))
    .pipe(gulp.dest(config.dirs.docs.distJS))
    .on('end', browserSyncReload);
};
gulp.task(
  'docs:replace-js-strings', ['docs:webpack'], replaceJsStringsFn
);

gulp.task('docs:watch', function () {
  gulp.watch(config.files.docs.srcHTML, ['docs:html']);
  gulp.watch([
    config.dirs.docs.srcCSS + '/**/*.less',
    config.dirs.srcCSS + '/**/*.less'
  ], ['docs:less']);
  // Why aren't we watching any JS files? Because we use webpack's
  // internal watch, which is faster due to insane caching.
});

// Use webpack to compile jsx into js,
gulp.task('docs:webpack', function (callback) {
  var isFirstRun = true;

  webpack(webpackConfig, function (err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }

    gutil.log('[webpack]', stats.toString({
      children: false,
      chunks: false,
      colors: true,
      modules: false,
      timing: true
    }));

    if (isFirstRun) {
      // This runs on initial gulp webpack load.
      isFirstRun = false;
      callback();
    } else {
      // This runs after webpack's internal watch rebuild.
      eslintFn();
      replaceJsStringsFn();
    }
  });
});

gulp.task('docs:default', [
  'docs:webpack',
  'docs:eslint',
  'docs:replace-js-strings',
  'docs:less',
  'docs:html'
]);

gulp.task('docs:dist', [
  'docs:default',
  'docs:minify-css',
  'docs:minify-js'
]);

gulp.task('docs:livereload', [
  'docs:default',
  'docs:browsersync',
  'docs:watch'
]);

var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var eslint = require('gulp-eslint');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var imagemin = require('gulp-imagemin');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var replace = require('gulp-replace');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var webpack = require('webpack');

var config = require('../configuration');
var packageInfo = require('../package');
var webpackConfig = require('../webpack.config.js');

var development = process.env.NODE_ENV === 'development';

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

gulp.task('docs:eslint', function () {
  return gulp.src([config.dirs.docs.srcJS + '/**/*.?(js|jsx)'])
    .pipe(eslint())
    .pipe(eslint.formatEach('stylish', process.stderr));
});

gulp.task('docs:html', function () {
  return gulp.src(config.files.docs.srcHTML)
    .pipe(gulp.dest(config.dirs.docs.dist));
});

gulp.task('docs:less', function () {
  return gulp.src(config.files.docs.srcCSS, {read: true}, {ignorePath: 'src'})
    .pipe(gulpif(development, sourcemaps.init()))
    .pipe(less({
      paths: [config.dirs.docs.cssSrc] // @import paths
    }))
    .pipe(autoprefixer())
    .pipe(concat(config.files.docs.distCSS))
    .pipe(gulpif(development, sourcemaps.write()))
    .pipe(gulp.dest('.'))
    .pipe(gulpif(development, browserSync.stream()));
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

gulp.task('docs:replace-js-strings', ['docs:webpack'], function() {
  return gulp.src(config.files.docs.distJS)
    .pipe(replace('@@VERSION', packageInfo.version))
    .pipe(replace('@@ENV', process.env.NODE_ENV))
    .pipe(gulp.dest(config.dirs.docs.distJS));
});

gulp.task('docs:server', function () {
  connect.server({
    port: 4200,
    root: config.dirs.docs.dist
  });
});

gulp.task('docs:watch', function () {
  gulp.watch(config.files.docs.srcHTML, ['docs:html']);
  gulp.watch([config.dirs.docs.srcCSS + '/**/*.less', config.dirs.srcCSS + '/**/*.less'], ['docs:less']);
  gulp.watch([config.dirs.docs.srcJS + '/**/*.?(js|jsx)', config.dirs.srcJS + '/**/*.?(js|jsx)'], ['docs:webpack', 'docs:replace-js-strings']);
});

// Use webpack to compile jsx into js,
gulp.task('docs:webpack', ['docs:eslint'], function (callback) {
  // Extend options with source mapping
  if (development) {
    webpackConfig.devtool = 'source-map';
    webpackConfig.module.preLoaders = [
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: /node_modules/
      }
    ];
  }
  // run webpack
  webpack(webpackConfig, function (err, stats) {
    if (err) {
      throw new gutil.PluginError("webpack", err);
    }

    gutil.log("[webpack]", stats.toString({
      children: false,
      chunks: false,
      colors: true,
      modules: false,
      timing: true
    }));

    if (development) {
      browserSync.reload();
    }
    callback();
  });
});

gulp.task('docs:default', ['docs:eslint', 'docs:webpack', 'docs:replace-js-strings', 'docs:less', 'docs:html']);

gulp.task('docs:dist', ['docs:default', 'docs:minify-css', 'docs:minify-js']);

gulp.task('docs:livereload', ['docs:default', 'docs:browsersync', 'docs:watch']);

gulp.task('docs:serve', ['docs:server', 'docs:default', 'docs:watch']);

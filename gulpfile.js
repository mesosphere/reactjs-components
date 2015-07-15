var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var eslint = require('gulp-eslint');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var imagemin = require('gulp-imagemin');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var replace = require('gulp-replace');
var spawn = require('child_process').spawn;
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var webpack = require('webpack');

var config = require('./configuration');
var packageInfo = require('./package');
var webpackConfig = require('./webpack.config.js');

var development = process.env.NODE_ENV === 'development';

gulp.task('browsersync', function () {
  browserSync.init({
    open: false,
    port: 4200,
    server: {
      baseDir: config.dirs.dist
    },
    socket: {
      domain: 'localhost:4200'
    }
  });
});

gulp.task('server', function () {
  var process;

  function spawnChildren() {
    // kill previous spawned process
    if (process) {
      process.kill();
    }

    // `spawn` a child `gulp` process linked to the parent `stdio`
    process = spawn('./bin/www', [], {
      stdio: 'inherit',
      env: {
        DEBUG: 'debug,server,error',
        NODE_PORT: 4200
      }
    });
  }

  gulp.watch(['app/**/*.*'], spawnChildren);
  spawnChildren();
});

gulp.task('eslint', function () {
  return gulp.src([config.dirs.srcJS + '/**/*.?(js|jsx)'])
    .pipe(eslint())
    .pipe(eslint.formatEach('stylish', process.stderr));
});

gulp.task('images', function () {
  return gulp.src([
      config.dirs.srcImg + '/**/*.*',
      '!' + config.dirs.srcImg + '/**/_exports/**/*.*'
    ])
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(gulp.dest(config.dirs.distImg));
});

gulp.task('html', function () {
  return gulp.src(config.files.srcHTML)
    .pipe(gulp.dest(config.dirs.dist));
});

gulp.task('less', function () {
  return gulp.src(config.files.srcCSS)
    .pipe(gulpif(development, sourcemaps.init()))
    .pipe(less({
      paths: [config.dirs.cssSrc] // @import paths
    }))
    .pipe(autoprefixer())
    .pipe(gulpif(development, sourcemaps.write()))
    .pipe(gulp.dest(config.dirs.distCSS))
    .pipe(gulpif(development, browserSync.stream()));
});

gulp.task('minify-css', ['less'], function () {
  return gulp.src(config.files.distCSS)
    .pipe(minifyCSS())
    .pipe(gulp.dest(config.dirs.distCSS));
});

gulp.task('minify-js', ['replace-js-strings'], function () {
  return gulp.src(config.files.distJS)
    .pipe(uglify({
      mangle: true,
      compress: true
    }))
    .pipe(gulp.dest(config.dirs.distJS));
});

gulp.task('replace-js-strings', ['webpack'], function() {
  return gulp.src(config.files.distJS)
    .pipe(replace('@@VERSION', packageInfo.version))
    .pipe(replace('@@ENV', process.env.NODE_ENV))
    .pipe(gulp.dest(config.dirs.distJS));
});

gulp.task('watch', function () {
  gulp.watch(config.files.srcHTML, ['html']);
  gulp.watch(config.dirs.srcCSS + '/**/*.less', ['less']);
  gulp.watch(config.dirs.srcJS + '/**/*.?(js|jsx)', ['webpack', 'replace-js-strings']);
  gulp.watch(config.dirs.srcImg + '/**/*.*', ['images']);
});

// Use webpack to compile jsx into js,
gulp.task('webpack', ['eslint'], function (callback) {
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
  webpack(webpackConfig, function (err) {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }

    if (development) {
      browserSync.reload();
    }

    callback();
  });
});

gulp.task('default', ['eslint', 'webpack', 'replace-js-strings', 'less', 'images', 'html']);

gulp.task('dist', ['default', 'minify-css', 'minify-js']);

gulp.task('serve', ['server', 'default', 'watch']);

gulp.task('livereload', ['server', 'default', 'browsersync', 'watch']);

var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var connect = require('gulp-connect');
var eslint = require('gulp-eslint');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var header = require('gulp-header');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var replace = require('gulp-replace');
var spawn = require('child_process').spawn;
var sourcemaps = require('gulp-sourcemaps');
var tap = require('gulp-tap');
var uglify = require('gulp-uglify');
var webpack = require('webpack');

var config = require('./configuration');
var packageInfo = require('./package');
var webpackConfig = require('./webpack.config.js');

var isDevelopment = process.env.NODE_ENV === 'development';

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

gulp.task('connect:server', function () {
  connect.server({
    port: 4200,
    root: config.dirs.dist
  });
});

gulp.task('eslint', function () {
  return gulp.src([config.dirs.srcJS + '/**/*.?(js|jsx)'])
    .pipe(eslint())
    .pipe(eslint.formatEach('stylish', process.stderr));
});

gulp.task('html', function () {
  return gulp.src(config.files.srcHTML)
    .pipe(gulp.dest(config.dirs.distHTML));
});

gulp.task('less', function () {
  return gulp.src(config.files.srcCSS)
    .pipe(gulpif(isDevelopment, sourcemaps.init()))
    .pipe(less({
      paths: [config.dirs.srcCSS] // @import paths
    }))
    .pipe(autoprefixer())
    .pipe(gulpif(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest(config.dirs.distCSS))
    .pipe(gulpif(isDevelopment, browserSync.stream()));
});

gulp.task('minify-css', ['less'], function () {
  return gulp.src(config.files.distCSS)
    .pipe(minifyCSS())
    .pipe(gulp.dest(config.dirs.distCSS));
});

gulp.task('minify-js', ['replace-js-strings'], function () {
  var banner = '/**\n' +
    ' * <%= pkg.name %> - <%= pkg.description %>\n' +
    ' * @version v<%= pkg.version %>\n' +
    ' */\n';
  return gulp.src(config.files.distJS)
    .pipe(uglify({
      mangle: true,
      compress: true
    }))
    .pipe(header(banner, {pkg: packageInfo}))
    .pipe(gulp.dest(config.dirs.distJS));
});

gulp.task('replace-js-strings', ['webpack'], function () {
  return gulp.src(config.files.distJS)
    .pipe(replace('@@VERSION', packageInfo.version))
    .pipe(replace('@@ENV', process.env.NODE_ENV))
    .pipe(gulp.dest(config.dirs.distJS));
});

gulp.task('watch', function () {
  gulp.watch(config.files.srcHTML, ['html']);
  gulp.watch(config.dirs.srcCSS + '/**/*.less', ['less']);
  gulp.watch(
    config.dirs.srcJS + '/**/*.?(js|jsx)',
    ['webpack', 'replace-js-strings']
  );
});

// Use webpack to compile jsx into js,
gulp.task('webpack', ['eslint'], function () {
  // Extend options with source mapping
  if (isDevelopment) {
    webpackConfig.devtool = 'source-map';
    webpackConfig.module.preLoaders = [
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: /node_modules/
      }
    ];
  }

  // Run webpack for each entry point
  return gulp.src(config.files.srcJS)
    .pipe(tap(function (file) {
      webpackConfig.entry = file.path;
      webpackConfig.output = {
        filename: file.path.replace('src', 'dist')
      };

      // run webpack
      return webpack(webpackConfig, function (err, stats) {
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

        if (isDevelopment) {
          browserSync.reload();
        }
      });
    }));
});

gulp.task('default', [
  'eslint',
  'webpack',
  'replace-js-strings',
  'less',
  'html'
]);

gulp.task('dist', ['default', 'minify-css', 'minify-js']);

gulp.task('serve', ['connect:server', 'default', 'watch']);

gulp.task('livereload', ['connect:server', 'default', 'browsersync', 'watch']);

gulp.task('publish', function (done) {
  spawn('npm', ['publish'], {stdio: 'inherit'}).on('close', done);
});

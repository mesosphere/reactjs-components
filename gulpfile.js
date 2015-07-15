var eslint = require('gulp-eslint');
var gulp = require('gulp');

var config = require('./configuration');

var docsTasks = require('./docs/gulpTasks');

gulp.task('eslint', function () {
  return gulp.src([config.dirs.srcJS + '/**/*.?(js|jsx)'])
    .pipe(eslint())
    .pipe(eslint.formatEach('stylish', process.stderr));
});

// dependencies
var browserSync = require("browser-sync");
var eslint = require("gulp-eslint");
var gulp = require("gulp");
var gutil = require("gulp-util");
var packageConfig = require("./package.json");
var webpack = require("webpack");

var packageInfo = require("./package");

var development = process.env.NODE_ENV === "development";

var dirs = {
  src: "./src",
  dist: "./dist",
  js: "js",
  jsDist: "js",
  styles: "styles",
  stylesDist: "styles",
  img: "img",
  imgDist: "img"
};

var files = {
  mainJs: "main",
  mainJsDist: "main",
  mainLess: "main",
  mainCssDist: "main",
  html: "index.html"
};

var webpackConfig = {
  entry: dirs.src + "/" + dirs.js + "/" + files.mainJs + ".js",
  output: {
    filename: dirs.dist + "/" + dirs.js + "/" + files.mainJsDist + ".js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "jsx-loader?harmony"
      }
    ],
    postLoaders: [
      {
        loader: "transform?envify"
      }
    ]
  },
  resolve: {
    extensions: ["", ".js"]
  }
};

gulp.task("browsersync", function () {
  browserSync.init({
    server: {
      baseDir: dirs.dist
    }
  });
});

gulp.task("eslint", function () {
  return gulp.src([dirs.js + "/**/*.?(js|jsx)"])
    .pipe(eslint())
    .pipe(eslint.formatEach("stylish", process.stderr));
});


gulp.task("html", function () {
  return gulp.src(dirs.src + "/" + files.html)
    .pipe(gulp.dest(dirs.dist));
});

gulp.task("watch", function () {
  gulp.watch(dirs.src + "/**/*.?(js|jsx)", ["webpack"]);
});

gulp.task("webpack", ["eslint"], function (callback) {
  if (development) {
    webpackConfig.devtool = "source-map";
    webpackConfig.module.preLoaders = [
      {
        test: /\.js$/,
        loader: "source-map-loader",
        exclude: /node_modules/
      }
    ];
  }
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

gulp.task("default", ["webpack", "html"]);

gulp.task("livereload", ["default", "browsersync", "watch"]);

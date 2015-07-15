// dependencies
var autoprefixer = require("gulp-autoprefixer");
var browserSync = require("browser-sync");
var connect = require("gulp-connect");
var eslint = require("gulp-eslint");
var gulp = require("gulp");
var gulpif = require("gulp-if");
var gutil = require("gulp-util");
var header = require("gulp-header");
var imagemin = require("gulp-imagemin");
var less = require("gulp-less");
var minifyCSS = require("gulp-minify-css");
var replace = require("gulp-replace");
var sourcemaps = require("gulp-sourcemaps");
var spawn = require("child_process").spawn;
var uglify = require("gulp-uglify");
var webpack = require("webpack");

var packageInfo = require("./package");

var sourcemapsEnabled = process.env.NODE_ENV === "development" &&
  !process.env.DISABLE_SOURCE_MAP ||
  process.env.DISABLE_SOURCE_MAP === "false";

var dirs = {
  src: "src",
  dist: "./dist",
  js: "src/js",
  jsDist: "",
  styles: "src/styles",
  stylesDist: ".",
  img: "src/img",
  imgDist: "img"
};

var files = {
  mainJs: "main",
  mainJsDist: "main",
  mainLess: "main",
  mainCssDist: "main",
  index: "index.html"
};

var webpackConfig = {
  entry: "./" + dirs.js + "/" + files.mainJs + ".js",
  output: {
    filename: dirs.dist + "/" + files.mainJsDist + ".js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "jsx-loader?harmony",
        exclude: /node_modules/
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
    port: 4200,
    server: {
      baseDir: dirs.dist
    }
  });
});

gulp.task("connect:server", function () {
  connect.server({
    port: 4200,
    root: dirs.dist
  });
});

gulp.task("eslint", function () {
  return gulp.src([dirs.js + "/**/*.?(js|jsx)"])
    .pipe(eslint())
    .pipe(eslint.formatEach("stylish", process.stderr));
});

gulp.task("images", function () {
  return gulp.src(
      [dirs.img + "/**/*.*", "!" + dirs.img + "/**/_exports/**/*.*"]
    )
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(gulp.dest(dirs.dist + "/" + dirs.imgDist));
});

gulp.task("index", function () {
  return gulp.src(dirs.src + "/" + files.index)
    .pipe(replace(
      "@@ANALYTICS_KEY",
      process.env.NODE_ENV === "production" ?
        "51ybGTeFEFU1xo6u10XMDrr6kATFyRyh" :
        "39uhSEOoRHMw6cMR6st9tYXDbAL3JSaP"
    ))
    .pipe(gulp.dest(dirs.dist));
});

gulp.task("less", function () {
  return gulp.src(dirs.styles + "/" + files.mainLess + ".less")
    .pipe(gulpif(sourcemapsEnabled, sourcemaps.init()))
    .pipe(less({
      paths: [dirs.styles] // @import paths
    }))
    .pipe(autoprefixer())
    .pipe(gulpif(sourcemapsEnabled, sourcemaps.write()))
    .pipe(gulp.dest(dirs.dist + "/" + dirs.stylesDist))
    .pipe(browserSync.stream());
});

gulp.task("minify-css", ["less"], function () {
  return gulp.src(
      dirs.dist + "/" + dirs.stylesDist + "/" + files.mainCssDist + ".css"
    )
    .pipe(minifyCSS())
    .pipe(gulp.dest(dirs.dist + "/" + dirs.stylesDist));
});

gulp.task("minify-js", ["webpack"], function () {
  var banner = "/**\n" +
    " * <%= pkg.name %> - <%= pkg.description %>\n" +
    " * @version v<%= pkg.version %>\n" +
    " */\n";

  return gulp.src(dirs.dist + "/" + dirs.jsDist + "/" + files.mainJs + ".js")
    .pipe(uglify())
    .pipe(header(banner, {pkg: packageInfo}))
    .pipe(gulp.dest(dirs.dist + "/" + dirs.jsDist));
});

gulp.task("replace-js-strings", ["webpack"], function () {
  return gulp.src(dirs.dist + "/**/*.?(js|jsx)")
    .pipe(replace("@@VERSION", packageInfo.version))
    .pipe(replace("@@ENV", process.env.NODE_ENV))
    .pipe(gulp.dest(dirs.dist));
});

gulp.task("swf", function () {
  return gulp.src(dirs.src + "/**/*.swf")
    .pipe(gulp.dest(dirs.dist));
});

gulp.task("watch", function () {
  gulp.watch(dirs.styles + "/*", ["less"]);
  gulp.watch(dirs.js + "/**/*.?(js|jsx)", ["webpack"]);
  gulp.watch(dirs.img + "/**/*.*", ["images"]);
});

// Use webpack to compile jsx into js,
gulp.task("webpack", ["eslint"], function (callback) {
  // Extend options with source mapping
  if (sourcemapsEnabled) {
    webpackConfig.devtool = "source-map";
    webpackConfig.module.preLoaders = [
      {
        test: /\.js$/,
        loader: "source-map-loader",
        exclude: /node_modules/
      }
    ];
  }
  // run webpack
  webpack(webpackConfig, function (err) {
    if (err) {
      throw new gutil.PluginError("webpack", err);
    }
    browserSync.reload();
    callback();
  });
});

gulp.task("default", [
  "eslint",
  "webpack",
  "replace-js-strings",
  "less",
  "images",
  "swf",
  "index"
]);

gulp.task("dist", ["default", "minify-css", "minify-js"]);

gulp.task("serve", ["default", "connect:server", "watch"]);

gulp.task("livereload", ["default", "browsersync", "watch"]);

gulp.task("publish", function (done) {
  spawn("npm", ["publish"], {stdio: "inherit"}).on("close", done);
});

var srcFolder = './src';
var distFolder = './dist';
var docsFolder = './docs';
var docsSrc = docsFolder + '/src';
var docsDist = docsFolder + '/dist';

var dirs = {
  src: srcFolder,
  dist: distFolder,
  srcJS: srcFolder,
  distJS: distFolder,
  srcCSS: srcFolder + '/css',
  distCSS: distFolder,
  srcImg: srcFolder + '/img',
  distImg: distFolder + '/img',
  docs: {
    src: docsSrc,
    dist: docsDist,
    srcJS: docsSrc,
    distJS: docsDist,
    srcCSS: docsFolder + '/**',
    distCSS: docsDist + '/',
    srcImg: srcFolder + '/img',
    distImg: distFolder + '/img'
  }
};

var files = {
  srcJS: dirs.srcJS + '/index.js',
  distJS: dirs.distJS + '/index.js',
  srcCSS: dirs.srcCSS + '/index.less',
  distCSS: dirs.distCSS + '/index.css',
  srcHTML: dirs.src + '/index.html',
  distHTML: dirs.dist + '/index.html',
  docs: {
    srcJS: [
      dirs.docs.srcJS + '/List/index.js'
    ],
    distJS: dirs.docs.distJS + '/index.js',
    srcCSS: dirs.docs.srcCSS + '/*.less',
    distCSS: dirs.docs.distCSS + '/index.css',
    srcHTML: dirs.docs.src + '/index.html',
    distHTML: dirs.docs.dist + '/index.html'
  }
};

module.exports = {
  dirs: dirs,
  files: files
};

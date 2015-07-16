var srcFolder = './src';
var distFolder = './dist';
var docsFolder = './docs';
var docsSrc = docsFolder + '/src';
var docsDist = docsFolder + '/dist';

var dirs = {
  srcJS: srcFolder,
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

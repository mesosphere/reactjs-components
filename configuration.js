var srcFolder = './src';
var distFolder = './dist';

var dirs = {
  src: srcFolder,
  dist: distFolder,
  srcJS: srcFolder + '/js',
  distJS: distFolder,
  srcCSS: srcFolder + '/css',
  distCSS: distFolder,
  srcImg: srcFolder + '/img',
  distImg: distFolder + '/img'
};

var files = {
  srcJS: dirs.srcJS + '/index.js',
  distJS: dirs.distJS + '/index.js',
  srcCSS: dirs.srcCSS + '/index.less',
  distCSS: dirs.distCSS + '/index.css',
  srcHTML: dirs.src + '/index.html',
  distHTML: dirs.dist + '/index.html'
};

module.exports = {
  dirs: dirs,
  files: files
};

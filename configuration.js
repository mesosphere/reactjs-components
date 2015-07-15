var srcFolder = './src';
var distFolder = './dist';

var dirs = {
  src: srcFolder,
  dist: distFolder,
  srcCSS: srcFolder + '/**',
  distCSS: distFolder,
  srcJS: srcFolder + '/**',
  distJS: distFolder,
  srcHTML: srcFolder + '/**',
  distHTML: distFolder
};

var files = {
  srcCSS: dirs.srcCSS + '/index.less',
  distCSS: dirs.distCSS + '/index.css',
  srcJS: dirs.srcJS + '/index.js',
  distJS: dirs.distJS + '/index.js',
  srcHTML: dirs.srcHTML + '/index.html',
  distHTML: dirs.distHTML + '/index.html'
};

module.exports = {
  dirs: dirs,
  files: files
};

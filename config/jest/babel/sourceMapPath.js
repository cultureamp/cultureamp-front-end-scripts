var fs = require('fs');
var os = require('os');
var path = require('path');
var crypto = require('crypto');

var TMPDIR = path.resolve('tmp/jest');

try {
  fs.mkdirSync(TMPDIR);
} catch (err) {
  if (err.code != 'EEXIST') {
    console.error(err);
  }
}

// determine path for sourcemap file in tmpdir based on hash of source location
function sourceMapPath(srcpath) {
  return path.join(
    TMPDIR,
    crypto
      .createHash('md5')
      .update(srcpath)
      .digest('hex') + '.map'
  );
}

sourceMapPath.TMPDIR = TMPDIR;

module.exports = sourceMapPath;

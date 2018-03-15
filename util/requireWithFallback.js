const fs = require('fs');

module.exports = function requireWithFallback(scriptPath, fallbackScriptPath) {
  return fs.existsSync(scriptPath)
    ? require(scriptPath)
    : require(fallbackScriptPath);
};

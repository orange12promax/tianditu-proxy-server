const path = require("node:path");

function getCacheFilePath(options) {
  const { layer, tileMatrixSet, z, y, x, format, cacheDir } = options;
  const fileName = `${x}.${format}`;
  return path.resolve(
    cacheDir,
    `tianditu_${tileMatrixSet}`,
    layer,
    z,
    y,
    fileName
  );
}

module.exports = {
  getCacheFilePath
};

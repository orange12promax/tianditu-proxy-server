const { getTiandituUrl, getFakeHeaders } = require("../utils/tianditu");
const { fetchBuffer } = require("../utils/request");
const { saveImage } = require("../utils/image");
const { getCacheFilePath } = require("../utils/cache");
const { checkFileExists } = require("../utils/file");

async function downloadTileImage(options, cachePath) {
  const { format, ...restOptions } = options;
  const mainLayerTileUrl = getTiandituUrl(restOptions);
  const mainLayerBuffer = await fetchBuffer(mainLayerTileUrl, {
    headers: getFakeHeaders()
  });
  await saveImage(mainLayerBuffer, {
    format,
    path: cachePath
  });
  return mainLayerBuffer;
}

async function getTileImagePath(options) {
  const mainLayerCachePath = getCacheFilePath(options);
  const ex = checkFileExists(mainLayerCachePath);
  if (!ex) {
    await downloadTileImage(options, mainLayerCachePath);
  }
  return mainLayerCachePath;
}

module.exports = {
  getTileImagePath
};

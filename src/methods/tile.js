const { getTiandituUrl, getFakeHeaders } = require("../utils/tianditu");
const { fetchBuffer } = require("../utils/request");
const { saveImage, mergeImages } = require("../utils/image");
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

async function getMergedTileImagePath(options) {
  const { layer, annotation, ...restOptions } = options;
  const mergedLayerCachePath = getCacheFilePath({
    ...restOptions,
    layer: `${layer}_${annotation}`
  });
  const ex = checkFileExists(mergedLayerCachePath);
  if (!ex) {
    const [mainLayerCachePath, annotationLayerCachePath] = await Promise.all([
      getTileImagePath({
        ...restOptions,
        layer
      }),
      getTileImagePath({
        ...restOptions,
        layer: annotation
      })
    ]);
    await mergeImages([mainLayerCachePath, annotationLayerCachePath], {
      path: mergedLayerCachePath
    });
  }
  return mergedLayerCachePath;
}

module.exports = {
  getTileImagePath,
  getMergedTileImagePath
};

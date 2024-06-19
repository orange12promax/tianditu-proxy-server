const { getTiandituUrl, getFakeHeaders } = require("../utils/tianditu");
const { fetchBuffer } = require("../utils/request");
const { saveImage, mergeImages } = require("../utils/image");
const { getCacheFilePath } = require("../utils/cache");
const { checkFileExists, writeFileBuffer } = require("../utils/file");
const { insertTileRecord, updateTileRecord } = require("../database/tile");
const { queryTileCacheBuffer } = require("../tile/basic");
const sharp = require("sharp");

async function downloadTileImage(options) {
  const insertId = await insertTileRecord(options);
  const mainLayerTileUrl = getTiandituUrl(options);
  const mainLayerBuffer = await fetchBuffer(mainLayerTileUrl, {
    headers: getFakeHeaders()
  });
  const meta = await sharp(mainLayerBuffer).metadata();
  const cachePath = getCacheFilePath({ ...options, format: meta.format });
  await writeFileBuffer(cachePath, mainLayerBuffer);
  await updateTileRecord({
    id: insertId,
    path: cachePath
  });
  return mainLayerBuffer;
}

async function getTileImagePath(options) {
  const buffer = await queryTileCacheBuffer(options);
  if (buffer) {
    return buffer;
  } else {
    return await downloadTileImage(options);
  }
  // console.log(cacheRecord);
  // const mainLayerCachePath = getCacheFilePath(options);
  // let ex = false;
  // if (!options.cacheDisabled) {
  //   ex = checkFileExists(mainLayerCachePath);
  // }
  // if (!ex) {
  //   await downloadTileImage(options, mainLayerCachePath);
  // }
  // return mainLayerCachePath;
}

async function getMergedTileImagePath(options) {
  const { layer, annotation, ...restOptions } = options;
  const mergedLayerCachePath = getCacheFilePath({
    ...restOptions,
    layer: `${layer}_${annotation}`
  });
  let ex = false;
  if (!options.cacheDisabled) {
    ex = checkFileExists(mergedLayerCachePath);
  }
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

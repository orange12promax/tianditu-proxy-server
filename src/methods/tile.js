const { getTiandituUrl, getFakeHeaders } = require("../utils/tianditu");
const { fetchBuffer } = require("../utils/request");
const { saveImage, mergeImages } = require("../utils/image");
const { getCacheFilePath } = require("../utils/cache");
const { checkFileExists } = require("../utils/file");
const {
  queryTileRecord,
  insertTileRecord,
  updateTileRecord
} = require("../database/tile");

async function downloadTileImage(options) {
  const cachePath = getCacheFilePath(options);
  const insertId = await insertTileRecord(options);
  const { format, ...restOptions } = options;
  const mainLayerTileUrl = getTiandituUrl(restOptions);
  const mainLayerBuffer = await fetchBuffer(mainLayerTileUrl, {
    headers: getFakeHeaders()
  });
  await saveImage(mainLayerBuffer, {
    format,
    path: cachePath
  });

  await updateTileRecord({
    id: insertId,
    path: cachePath
  });
  return cachePath;
}

async function getTileImagePath(options) {
  const cacheRecord = await queryTileRecord(options);
  if (cacheRecord?.path) {
    return cacheRecord.path;
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

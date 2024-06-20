const { mergeImages } = require("../utils/image");
const { getCacheFilePath } = require("../utils/cache");
const { writeFileBuffer } = require("../utils/file");
const { insertTileRecord, updateTileRecord } = require("../database/tile");
const { queryTileCacheBuffer, queryNativeTileBuffer } = require("./basic");
const sharp = require("sharp");

async function downloadTileImage(options) {
  const insertId = await insertTileRecord(options);
  const buffer = await queryNativeTileBuffer(options);
  const meta = await sharp(buffer).metadata();
  const cachePath = getCacheFilePath({ ...options, format: meta.format });
  await writeFileBuffer(cachePath, buffer);
  await updateTileRecord({
    id: insertId,
    path: cachePath
  });
  return buffer;
}

async function getTileImageBuffer(options) {
  const buffer = await queryTileCacheBuffer(options);
  if (buffer) {
    return buffer;
  } else {
    return await downloadTileImage(options);
  }
}

async function getMergedTileImageBuffer(options) {
  console.log(`---------- ${options.z}/${options.y}/${options.x} ----------`);
  const { layer, annotation, ...restOptions } = options;
  const mOptions = { ...restOptions, layer: `${layer}_${annotation}` };
  const mBuffer = await queryTileCacheBuffer(mOptions);
  if (mBuffer) {
    console.log("直接命中缓存");
    return mBuffer;
  } else {
    const insertId = await insertTileRecord(mOptions);
    const [mainBuffer, annotationBuffer] = await Promise.all([
      getTileImageBuffer({
        ...restOptions,
        layer
      }),
      getTileImageBuffer({
        ...restOptions,
        layer: annotation
      })
    ]);
    const mCachePath = getCacheFilePath(mOptions);
    const newBuffer = await mergeImages([mainBuffer, annotationBuffer], {
      format: options.format,
      path: mCachePath
    });
    writeFileBuffer(mCachePath, newBuffer);
    await updateTileRecord({
      id: insertId,
      path: mCachePath
    });
    return newBuffer;
  }
}

module.exports = {
  getTileImageBuffer,
  getMergedTileImageBuffer
};

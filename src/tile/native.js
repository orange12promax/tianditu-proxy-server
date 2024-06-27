const {
  handleBufferThroughMinio,
  queryNativeTileBuffer,
  getCacheBuffer
} = require("./basic");

// 通过minio获取buffer
async function getNativeBufferThroughMinio(options) {
  const buffer = await handleBufferThroughMinio(options, queryNativeTileBuffer);
  return buffer;
}

async function getNativeBuffer(options) {
  const cacheBuffer = await getCacheBuffer(options);
  if (cacheBuffer) {
    return cacheBuffer;
  } else {
    const buffer = await getNativeBufferThroughMinio(options);
    return buffer;
  }
}

module.exports = {
  getNativeBuffer
};

const { getCacheStreamFromMinio, getBufferThroughMinio } = require("./basic");

async function getBuffer(options) {
  const cacheBuffer = await getCacheStreamFromMinio(options);
  if (cacheBuffer) {
    return cacheBuffer;
  } else {
    const buffer = await getBufferThroughMinio(options);
    return buffer;
  }
}

module.exports = {
  getBuffer
};

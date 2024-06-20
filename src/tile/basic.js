const { queryTileRecord, removeTileRecord } = require("../database/tile");
const { checkFileExists, readFileBuffer } = require("../utils/file");
const { getTiandituUrl, getFakeHeaders } = require("../utils/tianditu");
const { fetchBuffer } = require("../utils/request");

async function queryTileCacheBuffer(options) {
  const cacheRecord = await queryTileRecord(options);
  if (cacheRecord?.path) {
    if (checkFileExists(cacheRecord.path)) {
      return readFileBuffer(cacheRecord.path);
    } else {
      await removeTileRecord({
        id: cacheRecord.id
      });
    }
  }
  return null;
}

async function queryNativeTileBuffer(options) {
  const tileUrl = getTiandituUrl(options);
  const tileBuffer = await fetchBuffer(tileUrl, {
    headers: getFakeHeaders()
  });
  return tileBuffer;
}

module.exports = {
  queryTileCacheBuffer,
  queryNativeTileBuffer
};

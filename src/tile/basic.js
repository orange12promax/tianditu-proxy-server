const { queryTileRecord, removeTileRecord } = require("../database/tile");
const { checkFileExists, readFileBuffer } = require("../utils/file");
const { getTiandituUrl, getFakeHeaders } = require("../utils/tianditu");
const { fetchBuffer } = require("../utils/request");

async function queryTileCacheBuffer(options) {
  const cacheRecord = await queryTileRecord(options);
  if (cacheRecord?.path) {
    console.log("在表中找到了缓存记录");
    if (checkFileExists(cacheRecord.path)) {
      console.log("缓存记录对应文件存在");
      return readFileBuffer(cacheRecord.path);
    } else {
      console.log("缓存记录对应文件不存在");
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

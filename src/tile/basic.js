const { queryTileRecord, removeTileRecord } = require("../database/tile");
const { checkFileExists, readFileBuffer } = require("../utils/file");

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

module.exports = {
  queryTileCacheBuffer
};

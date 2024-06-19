const { queryTileRecord, updateTileRecord } = require("../database/tile");
const { checkFileExists } = require("../utils/file");

async function queryTileCache(options) {
  const cacheRecord = await queryTileRecord(options);
  if (cacheRecord?.path) {
    if (checkFileExists(cacheRecord.path)) {
      return cacheRecord.path;
    } else {
      await updateTileRecord({
        id: cacheRecord.id,
        path: null
      });
    }
  }
  return null;
}

module.exports = {
  queryTileCache
};

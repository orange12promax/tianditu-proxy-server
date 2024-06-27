const {
  queryTileRecord,
  insertTileRecord,
  updateTileRecord,
  removeTileRecord
} = require("../database/tile");
const { getTiandituUrl, getFakeHeaders } = require("../utils/tianditu");
const { fetchBuffer } = require("../utils/request");
const { getObject, putObject } = require("../minio/index");
const { getImageFormat } = require("../utils/image");

function getTileImageFullName(options) {
  const { layer, tileMatrixSet, z, y, x, format } = options;
  const fileName = `${x}.${format}`;
  return [tileMatrixSet, layer, String(z), String(y), fileName].join("/");
}

async function queryNativeTileBuffer(options) {
  const tileUrl = getTiandituUrl(options);
  const tileBuffer = await fetchBuffer(tileUrl, {
    headers: getFakeHeaders()
  });
  return tileBuffer;
}

async function getBufferThroughMinio(options) {
  const insertId = await insertTileRecord(options);
  const buffer = await queryNativeTileBuffer(options);
  const format = await getImageFormat(buffer);
  const fullName = getTileImageFullName({
    ...options,
    format
  });
  await putObject(fullName, buffer);
  await updateTileRecord({
    id: insertId,
    path: fullName
  });
  return buffer;
}

async function getCacheStreamFromMinio(options) {
  const record = await queryTileRecord(options);
  if (record?.path) {
    const stream = await getObject(record.path);
    if (stream) {
      return stream;
    } else {
      removeTileRecord({
        id: record.id
      });
    }
  }
  return null;
}

module.exports = {
  getTileImageFullName,
  queryNativeTileBuffer,
  getBufferThroughMinio,
  getCacheStreamFromMinio
};

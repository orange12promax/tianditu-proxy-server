const {
  queryTileRecord,
  insertTileRecord,
  updateTileRecord,
  removeTileRecord
} = require("../database/tile");
const { getTiandituUrl, getFakeHeaders } = require("../utils/tianditu");
const { fetchBuffer } = require("../utils/request");
const { getObject, putObject } = require("../minio/index");
const { getImageMeta } = require("../utils/image");
const { getBufferFromStream } = require("../utils/stream");

// 根据配置获取文件全名
function getTileImageFullName(options) {
  const { layer, tileMatrixSet, z, y, x, format } = options;
  const fileName = `${x}.${format}`;
  return [tileMatrixSet, layer, String(z), String(y), fileName].join("/");
}

// 下载图片buffer
async function queryNativeTileBuffer(options) {
  const tileUrl = getTiandituUrl(options);
  const tileBuffer = await fetchBuffer(tileUrl, {
    headers: getFakeHeaders()
  });
  return tileBuffer;
}

async function handleBufferThroughMinio(options, callback) {
  const insertId = await insertTileRecord(options);
  const buffer = await callback(options);
  const { size, format } = await getImageMeta(buffer);
  const fullName = getTileImageFullName({
    ...options,
    format
  });
  const meta = {
    "Content-Type": `image/${format}`
  };
  await putObject(fullName, buffer, size, meta);
  await updateTileRecord({
    id: insertId,
    path: fullName
  });
  return buffer;
}

// 通过minio获取stream
async function getCacheBuffer(options) {
  const record = await queryTileRecord(options);
  if (record?.path) {
    const stream = await getObject(record.path);
    if (stream) {
      const buffer = await getBufferFromStream(stream);
      return buffer;
    } else {
      await removeTileRecord({
        id: record.id
      });
    }
  }
  return null;
}

module.exports = {
  getTileImageFullName,
  queryNativeTileBuffer,
  getCacheBuffer,
  handleBufferThroughMinio
};

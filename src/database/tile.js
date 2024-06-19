const { run, get, intTypeValue, textTypeValue } = require("./basic");

// 创建tianditu_tiles表
// 字段：x, y, z, tile, tile_matrix_set,path,status
const tableName = "tianditu_tiles";

const tableColumns = [
  {
    name: "id",
    type: `${intTypeValue} primary key autoincrement`
  },
  {
    name: "layer",
    type: textTypeValue
  },
  {
    name: "tile_matrix_set",
    type: textTypeValue
  },
  {
    name: "x",
    type: intTypeValue
  },
  {
    name: "y",
    type: intTypeValue
  },
  {
    name: "z",
    type: intTypeValue
  },
  {
    name: "path",
    type: textTypeValue
  },
  {
    name: "status",
    type: intTypeValue
  }
];

function createTileTable() {
  const columns = tableColumns.map((column) => {
    return `${column.name} ${column.type}`;
  });
  return run(`CREATE TABLE IF NOT EXISTS ${tableName} (${columns.join(",")})`);
}

// 插入新的瓦片记录
async function insertTileRecord(record) {
  const { layer, tileMatrixSet, x, y, z } = record;
  const columns = ["layer", "tile_matrix_set", "x", "y", "z", "status"];
  const placeholders = new Array(columns.length).fill("?");
  const sql = `INSERT INTO ${tableName} (${columns.join(",")}) VALUES (${placeholders.join(",")})`;
  const res = await run(sql, [layer, tileMatrixSet, x, y, z, 0]);
  return res.lastID;
}
// 修改瓦片记录
function updateTileRecord(record) {
  const { id, path } = record;
  let status = 0;
  if (path) {
    status = 1;
  }
  const sql = `UPDATE ${tableName} SET path = ?, status = ? WHERE id = ?`;
  return run(sql, [path, status, id]);
}
// 查询瓦片，获取id/path
function queryTileRecord(record) {
  const { layer, tileMatrixSet, x, y, z } = record;
  const sql = `SELECT id, path FROM ${tableName} WHERE layer = ? AND tile_matrix_set = ? AND x = ? AND y = ? AND z = ?`;
  return get(sql, [layer, tileMatrixSet, x, y, z]);
}

module.exports = {
  createTileTable,
  insertTileRecord,
  updateTileRecord,
  queryTileRecord
};

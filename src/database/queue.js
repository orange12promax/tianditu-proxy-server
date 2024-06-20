const { run, get, intTypeValue, textTypeValue } = require("./basic");

// 创建tianditu_tiles表
// 字段：x, y, z, tile, tile_matrix_set,path,status
const tableName = "queue";

const tableColumns = [
  {
    name: "id",
    type: `${intTypeValue} primary key autoincrement`
  },
  {
    name: "name",
    type: textTypeValue
  },
  {
    name: "param",
    type: textTypeValue
  },
  {
    name: "status",
    type: intTypeValue
  }
];

function createQueueTable() {
  const columns = tableColumns.map((column) => {
    return `${column.name} ${column.type}`;
  });
  return run(`CREATE TABLE IF NOT EXISTS ${tableName} (${columns.join(",")})`);
}

async function addTask(name, param) {
  const res = await run(
    `INSERT INTO ${tableName} (name, param, status) VALUES ('${name}', '${param}', 0)`
  );
  return res.lastID;
}

async function getNextTask(name) {
  // 获取下一个任务的参数 param
  const res = await get(
    `SELECT id, param FROM ${tableName} WHERE name = '${name}' AND status = 0 ORDER BY id ASC LIMIT 1`
  );
  console.log(res);
  return res;
}

function updateTask(id, status) {
  return run(`UPDATE ${tableName} SET status = ${status} WHERE id = ${id}`);
}

module.exports = {
  createQueueTable,
  addTask,
  getNextTask,
  updateTask
};

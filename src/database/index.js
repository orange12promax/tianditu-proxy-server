const { createConnection } = require("./basic");
const { createTileTable } = require("./tile");
const { createQueueTable } = require("./queue");

createConnection().then(() => {
  createTileTable();
  createQueueTable();
});

module.exports = {};

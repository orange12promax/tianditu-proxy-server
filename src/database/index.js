const { createConnection } = require("./basic");
const { createTileTable } = require("./tile");

createConnection().then(() => {
  createTileTable();
});

module.exports = {};

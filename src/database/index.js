const dotenv = require("dotenv");
dotenv.config();
const sqlite3 = require("sqlite3").verbose();
const path = require("node:path");
const sqlitePath = path.resolve(process.env.TILE_CACHE_DIR, "tile.db");

const database = new sqlite3.Database(sqlitePath, function (e) {
  console.log(e);
});

module.exports = {};

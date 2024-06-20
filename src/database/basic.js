const dotenv = require("dotenv");
dotenv.config();
const sqlite3 = require("sqlite3").verbose();
const path = require("node:path");
const sqlitePath = path.resolve(process.env.TILE_CACHE_DIR, "tile.db");

const textTypeValue = "text";
const intTypeValue = "integer";

let db = null;

function createConnection() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(sqlitePath, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

function run() {
  return new Promise((resolve, reject) => {
    db.run(...arguments, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}

function get() {
  return new Promise((resolve, reject) => {
    db.get(...arguments, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

function runMany(query, params) {
  return new Promise((resolve, reject) => {
    const stat = db.prepare(query);
    for (const param of params) {
      stat.run(param);
    }
    stat.finalize((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  createConnection,
  run,
  runMany,
  get,
  textTypeValue,
  intTypeValue
};

const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const { getTileImagePath, getMergedTileImagePath } = require("./methods/tile");
const database = require("./database/index");
const app = express();

app.get("/tianditu", async (req, res) => {
  const cacheDisabled = parseInt(process.env.CACHE_DISABLED) === 1;
  const commonOptions = {
    tk: process.env.TIANDITU_TK,
    tileMatrixSet: req.query.tileMatrixSet || "c",
    z: req.query.z,
    y: req.query.y,
    x: req.query.x,
    format: req.query.format || "webp",
    cacheDisabled,
    cacheDir: process.env.TILE_CACHE_DIR
  };
  let filePath = null;
  if (req.query.annotation) {
    filePath = await getMergedTileImagePath({
      ...commonOptions,
      layer: req.query.layer,
      annotation: req.query.annotation
    });
  } else {
    filePath = await getTileImagePath({
      ...commonOptions,
      layer: req.query.layer
    });
  }
  res.sendFile(filePath);
});

app.listen(3000);

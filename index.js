const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const {
  getTileImageBuffer,
  getMergedTileImageBuffer
} = require("./src/tile/index");
require("./src/database/index");
const app = express();

app.get("/tianditu", async (req, res) => {
  const cacheDisabled = parseInt(process.env.CACHE_DISABLED) === 1;
  const commonOptions = {
    tk: process.env.TIANDITU_TK,
    tileMatrixSet: req.query.tileMatrixSet || "c",
    z: req.query.z,
    y: req.query.y,
    x: req.query.x,
    cacheDisabled,
    cacheDir: process.env.TILE_CACHE_DIR
  };
  let filePath = null;
  if (req.query.annotation) {
    const format = req.query.format || "webp";
    filePath = await getMergedTileImageBuffer({
      ...commonOptions,
      format,
      layer: req.query.layer,
      annotation: req.query.annotation
    });
    res.setHeader("Content-Type", `image/${format}`);
    res.send(filePath);
  } else {
    filePath = await getTileImageBuffer({
      ...commonOptions,
      layer: req.query.layer
    });
    res.setHeader("Content-Type", "image/png");
    res.send(filePath);
  }
});

app.listen(3000);

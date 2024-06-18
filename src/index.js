const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const { getTileImagePath } = require("./methods/tile");

const app = express();

app.get("/tianditu", async (req, res) => {
  const commonOptions = {
    tk: process.env.TIANDITU_TK,
    tileMatrixSet: req.query.tileMatrixSet || "c",
    z: req.query.z,
    y: req.query.y,
    x: req.query.x,
    format: req.query.format || "png"
  };
  const mainLayerOptions = {
    ...commonOptions,
    layer: req.query.layer,
    cacheDir: process.env.TILE_CACHE_DIR
  };
  const mainLayerCachePath = await getTileImagePath(mainLayerOptions);
  res.sendFile(mainLayerCachePath);
});

app.listen(3000);

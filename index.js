const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
var cors = require("cors");
const { getMergedTileImageBuffer } = require("./src/tile/index");
require("./src/database/index");
const { createQueue, startQueue } = require("./src/queue/index");
const { generateTileParams } = require("./src/queue/tile");

const app = express();
app.use(cors());

app.get("/tianditu/:layer/:z/:x/:y", async (req, res) => {
  const cacheDisabled = parseInt(process.env.CACHE_DISABLED) === 1;
  const {
    params: { x, y, z, layer }
  } = req;
  const commonOptions = {
    tk: process.env.TIANDITU_TK,
    tileMatrixSet: req.query.tileMatrixSet || "w",
    z,
    y,
    x,
    cacheDisabled,
    cacheDir: process.env.TILE_CACHE_DIR
  };
  const format = req.query.format || "webp";
  const buffer = await getMergedTileImageBuffer({
    ...commonOptions,
    format,
    layer
  });
  res.setHeader("Content-Type", `image/${format}`);
  res.send(buffer);
});

app.get("/queue/create", async (req, res) => {
  let list = generateTileParams();
  list = list.map((item) => {
    return {
      ...item,
      tileMatrixSet: "w",
      tk: process.env.TIANDITU_TK,
      cacheDir: process.env.TILE_CACHE_DIR
    };
  });
  await createQueue("tile", list);
  startQueue("tile", async (param) => {
    console.log(param);
    await getMergedTileImageBuffer({
      ...param
    });
  });
  res.send(list);
});

app.listen(13000);

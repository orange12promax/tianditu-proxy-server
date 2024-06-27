const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
var cors = require("cors");
const {
  getCacheStreamFromMinio,
  getBufferThroughMinio
} = require("./src/tile/basic");
require("./src/database/index");
const { createQueue, startQueue } = require("./src/queue/index");
const { generateTileParams } = require("./src/queue/tile");

const app = express();
app.use(cors());

app.get("/tianditu/:layer/:z/:x/:y", async (req, res) => {
  const {
    params: { x, y, z, layer }
  } = req;
  const format = req.query.format || "png";
  const options = {
    tk: process.env.TIANDITU_TK,
    tileMatrixSet: req.query.tileMatrixSet || "w",
    z,
    y,
    x,
    format,
    layer
  };
  const cacheStream = await getCacheStreamFromMinio(options);
  if (cacheStream) {
    cacheStream.pipe(res);
    return;
  } else {
    const buffer = await getBufferThroughMinio(options);
    res.setHeader("Content-Type", `image/${format}`);
    res.send(buffer);
  }
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

const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
var cors = require("cors");
const {
  getCacheStreamFromMinio,
  getBufferThroughMinio
} = require("./src/tile/basic");
require("./src/database/index");

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

app.listen(13000);

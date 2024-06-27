const express = require("express");
var cors = require("cors");
const {
  getCacheStreamFromMinio,
  getBufferThroughMinio
} = require("./src/tile/basic");
require("./src/database/index");

const app = express();
app.use(cors());

app.get("/n/:layer/:z/:x/:y", async (req, res) => {
  const {
    params: { x, y, z, layer },
    query: { tileMatrixSet }
  } = req;
  const options = {
    tileMatrixSet: tileMatrixSet || "w",
    z,
    y,
    x,
    layer
  };
  const cacheStream = await getCacheStreamFromMinio(options);
  if (cacheStream) {
    cacheStream.pipe(res);
    return;
  } else {
    const buffer = await getBufferThroughMinio(options);
    res.setHeader("Content-Type", `image/png`);
    res.send(buffer);
  }
});

app.listen(13000);

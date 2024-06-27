const express = require("express");
var cors = require("cors");
const { getNativeBuffer, getMergedBuffer } = require("./src/tile");
require("./src/database");

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
  const buffer = await getNativeBuffer(options);
  res.setHeader("Content-Type", `image/png`);
  res.send(buffer);
});

app.get("/m/:layer/:z/:x/:y", async (req, res) => {
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
  const buffer = await getMergedBuffer(options);
  res.setHeader("Content-Type", `image/png`);
  res.send(buffer);
});

app.listen(13000);

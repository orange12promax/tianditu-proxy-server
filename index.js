const express = require("express");
var cors = require("cors");
const { getBuffer } = require("./src/tile");
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
  const buffer = await getBuffer(options);
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
  const buffer = await getBuffer(options);
  res.setHeader("Content-Type", `image/png`);
  res.send(buffer);
});

app.listen(13000);

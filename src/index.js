const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const { getTiandituUrl } = require("./tianditu");
const { queryFileData } = require("./file");

app.get("/tianditu", async (req, res) => {
  const { layer, z, y, x } = req.query;
  const url = getTiandituUrl({
    tk: process.env.TIANDITU_TK,
    layer,
    tileMatrixSet: "c",
    z,
    y,
    x,
  });
  const imgBytes = await queryFileData(url);
  res.setHeader("Content-Type", "image/png");
  res.send(imgBytes);
});

app.listen(3000);

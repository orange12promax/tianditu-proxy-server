const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const { saveTileImage } = require("./file");

app.get("/tianditu", async (req, res) => {
  const { layer, z, y, x } = req.query;
  const options = {
    tk: process.env.TIANDITU_TK,
    layer,
    tileMatrixSet: "c",
    z,
    y,
    x,
  };
  const imgPath = await saveTileImage(options);
  res.sendFile(imgPath);
});

app.listen(3000);

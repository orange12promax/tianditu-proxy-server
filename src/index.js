const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const { saveTileImage } = require("./file");
const { mergeImages } = require("./image");

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
  if (layer === "vec") {
    const annotation = await saveTileImage({
      ...options,
      layer: "cva",
    });
    const mergedOptions = {
      ...options,
      layer: "vec_cva",
    };
    const mergedPath = await mergeImages([imgPath, annotation], mergedOptions);
    // return mergedPath;
    res.sendFile(mergedPath);
  } else {
    res.sendFile(imgPath);
  }
});

app.listen(3000);

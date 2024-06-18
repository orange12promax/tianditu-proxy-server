const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const { getCacheFilePath } = require("./utils/cache");
const { checkFileExists } = require("./utils/file");
const { getFakeHeaders, getTiandituUrl } = require("./utils/tianditu");
const { fetchBuffer } = require("./utils/request");
const { saveImage } = require("./utils/image");

const app = express();

app.get("/tianditu", async (req, res) => {
  const commonOptions = {
    tk: process.env.TIANDITU_TK,
    tileMatrixSet: req.query.tileMatrixSet || "c",
    z: req.query.z,
    y: req.query.y,
    x: req.query.x
  };
  const mainLayerOptions = {
    ...commonOptions,
    layer: req.query.layer
  };
  const mainLayerCachePath = getCacheFilePath({
    ...mainLayerOptions,
    format: "png",
    dir: process.env.TILE_CACHE_DIR
  });
  const mainLayerEx = checkFileExists(mainLayerCachePath);
  if (mainLayerEx) {
    res.sendFile(mainLayerCachePath);
  } else {
    const mainLayerTileUrl = getTiandituUrl(mainLayerOptions);
    const mainLayerBuffer = await fetchBuffer(mainLayerTileUrl, {
      headers: getFakeHeaders()
    });

    await saveImage(mainLayerBuffer, {
      format: "png",
      path: mainLayerCachePath
    });
    res.sendFile(mainLayerCachePath);
  }
});

app.listen(3000);

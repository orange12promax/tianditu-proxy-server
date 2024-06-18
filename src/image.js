const sharp = require("sharp");
const {
  prepareImageDir,
  checkImageExists,
  getImagePathInfo,
} = require("./file");

// 合并图片
async function mergeImages(images, options) {
  const existance = checkImageExists(options);
  const pathInfo = getImagePathInfo(options);
  if (existance) {
    return pathInfo.full;
  } else {
    prepareImageDir(options);
    const [background, ...rest] = images;
    await sharp(background)
      .composite(rest.map((item) => ({ input: item, gravity: "northwest" })))
      .toFile(pathInfo.full);
    return pathInfo.full;
  }
}

module.exports = { mergeImages };

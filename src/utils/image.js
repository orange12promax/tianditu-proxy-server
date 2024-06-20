const sharp = require("sharp");
const { createFileDir } = require("./file");

// 合并图片
function mergeImages(images, options) {
  const savePath = options.path;
  const format = options.format || "webp";
  createFileDir(savePath);
  const [background, ...rest] = images;
  return sharp(background)
    .composite(rest.map((item) => ({ input: item, gravity: "northwest" })))
    .toFormat(format)
    .toBuffer();
}

module.exports = { mergeImages };

const sharp = require("sharp");

// 合并图片
function mergeImages(images) {
  const [background, ...rest] = images;
  return sharp(background)
    .composite(rest.map((item) => ({ input: item, gravity: "northwest" })))
    .toBuffer();
}

// 获取图片格式
function getImageMeta(buffer) {
  return sharp(buffer).metadata();
}

module.exports = { mergeImages, getImageMeta };

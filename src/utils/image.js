const sharp = require("sharp");

// 合并图片
function mergeImages(images) {
  const [background, ...rest] = images;
  return sharp(background)
    .composite(rest.map((item) => ({ input: item, gravity: "northwest" })))
    .toBuffer();
}

// 获取图片格式
async function getImageFormat(buffer) {
  const meta = await sharp(buffer).metadata();
  return meta.format;
}

module.exports = { mergeImages, getImageFormat };

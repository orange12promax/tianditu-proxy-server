const sharp = require("sharp");

// 合并图片
function mergeImages(images, options) {
  const savePath = options.path;
  const format = options.format || "webp";
  // createFileDir(savePath);
  const [background, ...rest] = images;
  return sharp(background)
    .composite(rest.map((item) => ({ input: item, gravity: "northwest" })))
    .toFormat(format)
    .toBuffer();
}

// 获取图片格式
async function getImageFormat(buffer) {
  const meta = await sharp(buffer).metadata();
  return meta.format;
}

module.exports = { mergeImages, getImageFormat };

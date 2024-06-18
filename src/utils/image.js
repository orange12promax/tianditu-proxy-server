const sharp = require("sharp");
// const {
//   prepareImageDir,
//   checkImageExists,
//   getImagePathInfo,
// } = require("../file");
const { createFileDir } = require("./file");

async function saveImage(buffer, options) {
  const format = options.format || "png";
  const imagePath = options.path;
  createFileDir(imagePath);
  const imgSrp = sharp(buffer);
  // const meta = await imgSrp.metadata();
  // console.log(meta);
  await imgSrp.toFormat(format).toFile(imagePath);
}

// 合并图片
async function mergeImages(images, options) {
  const imagePath = options.path;
  createFileDir(imagePath);
  const [background, ...rest] = images;
  await sharp(background)
    .composite(rest.map((item) => ({ input: item, gravity: "northwest" })))
    .toFile(imagePath);
}

module.exports = { saveImage, mergeImages };

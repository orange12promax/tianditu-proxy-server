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

// // 合并图片
// async function mergeImages(images, options) {
//   const existance = checkImageExists(options);
//   const pathInfo = getImagePathInfo(options);
//   if (existance) {
//     return pathInfo.full;
//   } else {
//     prepareImageDir(options);
//     const [background, ...rest] = images;
//     await sharp(background)
//       .composite(rest.map((item) => ({ input: item, gravity: "northwest" })))
//       .toFile(pathInfo.full);
//     return pathInfo.full;
//   }
// }

module.exports = { saveImage };

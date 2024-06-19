const fs = require("node:fs");
const path = require("node:path");

// 为一个文件创建目录
function createFileDir(filePath) {
  const fileDirname = path.dirname(filePath);
  if (!fs.existsSync(fileDirname)) {
    fs.mkdirSync(fileDirname, { recursive: true });
  }
}

// 判断一个文件是否存在
function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

// 读取文件为Buffer
function readFileBuffer(filePath) {
  return fs.readFileSync(filePath);
}
// 将buffer写入文件
function writeFileBuffer(filePath, buffer) {
  createFileDir(filePath);
  fs.writeFileSync(filePath, buffer);
}

module.exports = {
  createFileDir,
  checkFileExists,
  readFileBuffer,
  writeFileBuffer
};

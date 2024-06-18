const http = require("node:http");
const path = require("node:path");
const fs = require("node:fs");
const { getTiandituUrl } = require("./tianditu");

// 获取文件的二进制数据
function downloadFile(url, path) {
  return new Promise((resolve, reject) => {
    http
      .get(
        url,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
          },
        },
        (res) => {
          const fileStream = fs.createWriteStream(path);
          res.pipe(fileStream);
          fileStream.on("finish", () => {
            fileStream.close();
            resolve();
          });
        }
      )
      .on("error", (err) => {
        reject(err);
      });
  });
}

function getImagePathInfo(options) {
  const { layer, tileMatrixSet, z, y, x } = options;
  const basicDir = path.join(tileMatrixSet, layer, z, y);
  const dir = path.resolve(__dirname, "..", "tilecache", basicDir);
  const name = `${x}.png`;
  const full = path.join(dir, name);
  return { dir, name, full };
}

function checkImageExists(options) {
  const { full } = getImagePathInfo(options);
  return fs.existsSync(full);
}

function prepareImageDir(options) {
  const { dir } = getImagePathInfo(options);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function saveTileImage(options) {
  // 获取文件数据
  const url = getTiandituUrl(options);
  const { full } = getImagePathInfo(options);
  const existance = checkImageExists(options);
  if (existance) {
    return full;
  } else {
    prepareImageDir(options);
    await downloadFile(url, full);
    return full;
  }
}

module.exports = {
  saveTileImage,
};

const http = require("http");

// 获取文件的二进制数据
function queryFileData(url) {
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
          let data = Buffer.alloc(0);
          res.on("data", (chunk) => {
            data = Buffer.concat([data, chunk]);
          });
          res.on("end", () => {
            resolve(data);
          });
        }
      )
      .on("error", (err) => {
        reject(err);
      });
  });
}

module.exports = {
  queryFileData,
};

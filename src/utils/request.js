const http = require("node:http");

function fetchBuffer(url, options) {
  return new Promise((resolve) => {
    http.get(url, options, (res) => {
      const data = [];
      res
        .on("data", (chunk) => {
          data.push(chunk);
        })
        .on("end", () => {
          resolve(Buffer.concat(data));
        });
    });
  });
}

module.exports = {
  fetchBuffer
};

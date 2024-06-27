const http = require("node:http");
const { getBufferFromStream } = require("./stream");

function fetchBuffer(url, options) {
  return new Promise((resolve) => {
    http.get(url, options, async (res) => {
      const buffer = await getBufferFromStream(res);
      resolve(buffer);
    });
  });
}

module.exports = {
  fetchBuffer
};

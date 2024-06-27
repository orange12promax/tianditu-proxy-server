const dotenv = require("dotenv");
dotenv.config();
const Minio = require("minio");

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: process.env.MINIO_PORT,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY
});

// 上传文件流
function uploadFile(buffer, fileName) {
  const bucketName = process.env.MINIO_BUCKET;
  minioClient.putObject(bucketName, fileName, buffer, function (err, etag) {
    if (err) return console.log(err);
    console.log("File uploaded successfully.", etag);
  });
}

module.exports = {
  uploadFile
};

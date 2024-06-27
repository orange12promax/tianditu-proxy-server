const dotenv = require("dotenv");
dotenv.config();
const Minio = require("minio");

const bucketName = process.env.MINIO_BUCKET;
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY
});

// 上传文件流
function putObject(objectName, buffer, meta) {
  return new Promise((resolve, reject) => {
    minioClient.putObject(bucketName, objectName, buffer, meta, (err, etag) => {
      if (err) {
        reject(err);
      } else {
        resolve(etag);
      }
    });
  });
}

// 获取文件流信息
function statObject(objectName) {
  return new Promise((resolve, reject) => {
    minioClient.statObject(bucketName, objectName, (err, stat) => {
      if (err) {
        reject(err);
      } else {
        resolve(stat);
      }
    });
  });
}

// 获取文件流
async function getObject(objectName) {
  const stat = await statObject(objectName);
  if (!stat) return null;
  console.log(stat);
  const object = await minioClient.getObject(bucketName, objectName);
  return object;
}

module.exports = {
  putObject,
  getObject
};

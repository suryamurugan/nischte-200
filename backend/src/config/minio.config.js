import * as Minio from "minio";

const minioClient = new Minio.Client({
  endPoint: "22.0.0.179",
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

const bucketName = process.env.MINIO_BUCKET;

export { minioClient, bucketName };
